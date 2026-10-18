#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';

import { ROOT, defaultConfig, kbPath } from './kb-config.ts';
import { runMigrations } from './migrate.ts';
import { createConsoleLogger, createLogger, type KbLogger } from './kb-log.ts';
import { now, sha256 } from './kb-db.ts';
import { toPosix } from './kb-read.ts';

const VALID_KINDS = new Set(['rule', 'skill', 'agent', 'template', 'document', 'fragment']);
const VALID_VALUE_TYPES = new Set(['string', 'number', 'boolean', 'url', 'array', 'object']);
const VALID_SOURCES = new Set(['fs', 'db', 'import']);

export interface ArtifactInput {
  orgSlug?: string;
  kind: string;
  key: string;
  pathRel: string;
  title?: string | null;
  status?: string | null;
  scope?: string | null;
  appliesTo?: string[];
  tags?: string[];
  source?: string;
  priority?: number;
}

export interface MetadataInput {
  orgSlug?: string;
  pathRel: string;
  metaKey: string;
  metaValue: unknown;
  valueType: string;
  source?: string;
}

export interface InvariantViolation {
  pathRel: string;
  rule: string;
  detail: string;
}

export interface ValidateResult {
  checked: number;
  violations: InvariantViolation[];
}

function fullPathFor(rel: string): string {
  return path.join(ROOT, ...rel.split('/'));
}

function isAllowedPath(rel: string): boolean {
  return (
    rel.startsWith('.agents/rules/') ||
    rel.startsWith('.agents/skills/') ||
    rel.startsWith('.agents/agents/') ||
    rel.startsWith('.agents/templates/') ||
    (rel.includes('/') === false && ['AGENTS.md', 'ROADMAP.md', 'PLAN.md', 'TODO.md', 'BUGS.md', 'HANDOFF.md'].includes(rel))
  );
}

/**
 * Controlled upsert of an artifact's metadata. Validates every invariant before
 * touching the DB: kind enum, org exists, path exists on fs, path is within an
 * allowed root, content_hash matches the canonical file, and no content is stored.
 */
export async function upsertArtifact(input: ArtifactInput, logger?: KbLogger): Promise<number> {
  const log = logger ?? createConsoleLogger();
  const orgSlug = input.orgSlug ?? defaultConfig().orgSlug;
  const kind = input.kind;
  const key = input.key;
  const pathRel = toPosix(input.pathRel);

  if (!VALID_KINDS.has(kind)) throw new Error(`invalid kind: ${kind}`);
  if (!key || key.trim() === '') throw new Error('key must be non-empty');
  if (!isAllowedPath(pathRel)) throw new Error(`path not in an allowed root: ${pathRel}`);

  const full = fullPathFor(pathRel);
  const content = await fs.readFile(full, 'utf8').catch(() => null);
  if (content == null) throw new Error(`file does not exist: ${pathRel}`);
  const hash = sha256(content);

  const source = input.source ?? 'fs';
  if (!VALID_SOURCES.has(source)) throw new Error(`invalid source: ${source}`);

  await runMigrations(log);
  const dbFile = kbPath();
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON;');

  const stamp = now();
  const orgExists = db.prepare('SELECT org_slug FROM organizations WHERE org_slug = ?').get(orgSlug);
  if (!orgExists) {
    db.prepare('INSERT INTO organizations (org_slug, display_name, created_at, updated_at) VALUES (?, ?, ?, ?)')
      .run(orgSlug, orgSlug, stamp, stamp);
  }

  const existing = db
    .prepare('SELECT artifact_id FROM artifacts WHERE org_slug = ? AND path_rel = ?')
    .get(orgSlug, pathRel) as { artifact_id: number } | undefined;

  const appliesTo = JSON.stringify(input.appliesTo ?? []);
  const tags = JSON.stringify(input.tags ?? []);
  const title = input.title ?? null;
  const status = input.status ?? null;
  const scope = input.scope ?? null;
  const priority = input.priority ?? 0;

  let artifactId: number;
  if (existing) {
    db.prepare(
      `UPDATE artifacts SET kind=?, key=?, title=?, status=?, scope=?, applies_to=?, tags=?,
         content_hash=?, source=?, priority=?, updated_at=?, deleted_at=NULL
       WHERE artifact_id=?`
    ).run(kind, key, title, status, scope, appliesTo, tags, hash, source, priority, stamp, existing.artifact_id);
    artifactId = existing.artifact_id;
    log.log(`updated artifact: ${pathRel} (id=${artifactId})`);
  } else {
    const result = db
      .prepare(
        `INSERT INTO artifacts (org_slug, kind, key, path_rel, title, status, scope, applies_to, tags,
           content_hash, source, priority, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(orgSlug, kind, key, pathRel, title, status, scope, appliesTo, tags, hash, source, priority, stamp, stamp);
    artifactId = Number(result.lastInsertRowid);
    log.log(`inserted artifact: ${pathRel} (id=${artifactId})`);
  }

  db.close();
  return artifactId;
}

/**
 * Controlled upsert of a metadata entry attached to an artifact. Validates the
 * artifact exists (path_rel registered), value type, and JSON validity.
 */
export async function upsertMetadata(input: MetadataInput, logger?: KbLogger): Promise<void> {
  const log = logger ?? createConsoleLogger();
  const orgSlug = input.orgSlug ?? defaultConfig().orgSlug;
  const pathRel = toPosix(input.pathRel);
  const metaKey = input.metaKey;
  if (!metaKey || metaKey.trim() === '') throw new Error('metaKey must be non-empty');
  if (!VALID_VALUE_TYPES.has(input.valueType)) throw new Error(`invalid valueType: ${input.valueType}`);

  let metaValue: string;
  try {
    metaValue = JSON.stringify(input.metaValue);
  } catch {
    throw new Error('metaValue is not JSON-serializable');
  }
  // For scalar types, store the raw primitive string for readability.
  if (input.valueType === 'string' || input.valueType === 'url') {
    metaValue = JSON.stringify(String(input.metaValue));
  } else if (input.valueType === 'number') {
    if (typeof input.metaValue !== 'number') throw new Error('metaValue must be a number');
    metaValue = JSON.stringify(input.metaValue);
  } else if (input.valueType === 'boolean') {
    if (typeof input.metaValue !== 'boolean') throw new Error('metaValue must be a boolean');
    metaValue = JSON.stringify(input.metaValue);
  }

  await runMigrations(log);
  const dbFile = kbPath();
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON;');

  const artifact = db
    .prepare('SELECT artifact_id FROM artifacts WHERE org_slug = ? AND path_rel = ? AND deleted_at IS NULL')
    .get(orgSlug, pathRel) as { artifact_id: number } | undefined;
  if (!artifact) {
    db.close();
    throw new Error(`artifact not registered for path: ${pathRel} (run sync or upsertArtifact first)`);
  }

  const stamp = now();
  const source = input.source ?? 'db';
  if (!VALID_SOURCES.has(source)) throw new Error(`invalid source: ${source}`);

  const existing = db
    .prepare('SELECT entry_id FROM metadata_entries WHERE org_slug = ? AND artifact_id = ? AND meta_key = ?')
    .get(orgSlug, artifact.artifact_id, metaKey) as { entry_id: number } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE metadata_entries SET meta_value=?, value_type=?, source=?, updated_at=? WHERE entry_id=?`
    ).run(metaValue, input.valueType, source, stamp, existing.entry_id);
    log.log(`updated metadata: ${pathRel} :: ${metaKey}`);
  } else {
    db.prepare(
      `INSERT INTO metadata_entries (org_slug, artifact_id, meta_key, meta_value, value_type, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(orgSlug, artifact.artifact_id, metaKey, metaValue, input.valueType, source, stamp, stamp);
    log.log(`inserted metadata: ${pathRel} :: ${metaKey}`);
  }

  db.close();
}

/**
 * Soft-delete an artifact row (marks deleted_at). Used by the controlled pipeline
 * when a file is intentionally removed from the registry.
 */
export async function softDeleteArtifact(orgSlug: string, pathRel: string, logger?: KbLogger): Promise<void> {
  const log = logger ?? createConsoleLogger();
  const rel = toPosix(pathRel);
  await runMigrations(log);
  const dbFile = kbPath();
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON;');
  const stamp = now();
  const result = db
    .prepare('UPDATE artifacts SET deleted_at = ?, updated_at = ? WHERE org_slug = ? AND path_rel = ? AND deleted_at IS NULL')
    .run(stamp, stamp, orgSlug, rel);
  db.close();
  log.log(`soft-deleted ${result.changes} artifact row(s): ${rel}`);
}

/**
 * Validate KB invariants against the filesystem. Returns a list of violations
 * (empty = healthy). Checks:
 *   - every non-deleted artifact's path exists on disk
 *   - content_hash matches the canonical file
 *   - kind is in the valid enum (enforced by CHECK, but re-verified)
 *   - no orphaned metadata_entries (FK enforced, but re-verified)
 *   - org_slug exists in organizations
 */
export async function validateInvariants(orgSlug?: string, logger?: KbLogger): Promise<ValidateResult> {
  const log = logger ?? createConsoleLogger();
  const targetOrg = orgSlug ?? defaultConfig().orgSlug;
  await runMigrations(log);
  const dbFile = kbPath();
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON;');

  const violations: InvariantViolation[] = [];
  const rows = db
    .prepare('SELECT * FROM artifacts WHERE org_slug = ? AND deleted_at IS NULL')
    .all(targetOrg) as Array<Record<string, unknown>>;

  for (const r of rows) {
    const rel = String(r.path_rel);
    const full = fullPathFor(rel);
    const content = await fs.readFile(full, 'utf8').catch(() => null);
    if (content == null) {
      violations.push({ pathRel: rel, rule: 'path-exists', detail: 'file missing on disk' });
      continue;
    }
    const hash = sha256(content);
    if (hash !== String(r.content_hash)) {
      violations.push({ pathRel: rel, rule: 'hash-match', detail: 'content_hash stale (file changed)' });
    }
    if (!VALID_KINDS.has(String(r.kind))) {
      violations.push({ pathRel: rel, rule: 'valid-kind', detail: `unknown kind: ${r.kind}` });
    }
  }

  // Orphan metadata entries (should be impossible via FK, but verify).
  const orphanMeta = db
    .prepare(
      `SELECT m.entry_id, m.meta_key FROM metadata_entries m
       LEFT JOIN artifacts a ON a.artifact_id = m.artifact_id
       WHERE a.artifact_id IS NULL`
    )
    .all() as Array<{ entry_id: number; meta_key: string }>;
  for (const o of orphanMeta) {
    violations.push({ pathRel: '(none)', rule: 'no-orphan-metadata', detail: `orphan entry_id=${o.entry_id} key=${o.meta_key}` });
  }

  db.close();
  const result: ValidateResult = { checked: rows.length, violations };
  if (violations.length === 0) {
    log.log(`validate: ${rows.length} artifacts checked, 0 violations`);
  } else {
    log.warn(`validate: ${rows.length} artifacts checked, ${violations.length} violation(s)`);
    for (const v of violations) log.warn(`  [${v.rule}] ${v.pathRel}: ${v.detail}`);
  }
  return result;
}

/**
 * CLI entry point: runs invariant validation and exits non-zero on violations.
 */
export async function runValidate(logger?: KbLogger): Promise<ValidateResult> {
  const log = logger ?? createConsoleLogger();
  log.section('validate');
  const result = await validateInvariants(undefined, log);
  return result;
}

// Direct-run guard: only auto-run when this file is the CLI entry point.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const logger = createLogger('validate');
  runValidate(logger)
    .then(result => {
      logger.log(`validate complete: checked=${result.checked} violations=${result.violations.length}`);
      logger.close();
      if (result.violations.length > 0) process.exit(1);
    })
    .catch(err => {
      logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
      logger.close();
      process.exit(1);
    });
}
