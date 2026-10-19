# TODO.md — HELIX Origin Consolidated Task Ledger

> 📋 **Living Source of Truth**: Actionable task ledger across all active repositories in the **HELIX Origin** organization.
> Statuses: ⬜ backlog · 🚧 in progress · ✅ done (tracked as `- [ ]` and `- [x]` checkboxes).
> High-level direction lives in [`ROADMAP.md`](./ROADMAP.md), active sprint planning in [`PLAN.md`](./PLAN.md), issues in [`BUGS.md`](./BUGS.md).
> Completed historical workstreams live in [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
> Last updated: 2026-10-19

---

## 📜 Tracking Rules

- **100% Active Direction Accuracy**: This file and its companion ledgers (`ROADMAP.md`, `PLAN.md`, `BUGS.md`) must always reflect the current, active direction of all projects with zero contradictions. Whenever a requirement changes or supersedes an earlier decision, immediately replace or remove the superseded statements in place.
- **Normalized & Categorized Locked User Directives**: Never paste raw chronological chat logs or contradictory historical quotes. Rewrite user directives into clean, typo-free engineering specifications grouped under explicit bold domain sub-headers so it is immediately clear what goes to what.
- **Zero Non-Organization Mentions**: Only reference active repositories belonging to the `HELIX-Origin` GitHub organization (`helix-jekyll-theme`, `helix-origin.github.io`, `docs`, `wiki`, `nh-reader`, `universal-game-launcher`, `theme-toolkit`, `windhawk-themes`, `helix-gaming-db-00` through `03`, `ffxiv-config`, `depressurizer`). Never directly mention external, third-party, or deleted projects/repositories by name.
- **Atomic Checklist Groups & Archival**: Group checklist items by functional component (`- [ ] **[<project-name>] Component Group**:` followed by atomic `- [ ]` sub-tasks). Never stuff multiple distinct deliverables into a single run-on paragraph. Move completed workstreams to [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md) and leave a concise single-line summary under `## ✅ Completed Workstreams`.
- **Mandatory Project Tagging**: Every workstream, checklist group, task, and backlog item must explicitly include its current project tag (`[<project-name>] (<project-path>)`).
- **Active Items First**: The currently active workstream must always be placed at the top of the content sections.

---

## 🔥 Active Workstreams



### 🎯 [Ecosystem] Workstream W.56: Organization Community Health Files Standard — GitHub Community/Health Documents Across All Repositories
- **Project Identifiers:** `[Ecosystem]` (all `projects/*` repositories; per-repository rollout tracked below)
- **Target Components:**
  - **Binding rule (`.agents/rules/community-health-files.md`)**: Required file set, naming/placement, per-file content requirements, README linkage, and enforcement.
  - **Reusable templates (`.agents/templates/`)**: `contributing-template.md`, `code-of-conduct-template.md`, `security-template.md`, `support-template.md`, `privacy-template.md`, `changelog-template.md`, `governance-template.md`, `tos-template.md`, `citation-template.cff`, `pull-request-template.md`, `issue-template-config.yml`, `issue-template-bug.yml`, `issue-template-feature.yml`.
  - **Per-repository documents**: root `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `CHANGELOG.md`, `GOVERNANCE.md`, `CITATION.cff`, conditional `TOS.md`, plus `.github/pull_request_template.md` and `.github/ISSUE_TEMPLATE/{config.yml,bug_report.yml,feature_request.yml}`.

**Locked user directives (normalized by domain):**
- **1. GitHub Community/Health Files Everywhere**: Every HELIX-Origin repository must ship the standard community-health documents (contributing, code of conduct, security, support, privacy, changelog, governance, citation, and — for apps/services interacting with third-party services — terms of service) so GitHub surfaces them as tabs/links. Documents are self-contained, public-facing, and must never reference the private agents ecosystem.

**Implementation checklist:**
- [x] **[Ecosystem] 1. Community Health Files Standard & Templates**:
  - [x] `[Ecosystem]` Author binding rule `.agents/rules/community-health-files.md` (required set, content requirements, README linkage, invariants) and register it in `AGENTS.md`.
  - [x] `[Ecosystem]` Add reusable community-health templates under `.agents/templates/` and replace the legacy workspace-coupled PR template with a self-contained community-health version.
- [x] **[depressurizer] (projects/depressurizer) 2. Community Health Files Rollout**:
  - [x] `[depressurizer]` Add root files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `TOS.md`, `CHANGELOG.md`, `GOVERNANCE.md`, `CITATION.cff`.
  - [x] `[depressurizer]` Add `.github/pull_request_template.md` and YAML issue forms (`config.yml`, `bug_report.yml`, `feature_request.yml`, `autocat-request.yml`); retire the legacy Markdown issue templates.
  - [x] `[depressurizer]` Link the community documents from `README.md` and correct stale local-VDF wording to the client-free Web API direction.
- [x] **[Ecosystem] 2b. Per-Repo Rollout: Community-Health Files + Project-Local Agents Ecosystem + Tracking Files (user directive 2026-10-18)**:
  - **Locked directive:** every repository gets (1) the full community-health set, (2) its **own self-contained** agents ecosystem (`AGENTS.md`, `.agents/`, `.github/copilot-instructions.md`) generated via the headless CLI scaffold, and (3) its **own** `ROADMAP.md`/`PLAN.md`/`TODO.md`/`BUGS.md` holding that repo's items migrated from the root ledgers. The workspace-root ecosystem stays private, never referenced from repos, and enhances (never replaces) repo-local ones. No git operations; files only.
  - [x] `[Ecosystem]` Scaffold bodies made self-contained (no workspace references). **(Delivered 2026-10-18.)**
  - [x] `[Ecosystem]` Scaffold engine enhanced with configurable license (defaults to `MIT` per GitHub standard; configurable via `--license`), opt-in tracking ledgers (defaults to `AGENTS.md` only; `--tracking <files>`), and opt-in community-health files (`CODE_OF_CONDUCT.md`, `PRIVACY.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`, etc. via `--health <files>`). **(Delivered 2026-10-18.)**
  - [x] `[Ecosystem]` Optional `.env` configuration auto-loading support implemented (`--env [path]`, auto-detects `.env` in cwd; supports `SCAFFOLD_TYPE`, `SCAFFOLD_LICENSE`, `SCAFFOLD_TRACKING`, `SCAFFOLD_HEALTH`, `SCAFFOLD_ARGS`, etc.; CLI flags override `.env`), plus tracked prebuilt `.env.example` with all supported keys. **(Delivered 2026-10-18.)**
  - [x] `[Ecosystem]` Scaffold templates made domain-neutral (leak protection covers **both** organization base URLs, `*.helix-origin.club` and the GitHub Pages fallback paths `helix-origin.github.io/<repo>`): all organization/domain links are opt-in (`--docs-url`, `--wiki-url`, `--portal-url`, `--discord-url`, `--with-discussions`, `--repo-url`, `--repo-slug`, `--org-url`, `--org-name`; matching `SCAFFOLD_*` env keys), absent links are omitted entirely, `renderTemplate` supports `{{#KEY}}`/`{{^KEY}}` conditionals with a brace-order fix, and only `README.md` carries an always-on attribution footer linking `https://github.com/HELIX-Origin/agents`. **(Delivered 2026-10-19; `npm run typecheck` + 5/5 tests green.)**
  - [x] `[Ecosystem]` Flow-oriented templates now use GitHub-flavored mermaid diagrams: `contributing` (PR path), `security` (disclosure path), `governance` (decision path), `bugs` (bug lifecycle), and `handoff` (session cycle); the existing `roadmap`/`plan`/`todo` diagrams are retained. Documented as rule 5 in `.agents/rules/documentation-standards.md` and covered by scaffold tests. **(Delivered 2026-10-19.)**
  - [x] `[universal-game-launcher]` Community-health suite (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `TOS.md`, `CHANGELOG.md`, `GOVERNANCE.md`, `CITATION.cff`, PR template, issue forms) + project-local ecosystem & tracking files (`AGENTS.md`, `.agents/rules/local-conventions.md`, `.github/copilot-instructions.md`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`) migrated and tailored. **(Delivered 2026-10-18.)**
  - [x] `[nh-reader]` Community-health gaps + project-local ecosystem + tracking files: added `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `GOVERNANCE.md`, `.github/pull_request_template.md`, `AGENTS.md`, `.agents/rules/local-conventions.md`, `.github/copilot-instructions.md`, and tailored `ROADMAP.md`/`PLAN.md`/`TODO.md`/`BUGS.md`/`HANDOFF.md`; refreshed stale URLs/versions and removed workspace/external references across existing docs; added README community links + attribution footer. **(Delivered 2026-10-19.)**
  - [x] `[theme-toolkit]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[windhawk-themes]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[ffxiv-config]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[helix-jekyll-theme]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[helix-origin.github.io]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[helix-origin.github.io]` Flattened the Jekyll site root from `docs/` to the repository root (config, `index.md`, `CNAME`, assets); non-site `README.md` now carries `published: false`, `LICENSE` is excluded from the build, and artwork/release rules were updated. **(Delivered 2026-10-19.)**
  - [x] `[docs]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[wiki]` Community-health gaps + project-local ecosystem + tracking files.
  - [x] `[helix-gaming-db-00]` .. `[helix-gaming-db-03]` Community-health gaps + project-local ecosystem + tracking files (per shard).
  - [x] `[helix-gaming-db-ingest]` Community-health gaps + project-local ecosystem + tracking files (already migrated).
  - [x] `[Ecosystem]` Root-ledger reconciliation: after per-repo migration is verified, replace migrated per-repo workstreams in root `ROADMAP.md`/`PLAN.md`/`TODO.md`/`BUGS.md` and archives with one-line pointers.
  - [x] `[Ecosystem]` Verify no repo file references the workspace ecosystem; zero-leak scan.
- [x] **[Ecosystem] 3. Agents Ecosystem Knowledge Base (SQLite) — Design & Read-Only Integration (W.57)**:
  - [x] `[Ecosystem]` W.57a — Finalize agents DB design (`.agents/skills/agents-db-design.md`) — includes universal org/repo support, filesystem-canonical approach, and export/import round-trips. **(Delivered)**
  - [x] `[Ecosystem]` W.57b — Create schema prototype + migration `v001__init.sql` (`.agents/migrations/`). **(Delivered 2026-10-18 — metadata-only schema via `v002__metadata_only.sql`: `artifacts` rebuilt without `content_md`/`frontmatter`/`checksum_fs`, `kind` widened to rule/skill/agent/template/document/fragment, new `metadata_entries` key/value table; `migrate.ts` hardened with per-file applied-tracking, legacy `last_migration` backfill, and `schema_version` recompute — regression fixed where a second run re-applied v001 and downgraded the version)**
  - **Locked user directives (amended 2026-10-18):**
    - **4. Local-Only Database Lifecycle**: `knowledge.db` and `secure.db` live in `scripts/agents-kb/data/` (next to the headless CLI, mirroring `logs/`) and are **created by initial setup after cloning** the agents ecosystem (`setup.ts`, idempotent) — gitignored, never tracked, never pushed. Per-repo tracking is **solely per repo, locally**: clones/forks start with a clean DB, and repo-scoped information never reaches other people's clones or forks of the agents ecosystem repo.
    - **5. Metadata Helpers Only — Never Content**: The databases are helpers that store **metadata used by** agents, rules, skills, templates, etc. (path/hash registries, tags, cross-references, defaults). They **never store rules, agents, skills, or templates themselves** — that content in the DB would break the agent tools' ability to see those at runtime, since the tools load them from the filesystem.
  - [x] `[Ecosystem]` Local-only lifecycle implemented: `kb-config.ts` (`DATA_DIR`/`KB_PATH`/`SECURE_KB_PATH` under `scripts/agents-kb/data/`, `defaultConfig().tracked = false`), root `.gitignore` ignores `scripts/agents-kb/data/*` + `scripts/agents-kb/logs/*` with tracked `README.md` exceptions, existing local DB migrated to `scripts/agents-kb/data/knowledge.db` (verified: rerun → 0 applied, schema_version 2.0.0), `scripts/agents-kb/data/README.md` written.
  - [x] `[Ecosystem]` `.agents/skills/agents-db-design.md` corrected: metadata-helper-only invariant (rules/agents/skills/templates content never stored), v002 metadata-only `artifacts` + `metadata_entries` schema documented, DB → metadata export (no filesystem content regeneration), local-only lifecycle, `scripts/agents-kb/data/` location.
  - [x] `[Ecosystem]` W.57c — Implement read-only DB access with filesystem fallback (no behavior change). **(Delivered 2026-10-18 — `scripts/agents-kb/kb-read.ts`: DB-first Query API `getByKey`/`getByPath`/`list`/`findRefs`/`search` with filesystem merge/fallback, alias + ref traversal, scored search; `tryOpenDb()` never creates the DB; v1 schema → fs fallback; gate green, 2/2 tests)**
  - [x] `[Ecosystem]` W.57d — Add export/sync scripts (`scripts/agents-kb/kb-export.ts`, `scripts/agents-kb/kb-sync.ts`) for deterministic **metadata** export/import round-trips (the DB never regenerates filesystem content). **(Delivered 2026-10-18 — `kb-sync.ts` (fs→DB upsert + soft-delete orphans, idempotent: 88 inserted then 88 unchanged), `kb-export.ts` (DB→deterministic Markdown report `kb-export.md`, 88 artifacts; byte-identical on rerun); npm scripts `sync`/`export`; typecheck clean)**
  - [x] `[Ecosystem]` W.57e — Add controlled write path with invariant validation (no ecosystem refs in project repos, license correctness). **(Delivered 2026-10-18 — `scripts/agents-kb/kb-write.ts`: `upsertArtifact`/`upsertMetadata`/`softDeleteArtifact` with full invariant validation (kind enum, allowed path roots, file existence, content_hash match, value-type/JSON validity, org seed); `validateInvariants` + `runValidate` CLI; npm script `validate`; test body `kb-write.test.ts` green; 88 artifacts validate clean)**
  - [x] `[Ecosystem]` W.57f — Document fork customization (`org_slug`, repo mappings) in `workspace.md`/`AGENTS.md`. **(Delivered 2026-10-18 — fork-customization section in `.agents/rules/workspace.md` (slug override via code or `AGENTS_KB_ORG`/`AGENTS_KB_ORG_SLUG` env, local-only lifecycle, env override list); `defaultOrgSlug()` added to `kb-config.ts`; AGENTS.md quick-ref unchanged — env vars documented in `scripts/README.md`)**

---

### 🎯 [Ecosystem] Workstream W.58: Session Handoff Protocol — Permanent `HANDOFF.md` Session-State Ledger (Delivered, amended 2026-10-18)
- **Project Identifiers:** `[Ecosystem]` (`projects/agents`)
- **Target Components:**
  - **Binding rule (`.agents/rules/session-handoff.md`)**: lifecycle of the permanent, git-tracked workspace-root `HANDOFF.md` — write/refresh triggers, active self-monitoring scoreboard, consume-at-start-and-migrate protocol, incremental maintenance, compression (DCP) coexistence, ledger-accuracy parity, ecosystem isolation, no secrets.
  - **Skill (`.agents/skills/session-handoff.md`)**: continuous self-monitoring, Phase A maintain procedure, Phase B migrate-and-refresh procedure, migration mapping table, anti-patterns.
  - **Template (`.agents/templates/handoff-template.md`)**: structural baseline (header, per-workstream sections with state/delivered/next tasks/ledgers, shell notes, quick resume checklist).
  - **Agent (`.agents/agents/session-keeper/handoff-writer.md`)**: session-keeper role playbook with monitoring duty and write/consume checklists.

**Locked user directives (normalized by domain):**
- **1. Permanent Session-State Ledger**: `HANDOFF.md` is a permanent, **git-tracked** file at the workspace root holding live in-flight session state (exact next steps, fresh file/environment facts, workstream posture). It is read at the very start of every session and **kept current at all times** — created at the first worth-carrying milestone, refreshed at every workstream state change, fully rewritten at session end / soft-target posture — so it can serve its purpose. It is **never gitignored and never deleted**; consumption migrates its content into the ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) and then refreshes the file (migrated-only state collapses to one-line delivered notes).
- **2. Active Limit Self-Monitoring (never wait for the user)**: The agent must actively and silently monitor its own context pressure at every checkpoint (token meter, DCP compress count this session, pressure reminders, ~40-turn / ≥3-workstream fallbacks) against the fixed thresholds (soft 100k / hard 120k, 60% of window when < 160k) and execute the postures autonomously. The user must never have to notify the agent that a limit was exceeded — that is a protocol failure.
- **3. Compression (DCP / `compress`) Coexistence**: The handoff protocol must work alongside the compress tool in workspaces with it enabled: `HANDOFF.md` is the disk-durable store sourced independently of compressed conversation memory, compress summaries must preserve the handoff file's current state, and compressing never substitutes for refreshing the handoff.

**Implementation checklist:**
- [x] **[Ecosystem] 1. Session Handoff Standard (rule, skill, template, agent)**:
  - [x] `[Ecosystem]` Author binding rule `.agents/rules/session-handoff.md` and register it in `AGENTS.md` (quick reference + workspace layout + session start checklist).
  - [x] `[Ecosystem]` Author skill `.agents/skills/session-handoff.md` and template `.agents/templates/handoff-template.md`.
  - [x] `[Ecosystem]` Author agent playbook `.agents/agents/session-keeper/handoff-writer.md`.
  - [x] `[Ecosystem]` Root `.gitignore` treatment: originally ignored as a temporary file; **superseded 2026-10-18** — `HANDOFF.md` is permanent and git-tracked (ignore rule removed).
  - [x] `[Ecosystem]` Integrate handoff steps into `.agents/rules/session-management.md` (session start/end checklists) and `.agents/skills/large-session-management.md`.
  - [x] `[Ecosystem]` Codify a **fixed max session size** (never re-calculated): hard ceiling **120k tokens**, soft target **100k tokens**, **60% of window** when < 160k, fallback heuristics (~40 substantive turns / ≥ 3 open workstreams / compaction suggested) — defined once in the rule and mirrored in the skill and agent.
  - [x] `[Ecosystem]` **Amendment 2026-10-18 — permanent ledger**: rule, skill, template, agent, `session-management.md`, `large-session-management.md`, and `AGENTS.md` (layout, quick reference, session start checklist) rewritten for the permanent, always-current, never-deleted `HANDOFF.md` lifecycle (incremental refresh; migrate-and-refresh instead of delete).
  - [x] `[Ecosystem]` **Amendment 2026-10-18 — active self-monitoring**: binding context-pressure scoreboard (token meter, compress count, DCP reminders, turn/workstream fallbacks → self-executing postures) added to rule, skill, agent, and `session-management.md` mandatory practice 7 — the agent never waits for the user to flag a limit.
  - [x] `[Ecosystem]` **Amendment 2026-10-18 — DCP compression coexistence**: coexistence section (disk-durable store, lifecycle-preserving compress summaries, compress ≠ handoff substitute, compression-proof consumption) added to rule + skill; template and `BUGS.md` quirks updated.

---

### 🎯 [Ecosystem] Workstream W.59: Headless CLI Standards — Dual Extension Mechanism, Structured Logging & Folder Documentation (Delivered 2026-10-18)
- **Project Identifiers:** `[Ecosystem]` (`projects/agents`) — `scripts/agents-kb/` headless TS ESM CLI
- **Locked user directives (normalized by domain):**
- **1. Reusable Script Extensions (no temp scripts)**: Test, inspection, and helper scripts must be built as reusable extensions of the modular TypeScript ESM CLI (e.g. `scripts/agents-kb/`) — never temporary/ad-hoc scripts — so they never have to be remade; reusability is the rationale.
- **2. Dual Extension Mechanism (body files ≠ all extensions)**: Future extensions are **not always body files**. Body files suit pluggable *content* units (tests under `bodies/test/*.test.ts`, migration SQL under `.agents/migrations/*.sql`); new **first-class TypeScript ESM modules** (`kb-read.ts`, `kb-log.ts`, future exporters/validators/commands) must be added when the capability needs real logic/exports. Locking extensions solely to body files leaves a massive gap and limits the headless CLI — choose the mechanism by nature of the capability.
- **3. Detailed Logging for Debug & Verification**: Create a logs directory with **all log files gitignored** so the CLI can log every action in detail — catching issues and verifying the CLI runs as intended.
- **4. Tracked Folder Documentation**: The logs folder itself stays tracked via a `README.md` inside it (explaining its purpose) despite the log files being ignored; the `scripts/` folder also needs a proper `README.md` explaining its purpose.
- **Implementation checklist:**
  - [x] `[Ecosystem]` Update `.agents/rules/script-standards.md` with the headless-CLI invariant: no temp scripts, dual extension mechanism (modules vs body files), structured logging to gitignored `logs/`.
  - [x] `[Ecosystem]` Add logging module `scripts/agents-kb/kb-log.ts` (console+file tee, per-run file, retention pruning, never fails CLI) and gitignore rules: `scripts/agents-kb/logs/*` + `!scripts/agents-kb/logs/README.md`.
  - [x] `[Ecosystem]` Add body-file loader `scripts/agents-kb/kb-body.ts` (discovers/imports `*.test.ts` bodies; ENOENT-safe; default-or-named `run` export contract).
  - [x] `[Ecosystem]` Add test runner `scripts/agents-kb/test.ts` + first body `scripts/agents-kb/bodies/test/migrations.test.ts` (fresh build, idempotent rerun, metadata-only schema shape, legacy backfill, schema_version downgrade guard — regression tests for the fixed migrate bug).
  - [x] `[Ecosystem]` Add initial-setup module `scripts/agents-kb/setup.ts` (idempotent: creates `data/` + `logs/` dirs, runs migrations, seeds the organization row) — the tracked READMEs + gitignore rules for both folders are already in place.
  - [x] `[Ecosystem]` Make `kb-config.ts` paths lazy/overridable (`kbPath()` + `AGENTS_KB_PATH` env, `TESTS_DIR`) so tests run the real pipeline against throwaway DBs (`DATA_DIR`/`LOGS_DIR` constants and local-only paths already in place).
  - [x] `[Ecosystem]` Write `scripts/README.md` (purpose, structure, extension mechanisms, env overrides) and `scripts/agents-kb/logs/README.md` (log purpose, naming, retention, git policy).

---

### 🎯 [Ecosystem] Workstream W.60: Project-Local Agents Interoperability & Per-Project Ecosystem Scaffolding (Delivered 2026-10-18)
- **Project Identifiers:** `[Ecosystem]` (`projects/agents`) — `.agents/rules/` + `scripts/agents-kb/` headless TS ESM CLI
- **Target Components:**
  - **Interoperability rule (`.agents/rules/project-agents-interoperability.md`)**: discovery of project-local agents assets, precedence matrix (org-wide invariants vs project-internal conventions), enhancement direction (ours enhances theirs; never clobber; ecosystem isolation preserved).
  - **Scaffold module (`scripts/agents-kb/kb-scaffold.ts`)**: optional headless-CLI feature that generates a complete project-local agents ecosystem (`AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/templates/`, `.agents/agents/`) inside a target project for users who want per-project agents.
  - **Project-type template suites (body files)**: scaffold content packs for distinct project types/engines (e.g. Tauri v2 desktop, Jekyll theme, Node/TS CLI, Rust library, docs site) under the body-file extension mechanism.

**Locked user directives (normalized by domain):**
- **1. Interoperability**: Some projects/repositories have their own internal agents. The workspace-root agents ecosystem must work with those — it is used to **enhance** per-project agents, rules, skills, templates, etc. in projects that have their own (project-local files are first-class and never clobbered unprompted; org-wide invariants always win).
- **2. Optional Scaffolding Feature in the Headless CLI**: The ability to author proper per-project agents, skills, rules, and templates ships as an **optional feature of the headless CLI** for users who desire per-project agents ecosystems — meaning proper **templates for various project types and engines** are required.

**Implementation checklist:**
- [x] `[Ecosystem]` Author binding rule `.agents/rules/project-agents-interoperability.md` (discovery, precedence matrix, enhancement direction, invariants).
- [x] `[Ecosystem]` Register `AGENTS.md` invariant 15 (project-local agents interoperability), quick-reference row, and session-start checklist step 7 (discover & honor project-local agents assets).
- [x] `[Ecosystem]` Add scaffold module `scripts/agents-kb/kb-scaffold.ts` (first-class TS ESM module): `--type <engine> --path <project>` scaffolding with dry-run, idempotent merge (never overwrites existing project-local files unprompted), structured logging via `kb-log.ts`. **(Delivered 2026-10-18)**
- [x] `[Ecosystem]` Author project-type template suites as body files (`scripts/agents-kb/bodies/scaffold/<type>/…`): at minimum `tauri-desktop`, `jekyll-theme`, `node-ts-cli`, `rust-library`, `docs-site` — each with `AGENTS.md`, starter rules, skills, templates, and agent playbooks tailored to the engine. **(Delivered 2026-10-18 — each type: AGENTS.md, .agents/rules/local-conventions.md, .github/copilot-instructions.md)**
- [x] `[Ecosystem]` Add scaffold test bodies (`tests/scaffold.test.ts`): dry-run makes no writes, idempotent re-run, never-clobber guard, engine-specific content present. **(Delivered 2026-10-18 — 5 types, dry-run/idempotency/never-clobber/content checks green)**
- [x] `[Ecosystem]` Document the feature in `scripts/README.md` and `.agents/rules/project-agents-interoperability.md` integration section; note the KB artifact recording (per-repo agent assets, W.57). **(Delivered 2026-10-18 — README updated with scaffold command/type list; scaffold section added to interop rule)**

---

### 🎯 [Ecosystem] Workstream W.62: OpenCode Context-Pressure Self-Monitoring Plugin (Proposed)
- **Project Identifiers:** `[Ecosystem]` (`projects/agents`) — V2-native OpenCode plugin under `.opencode/plugins/` (or `scripts/opencode-plugin/`) that auto-injects the context-pressure scoreboard at every checkpoint and forces a `HANDOFF.md` refresh at soft-target posture.
- **Target Components:**
  - **V2 plugin module**: default export `{ id, effect | setup }` (V2 shape) so it loads under the current OpenCode build (the V1-only plugins that prompted W.61 are the cautionary example).
  - **Scoreboard injection**: reads token usage / compress count / workstream count from OpenCode's session API and injects a one-line scoreboard into the system prompt or a tool result at each checkpoint, so the agent can see its own posture without relying on memory.
  - **Soft-target enforcement**: at soft-target posture, blocks new implementation work and only permits verification + ledger sync + HANDOFF rewrite until the posture is cleared; emits a user-visible notice.
  - **Potato-budget**: must be lightweight (no background polling loops, no heavy deps); runs only on checkpoint events.
- **Why:** the session-handoff protocol's self-monitoring rule (`.agents/rules/session-handoff.md`) depends on the agent noticing its own token pressure; twice this session the agent failed to act on the 100k soft target until the user flagged it. An internal V2 plugin is the only reliable mechanism — the agent cannot self-observe accurately from within the context window.
- **Locked user directives (proposed 2026-10-18):**
  - **1. V2-native only**: must use the V2 plugin API (`{ id, effect | setup }`); never ship a V1-shaped default export.
  - **2. Read-only, low-overhead**: no mutations to sessions or files except the HANDOFF refresh that the agent itself performs; no background polling; checkpoint-event driven.
  - **3. Curated**: single-purpose plugin; no feature creep into unrelated capabilities (those belong in W.61 survey scope).
- **Implementation checklist:**
  - [ ] `[Ecosystem]` Read the V2 plugins guide (`https://opencode.ai/v2/docs/build/plugins`) and scaffold a minimal V2 plugin that logs/returns a checkpoint scoreboard (proof-of-concept).
  - [ ] `[Ecosystem]` Wire scoreboard to the session-handoff rule's thresholds (100k soft / 120k hard / 60% of window < 160k; compress count; ~40 turns / ≥3 workstreams).
  - [ ] `[Ecosystem]` Add soft-target gating: at soft posture, only verification + ledger sync + HANDOFF rewrite permitted; user-visible notice.
  - [ ] `[Ecosystem]` Verify it loads green under the current OpenCode build (plugin view + `~/.local/share/opencode/log/opencode.log`), add to `.opencode/opencode.jsonc` only after verification, and document in `scripts/README.md` / `BUGS.md` quirk set.
  - [ ] `[Ecosystem]` Test on potato-class hardware (Dell OptiPlex 3040 SFF reference) for overhead before adoption.

---

### 🎯 [Ecosystem] Workstream W.61: OpenCode Ecosystem Watch — V2 Plugin Compatibility Restore & Curated Plugin/MCP/LSP Discovery (In Progress)

- **Project Identifiers:** `[Ecosystem]` (`projects/agents`) — `.opencode/opencode.jsonc` project plugin/MCP/LSP config
- **Target Components:**
  - **V2 compatibility restore**: three plugins removed 2026-10-18 from `.opencode/opencode.jsonc` because they load only under the V1 plugin API (fails on V2's required default export `{ id, effect | setup }`): `@franlol/opencode-md-table-formatter`, `opencode-agent-skills`, `opencode-websearch-cited`.
  - **Curated discovery**: periodic survey of the OpenCode ecosystem for new plugins **and MCP / LSP configurations** the agents ecosystem can genuinely benefit from — under a hard low-end-hardware budget.

**Locked user directives (normalized by domain):**
- **1. Restore Compatibility ASAP**: Regularly check whether V2-compatible versions of the removed plugins (or compatible alternatives providing the same capability) are available, and restore them as soon as possible.
- **2. Curated Discovery With a Hard Cap on Clutter**: Regularly also check for new beneficial **plugins, MCP servers, and LSP configurations** — but strictly curated: the goal is the **benefits without clutter**. Never accumulate so much that the OpenCode instance risks corruption, instability, or lockup. Only adopt candidates that are compatible, actively maintained, non-overlapping with existing capability, and low-overhead.
- **3. Potato-Computer Budget**: Some users run from very modest hardware — the reference environment is a slightly upgraded Dell OptiPlex 3040 SFF (Small Form Factor; RAM upgrade, GPU upgrade, new tri-channel internal WiFi + Bluetooth card). Every candidate must be evaluated for RAM/CPU/disk/network overhead on such potato-class machines; prefer lightweight or optional/deferred-load configurations and skip anything heavy (headless browsers, large indexers, always-on model servers) unless the benefit clearly justifies the cost.

**Implementation checklist:**
- [x] `[Ecosystem]` Remove V1-incompatible plugins from `.opencode/opencode.jsonc` (kept `@tarquinen/opencode-dcp`, `@plannotator/opencode`) and record the ecosystem quirk in `BUGS.md` (2026-10-18).
- [ ] `[Ecosystem]` Re-check `@franlol/opencode-md-table-formatter`, `opencode-agent-skills`, and `opencode-websearch-cited` npm latest releases for V2-compatible versions (or same-capability alternatives) at session starts / periodically; re-add to the `plugin` array when available and verify green (plugin view + no `failed to load plugin` in `~/.local/share/opencode/log/opencode.log`).
- [ ] `[Ecosystem]` Periodically survey for new ecosystem-beneficial **plugins, MCP servers, and LSP configurations**; evaluate each against the curation policy (compatible, maintained, no capability overlap, low resource overhead, no lockup/corruption risk **on potato-class hardware**); adopt only clear wins and keep the total list minimal.




## Completed Workstreams (Bare-Minimal Index)

> Per-repo workstreams have been migrated to each repository's own tracking files (projects/<repo>/TODO.md, ROADMAP.md, PLAN.md, BUGS.md, HANDOFF.md). See each repo for details. The full historical archive remains in [.github/TODO-ARCHIVE.md](./.github/TODO-ARCHIVE.md).

- **[Ecosystem]** W.56 2b per-repo migration: COMPLETE (all 15 org repos scaffolded + tailored).
- **[Ecosystem]** W.57/W.58/W.59/W.60/W.61/W.62: delivered (see PLAN.md / HANDOFF.md).

