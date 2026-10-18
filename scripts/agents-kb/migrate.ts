#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';
import { kbPath, MIGRATIONS_DIR } from './kb-config.ts';
import { createConsoleLogger, createLogger, type KbLogger } from './kb-log.ts';

const MIGRATION_PREFIX = 'migration:';
const VERSION_RE = /^v(\d{3})__/;

export interface MigrationResult {
  appliedCount: number;
  fileCount: number;
  schemaVersion: string;
  applied: string[];
}

function versionOf(file: string, fallback: number): string {
  const match = file.match(VERSION_RE);
  return match ? `${Number(match[1])}.0.0` : `${fallback}.0.0`;
}

/**
 * Forward-only migration runner.
 * - Each applied file is recorded as `migration:<file>` in `schema_meta` and skipped later.
 * - `schema_version` is `<major>.0.0` from the numeric migration prefix (v002 -> 2.0.0) and is
 *   recomputed from ALL applied files on every run so it can never drift or downgrade.
 * - Legacy databases that only recorded `last_migration` are backfilled: migrations were
 *   historically applied in sorted order, so every file up to and including `last_migration`
 *   counts as applied.
 * - The target DB comes from `kbPath()` (`AGENTS_KB_PATH` env override or the local data dir).
 */
export async function runMigrations(logger?: KbLogger): Promise<MigrationResult> {
  const log = logger ?? createConsoleLogger();
  const dbFile = kbPath();
  await fs.mkdir(path.dirname(dbFile), { recursive: true });
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');

  db.exec(`CREATE TABLE IF NOT EXISTS schema_meta (
    meta_key TEXT PRIMARY KEY,
    meta_value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  )`);

  const files = (await fs.readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort();
  const applied = new Set(
    db
      .prepare(`SELECT meta_key FROM schema_meta WHERE meta_key LIKE ?`)
      .all(`${MIGRATION_PREFIX}%`)
      .map(row => String(row.meta_key).slice(MIGRATION_PREFIX.length))
  );

  // Backfill legacy databases: migrations ran sequentially, so everything up to and
  // including `last_migration` was applied even though per-file keys are missing.
  const last = db
    .prepare(`SELECT meta_value FROM schema_meta WHERE meta_key = 'last_migration'`)
    .get() as { meta_value?: unknown } | undefined;
  if (last?.meta_value) {
    const lastIndex = files.indexOf(String(last.meta_value));
    for (let i = 0; i <= lastIndex; i += 1) applied.add(files[i]);
  }

  let appliedCount = 0;
  const appliedFiles: string[] = [];
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = await fs.readFile(path.join(MIGRATIONS_DIR, file), 'utf8');
    db.exec(sql);
    applied.add(file);

    const stamp = Date.now();
    const record = db.prepare(
      'INSERT OR REPLACE INTO schema_meta (meta_key, meta_value, updated_at) VALUES (?, ?, ?)'
    );
    record.run(`${MIGRATION_PREFIX}${file}`, versionOf(file, appliedCount + 1), stamp);
    record.run('last_migration', file, stamp);
    appliedCount += 1;
    appliedFiles.push(file);
    log.log(`applied: ${file}`);
  }

  // Always recompute schema_version from all applied migrations (prevents drift/downgrade).
  const version = files
    .filter(file => applied.has(file))
    .reduce((max, file) => {
      const match = file.match(VERSION_RE);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
  const schemaVersion = `${version}.0.0`;
  db.prepare('INSERT OR REPLACE INTO schema_meta (meta_key, meta_value, updated_at) VALUES (?, ?, ?)')
    .run('schema_version', schemaVersion, Date.now());

  db.close();
  return { appliedCount, fileCount: files.length, schemaVersion, applied: appliedFiles };
}

// Direct-run guard: only auto-run when this file is the CLI entry point.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const logger = createLogger('migrate');
  runMigrations(logger)
    .then(result => {
      logger.log(
        `migrations applied: ${result.appliedCount} (files: ${result.fileCount}, schema_version: ${result.schemaVersion})`
      );
      logger.close();
    })
    .catch(err => {
      logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
      logger.close();
      process.exit(1);
    });
}
