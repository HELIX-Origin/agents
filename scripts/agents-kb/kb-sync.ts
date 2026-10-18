#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';

import { DATA_DIR, defaultConfig, kbPath } from './kb-config.ts';
import { runMigrations } from './migrate.ts';
import { createConsoleLogger, createLogger, type KbLogger } from './kb-log.ts';
import { now, sha256 } from './kb-db.ts';
import { scanFs, type KbArtifact } from './kb-read.ts';

export interface SyncResult {
  orgSlug: string;
  inserted: number;
  updated: number;
  unchanged: number;
  removed: number;
  total: number;
  schemaVersion: string;
}

/**
 * Filesystem -> DB sync. The filesystem is canonical: every scanned `.agents/` +
 * root-ledger file becomes (or updates) a metadata-only artifact row; rows whose
 * path no longer exists are soft-deleted. The DB never stores file content.
 */
export async function runSync(logger?: KbLogger): Promise<SyncResult> {
  const log = logger ?? createConsoleLogger();
  const cfg = defaultConfig();
  const orgSlug = cfg.orgSlug;

  log.section('sync');

  const migration = await runMigrations(log);
  const dbFile = kbPath();
  await fs.mkdir(path.dirname(dbFile), { recursive: true });
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');

  const stamp = now();
  const orgExists = db.prepare('SELECT org_slug FROM organizations WHERE org_slug = ?').get(orgSlug);
  if (orgExists) {
    log.log(`organization already present: ${orgSlug}`);
  } else {
    db.prepare('INSERT INTO organizations (org_slug, display_name, created_at, updated_at) VALUES (?, ?, ?, ?)')
      .run(orgSlug, orgSlug, stamp, stamp);
    log.log(`organization seeded: ${orgSlug}`);
  }

  const items = await scanFs(orgSlug);
  log.log(`scanned ${items.length} filesystem artifacts`);

  const selectByPath = db.prepare('SELECT * FROM artifacts WHERE org_slug = ? AND path_rel = ?');
  const insertStmt = db.prepare(
    `INSERT INTO artifacts (org_slug, kind, key, path_rel, title, status, scope, applies_to, tags, content_hash, source, priority, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const updateStmt = db.prepare(
    `UPDATE artifacts SET kind = ?, key = ?, title = ?, status = ?, scope = ?, applies_to = ?, tags = ?,
       content_hash = ?, source = ?, priority = ?, updated_at = ?, deleted_at = NULL
     WHERE org_slug = ? AND path_rel = ?`
  );

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const item of items) {
    const existing = selectByPath.get(orgSlug, item.pathRel) as Record<string, unknown> | undefined;
    const appliesTo = JSON.stringify(item.appliesTo ?? []);
    const tags = JSON.stringify(item.tags ?? []);
    const rowStamp = now();

    if (existing) {
      const sameHash = String(existing.content_hash ?? '') === item.contentHash;
      const sameMeta =
        existing.kind === item.kind &&
        existing.key === item.key &&
        existing.title === item.title &&
        existing.status === item.status &&
        String(existing.applies_to ?? '') === appliesTo &&
        String(existing.tags ?? '') === tags;
      if (sameHash && sameMeta) {
        unchanged += 1;
        continue;
      }
      updateStmt.run(
        item.kind, item.key, item.title, item.status, item.scope, appliesTo, tags,
        item.contentHash, item.source, item.priority, rowStamp, orgSlug, item.pathRel
      );
      updated += 1;
    } else {
      insertStmt.run(
        orgSlug, item.kind, item.key, item.pathRel, item.title, item.status, item.scope,
        appliesTo, tags, item.contentHash, item.source, item.priority, rowStamp, rowStamp
      );
      inserted += 1;
    }
  }

  // Soft-delete rows whose path no longer exists on the filesystem.
  const allRows = db
    .prepare('SELECT path_rel FROM artifacts WHERE org_slug = ? AND deleted_at IS NULL')
    .all(orgSlug) as Array<{ path_rel: string }>;
  const present = new Set(items.map(i => i.pathRel));
  const softDelete = db.prepare(
    'UPDATE artifacts SET deleted_at = ?, updated_at = ? WHERE org_slug = ? AND path_rel = ?'
  );
  let removed = 0;
  for (const row of allRows) {
    if (!present.has(row.path_rel)) {
      softDelete.run(now(), now(), orgSlug, row.path_rel);
      removed += 1;
    }
  }

  db.close();

  const result: SyncResult = {
    orgSlug,
    inserted,
    updated,
    unchanged,
    removed,
    total: items.length,
    schemaVersion: migration.schemaVersion
  };
  log.log(
    `sync complete: inserted=${inserted} updated=${updated} unchanged=${unchanged} removed=${removed} (total ${items.length})`
  );
  return result;
}

// Direct-run guard: only auto-run when this file is the CLI entry point.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const logger = createLogger('sync');
  runSync(logger)
    .then(result => {
      logger.log(
        `sync summary: org=${result.orgSlug} inserted=${result.inserted} updated=${result.updated} unchanged=${result.unchanged} removed=${result.removed} total=${result.total} schema=${result.schemaVersion}`
      );
      logger.close();
    })
    .catch(err => {
      logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
      logger.close();
      process.exit(1);
    });
}
