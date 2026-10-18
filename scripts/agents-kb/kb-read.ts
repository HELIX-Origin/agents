#!/usr/bin/env node
/**
 * kb-read.ts — read-only Knowledge Base access with filesystem fallback (W.57c).
 *
 * Implements the agent-facing Query API from `.agents/skills/agents-db-design.md`:
 * `getByKey`, `getByPath`, `list`, `findRefs`, `search`.
 *
 * Contract:
 * - READ-ONLY: never creates, writes, or migrates the database. If `knowledge.db` is
 *   missing, unreadable, or schema-mismatched (major < 2), every operation answers from
 *   the filesystem (canonical content) with `origin: 'fs'` — the fail-safe fallback.
 * - When the DB is healthy it is queried first (alias fallback, references, scored
 *   search), and the filesystem is merged for parity until the sync pipeline (W.57d/e)
 *   populates registry rows; DB rows win on `path_rel` collisions (`origin: 'db'`).
 * - References are DB-native metadata: `findRefs` has no filesystem equivalent and
 *   returns `[]` in fallback mode.
 * - Nothing in the workspace calls this module yet ("no behavior change"): it is the
 *   read foundation future exporters, validators, and the scaffold feature build on.
 */
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { ROOT, defaultConfig, kbPath, defaultOrgSlug } from './kb-config.ts';
import { sha256 } from './kb-db.ts';

export type KbKind = 'rule' | 'skill' | 'agent' | 'template' | 'document' | 'fragment';
export type KbOrigin = 'db' | 'fs';
export type KbResultOrigin = KbOrigin | 'merged';
export type KbSearchField = 'title' | 'path' | 'tags';

export interface KbArtifact {
  artifactId: number | null;
  orgSlug: string;
  kind: KbKind;
  key: string;
  pathRel: string;
  title: string | null;
  status: string | null;
  scope: string | null;
  appliesTo: string[];
  tags: string[];
  contentHash: string;
  source: 'fs' | 'db' | 'import';
  priority: number;
  origin: KbOrigin;
}

export interface KbListOptions {
  kind?: KbKind;
  tags?: string[];
  appliesTo?: string;
  orgSlug?: string;
  limit?: number;
}

export interface KbListResult {
  items: KbArtifact[];
  origin: KbResultOrigin;
}

export interface KbSearchHit extends KbArtifact {
  score: number;
}

export interface KbSearchResult {
  items: KbSearchHit[];
  origin: KbResultOrigin;
}

export interface KbReference {
  relType: string;
  direction: 'outgoing' | 'incoming';
  artifact: KbArtifact;
}

const DEFAULT_ORG = defaultOrgSlug();

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function parseArray(value: unknown): string[] {
  if (typeof value !== 'string' || value.trim() === '') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    // Non-JSON legacy text: treat comma-separated values as a last resort.
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
}

export function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}

/** Probe for a readable, v2-shaped database WITHOUT ever creating one
 * (`existsSync` guard + driver-level `readOnly`). Returns null when reads
 * must fall back to the filesystem. */
function tryOpenDb(): DatabaseSync | null {
  const file = kbPath();
  if (!existsSync(file)) return null;
  let db: DatabaseSync | null = null;
  try {
    db = new DatabaseSync(file, { readOnly: true });
    const ver = db
      .prepare(`SELECT meta_value FROM schema_meta WHERE meta_key = 'schema_version'`)
      .get() as { meta_value?: unknown } | undefined;
    const major = Number.parseInt(String(ver?.meta_value ?? ''), 10);
    if (!Number.isFinite(major) || major < 2) {
      db.close();
      return null; // v001-era shape (content columns) = schema mismatch
    }
    db.prepare('SELECT artifact_id FROM artifacts LIMIT 1').get(); // shape probe
    return db;
  } catch {
    try {
      db?.close();
    } catch {
      // Probing must never throw.
    }
    return null;
  }
}

function rowToArtifact(row: Record<string, unknown>): KbArtifact {
  return {
    artifactId: Number(row.artifact_id),
    orgSlug: String(row.org_slug),
    kind: String(row.kind) as KbKind,
    key: String(row.key),
    pathRel: String(row.path_rel),
    title: row.title == null ? null : String(row.title),
    status: row.status == null ? null : String(row.status),
    scope: row.scope == null ? null : String(row.scope),
    appliesTo: parseArray(row.applies_to),
    tags: parseArray(row.tags),
    contentHash: String(row.content_hash),
    source: String(row.source) as KbArtifact['source'],
    priority: row.priority == null ? 0 : Number(row.priority),
    origin: 'db'
  };
}

/** DB rows win per `path_rel`; sorted by priority DESC, then key ASC. */
function mergeDbFs(dbRows: KbArtifact[], fsItems: KbArtifact[]): KbArtifact[] {
  const byPath = new Map<string, KbArtifact>();
  for (const item of fsItems) byPath.set(item.pathRel, item);
  for (const row of dbRows) byPath.set(row.pathRel, row);
  return [...byPath.values()].sort(
    (a, b) => b.priority - a.priority || a.key.localeCompare(b.key)
  );
}

function originOf(items: KbArtifact[]): KbResultOrigin {
  const hasDb = items.some(i => i.origin === 'db');
  const hasFs = items.some(i => i.origin === 'fs');
  return hasDb && hasFs ? 'merged' : hasDb ? 'db' : 'fs';
}

// ---------------------------------------------------------------------------
// Filesystem fallback (canonical content)
// ---------------------------------------------------------------------------

export const FS_DIRS: ReadonlyArray<{ dir: string; kind: KbKind }> = [
  { dir: path.join(ROOT, '.agents', 'rules'), kind: 'rule' },
  { dir: path.join(ROOT, '.agents', 'skills'), kind: 'skill' },
  { dir: path.join(ROOT, '.agents', 'agents'), kind: 'agent' },
  { dir: path.join(ROOT, '.agents', 'templates'), kind: 'template' }
];

export const ROOT_DOCS: ReadonlyArray<string> = [
  'AGENTS.md',
  'ROADMAP.md',
  'PLAN.md',
  'TODO.md',
  'BUGS.md',
  'HANDOFF.md'
];

interface MiniFrontmatter {
  key?: string;
  title?: string;
  status?: string;
  tags?: string[];
  appliesTo?: string[];
}

function stripQuotes(v: string): string {
  const t = v.trim();
  return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))
    ? t.slice(1, -1)
    : t;
}

function parseListValue(raw: string): string[] {
  const t = raw.trim();
  if (t.startsWith('[')) {
    return t
      .slice(1, -1)
      .split(',')
      .map(s => stripQuotes(s))
      .filter(Boolean);
  }
  return t
    .split(',')
    .map(s => stripQuotes(s))
    .filter(Boolean);
}

/** Minimal frontmatter reader (title/key/status/tags/applies_to only; no YAML dependency). */
function parseFrontmatter(content: string): MiniFrontmatter {
  const out: MiniFrontmatter = {};
  if (!content.startsWith('---')) return out;
  const lines = content.split(/\r?\n/);
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') break;
    const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!match) continue;
    const name = match[1].toLowerCase();
    const value = match[2].trim();
    switch (name) {
      case 'key':
        out.key = stripQuotes(value);
        break;
      case 'title':
        out.title = stripQuotes(value);
        break;
      case 'status':
        out.status = stripQuotes(value);
        break;
      case 'tags':
        out.tags = parseListValue(value);
        break;
      case 'applies_to':
        out.appliesTo = parseListValue(value);
        break;
      default:
        break;
    }
  }
  return out;
}

function headingOf(content: string): string | null {
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) return match[1].trim();
  }
  return null;
}

/** Key from filename: `git-operations.md` -> `git-operations`. */
function keyOf(file: string): string {
  const ext = path.extname(file);
  return ext ? file.slice(0, -ext.length) : file;
}

function kindOfPath(rel: string): KbKind | null {
  if (rel.startsWith('.agents/rules/')) return 'rule';
  if (rel.startsWith('.agents/skills/')) return 'skill';
  if (rel.startsWith('.agents/agents/')) return 'agent';
  if (rel.startsWith('.agents/templates/')) return 'template';
  const base = path.posix.basename(rel);
  if (!rel.includes('/') && ROOT_DOCS.includes(base)) return 'document';
  return null;
}

export async function fsArtifact(full: string, kind: KbKind, orgSlug: string): Promise<KbArtifact | null> {
  const content = await fs.readFile(full, 'utf8').catch(() => null);
  if (content == null) return null;
  const rel = toPosix(path.relative(ROOT, full));
  const fm = parseFrontmatter(content);
  const base = keyOf(path.basename(full));
  return {
    artifactId: null,
    orgSlug,
    kind,
    key: fm.key ?? base,
    pathRel: rel,
    title: fm.title ?? headingOf(content) ?? base,
    status: fm.status ?? null,
    scope: null,
    appliesTo: fm.appliesTo ?? [],
    tags: fm.tags ?? [],
    contentHash: sha256(content),
    source: 'fs',
    priority: 0,
    origin: 'fs'
  };
}

/** Filesystem parity scan: derives registry-style metadata from the canonical
 * `.agents/` tree and the workspace-root ledgers. This is the fallback truth source. */
export async function scanFs(orgSlug: string): Promise<KbArtifact[]> {
  const items: KbArtifact[] = [];

  for (const { dir, kind } of FS_DIRS) {
    let entries;
    try {
      entries = await fs.readdir(dir, { recursive: true, withFileTypes: true });
    } catch {
      continue; // directory absent (e.g. minimal fork) — skip, never throw
    }
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const parent = entry.parentPath ?? dir;
      const artifact = await fsArtifact(path.join(parent, entry.name), kind, orgSlug);
      if (artifact) items.push(artifact);
    }
  }

  for (const name of ROOT_DOCS) {
    const artifact = await fsArtifact(path.join(ROOT, name), 'document', orgSlug);
    if (artifact) items.push(artifact);
  }

  return items;
}

// ---------------------------------------------------------------------------
// Query API
// ---------------------------------------------------------------------------

/** Lookup by logical key (with alias fallback; DB-miss falls through to the filesystem). */
export async function getByKey(
  kind: KbKind,
  key: string,
  orgSlug: string = DEFAULT_ORG
): Promise<KbArtifact | null> {
  const db = tryOpenDb();
  if (db) {
    try {
      const row = db
        .prepare(
          `SELECT * FROM artifacts WHERE org_slug = ? AND kind = ? AND key = ? AND deleted_at IS NULL`
        )
        .get(orgSlug, kind, key) as Record<string, unknown> | undefined;
      if (row) return rowToArtifact(row);
      const alias = db
        .prepare(
          `SELECT a.* FROM artifact_aliases al
           JOIN artifacts a ON a.artifact_id = al.artifact_id
           WHERE al.org_slug = ? AND al.alias_key = ? AND a.kind = ? AND a.deleted_at IS NULL`
        )
        .get(orgSlug, key, kind) as Record<string, unknown> | undefined;
      if (alias) return rowToArtifact(alias);
    } catch {
      // Unreadable DB mid-query: fall through to the filesystem.
    } finally {
      try {
        db.close();
      } catch {
        // Ignore close failures.
      }
    }
  }
  // Filesystem parity: a DB miss is not authoritative until the sync pipeline
  // (W.57d/e) populates registry rows.
  const items = await scanFs(orgSlug);
  const lower = key.toLowerCase();
  return (
    items.find(i => i.kind === kind && i.key === key) ??
    items.find(i => i.kind === kind && i.key.toLowerCase() === lower) ??
    null
  );
}

/** Exact path lookup (critical for fallback parity). */
export async function getByPath(
  pathRel: string,
  orgSlug: string = DEFAULT_ORG
): Promise<KbArtifact | null> {
  const normalized = toPosix(pathRel);
  const db = tryOpenDb();
  if (db) {
    try {
      const row = db
        .prepare(
          `SELECT * FROM artifacts WHERE org_slug = ? AND path_rel = ? AND deleted_at IS NULL`
        )
        .get(orgSlug, normalized) as Record<string, unknown> | undefined;
      if (row) return rowToArtifact(row);
    } catch {
      // Fall through to the filesystem.
    } finally {
      try {
        db.close();
      } catch {
        // Ignore close failures.
      }
    }
  }
  const kind = kindOfPath(normalized);
  if (!kind) return null;
  return fsArtifact(path.resolve(ROOT, normalized), kind, orgSlug);
}

/** Filtered listing (priority DESC, key ASC; DB + filesystem merge). */
export async function list(options: KbListOptions = {}): Promise<KbListResult> {
  const orgSlug = options.orgSlug ?? DEFAULT_ORG;
  const dbRows: KbArtifact[] = [];

  const db = tryOpenDb();
  if (db) {
    try {
      const where: string[] = ['org_slug = ?', 'deleted_at IS NULL'];
      const params: Array<string | number> = [orgSlug];
      if (options.kind) {
        where.push('kind = ?');
        params.push(options.kind);
      }
      if (options.appliesTo) {
        where.push('applies_to LIKE ?');
        params.push(`%${options.appliesTo}%`);
      }
      for (const tag of options.tags ?? []) {
        where.push('tags LIKE ?');
        params.push(`%${tag}%`);
      }
      const rows = db
        .prepare(`SELECT * FROM artifacts WHERE ${where.join(' AND ')} ORDER BY priority DESC, key ASC`)
        .all(...params) as Array<Record<string, unknown>>;
      dbRows.push(...rows.map(rowToArtifact));
    } catch {
      // Unreadable DB: filesystem only.
    } finally {
      try {
        db.close();
      } catch {
        // Ignore close failures.
      }
    }
  }

  const wantedTags = options.tags ?? [];
  const fsItems = (await scanFs(orgSlug)).filter(item => {
    if (options.kind && item.kind !== options.kind) return false;
    if (options.appliesTo && !item.appliesTo.includes(options.appliesTo)) return false;
    if (wantedTags.length > 0 && !wantedTags.every(t => item.tags.includes(t))) return false;
    return true;
  });

  let items = mergeDbFs(dbRows, fsItems);
  if (options.limit && options.limit > 0) items = items.slice(0, options.limit);
  return { items, origin: originOf(items) };
}

/** Traverse relations (DB-native metadata; no filesystem equivalent → `[]` in fallback). */
export async function findRefs(artifactId: number, relType?: string): Promise<KbReference[]> {
  const db = tryOpenDb();
  if (!db) return [];
  try {
    const params: Array<string | number> = [artifactId];
    let filter = '';
    if (relType) {
      filter = ' AND r.rel_type = ?';
      params.push(relType);
    }
    const outgoing = db
      .prepare(
        `SELECT r.rel_type AS rel_type, a.* FROM artifact_references r
         JOIN artifacts a ON a.artifact_id = r.to_artifact_id
         WHERE r.from_artifact_id = ?${filter}`
      )
      .all(...params) as Array<Record<string, unknown>>;
    const incoming = db
      .prepare(
        `SELECT r.rel_type AS rel_type, a.* FROM artifact_references r
         JOIN artifacts a ON a.artifact_id = r.from_artifact_id
         WHERE r.to_artifact_id = ?${filter}`
      )
      .all(...params) as Array<Record<string, unknown>>;
    const toRef = (row: Record<string, unknown>, direction: 'outgoing' | 'incoming'): KbReference => ({
      relType: String(row.rel_type),
      direction,
      artifact: rowToArtifact(row)
    });
    return [...outgoing.map(r => toRef(r, 'outgoing')), ...incoming.map(r => toRef(r, 'incoming'))];
  } finally {
    try {
      db.close();
    } catch {
      // Ignore close failures.
    }
  }
}

/** Simple full-text over title/path/tags with ranking (title 3, path 2, tags 1). */
export async function search(
  query: string,
  fields: KbSearchField[] = ['title', 'path', 'tags'],
  limit = 50,
  orgSlug: string = DEFAULT_ORG
): Promise<KbSearchResult> {
  const q = query.trim();
  if (q === '') return { items: [], origin: 'fs' };
  const active = fields.length > 0 ? fields : (['title', 'path', 'tags'] as KbSearchField[]);
  const qLower = q.toLowerCase();
  const pattern = `%${qLower}%`;

  const dbHits: KbSearchHit[] = [];
  const db = tryOpenDb();
  if (db) {
    try {
      const params: string[] = [];
      let titleSql = '0';
      if (active.includes('title')) {
        titleSql = `(CASE WHEN lower(COALESCE(title, '')) LIKE ? THEN 3 ELSE 0 END)`;
        params.push(pattern);
      }
      let pathSql = '0';
      if (active.includes('path')) {
        pathSql = `(CASE WHEN lower(path_rel) LIKE ? THEN 2 ELSE 0 END)`;
        params.push(pattern);
      }
      let tagsSql = '0';
      if (active.includes('tags')) {
        tagsSql = `(CASE WHEN lower(COALESCE(tags, '')) LIKE ? THEN 1 ELSE 0 END)`;
        params.push(pattern);
      }
      // Placeholder order follows the SQL text: the score CASEs come before
      // `org_slug = ?` in the subquery, so patterns bind first, then org, then limit.
      const rows = db
        .prepare(
          `SELECT * FROM (
             SELECT a.*, ${titleSql} + ${pathSql} + ${tagsSql} AS score
             FROM artifacts a WHERE org_slug = ? AND deleted_at IS NULL
           ) WHERE score > 0 ORDER BY score DESC, priority DESC, key ASC LIMIT ?`
        )
        .all(...params, orgSlug, String(limit)) as Array<Record<string, unknown>>;
      for (const row of rows) {
        dbHits.push({ ...rowToArtifact(row), score: Number(row.score) });
      }
    } catch {
      // Unreadable DB: filesystem only.
    } finally {
      try {
        db.close();
      } catch {
        // Ignore close failures.
      }
    }
  }

  const fsHits: KbSearchHit[] = [];
  for (const item of await scanFs(orgSlug)) {
    let score = 0;
    if (active.includes('title') && (item.title ?? '').toLowerCase().includes(qLower)) score += 3;
    if (active.includes('path') && item.pathRel.toLowerCase().includes(qLower)) score += 2;
    if (active.includes('tags') && item.tags.some(t => t.toLowerCase().includes(qLower))) score += 1;
    if (score > 0) fsHits.push({ ...item, score });
  }

  const byPath = new Map<string, KbSearchHit>();
  for (const hit of fsHits) byPath.set(hit.pathRel, hit);
  for (const hit of dbHits) byPath.set(hit.pathRel, hit);
  const items = [...byPath.values()]
    .sort((a, b) => b.score - a.score || b.priority - a.priority || a.key.localeCompare(b.key))
    .slice(0, limit);
  return { items, origin: originOf(items) };
}
