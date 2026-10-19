#!/usr/bin/env node
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import { listTypes, parseArgs, runScaffold } from '../kb-scaffold.ts';

const silent = {
  logFile: null, section() {}, log() {}, warn() {}, error() {},
  startTimer() { return () => 0; }, close() {}
} as any;

/**
 * Both organization base URLs are leak surfaces: the custom domain and the
 * GitHub Pages fallback paths (`helix-origin.github.io/<repo>`). Generated scaffold files must never
 * contain either, so fork/generated output stays portable even if the custom
 * domain is retired.
 */
const FORBIDDEN_DOMAINS = ['helix-origin.club', 'helix-origin.github.io'];

async function collectFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectFiles(full)));
    else out.push(full);
  }
  return out;
}

async function assertNoDomainLeak(root: string): Promise<void> {
  for (const file of await collectFiles(root)) {
    const content = (await fs.readFile(file, 'utf8')).toLowerCase();
    for (const domain of FORBIDDEN_DOMAINS) {
      assert.ok(!content.includes(domain), `${path.relative(root, file)} must not leak ${domain}`);
    }
  }
}

export default async function run(): Promise<void> {
  const types = await listTypes();
  for (const t of ['tauri-desktop', 'jekyll-theme', 'node-ts-cli', 'rust-library', 'docs-site']) {
    assert.ok(types.includes(t), `missing scaffold type: ${t}`);
  }

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'scaffold-'));
  try {
    const project = path.join(tmp, 'proj');

    // Dry run reports wouldCreate and creates nothing.
    const dry = await runScaffold({ type: 'node-ts-cli', projectPath: project, dryRun: true }, silent);
    assert.ok(dry.wouldCreate.length > 0, 'dry run must report wouldCreate');
    assert.equal(dry.created.length, 0);
    let exists = true;
    try { await fs.access(path.join(project, 'AGENTS.md')); } catch { exists = false; }
    assert.equal(exists, false, 'dry run must not create files');

    // Default run creates files with default MIT license and project name, with NO tracking or health files by default.
    const first = await runScaffold({ type: 'node-ts-cli', projectPath: project }, silent);
    assert.ok(first.created.length > 0, 'first run must create files');
    assert.equal(first.skipped.length, 0);
    assert.equal(first.license, 'MIT', 'default license must be MIT');
    assert.equal(first.trackingFiles.length, 0, 'no tracking files created by default');
    assert.equal(first.healthFiles.length, 0, 'no health files created by default');
    let planExists = true;
    try { await fs.access(path.join(project, 'PLAN.md')); } catch { planExists = false; }
    assert.equal(planExists, false, 'PLAN.md must not exist by default');
    const agentsMd = await fs.readFile(path.join(project, 'AGENTS.md'), 'utf8');
    assert.ok(agentsMd.includes('Node.js TypeScript CLI'), 'AGENTS.md content from template');
    assert.ok(agentsMd.includes('# proj'), 'project name replaced from folder basename');
    assert.ok(agentsMd.includes('MIT license'), 'default license rendered as MIT in AGENTS.md');

    // Custom license, specific tracking subset (plan, handoff, bugs, todo - but NO roadmap), and health files test.
    const customProject = path.join(tmp, 'custom');
    const custom = await runScaffold({
      type: 'tauri-desktop',
      projectPath: customProject,
      license: 'Apache-2.0',
      projectName: 'my-desktop-app',
      tracking: 'plan,handoff,bugs,todo',
      health: 'privacy,security',
    }, silent);
    assert.equal(custom.license, 'Apache-2.0');
    assert.equal(custom.projectName, 'my-desktop-app');
    assert.deepEqual(custom.trackingFiles.sort(), ['BUGS.md', 'HANDOFF.md', 'PLAN.md', 'TODO.md']);
    assert.deepEqual(custom.healthFiles.sort(), ['PRIVACY.md', 'SECURITY.md']);

    const tauriAgents = await fs.readFile(path.join(customProject, 'AGENTS.md'), 'utf8');
    assert.ok(tauriAgents.includes('# my-desktop-app'), 'custom project name replaced');
    assert.ok(tauriAgents.includes('Apache-2.0 license'), 'custom license rendered in AGENTS.md');
    const copilot = await fs.readFile(path.join(customProject, '.github/copilot-instructions.md'), 'utf8');
    assert.ok(copilot.includes('Apache-2.0'), 'custom license rendered in copilot instructions');
    
    // Check specific tracking files exist and ROADMAP does NOT exist
    for (const trackingFile of ['PLAN.md', 'HANDOFF.md', 'BUGS.md', 'TODO.md']) {
      const content = await fs.readFile(path.join(customProject, trackingFile), 'utf8');
      assert.ok(content.length > 0, `${trackingFile} must be generated`);
      assert.ok(content.includes('my-desktop-app'), `${trackingFile} contains project name`);
    }
    let roadmapExists = true;
    try { await fs.access(path.join(customProject, 'ROADMAP.md')); } catch { roadmapExists = false; }
    assert.equal(roadmapExists, false, 'ROADMAP.md must not exist when omitted from selection');

    // Check health files exist
    const privacy = await fs.readFile(path.join(customProject, 'PRIVACY.md'), 'utf8');
    assert.ok(privacy.includes('my-desktop-app'), 'PRIVACY.md contains project name');
    const security = await fs.readFile(path.join(customProject, 'SECURITY.md'), 'utf8');
    assert.ok(security.includes('my-desktop-app'), 'SECURITY.md contains project name');

    // Optional links: docs/wiki/discussions/discord are opt-in. With no URLs,
    // generated files must not leak any maintainer domain or organization name.
    const bareProject = path.join(tmp, 'bare');
    await runScaffold({
      type: 'node-ts-cli',
      projectPath: bareProject,
      health: 'readme,support,issue-config,citation,changelog',
    }, silent);
    const bareReadme = await fs.readFile(path.join(bareProject, 'README.md'), 'utf8');
    assert.ok(!bareReadme.includes('helix-origin.club'), 'README must not hardcode a maintainer domain');
    assert.ok(
      bareReadme.includes('https://github.com/HELIX-Origin/agents'),
      'README carries the always-on attribution footer'
    );
    assert.ok(!bareReadme.includes('Documentation'), 'README has no docs section without a docs URL');
    assert.ok(bareReadme.includes('**bare application.**'), 'double-brace tokens render without stray braces');
    const bareSupport = await fs.readFile(path.join(bareProject, 'SUPPORT.md'), 'utf8');
    assert.ok(!bareSupport.includes('Discussions'), 'discussions are opt-in');
    assert.ok(!bareSupport.includes('agent ecosystem'), 'attribution is README-only');
    const bareIssue = await fs.readFile(path.join(bareProject, '.github/ISSUE_TEMPLATE/config.yml'), 'utf8');
    assert.ok(bareIssue.includes('contact_links: []'), 'empty contact links render as a valid empty list');
    await assertNoDomainLeak(bareProject);

    // Explicit optional links are applied only when provided.
    const linkedProject = path.join(tmp, 'linked');
    await runScaffold({
      type: 'node-ts-cli',
      projectPath: linkedProject,
      projectName: 'linked-app',
      health: 'readme,support,issue-config,citation',
      docsUrl: 'https://example.com/docs/',
      wikiUrl: 'https://example.com/wiki/',
      repoUrl: 'https://github.com/example/linked-app/',
      repoSlug: 'example/linked-app',
      orgUrl: 'https://github.com/example',
      orgName: 'Example',
      discussions: true,
      discordUrl: 'https://discord.gg/example',
    }, silent);
    const linkedReadme = await fs.readFile(path.join(linkedProject, 'README.md'), 'utf8');
    assert.ok(linkedReadme.includes('https://example.com/docs'), 'docs URL applied');
    assert.ok(linkedReadme.includes('https://discord.gg/example'), 'discord invite applied');
    assert.ok(!linkedReadme.includes('helix-origin.club'), 'no maintainer domain leakage');
    const linkedSupport = await fs.readFile(path.join(linkedProject, 'SUPPORT.md'), 'utf8');
    assert.ok(
      linkedSupport.includes('https://github.com/example/linked-app/discussions'),
      'discussions link applied when opted in'
    );
    const linkedIssue = await fs.readFile(
      path.join(linkedProject, '.github/ISSUE_TEMPLATE/config.yml'),
      'utf8'
    );
    assert.ok(linkedIssue.includes('https://example.com/docs'), 'docs contact link applied');
    assert.ok(linkedIssue.includes('https://example.com/wiki'), 'wiki contact link applied');
    assert.ok(
      linkedIssue.includes('https://github.com/example/linked-app/security'),
      'security contact link applied'
    );
    const linkedCitation = await fs.readFile(path.join(linkedProject, 'CITATION.cff'), 'utf8');
    assert.ok(linkedCitation.includes('name: "Example"'), 'org name applied to citation author');
    assert.ok(linkedCitation.includes('https://example.com/docs'), 'citation url from docs url');
    await assertNoDomainLeak(linkedProject);

    // Test .env parsing and auto-setting CLI options
    const envFilePath = path.join(tmp, '.test-env');
    const envContent = `
# Scaffold test env
SCAFFOLD_TYPE=tauri-desktop
SCAFFOLD_LICENSE=Apache-2.0
SCAFFOLD_TRACKING=plan,handoff,bugs,todo
SCAFFOLD_HEALTH=CODE_OF_CONDUCT.md,PRIVACY.md,SECURITY.md,SUPPORT.md,CHANGELOG.md,GOVERNANCE.md,CONTRIBUTING.md
`;
    await fs.writeFile(envFilePath, envContent, 'utf8');

    const envOpts = parseArgs(['--env', envFilePath, '--path', path.join(tmp, 'from-env')]);
    assert.equal(envOpts.type, 'tauri-desktop');
    assert.equal(envOpts.license, 'Apache-2.0');
    assert.equal(envOpts.tracking, 'plan,handoff,bugs,todo');
    assert.equal(
      envOpts.health,
      'CODE_OF_CONDUCT.md,PRIVACY.md,SECURITY.md,SUPPORT.md,CHANGELOG.md,GOVERNANCE.md,CONTRIBUTING.md'
    );

    // CLI args take precedence over .env
    const overrideOpts = parseArgs([
      '--env', envFilePath,
      '--path', path.join(tmp, 'from-env'),
      '--license', 'BSD-3-Clause',
      '--tracking', 'plan,todo'
    ]);
    assert.equal(overrideOpts.license, 'BSD-3-Clause', 'CLI --license overrides .env');
    assert.equal(overrideOpts.tracking, 'plan,todo', 'CLI --tracking overrides .env');

    // Run scaffold using options loaded from .env
    const envRunProject = path.join(tmp, 'env-project');
    const envRun = await runScaffold({
      type: envOpts.type,
      projectPath: envRunProject,
      license: envOpts.license,
      tracking: envOpts.tracking,
      health: envOpts.health,
    }, silent);

    assert.equal(envRun.license, 'Apache-2.0');
    assert.deepEqual(envRun.trackingFiles.sort(), ['BUGS.md', 'HANDOFF.md', 'PLAN.md', 'TODO.md']);
    assert.deepEqual(
      envRun.healthFiles.sort(),
      [
        'CHANGELOG.md',
        'CODE_OF_CONDUCT.md',
        'CONTRIBUTING.md',
        'GOVERNANCE.md',
        'PRIVACY.md',
        'SECURITY.md',
        'SUPPORT.md',
      ].sort()
    );

    // Second run is idempotent: never clobber.
    const second = await runScaffold({ type: 'node-ts-cli', projectPath: project }, silent);
    assert.equal(second.created.length, 0, 'second run creates nothing');
    assert.ok(second.skipped.length > 0, 'second run skips existing files');
    const agentsMd2 = await fs.readFile(path.join(project, 'AGENTS.md'), 'utf8');
    assert.equal(agentsMd, agentsMd2, 'existing files are never overwritten');

    // Unknown type throws.
    await assert.rejects(
      () => runScaffold({ type: 'nope', projectPath: project }, silent),
      /unknown scaffold type/
    );
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
