#!/usr/bin/env node
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { runSync } from '../kb-sync.ts';
import { runExport } from '../kb-export.ts';

const silent = {
  logFile: null,
  section() {},
  log() {},
  warn() {},
  error() {},
  startTimer() { return () => 0; },
  close() {}
} as any;

export default async function run(): Promise<void> {
  const prevDb = process.env.AGENTS_KB_PATH;
  const prevExport = process.env.AGENTS_KB_EXPORT_PATH;
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kb-sync-'));
  const dbFile = path.join(tmp, 'knowledge.db');
  const exportFile = path.join(tmp, 'kb-export.md');
  process.env.AGENTS_KB_PATH = dbFile;
  process.env.AGENTS_KB_EXPORT_PATH = exportFile;

  try {
    // First sync populates from the canonical filesystem.
    const first = await runSync(silent);
    assert.ok(first.total > 0, 'sync must discover filesystem artifacts');
    assert.equal(first.inserted, first.total, 'first sync inserts every discovered artifact');
    assert.equal(first.updated, 0);
    assert.equal(first.removed, 0);

    // Second sync is fully idempotent.
    const second = await runSync(silent);
    assert.equal(second.inserted, 0, 'second sync inserts nothing');
    assert.equal(second.updated, 0, 'second sync updates nothing');
    assert.equal(second.removed, 0, 'second sync removes nothing');
    assert.equal(second.unchanged, second.total, 'second sync leaves all rows unchanged');

    // Export produces a non-empty deterministic report.
    const e1 = await runExport(silent);
    assert.equal(e1.outPath, exportFile);
    const b1 = await fs.readFile(exportFile);
    assert.ok(b1.length > 0, 'export must write content');
    assert.ok(b1.includes('Registry'), 'export must include registry section');

    const e2 = await runExport(silent);
    const b2 = await fs.readFile(exportFile);
    assert.ok(b1.equals(b2), 'export must be byte-identical on rerun');
    assert.equal(e1.count, e2.count);
  } finally {
    if (prevDb === undefined) delete process.env.AGENTS_KB_PATH;
    else process.env.AGENTS_KB_PATH = prevDb;
    if (prevExport === undefined) delete process.env.AGENTS_KB_EXPORT_PATH;
    else process.env.AGENTS_KB_EXPORT_PATH = prevExport;
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
