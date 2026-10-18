# HANDOFF.md — Ecosystem: W.57c/W.59 Delivered, Node Packaging, W.62 Proposed, Soft-Target Posture

**Last updated:** 2026-10-18
**Current session status:** SOFT-TARGET POSTURE — session split required; all in-flight work verified and ledger-synced; next session resumes at W.57d
**Root:** D:\Projects\GitHub\HELIX Origin

> Permanent, git-tracked session-state ledger. Maintained **incrementally** — refresh at every
> workstream state change, fully rewrite at session end / soft-target posture. New session: read
> this file right after `AGENTS.md`, migrate every item into `ROADMAP.md` / `PLAN.md` /
> `TODO.md` / `BUGS.md`, then **refresh this file** (migrated-only state collapses to one-line
> delivered notes). **Never delete it.** See `.agents/rules/session-handoff.md`.

---

## 1) [Ecosystem] (projects/agents) W.57 — Agents Ecosystem Knowledge Base (SQLite) — Design & Read-Only Integration
- **State:** W.57a–f delivered + ledger-synced (W.57 COMPLETE).
- **Delivered (this + prior sessions):**
  - W.57a: design doc `.agents/skills/agents-db-design.md` (metadata-helper-only, local-only, universal org, Query API).
  - W.57b: migrations `v001__init.sql` + `v002__metadata_only.sql` (metadata-only artifacts, metadata_entries); migrate.ts hardened (per-file applied tracking, legacy backfill, schema_version recompute); local-only lifecycle (`scripts/agents-kb/data/`, gitignored + tracked README, `tracked:false`); design doc corrected.
  - W.57c: `scripts/agents-kb/kb-read.ts` — read-only Query API (getByKey/getByPath/list/findRefs/search) with DB-first + filesystem merge/fallback (`origin: db/fs/merged`), alias fallback, both-direction refs, scored search (title 3/path 2/tags 1); `tryOpenDb()` never creates the DB; v1 schema → fs fallback. Test body `kb-read.test.ts` (4 assertions) green.
  - W.57d: `scripts/agents-kb/kb-sync.ts` (fs→DB upsert + soft-delete orphans, idempotent) + `scripts/agents-kb/kb-export.ts` (DB→deterministic Markdown report `kb-export.md`, byte-identical on rerun); npm scripts `sync`/`export`; env overrides `AGENTS_KB_PATH`/`AGENTS_KB_EXPORT_PATH`; test body `kb-sync.test.ts` (idempotency + determinism) green.
  - W.57e: `scripts/agents-kb/kb-write.ts` — controlled write path (`upsertArtifact`/`upsertMetadata`/`softDeleteArtifact`) with full invariant validation (kind enum, allowed path roots, file existence, content_hash match, value-type/JSON validity, org seed); `validateInvariants` + `runValidate` CLI; npm script `validate`; test body `kb-write.test.ts` green; 88 artifacts validate clean.
- **Next tasks:** (none — W.57 complete; W.57e `kb-write.ts` and W.57f fork customization delivered)
- **Ledgers:** `TODO.md` (W.57), `PLAN.md` (Sprint 33 task 3)

## 2) [Ecosystem] (projects/agents) W.58 — Permanent Handoff, Self-Monitoring, Compression Coexistence (Delivered)
- **State:** All ecosystem surfaces rewritten and ledger-synced (2026-10-18).
- **Delivered:** `.agents/rules/session-handoff.md` + skill + template + agent playbook (permanent lifecycle, self-monitoring scoreboard with postures, DCP coexistence); `session-management.md` practice 7; `large-session-management.md`; `AGENTS.md`; `.gitignore` (HANDOFF ignore removed); `BUGS.md` post-mortem; `TODO.md`/`PLAN.md` synced.
- **Next tasks:**
  - [ ] Commit the amendment set when the user authorizes git (workspace root): `.agents/`, `AGENTS.md`, `.gitignore`, `BUGS.md`, `TODO.md`, `PLAN.md`, `HANDOFF.md`, `scripts/`.
- **Ledgers:** `TODO.md` (W.58), `PLAN.md` (Sprint 33 task 4)

## 3) [Ecosystem] (projects/agents) W.59 — Headless CLI Standards (Delivered, fully synced)
- **State:** All implementation files written, gate green (2/2 tests), ledger sync complete.
- **Delivered:** `kb-config.ts` (lazy `kbPath()`+`AGENTS_KB_PATH`, `secureKbPath()`, TESTS_DIR/BODIES_DIR; const KB_PATH removed); `kb-log.ts`; `kb-body.ts` (`loadUnits`); `migrate.ts` refactored; `setup.ts`; `test.ts`; `tests/migrations.test.ts` + `tests/kb-read.test.ts`; `scripts/README.md` + `logs/README.md`; `script-standards.md` invariant 5 (dual extension mechanism corrected taxonomy, standard Node.js project setup); `AGENTS.md` layout; `package.json` + `tsconfig.json` (strict ESM, engines ≥22.18, npm scripts setup/migrate/test/typecheck); root `.gitignore` (`node_modules/`, `scripts/**/node_modules/`, data/, logs/). `npm install` → 3 packages, 0 vulns; `npm run typecheck` clean; `npm run test` → 2 passed, 0 failed.
- **Next tasks:** (none — complete; W.57c `kb-read.ts` delivered alongside)
- **Ledgers:** `TODO.md` (W.59), `PLAN.md` (Sprint 33 task 5)

## 4) [Ecosystem] (projects/agents) W.60 — Project-Local Agents Interoperability & Scaffolding (Delivered 2026-10-18)
- **State:** Rule + invariant + scaffold module + template suites + tests + docs delivered.
- **Delivered:** `.agents/rules/project-agents-interoperability.md` + `AGENTS.md` invariant 15 / quick-ref / session-start step 7; `scripts/agents-kb/kb-scaffold.ts` (dry-run, never-clobber, `--list`/`--force`); template suites `bodies/scaffold/{tauri-desktop,jekyll-theme,node-ts-cli,rust-library,docs-site}/` (AGENTS.md, .agents/rules/local-conventions.md, .github/copilot-instructions.md); test body `scaffold.test.ts` green; README + interop rule docs.
- **Next tasks:** (none — W.60 complete)
- **Ledgers:** `TODO.md` (W.60), `PLAN.md` (Sprint 33 task 6)

## 5) [Ecosystem] (projects/agents) W.61 — OpenCode Ecosystem Watch (In Progress, recurring)
- **State:** Incident closed 2026-10-18; recurring watch active.
- **Facts:** V1-only plugins `@franlol/opencode-md-table-formatter`, `opencode-agent-skills`, `opencode-websearch-cited` removed from `.opencode/opencode.jsonc` (fail V2 API). First npm check 2026-10-18: still no V2-compatible releases (0.0.6/0.7.0/1.2.0). Working V2-native: `@tarquinen/opencode-dcp`, `@plannotator/opencode`. Config reload = full OpenCode relaunch (no `opencode service` subcommand; plugin view also refreshes live).
- **Next tasks:**
  - [ ] Periodically re-check the three packages (or alternatives) for V2-compatible releases → re-add when available.
  - [ ] Periodically survey for beneficial plugins/MCP/LSP configs under curation policy + potato-class hardware budget (Dell OptiPlex 3040 SFF reference).
- **Ledgers:** `TODO.md` (W.61), `BUGS.md` (ecosystem quirk)

## 6) [Ecosystem] (projects/agents) W.62 — OpenCode Context-Pressure Self-Monitoring Plugin (Proposed)
- **State:** Proposed 2026-10-18 after a second self-monitoring failure (agent failed to act on 100k soft target until user flagged it at 106k). The agent cannot reliably self-observe from inside the context window; a V2-native plugin is the only reliable mechanism.
- **Next tasks:** (see TODO.md W.62 checklist — PoC scaffold, scoreboard wiring, soft-target gating, green-load verification, potato-hardware overhead test)
- **Ledgers:** `TODO.md` (W.62), `BUGS.md` (post-mortem entry)

## 7) Shell / Tooling Notes
- Node v26.8.1 — native TS type stripping; `.ts` imports need explicit extensions; package at `scripts/package.json` (ESM, engines ≥22.18, strict tsconfig).
- Never run inline `node -e` (PowerShell strips quotes) — write CLI module files under `scripts/`.
- Read-only git only; no mutations authorized this conversation.
- DCP plugins active; `compress` sanctioned — summaries must preserve this file's current state.
- `node scripts/agents-kb/migrate.ts` verified working (0 applied, schema_version 2.0.0); `npm run test` → 2 passed, 0 failed.

## 8) Recent Deliveries (2026-10-18)
- **[depressurizer] W.55 Complete & Verified:**
  - Fallback API key purged from `AppSettings::default()`; credential hygiene strictly enforced (no hardcoded keys/IDs, local `.env` untouched).
  - Client support trimmed to userdata enumeration only; dead VDF parsing removed.
  - HLTB AutoCat filter integration (`AutoCatFilterType::Hltb`) + storage/UI/Rust unit tests (`test_autocat_hltb_range_and_fields`) passing.
  - Category pick-list, semantic sidebar, favicon link, and desktop-only scope documented in README. Quality gate green (`cargo test` 2/2, `svelte-check` 0 errors/0 warnings).
- **[Ecosystem] W.60 Scaffolding Engine Enhancements & .env Support:**
  - License configurable (`--license <type>`, defaults to `MIT` per GitHub standard; templates use `{LICENSE}`).
  - Default root tracking file strictly `AGENTS.md` (no tracking ledgers or health files generated by default).
  - Opt-in tracking ledgers (`--tracking [files]` / `--with-plan|handoff|bugs|todo|roadmap`).
  - Opt-in community-health files (`--health [files]` / `--with-health`), resolving `CODE_OF_CONDUCT.md`, `PRIVACY.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md`, `GOVERNANCE.md`, `CONTRIBUTING.md`, `CITATION.cff`, `TOS.md`.
  - Optional `.env` configuration auto-loading (`--env [path]`, auto-detects `.env` in cwd; supports `SCAFFOLD_TYPE`, `SCAFFOLD_LICENSE`, `SCAFFOLD_TRACKING`, `SCAFFOLD_HEALTH`, `SCAFFOLD_ARGS`, etc.; CLI flags override `.env`).
  - Tracked prebuilt `.env.example` created in `scripts/.env.example` and `scripts/agents-kb/.env.example`.
  - All test suites green (5/5 passed), typecheck clean (`tsc --noEmit`), KB sync and validate 88/88 artifacts clean.

## 9) Pending
- [Ecosystem] W.56 organization community-health files rollout to remaining repos; migrate per-repo plans/tasks/tracking from root ledgers into each repo as part of the rollout.
- [Ecosystem] Convert `provision-repo-secrets.ps1` into a headless-CLI extension (CLI owns the DB it will use).
- [Ecosystem] W.61 periodic checks; W.62 plugin PoC.

## Quick Resume Checklist (New Session)
1. Read `AGENTS.md`
2. Read this file immediately, then `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`
3. Migrate this file's open items into the ledgers, then refresh it (never delete)
4. Resume at W.56 per-repo rollout using the enhanced `kb-scaffold` CLI (first repo: `universal-game-launcher` or `nh-reader`).
5. Run the context-pressure scoreboard at every checkpoint — never wait for the user to flag a limit.
