#!/usr/bin/env node
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { runMigrations } from '../migrate.ts';
import type { KbLogger } from '../kb-log.ts';
import { getByKey, getByPath, list, search, findRefs } from '../kb-read.ts';

/** Silent logger: migration runs inside tests must not spam console or write log files. */
const silent: KbLogger = {
  logFile: null,
  section() {},
  log() {},
  warn() {},
  error() {},
  startTimer() {
    return () => 0;
  },
  close() {}
};

/**
 * kb-read.ts contract tests: filesystem fallback (missing/legacy DB), read-only
 * guarantee (never creates the DB file), DB-first lookups with alias fallback,
 * refs traversal, tag filtering, and ranked search. Throwaway DBs only via the
 * `AGENTS_KB_PATH` env override.
 */
export default async function run(): Promise<void> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'agents-kb-read-test-'));
  const previousEnv = process.env.AGENTS_KB_PATH;
  try {
    // --- 1) Missing DB: pure filesystem fallback, and the DB is NEVER created.
    const missing = path.join(tmp, 'missing.db');
    process.env.AGENTS_KB_PATH = missing;

    const rules = await list({ kind: 'rule' });
    assert.equal(rules.origin, 'fs', 'missing DB must answer from the filesystem');
    assert.ok(rules.items.length >= 1, 'filesystem fallback must find the real .agents/rules files');
    assert.ok(
      rules.items.every(i => i.pathRel.startsWith('.agents/rules/')),
      'kind filter must scope filesystem results to rules'
    );
    const rule = rules.items[0];
    assert.ok(rule.contentHash.length === 64, 'fs rows must carry a sha-256 content hash');
    assert.ok(rule.title && rule.title.length > 0, 'fs rows must derive a title');

    const byPath = await getByPath('.agents/rules/git-operations.md');
    assert.ok(byPath, 'getByPath must resolve a real rule file');
    assert.equal(byPath.origin, 'fs');

    const found = await search('handoff');
    assert.ok(found.items.length >= 1, 'search must find handoff-related artifacts via fs');
    assert.ok(
      found.items[0].score >= found.items[found.items.length - 1].score,
      'search results must be score-ordered'
    );

    assert.equal(existsSync(missing), false, 'read access must never create the database file');

    // --- 2) Healthy v2 DB: DB-first answers, alias fallback, refs, tag filter, search.
    const dbFile = path.join(tmp, 'healthy.db');
    process.env.AGENTS_KB_PATH = dbFile;
    const migrated = await runMigrations(silent);
    assert.equal(migrated.schemaVersion, '2.0.0');
    let demoId: number;
    let skillId: number;
    {
      const db = new DatabaseSync(dbFile);
      const now = Date.now();
      db.prepare(
        'INSERT INTO organizations (org_slug, display_name, created_at, updated_at) VALUES (?, ?, ?, ?)'
      ).run('HELIX-Origin', 'HELIX-Origin', now, now);
      db.prepare(
        `INSERT INTO artifacts (org_slug, kind, key, path_rel, title, tags, content_hash, source, priority, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'db', 10, ?, ?)`
      ).run('HELIX-Origin', 'rule', 'demo-rule', '.agents/rules/demo-rule.md', 'Demo Rule', '["demo"]', 'a'.repeat(64), now, now);
      demoId = Number(
        (db.prepare(`SELECT artifact_id FROM artifacts WHERE key = 'demo-rule'`).get() as { artifact_id: number })
          .artifact_id
      );
      db.prepare('INSERT INTO artifact_aliases (org_slug, artifact_id, alias_key, created_at) VALUES (?, ?, ?, ?)').run(
        'HELIX-Origin',
        demoId,
        'demo-alias',
        now
      );
      db.prepare(
        `INSERT INTO artifacts (org_slug, kind, key, path_rel, title, tags, content_hash, source, created_at, updated_at)
         VALUES ('HELIX-Origin', 'skill', 'demo-skill', '.agents/skills/demo-skill.md', 'Demo Skill', '["demo"]', ?, 'db', ?, ?)`
      ).run('b'.repeat(64), now, now);
      skillId = Number(
        (db.prepare(`SELECT artifact_id FROM artifacts WHERE key = 'demo-skill'`).get() as { artifact_id: number })
          .artifact_id
      );
      db.prepare(
        'INSERT INTO artifact_references (org_slug, from_artifact_id, to_artifact_id, rel_type, created_at) VALUES (?, ?, ?, ?, ?)'
      ).run('HELIX-Origin', demoId, skillId, 'documents', now);
      db.close();
    }

    const byKey = await getByKey('rule', 'demo-rule');
    assert.ok(byKey, 'getByKey must hit the DB row');
    assert.equal(byKey.origin, 'db');
    assert.equal(byKey.artifactId, demoId);
    assert.deepEqual(byKey.tags, ['demo'], 'tags JSON must parse');

    const byAlias = await getByKey('rule', 'demo-alias');
    assert.ok(byAlias, 'alias fallback must resolve');
    assert.equal(byAlias.key, 'demo-rule');
    assert.equal(byAlias.artifactId, demoId);

    const refs = await findRefs(demoId);
    assert.equal(refs.length, 1, 'findRefs must return the outgoing relation');
    assert.equal(refs[0].direction, 'outgoing');
    assert.equal(refs[0].relType, 'documents');
    assert.equal(refs[0].artifact.artifactId, skillId);
    const reverseRefs = await findRefs(skillId);
    assert.equal(reverseRefs.length, 1, 'findRefs must also surface incoming relations');
    assert.equal(reverseRefs[0].direction, 'incoming');

    const tagged = await list({ kind: 'rule', tags: ['demo'] });
    assert.ok(
      tagged.items.some(i => i.origin === 'db' && i.key === 'demo-rule'),
      'DB row must answer the tag filter'
    );
    assert.ok(
      !tagged.items.some(i => i.origin === 'fs'),
      'filesystem rules carry no demo tag and must be filtered out'
    );

    const searched = await search('demo-rule');
    assert.ok(
      searched.items.some(i => i.origin === 'db' && i.key === 'demo-rule'),
      'search must include DB hits'
    );
    assert.equal(searched.items[0].key, 'demo-rule', 'top hit must be the exact DB row');

    // --- 3) Schema-mismatched DB (v1-era): reads fall back to the filesystem.
    const legacy = path.join(tmp, 'legacy.db');
    {
      const db = new DatabaseSync(legacy);
      db.exec('CREATE TABLE schema_meta (meta_key TEXT PRIMARY KEY, meta_value TEXT NOT NULL, updated_at INTEGER NOT NULL)');
      db.prepare('INSERT INTO schema_meta VALUES (?, ?, ?)').run('schema_version', '1.0.0', Date.now());
      db.exec('CREATE TABLE artifacts (artifact_id INTEGER PRIMARY KEY, content_md TEXT)');
      db.close();
    }
    process.env.AGENTS_KB_PATH = legacy;
    const fallback = await list({ kind: 'skill' });
    assert.equal(fallback.origin, 'fs', 'v1 schema must be treated as a mismatch and fall back');
    assert.ok(fallback.items.length >= 1, 'fallback must still list real skills');

    // --- 4) Unknown key/path resolve to null without throwing (fallback mode).
    process.env.AGENTS_KB_PATH = missing;
    assert.equal(await getByPath('.agents/rules/definitely-missing-rule.md'), null);
    assert.equal(await getByKey('rule', 'definitely-missing-key'), null);
  } finally {
    if (previousEnv === undefined) delete process.env.AGENTS_KB_PATH;
    else process.env.AGENTS_KB_PATH = previousEnv;
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
