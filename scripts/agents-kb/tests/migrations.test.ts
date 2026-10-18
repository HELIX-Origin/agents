#!/usr/bin/env node
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { MIGRATIONS_DIR, kbPath } from '../kb-config.ts';
import { runMigrations } from '../migrate.ts';

/**
 * Migration runner contract tests. Each scenario uses a throwaway DB via the
 * `AGENTS_KB_PATH` env override so the real local data dir is never touched.
 */
export default async function run(): Promise<void> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'agents-kb-test-'));
  const previousEnv = process.env.AGENTS_KB_PATH;
  try {
    const files = (await fs.readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort();
    assert.ok(files.length >= 2, `expected at least v001+v002 migrations, found ${files.length}`);

    // --- 1) Fresh build applies ALL migrations and lands on 2.0.0.
    process.env.AGENTS_KB_PATH = path.join(tmp, 'fresh.db');
    const first = await runMigrations();
    assert.equal(first.appliedCount, files.length, 'fresh build must apply every migration file');
    assert.equal(first.fileCount, files.length);
    assert.equal(first.schemaVersion, '2.0.0', 'schema_version must be 2.0.0 after full build');
    assert.deepEqual(first.applied, files, 'applied list must match sorted file list');

    // --- 2) Rerun applies nothing (idempotency).
    const second = await runMigrations();
    assert.equal(second.appliedCount, 0, 'second run must apply zero migrations');
    assert.equal(second.schemaVersion, '2.0.0');

    // --- 3) Artifact schema is metadata-only: no content columns, has metadata_entries.
    const dbPath = kbPath();
    {
      const db = new DatabaseSync(dbPath);
      const columns = db
        .prepare(`SELECT name FROM pragma_table_info('artifacts')`)
        .all()
        .map(row => String(row.name));
      for (const forbidden of ['content_md', 'frontmatter', 'checksum_fs']) {
        assert.ok(!columns.includes(forbidden), `artifacts must NOT contain content column '${forbidden}'`);
      }
      const tables = db
        .prepare(`SELECT name FROM sqlite_master WHERE type = 'table'`)
        .all()
        .map(row => String(row.name));
      assert.ok(tables.includes('metadata_entries'), 'metadata_entries table must exist');
      db.close();
    }

    // --- 4) kind CHECK accepts rule/skill/agent (and template/document/fragment).
    {
      const db = new DatabaseSync(dbPath);
      const now = Date.now();
      db.prepare(
        'INSERT OR IGNORE INTO organizations (org_slug, display_name, created_at, updated_at) VALUES (?, ?, ?, ?)'
      ).run('HELIX-Origin', 'HELIX-Origin', now, now);
      const insert = db.prepare(
        `INSERT INTO artifacts (org_slug, kind, key, path_rel, title, content_hash, source, created_at, updated_at)
         VALUES ('HELIX-Origin', ?, ?, ?, ?, ?, 'fs', ?, ?)`
      );
      const kinds = ['rule', 'skill', 'agent', 'template', 'document', 'fragment'];
      for (const kind of kinds) {
        insert.run(kind, `probe-${kind}`, `.agents/probe-${kind}.md`, `Probe ${kind}`, 'deadbeef', now, now);
      }
      const found = db
        .prepare(`SELECT DISTINCT kind FROM artifacts WHERE org_slug = 'HELIX-Origin'`)
        .all()
        .map(row => String(row.kind))
        .sort();
      assert.deepEqual(found, [...kinds].sort(), 'all six kinds must be storable');
      db.close();
    }

    // --- 5) schema_version never downgrades: a forced low value is corrected on rerun.
    {
      const db = new DatabaseSync(dbPath);
      db.prepare('UPDATE schema_meta SET meta_value = ? WHERE meta_key = ?').run('1.0.0', 'schema_version');
      db.close();
    }
    const third = await runMigrations();
    assert.equal(third.schemaVersion, '2.0.0', 'schema_version must never downgrade on rerun');
    assert.equal(third.appliedCount, 0, 'version correction must not re-apply migrations');

    // --- 6) Legacy backfill: DB with only last_migration='v001__init.sql' applies ONLY v002.
    process.env.AGENTS_KB_PATH = path.join(tmp, 'legacy.db');
    {
      const legacy = new DatabaseSync(kbPath());
      legacy.exec('PRAGMA foreign_keys = ON;');
      const v001 = await fs.readFile(path.join(MIGRATIONS_DIR, files[0]), 'utf8');
      legacy.exec(v001);
      const now = Date.now();
      legacy
        .prepare('INSERT OR REPLACE INTO schema_meta (meta_key, meta_value, updated_at) VALUES (?, ?, ?)')
        .run('last_migration', files[0], now);
      legacy.close();
    }
    const backfill = await runMigrations();
    assert.equal(backfill.appliedCount, 1, 'legacy backfill must apply only the un-recorded v002');
    assert.deepEqual(backfill.applied, [files[1]], 'only v002 must run against a legacy DB');
    assert.equal(backfill.schemaVersion, '2.0.0');
  } finally {
    if (previousEnv === undefined) delete process.env.AGENTS_KB_PATH;
    else process.env.AGENTS_KB_PATH = previousEnv;
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
