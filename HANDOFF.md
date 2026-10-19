# HANDOFF.md — Agents Ecosystem Session Handoff

**Last updated:** 2026-10-19
**Current session status:** In Progress · Ecosystem-only scope normalized
**Workspace Root:** D:\Projects\GitHub\HELIX Origin

> Permanent, git-tracked session-state ledger for the **Agents Ecosystem**. Maintained **incrementally** — refresh at every
> workstream state change, fully rewrite at session end / soft-target posture. New session: read
> this file right after `AGENTS.md`, migrate every item into `ROADMAP.md` / `PLAN.md` /
> `TODO.md` / `BUGS.md`, then **refresh this file** (migrated-only state collapses to one-line
> delivered notes). **Never delete it.** See `.agents/rules/session-handoff.md`.
> Project-specific session state lives strictly in each project's own repository (`projects/<repo>/HANDOFF.md`).

---

## 1) [Ecosystem] (projects/agents) W.57 — Agents Ecosystem Knowledge Base (SQLite) — Design & Read-Only Integration
- **State:** W.57a–f delivered + ledger-synced (W.57 COMPLETE).
- **Delivered (this + prior sessions):**
  - W.57a: design doc `.agents/skills/agents-db-design.md` (metadata-helper-only, local-only, universal org, Query API).
  - W.57b: migrations `v001__init.sql` + `v002__metadata_only.sql` (metadata-only artifacts, metadata_entries); migrate.ts hardened (per-file applied tracking, legacy backfill, schema_version recompute); local-only lifecycle (`scripts/agents-kb/data/`, gitignored + tracked README, `tracked:false`); design doc corrected.
  - W.57c: `scripts/agents-kb/kb-read.ts` — read-only Query API (getByKey/getByPath/list/findRefs/search) with DB-first + filesystem merge/fallback (`origin: db/fs/merged`), alias fallback, both-direction refs, scored search (title 3/path 2/tags 1); `tryOpenDb()` never creates the DB; v1 schema → fs fallback. Test body `kb-read.test.ts` (4 assertions) green.
  - W.57d: `scripts/agents-kb/kb-sync.ts` (fs→DB upsert + soft-delete orphans, idempotent) + `scripts/agents-kb/kb-export.ts` (DB→deterministic Markdown report `kb-export.md`, byte-identical on rerun); npm scripts `sync`/`export`; env overrides `AGENTS_KB_PATH`/`AGENTS_KB_EXPORT_PATH`; test body `kb-sync.test.ts` green.
  - W.57e: `scripts/agents-kb/kb-write.ts` — controlled write path (`upsertArtifact`/`upsertMetadata`/`softDeleteArtifact`) with full invariant validation (kind enum, allowed path roots, file existence, content_hash match, value-type/JSON validity, org seed); `validateInvariants` + `runValidate` CLI; npm script `validate`; test body `kb-write.test.ts` green; 89 artifacts validate clean.
- **Next tasks:** (none — W.57 complete)
- **Ledgers:** `TODO.md` (W.57), `PLAN.md` (Sprint 33 task 3)

---

## 2) [Ecosystem] (projects/agents) W.58 — Permanent Handoff, Self-Monitoring, Compression Coexistence (Delivered)
- **State:** All ecosystem surfaces rewritten and ledger-synced.
- **Delivered:** `.agents/rules/session-handoff.md` + skill + template + agent playbook (permanent lifecycle, self-monitoring scoreboard with postures, DCP coexistence); `session-management.md` practice 7; `large-session-management.md`; `AGENTS.md`; `.gitignore` (HANDOFF ignore removed); `BUGS.md` post-mortem; `TODO.md`/`PLAN.md` synced.
- **Next tasks:** (none — protocol fully established)
- **Ledgers:** `TODO.md` (W.58), `PLAN.md` (Sprint 33 task 4)

---

## 3) [Ecosystem] (projects/agents) W.59 — Headless CLI Standards (Delivered, fully synced)
- **State:** All implementation files written, quality gate green (all tests pass), ledger sync complete.
- **Delivered:** `kb-config.ts` (lazy `kbPath()`+`AGENTS_KB_PATH`, `secureKbPath()`, TESTS_DIR/BODIES_DIR); `kb-log.ts`; `kb-body.ts` (`loadUnits`); `migrate.ts` refactored; `setup.ts`; `test.ts`; `tests/migrations.test.ts` + `tests/kb-read.test.ts`; `scripts/README.md` + `logs/README.md`; `script-standards.md` invariant 5 (dual extension mechanism, standard Node.js project setup); `package.json` + `tsconfig.json` (strict ESM, engines ≥22.18, npm scripts setup/migrate/test/typecheck); root `.gitignore` (`node_modules/`, `scripts/**/node_modules/`, data/, logs/).
- **Next tasks:** (none — complete)
- **Ledgers:** `TODO.md` (W.59), `PLAN.md` (Sprint 33 task 5)

---

## 4) [Ecosystem] (projects/agents) W.60 — Project-Local Agents Interoperability & Scaffolding (Delivered)
- **State:** Rule + invariant + scaffold module + template suites + tests + docs delivered.
- **Delivered:** `.agents/rules/project-agents-interoperability.md` + `AGENTS.md` invariant 15 / quick-ref / session-start step 7; `scripts/agents-kb/kb-scaffold.ts` (dry-run, never-clobber, `--list`/`--force`); template suites `bodies/scaffold/{tauri-desktop,jekyll-theme,node-ts-cli,rust-library,docs-site}/` (AGENTS.md, .agents/rules/local-conventions.md, .github/copilot-instructions.md); test body `scaffold.test.ts` green; README + interop rule docs.
- **Next tasks:** (none — W.60 complete)
- **Ledgers:** `TODO.md` (W.60), `PLAN.md` (Sprint 33 task 6)

---

## 5) [Ecosystem] (projects/agents) W.61 — OpenCode Ecosystem Watch (In Progress, recurring)
- **State:** Incident closed; recurring watch active.
- **Facts:** V1-only plugins `@franlol/opencode-md-table-formatter`, `opencode-agent-skills`, `opencode-websearch-cited` removed from `.opencode/opencode.jsonc` (fail V2 API). Working V2-native: `@tarquinen/opencode-dcp`, `@plannotator/opencode`.
- **Next tasks:**
  - [ ] Periodically re-check the three packages (or alternatives) for V2-compatible releases → re-add when available.
  - [ ] Periodically survey for beneficial plugins/MCP/LSP configs under curation policy + potato-class hardware budget (Dell OptiPlex 3040 SFF reference).
- **Ledgers:** `TODO.md` (W.61), `BUGS.md` (ecosystem quirk)

---

## 6) [Ecosystem] (projects/agents) W.62 — OpenCode Context-Pressure Self-Monitoring Plugin (Proposed)
- **State:** Proposed after a second self-monitoring failure (agent failed to act on 100k soft target until user flagged it). A V2-native plugin is the only reliable mechanism.
- **Next tasks:**
  - [ ] Scaffold minimal V2 plugin module (`{ id, effect | setup }`).
  - [ ] Wire scoreboard to token meter / compress count / turn count.
  - [ ] Enforce soft-target posture gating (100k soft / 120k hard).
  - [ ] Test on potato-class hardware for low resource overhead.
- **Ledgers:** `TODO.md` (W.62), `PLAN.md` (Sprint 35)

---

## 7) Shell / Tooling Notes
- Node v26.8.1 — native TS type stripping; `.ts` imports need explicit extensions; package at `scripts/package.json` (ESM, engines ≥22.18, strict tsconfig).
- Never run inline `node -e` (PowerShell strips quotes) — write CLI module files under `scripts/`.
- Read-only git by default; only mutate repositories with explicit user permission in current conversation.
- DCP plugins active; `compress` sanctioned — summaries must preserve this file's current state.
- `npm run test` in `scripts/agents-kb/` → 5 passed, 0 failed; `npm run validate` → 89 artifacts validated clean.

---

## 8) Recent Deliveries (Ecosystem)
- **[Ecosystem] Zero Project-Scoped Data Purge (2026-10-19):** Completely scrubbed project-scoped bugs, roadmaps, sprint plans, and pending tasks from root tracking ledgers (`BUGS.md`, `PLAN.md`, `ROADMAP.md`, `TODO.md`, `HANDOFF.md`). All project data lives exclusively in per-project repositories under `projects/<repo>/`.
- **[Ecosystem] W.56 — Scaffold Domain-Neutral Links & Attribution (2026-10-19):**
  - All org/domain-specific URLs removed from scaffold templates and bodies; docs/wiki/portal/Discord/Discussions/repo/org links are now opt-in (`--docs-url`, `--wiki-url`, `--portal-url`, etc.).
  - `renderTemplate` gained `{{#KEY}}`/`{{^KEY}}` conditional blocks and brace-order fix.
  - Only `README.md` carries an always-on attribution footer linking the agents ecosystem repository.
- **[Ecosystem] W.56 — GFM Mermaid in Flow-Oriented Templates (2026-10-19):**
  - Added GitHub-flavored mermaid diagrams to `contributing`, `security`, `governance`, `bugs`, and `handoff` templates.
- **[Ecosystem] W.60 Scaffolding Engine Enhancements & .env Support:**
  - Configurable license (`--license <type>`, defaults to `MIT`).
  - Opt-in tracking ledgers and opt-in community-health files.
  - Automatic `.env` loading (`--env [path]`).

---

## 9) Pending (Ecosystem)
- [Ecosystem] Convert `provision-repo-secrets.ps1` into a headless-CLI extension.
- [Ecosystem] W.61 periodic plugin checks; W.62 context-monitoring plugin proof-of-concept.

---

## Quick Resume Checklist (New Session)
1. Read `AGENTS.md`
2. Read this file immediately, then `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`
3. Migrate this file's open items into the ledgers, then refresh it (never delete)
4. Verify ecosystem health: `npm --prefix scripts test` and `npm --prefix scripts run validate`
5. Run the context-pressure scoreboard at every checkpoint — never wait for the user to flag a limit.
