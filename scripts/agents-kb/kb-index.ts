#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

import { ROOT } from './kb-config.ts';
import { createLogger, type KbLogger } from './kb-log.ts';

/**
 * Project Tracking Index generator.
 *
 * The workspace-root ledgers (ROADMAP / PLAN / TODO / BUGS / HANDOFF) are an *entry point* to
 * per-project tracking: each lists every project as a short title plus a link into that project's
 * own ledger. They never carry per-project tracking detail. This module regenerates that index
 * block (between marker comments) from the project registry and each project's own files.
 *
 * Read-only on `projects/`; writes only the root ledgers. Idempotent (`--check` = verify only).
 */

export const START = '<!-- project-index:start -->';
export const END = '<!-- project-index:end -->';
export const HEADING = '## 🧭 Project Tracking Index';

export type LedgerKey = 'ROADMAP' | 'PLAN' | 'TODO' | 'BUGS' | 'HANDOFF';
export const LEDGERS: LedgerKey[] = ['ROADMAP', 'PLAN', 'TODO', 'BUGS', 'HANDOFF'];

export interface RegistryProject {
  id: string;
  path: string;
  kind?: string;
  description: string;
}

export interface IndexOptions {
  root?: string;
  check?: boolean;
}

export interface IndexResult {
  changed: string[];
  unchanged: string[];
  projects: number;
}

const MAX_FOCUS = 120;

/** Strip emoji/markers and `[tag] (path)` prefixes from a heading into a short plain title. */
export function cleanTitle(raw: string): string {
  let t = raw.replace(/^#+\s*/, '');
  t = t.replace(/^[^\p{L}\p{N}[]*/u, '');
  t = t.replace(/\[[^\]]+\](\s*\([^)]*\))?/g, '');
  t = t.replace(/\*\*/g, '').replace(/`/g, '');
  t = t.replace(/:\s*[—–-]\s*/, ' — ').replace(/\s+[—–-]\s+[—–-]\s+/g, ' — ');
  t = t.replace(/\s{2,}/g, ' ').trim().replace(/^[—–-]\s*/, '').trim();
  return t.length > MAX_FOCUS ? `${t.slice(0, MAX_FOCUS - 1).trimEnd()}…` : t;
}

function sectionLines(lines: string[], headingTest: RegExp): string[] {
  const start = lines.findIndex(l => /^##\s/.test(l) && headingTest.test(l));
  if (start < 0) return [];
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out;
}

function firstH3(section: string[]): string | null {
  const h = section.find(l => /^###\s/.test(l));
  return h ? cleanTitle(h) : null;
}

function activeTableRow(lines: string[]): string | null {
  for (const l of lines) {
    if (!l.startsWith('|') || /^\|\s*[-:]+/.test(l)) continue;
    if (!/Active/i.test(l) || /Status/i.test(l)) continue;
    const cells = l.split('|').map(c => c.trim()).filter(Boolean);
    const name = cells.find((c, i) => i > 0 && !/Active|✅|⏳|🔮/.test(c) && c.length > 3);
    if (name) return cleanTitle(name);
  }
  return null;
}

/** Extract a project's current focus for one ledger. Returns null when nothing is recorded. */
export function extractFocus(ledger: LedgerKey, content: string): string | null {
  const lines = content.split(/\r?\n/);
  switch (ledger) {
    case 'ROADMAP':
      return firstH3(sectionLines(lines, /Active Milestones?/i)) ?? activeTableRow(lines);
    case 'PLAN':
      return firstH3(sectionLines(lines, /Active Sprints?/i));
    case 'TODO':
      return firstH3(sectionLines(lines, /Active Workstreams?/i));
    case 'BUGS': {
      const open = sectionLines(lines, /Active.*Open|Open.*Bugs/i).filter(l => /^###\s/.test(l));
      if (open.length === 0) return 'No open bugs';
      return `${open.length} open — ${cleanTitle(open[0])}`;
    }
    case 'HANDOFF': {
      const m = content.match(/\*\*Current session status:\*\*\s*(.+)/);
      if (!m) return null;
      const t = m[1].replace(/\*\*/g, '').trim();
      return t.length > 140 ? `${t.slice(0, 139).trimEnd()}…` : t;
    }
  }
}

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
}

export async function loadRegistry(root: string): Promise<RegistryProject[]> {
  const raw = await fs.readFile(path.join(root, '.agents', 'registry', 'projects.json'), 'utf8');
  const parsed = JSON.parse(raw) as { projects: RegistryProject[] };
  return parsed.projects;
}

export async function renderIndex(root: string, ledger: LedgerKey, projects: RegistryProject[]): Promise<string> {
  const lines: string[] = [HEADING, ''];
  lines.push(
    `> Entry point to per-project **${ledger}** tracking: one line per project (short title + link). ` +
      'Detail lives only in each repository. Regenerate with `npm --prefix scripts run index`; do not edit between the markers.',
    '',
    START
  );
  for (const p of projects) {
    const rel = `./${p.path}/${ledger}.md`;
    const content = await readIfExists(path.join(root, p.path, `${ledger}.md`));
    const tag = `**[${p.id}]**`;
    if (content === null) {
      lines.push(`- ${tag} — [${ledger}.md](${rel}) _(repository not cloned locally)_ · _${p.description}_`);
      continue;
    }
    const focus = extractFocus(ledger, content) ?? 'No active item recorded';
    lines.push(`- ${tag} — [${focus}](${rel}) · _${p.description}_`);
  }
  lines.push(END);
  return lines.join('\n');
}

/** Replace the marked block (or insert a new section after the Tracking Rules section). */
export function applyBlock(file: string, block: string): string {
  const s = file.indexOf(START);
  const e = file.indexOf(END);
  if (s >= 0 && e > s) {
    const headStart = file.lastIndexOf(HEADING, s);
    const from = headStart >= 0 && s - headStart < 600 ? headStart : s;
    return file.slice(0, from) + block + file.slice(e + END.length);
  }
  const lines = file.split('\n');
  const rules = lines.findIndex(l => /^##\s.*Tracking Rules/i.test(l));
  let at = lines.length;
  if (rules >= 0) {
    at = lines.findIndex((l, i) => i > rules && /^##\s/.test(l));
    if (at < 0) at = lines.length;
  }
  lines.splice(at, 0, block, '', '---', '');
  return lines.join('\n');
}

export async function runIndex(logger?: KbLogger, options: IndexOptions = {}): Promise<IndexResult> {
  const log = logger ?? createLogger('index');
  const root = options.root ?? ROOT;
  const projects = await loadRegistry(root);
  const result: IndexResult = { changed: [], unchanged: [], projects: projects.length };

  for (const ledger of LEDGERS) {
    const file = path.join(root, `${ledger}.md`);
    const current = await readIfExists(file);
    if (current === null) {
      log.warn(`skip ${ledger}.md (missing)`);
      continue;
    }
    const next = applyBlock(current, await renderIndex(root, ledger, projects));
    if (next === current) {
      result.unchanged.push(`${ledger}.md`);
      continue;
    }
    result.changed.push(`${ledger}.md`);
    if (!options.check) await fs.writeFile(file, next, 'utf8');
  }
  log.log(
    `index ${options.check ? 'check' : 'write'}: ${result.changed.length} changed, ${result.unchanged.length} unchanged (${projects.length} projects)`
  );
  return result;
}

// Direct-run guard: only auto-run when this file is the CLI entry point.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const logger = createLogger('index');
  const check = process.argv.includes('--check');
  runIndex(logger, { check })
    .then(r => {
      logger.close();
      if (check && r.changed.length > 0) {
        console.error(`stale project index: ${r.changed.join(', ')} (run: npm --prefix scripts run index)`);
        process.exit(1);
      }
    })
    .catch(err => {
      logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
      logger.close();
      process.exit(1);
    });
}
