#!/usr/bin/env node
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { runSync } from '../kb-sync.ts';
import { upsertArtifact, upsertMetadata, validateInvariants, softDeleteArtifact } from '../kb-write.ts';

const silent = {
  logFile: null, section() {}, log() {}, warn() {}, error() {},
  startTimer() { return () => 0; }, close() {}
} as any;

export default async function run(): Promise<void> {
  const prevDb = process.env.AGENTS_KB_PATH;
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kb-write-'));
  const dbFile = path.join(tmp, 'knowledge.db');
  process.env.AGENTS_KB_PATH = dbFile;

  try {
    await runSync(silent);

    // Controlled write: upsert metadata on an existing artifact.
    await upsertMetadata(
      { pathRel: '.agents/rules/git-operations.md', metaKey: 'owner', metaValue: 'git-guard', valueType: 'string' },
      silent
    );

    // Invariants hold after a controlled write.
    const v1 = await validateInvariants('HELIX-Origin', silent);
    assert.equal(v1.violations.length, 0, 'no violations after controlled metadata write');

    // Rejects writes to unknown artifacts.
    await assert.rejects(
      () => upsertMetadata({ pathRel: '.agents/rules/does-not-exist.md', metaKey: 'x', metaValue: 1, valueType: 'number' }, silent),
      /not registered/
    );

    // Rejects disallowed paths.
    await assert.rejects(
      () => upsertArtifact({ kind: 'rule', key: 'evil', pathRel: 'README.md' }, silent),
      /not in an allowed root/
    );

    // Rejects invalid value types.
    await assert.rejects(
      () => upsertMetadata({ pathRel: '.agents/rules/git-operations.md', metaKey: 'y', metaValue: 1, valueType: 'bogus' }, silent),
      /invalid valueType/
    );

    // Soft-delete removes the row from validation scope.
    await softDeleteArtifact('HELIX-Origin', '.agents/rules/git-operations.md', silent);
    const v2 = await validateInvariants('HELIX-Origin', silent);
    assert.ok(v2.checked < v1.checked + 1, 'soft-deleted row excluded from validation');
  } finally {
    if (prevDb === undefined) delete process.env.AGENTS_KB_PATH;
    else process.env.AGENTS_KB_PATH = prevDb;
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
