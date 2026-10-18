import * as fsSync from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

import { BODIES_DIR, ROOT, defaultConfig } from './kb-config.ts';
import { createConsoleLogger, createLogger, type KbLogger } from './kb-log.ts';

const SCAFFOLD_ROOT = path.join(BODIES_DIR, 'scaffold');

export interface ScaffoldOptions {
  type: string;
  projectPath: string;
  dryRun?: boolean;
  force?: boolean;
  license?: string;
  projectName?: string;
  serviceName?: string;
  tracking?: string[] | boolean | string;
  health?: string[] | boolean | string;
}

export interface ScaffoldResult {
  type: string;
  projectPath: string;
  license: string;
  projectName: string;
  dryRun: boolean;
  created: string[];
  skipped: string[];
  wouldCreate: string[];
  types: string[];
  trackingFiles: string[];
  healthFiles: string[];
}

export const TRACKING_FILE_MAP: Record<string, { file: string; template: string }> = {
  plan: { file: 'PLAN.md', template: 'plan-template.md' },
  handoff: { file: 'HANDOFF.md', template: 'handoff-template.md' },
  bugs: { file: 'BUGS.md', template: 'bugs-template.md' },
  todo: { file: 'TODO.md', template: 'todo-template.md' },
  roadmap: { file: 'ROADMAP.md', template: 'roadmap-template.md' },
};

export const HEALTH_FILE_MAP: Record<string, { file: string; template: string }> = {
  contributing: { file: 'CONTRIBUTING.md', template: 'contributing-template.md' },
  'code-of-conduct': { file: 'CODE_OF_CONDUCT.md', template: 'code-of-conduct-template.md' },
  security: { file: 'SECURITY.md', template: 'security-template.md' },
  support: { file: 'SUPPORT.md', template: 'support-template.md' },
  privacy: { file: 'PRIVACY.md', template: 'privacy-template.md' },
  changelog: { file: 'CHANGELOG.md', template: 'changelog-template.md' },
  governance: { file: 'GOVERNANCE.md', template: 'governance-template.md' },
  citation: { file: 'CITATION.cff', template: 'citation-template.cff' },
  tos: { file: 'TOS.md', template: 'tos-template.md' },
  'pr-template': { file: '.github/pull_request_template.md', template: 'pull-request-template.md' },
  'issue-config': { file: '.github/ISSUE_TEMPLATE/config.yml', template: 'issue-template-config.yml' },
  'issue-bug': { file: '.github/ISSUE_TEMPLATE/bug_report.yml', template: 'issue-template-bug.yml' },
  'issue-feature': { file: '.github/ISSUE_TEMPLATE/feature_request.yml', template: 'issue-template-feature.yml' },
};

export function resolveTrackingSelection(tracking?: string[] | boolean | string): string[] {
  if (!tracking) return [];
  if (tracking === true || tracking === 'all') {
    return Object.keys(TRACKING_FILE_MAP);
  }
  const list = Array.isArray(tracking) ? tracking : tracking.split(',').map(s => s.trim().toLowerCase());
  const selected: string[] = [];
  for (const raw of list) {
    const item = raw.toLowerCase().trim();
    const norm = item.replace(/\.md$/i, '').replace(/_/g, '-');
    for (const [key, meta] of Object.entries(TRACKING_FILE_MAP)) {
      if (
        key === norm ||
        meta.file.toLowerCase() === item ||
        meta.file.toLowerCase().replace(/\.md$/, '') === norm
      ) {
        if (!selected.includes(key)) selected.push(key);
      }
    }
  }
  return selected;
}

export function resolveHealthSelection(health?: string[] | boolean | string): string[] {
  if (!health) return [];
  if (health === true || health === 'all') {
    return Object.keys(HEALTH_FILE_MAP);
  }
  const list = Array.isArray(health) ? health : health.split(',').map(s => s.trim().toLowerCase());
  const selected: string[] = [];
  for (const raw of list) {
    const item = raw.toLowerCase().trim();
    const norm = item.replace(/\.(md|cff|yml|yaml)$/i, '').replace(/_/g, '-');
    for (const [key, meta] of Object.entries(HEALTH_FILE_MAP)) {
      if (
        key === norm ||
        meta.file.toLowerCase() === item ||
        path.basename(meta.file).toLowerCase() === item ||
        path.basename(meta.file).toLowerCase().replace(/\.(md|cff|yml|yaml)$/i, '').replace(/_/g, '-') === norm
      ) {
        if (!selected.includes(key)) selected.push(key);
      }
    }
  }
  return selected;
}

async function walkFiles(dir: string, base: string = dir): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkFiles(full, base)));
    } else if (entry.isFile()) {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

export async function listTypes(): Promise<string[]> {
  let entries;
  try {
    entries = await fs.readdir(SCAFFOLD_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.filter(e => e.isDirectory()).map(e => e.name).sort();
}

function renderTemplate(content: string, vars: Record<string, string>): string {
  let result = content;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, val);
    result = result.replaceAll(`{{${key}}}`, val);
  }
  return result;
}

export async function runScaffold(options: ScaffoldOptions, logger?: KbLogger): Promise<ScaffoldResult> {
  const log = logger ?? createConsoleLogger();
  const dryRun = Boolean(options.dryRun);
  const force = Boolean(options.force);
  const type = options.type;
  const projectPath = path.resolve(options.projectPath);
  const license = options.license?.trim() || 'MIT';
  const projectName = options.projectName?.trim() || path.basename(projectPath);

  const selectedTrackingKeys = resolveTrackingSelection(options.tracking);
  const selectedHealthKeys = resolveHealthSelection(options.health);

  log.section('scaffold');

  const types = await listTypes();
  if (!types.includes(type)) {
    throw new Error(`unknown scaffold type "${type}". Available: ${types.join(', ') || '(none)'}`);
  }

  const templateDir = path.join(SCAFFOLD_ROOT, type);
  const files = (await walkFiles(templateDir)).sort();
  log.log(`type=${type} license=${license} project=${projectName} templates=${files.length} tracking=${selectedTrackingKeys.join(',') || 'none'} health=${selectedHealthKeys.join(',') || 'none'} target=${projectPath} dryRun=${dryRun} force=${force}`);

  const created: string[] = [];
  const skipped: string[] = [];
  const wouldCreate: string[] = [];

  const templateVars: Record<string, string> = {
    PROJECT_NAME: projectName,
    PROJECT_OR_ORG_NAME: projectName,
    REPO_NAME: projectName,
    PROJECT_PATH: path.basename(projectPath),
    LICENSE: license,
    SPDX_LICENSE: license,
    VERSION: '0.1.0',
    DATE: new Date().toISOString().slice(0, 10),
    YEAR: new Date().getFullYear().toString(),
    VERSION_LINE_ACTIVE: 'v0.1.0',
    VERSION_LINE_PREVIOUS: 'v0.0.9',
    ABSTRACT: `${projectName} application.`,
    KEYWORD_1: projectName.toLowerCase(),
    KEYWORD_2: type,
    STORAGE_TABLE: '| Data | Storage Location | Purpose |\n| --- | --- | --- |\n| App settings | Local application data directory | Storing user preferences and configuration |',
    TRANSMITTED: 'The application operates locally on your machine.',
    OUTBOUND_HOSTS: 'None by default.',
    REMOVAL: 'Uninstall the application and remove the local application data directory.',
    WORKSTREAM_ID: 'W.01',
    WORKSTREAM_TITLE: 'Initial Project Scaffolding & Setup',
    TARGET_COMPONENT_OR_MODULE: 'Core Architecture',
    DOMAIN_CATEGORY_1: 'Setup',
    NORMALIZED_DIRECTIVE_1A: 'Establish project-local agents ecosystem and tracking files.',
    NORMALIZED_DIRECTIVE_1B: 'Initialize project structure and configuration.',
    CHECKLIST_GROUP_1: 'Scaffolding',
    TASK_ITEM_1: 'Verify local agent conventions and quality gate commands',
    TASK_ITEM_2: 'Configure build toolchain and dependencies',
    VERIFICATION_STEP_1: 'Run project quality gate with zero warnings',
    ACTIVE_MILESTONE_ID: 'M1',
    ACTIVE_MILESTONE_NAME: 'Foundation & Scaffolding',
    STAGE_1_LABEL: 'Scaffolding',
    STAGE_2_LABEL: 'Implementation',
    STAGE_3_LABEL: 'Quality Gate',
    DELIVERABLE_1_TITLE: 'Project Scaffolding',
    DELIVERABLE_1_DESC: 'Establish initial project files and local agents.',
    SPRINT_ID: '1',
    SPRINT_TITLE: 'Foundation & Initial Architecture',
    TARGET_OBJECTIVE: 'Scaffold project structure, local agents, and tracking ledgers.',
    TASK_1_NAME: 'Initial Setup',
    SUBTASK_1_A: 'Setup project configuration',
    SUBTASK_1_B: 'Verify test and build gate',
    PROJECT_SLUG: projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    SERVICE_NAME: options.serviceName?.trim() || `${projectName} Service`,
    PREREQUISITES:
      type === 'tauri-desktop'
        ? 'Node.js (>=20.x), Rust toolchain (stable), and platform-specific Tauri dependencies.'
        : type === 'node-ts-cli'
        ? 'Node.js (>=22.x) and npm.'
        : type === 'rust-library'
        ? 'Rust toolchain (stable).'
        : type === 'jekyll-theme' || type === 'docs-site'
        ? 'Ruby (>=3.1) and Bundler.'
        : 'Development runtime and build toolchain.',
    DEV_COMMAND:
      type === 'tauri-desktop'
        ? 'npm run tauri dev'
        : type === 'node-ts-cli'
        ? 'npm run build'
        : type === 'rust-library'
        ? 'cargo build'
        : type === 'jekyll-theme' || type === 'docs-site'
        ? 'bundle exec jekyll serve'
        : 'npm test',
    DEV_NOTES:
      type === 'tauri-desktop'
        ? 'Follow the official Tauri v2 setup guide for your OS.'
        : type === 'node-ts-cli'
        ? 'Build artifacts are placed in dist/.'
        : type === 'rust-library'
        ? 'Ensure cargo is in your PATH.'
        : type === 'jekyll-theme' || type === 'docs-site'
        ? 'Runs on http://localhost:4000.'
        : 'See project documentation.',
    QUALITY_GATE:
      type === 'tauri-desktop'
        ? 'cargo check\ncargo test\nnpm run typecheck'
        : type === 'node-ts-cli'
        ? 'npm test\nnpm run typecheck'
        : type === 'rust-library'
        ? 'cargo check\ncargo test'
        : type === 'jekyll-theme' || type === 'docs-site'
        ? 'bundle exec jekyll build'
        : 'npm test',
  };

  async function processFile(srcPath: string, relTarget: string) {
    const target = path.join(projectPath, relTarget);
    let exists = false;
    try {
      await fs.access(target);
      exists = true;
    } catch {
      exists = false;
    }

    if (exists && !force) {
      skipped.push(relTarget);
      log.log(`skip (exists): ${relTarget}`);
      return;
    }

    if (dryRun) {
      wouldCreate.push(relTarget);
      log.log(`would create: ${relTarget}`);
      return;
    }

    await fs.mkdir(path.dirname(target), { recursive: true });
    try {
      const raw = await fs.readFile(srcPath, 'utf8');
      const rendered = renderTemplate(raw, templateVars);
      await fs.writeFile(target, rendered, 'utf8');
    } catch {
      await fs.copyFile(srcPath, target);
    }
    created.push(relTarget);
    log.log(`created: ${relTarget}`);
  }

  // 1. Scaffold ecosystem files (AGENTS.md, .agents/, .github/copilot-instructions.md)
  for (const rel of files) {
    await processFile(path.join(templateDir, rel), rel);
  }

  // 2. Scaffold tracking files if chosen
  const templatesDir = path.join(ROOT, '.agents', 'templates');
  for (const key of selectedTrackingKeys) {
    const meta = TRACKING_FILE_MAP[key];
    if (meta) {
      const src = path.join(templatesDir, meta.template);
      await processFile(src, meta.file);
    }
  }

  // 3. Scaffold repository health files if chosen
  for (const key of selectedHealthKeys) {
    const meta = HEALTH_FILE_MAP[key];
    if (meta) {
      const src = path.join(templatesDir, meta.template);
      await processFile(src, meta.file);
    }
  }

  const result: ScaffoldResult = {
    type,
    projectPath,
    license,
    projectName,
    dryRun,
    created,
    skipped,
    wouldCreate,
    types,
    trackingFiles: selectedTrackingKeys.map(k => TRACKING_FILE_MAP[k]?.file).filter(Boolean),
    healthFiles: selectedHealthKeys.map(k => HEALTH_FILE_MAP[k]?.file).filter(Boolean),
  };
  log.log(
    `scaffold complete: created=${created.length} skipped=${skipped.length} wouldCreate=${wouldCreate.length}`
  );
  return result;
}

// ---- CLI & Environment Configuration ----
export function parseEnvContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const clean = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const eqIdx = clean.indexOf('=');
    if (eqIdx === -1) continue;
    const key = clean.slice(0, eqIdx).trim();
    let val = clean.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

export function splitArgs(cmd: string): string[] {
  const matches = cmd.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
  if (!matches) return [];
  return matches.map(m => {
    if ((m.startsWith('"') && m.endsWith('"')) || (m.startsWith("'") && m.endsWith("'"))) {
      return m.slice(1, -1);
    }
    return m;
  });
}

export function parseArgs(argv: string[]): ScaffoldOptions {
  let useEnv = true;
  let customEnvPath: string | undefined;

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--no-env') {
      useEnv = false;
    } else if (argv[i] === '--env' || argv[i] === '-e') {
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        customEnvPath = next;
      } else {
        customEnvPath = path.resolve(process.cwd(), '.env');
      }
    }
  }

  let envVars: Record<string, string> = {};
  if (useEnv) {
    const envCandidate = customEnvPath ?? path.resolve(process.cwd(), '.env');
    if (fsSync.existsSync(envCandidate)) {
      try {
        const raw = fsSync.readFileSync(envCandidate, 'utf8');
        envVars = parseEnvContent(raw);
      } catch {
        // Ignore read errors
      }
    }
  }

  let baseArgs: string[] = [];
  if (envVars.SCAFFOLD_ARGS) {
    baseArgs = splitArgs(envVars.SCAFFOLD_ARGS);
  }

  const opts: Partial<ScaffoldOptions> = {
    dryRun: false,
    force: false,
    license: 'MIT',
  };

  if (envVars.SCAFFOLD_TYPE || envVars.TYPE) {
    opts.type = envVars.SCAFFOLD_TYPE || envVars.TYPE;
  }
  if (envVars.SCAFFOLD_PATH || envVars.PROJECT_PATH) {
    opts.projectPath = envVars.SCAFFOLD_PATH || envVars.PROJECT_PATH;
  }
  if (envVars.SCAFFOLD_LICENSE || envVars.LICENSE) {
    opts.license = envVars.SCAFFOLD_LICENSE || envVars.LICENSE;
  }
  if (envVars.SCAFFOLD_PROJECT_NAME || envVars.PROJECT_NAME) {
    opts.projectName = envVars.SCAFFOLD_PROJECT_NAME || envVars.PROJECT_NAME;
  }
  if (envVars.SCAFFOLD_SERVICE_NAME || envVars.SERVICE_NAME) {
    opts.serviceName = envVars.SCAFFOLD_SERVICE_NAME || envVars.SERVICE_NAME;
  }
  if (envVars.SCAFFOLD_TRACKING || envVars.TRACKING) {
    opts.tracking = envVars.SCAFFOLD_TRACKING || envVars.TRACKING;
  }
  if (envVars.SCAFFOLD_HEALTH || envVars.HEALTH) {
    opts.health = envVars.SCAFFOLD_HEALTH || envVars.HEALTH;
  }
  if (envVars.SCAFFOLD_DRY_RUN === 'true' || envVars.DRY_RUN === 'true') {
    opts.dryRun = true;
  }
  if (envVars.SCAFFOLD_FORCE === 'true' || envVars.FORCE === 'true') {
    opts.force = true;
  }

  function applyTokens(tokens: string[]) {
    for (let i = 0; i < tokens.length; i += 1) {
      const a = tokens[i];
      if (a === '--type') {
        opts.type = tokens[++i];
      } else if (a === '--path') {
        opts.projectPath = tokens[++i];
      } else if (a === '--license' || a === '-l') {
        opts.license = tokens[++i];
      } else if (a === '--project-name' || a === '-n') {
        opts.projectName = tokens[++i];
      } else if (a === '--service-name') {
        opts.serviceName = tokens[++i];
      } else if (a === '--tracking' || a === '-t') {
        const next = tokens[i + 1];
        if (next && !next.startsWith('-')) {
          opts.tracking = tokens[++i];
        } else {
          opts.tracking = true;
        }
      } else if (a === '--with-tracking') {
        opts.tracking = true;
      } else if (a === '--with-plan') {
        const cur = resolveTrackingSelection(opts.tracking);
        if (!cur.includes('plan')) cur.push('plan');
        opts.tracking = cur;
      } else if (a === '--with-handoff') {
        const cur = resolveTrackingSelection(opts.tracking);
        if (!cur.includes('handoff')) cur.push('handoff');
        opts.tracking = cur;
      } else if (a === '--with-bugs') {
        const cur = resolveTrackingSelection(opts.tracking);
        if (!cur.includes('bugs')) cur.push('bugs');
        opts.tracking = cur;
      } else if (a === '--with-todo') {
        const cur = resolveTrackingSelection(opts.tracking);
        if (!cur.includes('todo')) cur.push('todo');
        opts.tracking = cur;
      } else if (a === '--with-roadmap') {
        const cur = resolveTrackingSelection(opts.tracking);
        if (!cur.includes('roadmap')) cur.push('roadmap');
        opts.tracking = cur;
      } else if (a === '--health') {
        const next = tokens[i + 1];
        if (next && !next.startsWith('-')) {
          opts.health = tokens[++i];
        } else {
          opts.health = true;
        }
      } else if (a === '--with-health') {
        opts.health = true;
      } else if (a === '--dry-run') {
        opts.dryRun = true;
      } else if (a === '--force') {
        opts.force = true;
      } else if (a === '--list') {
        opts.type = '__list__';
        opts.projectPath = process.cwd();
      } else if (a === '--env' || a === '-e') {
        const next = tokens[i + 1];
        if (next && !next.startsWith('-')) i += 1;
      } else if (a === '--no-env') {
        // already checked
      }
    }
  }

  if (baseArgs.length > 0) {
    applyTokens(baseArgs);
  }
  applyTokens(argv);

  if (!opts.projectPath) opts.projectPath = process.cwd();
  return opts as ScaffoldOptions;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const logger = createLogger('scaffold');
  const argv = process.argv.slice(2);
  if (argv.includes('--list')) {
    listTypes().then(types => {
      logger.log(`available scaffold types: ${types.join(', ') || '(none)'}`);
      logger.close();
    }).catch(err => {
      logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
      logger.close();
      process.exit(1);
    });
  } else {
    const opts = parseArgs(argv);
    if (!opts.type || !opts.projectPath) {
      logger.error('usage: kb-scaffold.ts --type <engine> --path <project> [--license <type>] [--tracking [files]] [--health [files]] [--env [path]] [--dry-run] [--force] (or --list)');
      logger.close();
      process.exit(2);
    }
    runScaffold(opts, logger)
      .then(result => {
        logger.log(`scaffold done: type=${result.type} license=${result.license} created=${result.created.length} skipped=${result.skipped.length} wouldCreate=${result.wouldCreate.length}`);
        logger.close();
      })
      .catch(err => {
        logger.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
        logger.close();
        process.exit(1);
      });
  }
}
