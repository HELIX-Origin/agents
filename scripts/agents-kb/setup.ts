#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';
import { DATA_DIR, LOGS_DIR, defaultConfig, kbPath } from './kb-config.ts';
import { createConsoleLogger, createLogger, type KbLogger } from './kb-log.ts';
import { runMigrations } from './migrate.ts';

export interface SetupResult {
  dbPath: string;
  schemaVersion: string;
  appliedCount: number;
  seededOrg: string;
}

/**
 * Initial setup after cloning the agents ecosystem: creates the local-only `data/` and
 * `logs/` directories, applies all migrations, and seeds the default organization row.
 * Idempotent — safe to run repeatedly; existing rows and applied migrations are untouched.
 */
export async function runSetup(logger?: KbLogger): Promise<SetupResult> {
  const log = logger ?? createConsoleLogger();
  const cfg = defaultConfig();
  log.section('setup');

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(LOGS_DIR, { recursive: true });
  log.log(`data dir ready: ${DATA_DIR}`);

  const migration = await runMigrations(log);

  const dbFile = kbPath();
  const db = new DatabaseSync(dbFile);
  db.exec('PRAGMA foreign_keys = ON;');

  const stamp = Date.now();
  const existing = db
    .prepare('SELECT org_slug FROM organizations WHERE org_slug = ?')
    .get(cfg.orgSlug);
  if (existing) {
    log.log(`organization already present: ${cfg.orgSlug}`);
  } else {
    db.prepare(
      'INSERT INTO organizations (org_slug, display_name, created_at, updated_at) VALUES (?, ?, ?, ?)'
    ).run(cfg.orgSlug, cfg.orgSlug, stamp, stamp);
    log.log(`organization seeded: ${cfg.orgSlug}`);
  }
  db.close();

  return {
    dbPath: dbFile,
    schemaVersion: migration.schemaVersion,
    appliedCount: migration.appliedCount,
    seededOrg: cfg.orgSlug
  };
}

// Direct-run guard: only auto-run when this file is the CLI entry point.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const logger = createLogger('setup');
  runSetup(logger)
    .then(result => {
      logger.log(
        `setup complete: db=${result.dbPath} schema_version=${result.schemaVersion} applied=${result.appliedCount}`
      );
      logger.close();
    })
    .catch(err => {
      logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
      logger.close();
      process.exit(1);
    });
}
