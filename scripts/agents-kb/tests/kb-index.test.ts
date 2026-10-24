#!/usr/bin/env node
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { applyBlock, cleanTitle, extractFocus, renderIndex, runIndex, END, START } from '../kb-index.ts';

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
  // Title cleaning strips emoji, [tag] (path) prefixes and normalizes separators.
  assert.equal(
    cleanTitle('### 🚀 Sprint 32: [windows-game-explorer] — Native C++ Core (v2.0.0)'),
    'Sprint 32 — Native C++ Core (v2.0.0)'
  );
  assert.equal(
    cleanTitle('### 🎯 [windhawk-themes] (projects/windhawk-themes) — Milestone M.02b: Polish'),
    'Milestone M.02b: Polish'
  );

  // Focus extraction per ledger.
  const plan = '## 🎯 Active Sprints\n\n### 🚀 Sprint 5: [x] — Packaging (v0.8.0)\n\n## ✅ Completed Sprints\n### Old\n';
  assert.equal(extractFocus('PLAN', plan), 'Sprint 5 — Packaging (v0.8.0)');
  assert.equal(extractFocus('PLAN', '# empty'), null);
  const bugs = '## ⚠️ Active & Open Bugs\n\n### BUG-1 — Crash\n\n### BUG-2 — Hang\n\n## ✅ Resolved\n### Old\n';
  assert.equal(extractFocus('BUGS', bugs), '2 open — BUG-1 — Crash');
  assert.equal(extractFocus('BUGS', '## ⚠️ Active & Open Bugs\n\n## ✅ Resolved\n'), 'No open bugs');
  assert.equal(extractFocus('HANDOFF', '**Current session status:** Stable · v1.4.1\n'), 'Stable · v1.4.1');
  const roadmap = '| # | Name | Status |\n|---|---|---|\n| **M5** | Packaging & Release | 🚀 Active |\n';
  assert.equal(extractFocus('ROADMAP', roadmap), 'Packaging & Release');

  // Block application: insert after Tracking Rules, then replace in place (idempotent).
  const ledger = '# T\n\n## 📜 Tracking Rules\n\n- a\n\n---\n\n## 🔥 Active\n\nbody\n';
  const block = `## 🧭 Project Tracking Index\n\n${START}\n- one\n${END}`;
  const once = applyBlock(ledger, block);
  assert.ok(once.indexOf(START) > once.indexOf('Tracking Rules'));
  assert.ok(once.indexOf(START) < once.indexOf('## 🔥 Active'));
  assert.equal(applyBlock(once, block), once);
  const replaced = applyBlock(once, `## 🧭 Project Tracking Index\n\n${START}\n- two\n${END}`);
  assert.ok(replaced.includes('- two') && !replaced.includes('- one'));
  assert.equal(replaced.split('Project Tracking Index').length - 1, 1, 'heading must not duplicate');

  // End to end against a throwaway root.
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kb-index-'));
  try {
    await fs.mkdir(path.join(tmp, '.agents', 'registry'), { recursive: true });
    await fs.writeFile(
      path.join(tmp, '.agents', 'registry', 'projects.json'),
      JSON.stringify({
        projects: [
          { id: 'alpha', path: 'projects/alpha', description: 'Alpha app' },
          { id: 'beta', path: 'projects/beta', description: 'Beta site' }
        ]
      })
    );
    await fs.mkdir(path.join(tmp, 'projects', 'alpha'), { recursive: true });
    await fs.writeFile(path.join(tmp, 'projects', 'alpha', 'PLAN.md'), plan);
    for (const name of ['ROADMAP', 'PLAN', 'TODO', 'BUGS', 'HANDOFF']) {
      await fs.writeFile(path.join(tmp, `${name}.md`), ledger);
    }
    const rendered = await renderIndex(tmp, 'PLAN', [
      { id: 'alpha', path: 'projects/alpha', description: 'Alpha app' },
      { id: 'beta', path: 'projects/beta', description: 'Beta site' }
    ]);
    assert.ok(rendered.includes('[Sprint 5 — Packaging (v0.8.0)](./projects/alpha/PLAN.md)'));
    assert.ok(rendered.includes('not cloned locally'));

    const check1 = await runIndex(silent, { root: tmp, check: true });
    assert.equal(check1.changed.length, 5, 'check reports stale ledgers without writing');
    assert.ok(!(await fs.readFile(path.join(tmp, 'PLAN.md'), 'utf8')).includes(START));

    await runIndex(silent, { root: tmp });
    const second = await runIndex(silent, { root: tmp, check: true });
    assert.equal(second.changed.length, 0, 'second run is a no-op');
    assert.equal(second.unchanged.length, 5);
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
