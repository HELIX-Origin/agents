# PLAN.md — HELIX Origin Master Plan & Sprints

> 🎯 **Master Plan**: Active sprint planning, execution architecture, and completed sprint history across all active repositories in the **HELIX Origin** organization.
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (strategic direction), [`TODO.md`](./TODO.md) (executable tasks), and [`BUGS.md`](./BUGS.md) (known issues).
> Historical delivered milestones and task archives live in [`.github/`](./.github/).
> Last updated: 2026-10-18

---

## 📜 Organizational Tracking Contract

- **Single Pane of Glass:** All repository sprint plans are consolidated here at workspace root.
- **100% Active Direction Accuracy:** Active sprints and architectural descriptions must always reflect the current, active direction of all projects with zero contradictions. Superseded tasks or decisions must be updated in place rather than appended as conflicting statements.
- **Zero Non-Organization Mentions:** Only reference active repositories belonging to the `HELIX-Origin` GitHub organization (`helix-jekyll-theme`, `helix-origin.github.io`, `docs`, `wiki`, `nh-reader`, `universal-game-launcher`, `theme-toolkit`, `windhawk-themes`, `helix-gaming-db-00` through `03`, `ffxiv-config`). Never directly mention external, third-party, or deleted projects/repositories by name.
- **Active Sprints Only in Top Section:** `## 🎯 Active Sprints` contains ONLY currently active sprints. Completed sprints move immediately to `## ✅ Completed Sprints` (newest first).
- **Mandatory Project Tagging Invariant:** Every sprint, workstream, task, and verification command **must explicitly state its current project name and repository path** (`[<project-name>] (<project-path>)`). Unscoped items are strictly prohibited so agents never conflate repositories.

---

## 🎯 Active Sprints

### 🚀 Sprint 32: [depressurizer] (projects/depressurizer) — Steam Library Categorizer Cross-Platform Revival: Tauri v2 (Rust + Svelte/SCSS) Architecture, Official Steam Integration, Multi-User NSIS & Multi-Platform Packaging
- **Project Identifiers:** `[depressurizer]` (`projects/depressurizer`)
- **Target Objective:** Revive and maintain an active cross-platform fork of Depressurizer within the `HELIX-Origin` organization targeting Windows, macOS, and Linux. Transition from archived legacy .NET Framework 4.8 WinForms to the organization's standard **Tauri v2 (Rust + Svelte/SCSS)** desktop architecture. Rely **entirely on the official Steam Web API key** as the sole required integration surface — it provides account authorization (`key` + `steamid`), the full owned-game library (`IPlayerService/GetOwnedGames`), and account collection customization — with **no dependency on direct Steam client access**: the legacy Steam-client methods (local path autodetection and VDF parsing) are **abandoned and removed**, not retained as a fallback — they were flaky and Windows-locked, which is precisely why the migration moves to the Web API key + SteamID64 architecture. The app never reads or writes local Steam client files; the `legacy/` folder (archived .NET/C# app) is retained only as an intentional historical backup and behavioural reference. Official Steam Store API supplements tags/genres. Implement an obsidian dark SCSS frontend matching our desktop suite, multi-platform installer options (multi-user NSIS for Windows, DMG for macOS, AppImage/deb for Linux), and automated GitHub Actions CI/CD. The key-only architecture additionally unlocks future Android and iOS support for the app.

```mermaid
flowchart TD
    S32_0["[depressurizer] Fork & Org Registration (provision-repo-secrets, AGENTS.md, ROADMAP.md)"] --> S32_1["[depressurizer] Tauri v2 Scaffolding (Rust src-tauri, Svelte/TypeScript UI, Vite, SCSS)"]
    S32_1 --> S32_2["[depressurizer] Steam Web API Engine (Key-Only — No Steam Client Dependency)"]
    S32_2 --> S32_3["[depressurizer] Category & AutoCat Rules Engine (Genres, Tags, Dev/Pub, Hours)"]
    S32_3 --> S32_4["[depressurizer] Obsidian SCSS UI Suite & Profile Switcher"]
    S32_4 --> S32_5["[depressurizer] Multi-Platform Packaging (Tauri Multi-User NSIS, macOS DMG, Linux AppImage)"]
```

#### 📝 Execution Tasks

0. **[depressurizer] (projects/depressurizer) W.55_init — Repository Fork, Secret Provisioning & Ecosystem Registration (Delivered)**:
   - `[depressurizer]` Forked archived repository into `HELIX-Origin/depressurizer`.
   - `[depressurizer]` Provisioned `PAT_TOKEN` secret to repository via `provision-repo-secrets.ps1`.
   - `[depressurizer]` Cloned repository to `projects/depressurizer` and configured clean remote origin.
   - `[depressurizer]` Registered repository across `AGENTS.md`, `.agents/rules/workspace.md`, `.agents/rules/release-notes.md`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, and `provision-repo-secrets.ps1`.
1. **[depressurizer] (projects/depressurizer) W.55a — Tauri v2 Core Scaffolding & Design System (Delivered)**:
   - `[depressurizer]` Scaffolded Tauri v2 architecture (`src-tauri/` with Rust backend, SvelteKit / Vite frontend, TypeScript, SCSS).
   - `[depressurizer]` Integrated HELIX Origin obsidian dark theme SCSS tokens (`#07111f`, `#0d1b2d`, `#48d8f2`, `#b06cff`).
   - `[depressurizer]` Generated full cross-platform icon suites (ICNS, ICO, PNG) and NSIS sidebar artwork (`sidebar.bmp` / `sidebar.svg`).
2. **[depressurizer] (projects/depressurizer) W.55b — Official Steam Web API Engine & Legacy Code Extraction (Delivered)**:
   - `[depressurizer]` Implemented official Steam Web API client (`IPlayerService/GetOwnedGames`) and official Store API tag/genre lookup.
   - `[depressurizer]` Relocated the legacy monolithic .NET/C# application to the `legacy/` folder as an intentional historical backup and behavioural reference (retained; excluded from the shipped build).
   - `[depressurizer]` *Superseded:* Steam client path autodetection and the VDF parser were delivered here and are now abandoned and removed (see W.55k) — they were flaky and Windows-locked.
3. **[depressurizer] (projects/depressurizer) W.55c — AutoCat Rules Engine & Category Management (Delivered)**:
   - `[depressurizer]` Implemented complete category manipulation (create, rename, delete, assign, unassign).
   - `[depressurizer]` Authored AutoCat rules engine supporting Genre, Tags, Developer/Publisher, Release Year, User Score, Playtime, and Platform filters with unit tests.
   - `[depressurizer]` Implemented Tokio background worker (`worker.rs`) streaming live progress events to prevent UI hangs.
   - `[depressurizer]` Implemented headless CLI (`--cli detect`, `list-games`, `autocat`) with Windows console attachment (`AttachConsole`).
4. **[depressurizer] (projects/depressurizer) W.55d — Multi-Platform Packaging & Continuous Integration (Delivered)**:
   - `[depressurizer]` Authored NSIS multi-user installer matching Tauri v2 standards (all-users vs per-user, custom path, desktop shortcuts, clean uninstaller, process termination mutex).
   - `[depressurizer]` Authored `.github/workflows/ci.yml` verifying Rust and frontend builds across Windows, macOS, and Linux runners.
5. **[depressurizer] (projects/depressurizer) W.55e — SQLite Persistent In-App Storage & All Owned Games Discovery (Delivered)**:
   - `[depressurizer]` Implemented native Tauri RustSQL (`rusqlite`) storage module (`storage.rs`) with WAL mode in `depressurizer.db` for instant startup and persistent credentials/settings.
   - `[depressurizer]` Implemented official Steam Web API client (`IPlayerService/GetOwnedGames/v1`) capturing all 137 owned games (installed + uninstalled) so AutoCat never misses a title.
   - `[depressurizer]` Configured generic Chrome 131 user agent across WebView window and HTTP clients to prevent Cloudflare/CDN blocks.
6. **[depressurizer] (projects/depressurizer) W.55f — Modular SCSS Design System & Zero-Warning Gate (Delivered)**:
   - `[depressurizer]` Extracted all inline styles into modular SCSS partials (`_tokens.scss`, `_mixins.scss`, `_components.scss`, `_titlebar.scss`, `depressurizer.scss`).
   - `[depressurizer]` Refactored modals to full accessible dialogs (`role="dialog"`, `aria-modal="true"`, keyboard dismissals), achieving **0 errors and 0 warnings** across `svelte-check`, `vite build`, and `RUSTFLAGS="-D warnings" cargo check`.
7. **[depressurizer] (projects/depressurizer) W.55g — Live AutoCat Execution Feedback & Tauri v2 Capabilities ACL (Delivered)**:
   - `[depressurizer]` Streamed live per-game AutoCat progress from the Tokio worker to the frontend (`autocat://progress` / `AutoCatProgress`) driving both live table row updates (matched by `app_id`) and an in-modal progress bar.
   - `[depressurizer]` Shipped an explicit Tauri v2 capabilities ACL (`src-tauri/capabilities/default.json`: `core:default`, custom-titlebar window controls, `opener:default`) replacing the empty implicit permission set; verified at zero errors and zero warnings across `svelte-check`, `vite build`, and `RUSTFLAGS="-D warnings"`/`cargo clippy`.
8. **[depressurizer] (projects/depressurizer) W.55h — Workbench Table Multiselect & Batch Actions (Delivered)**:
   - `[depressurizer]` Implemented workbench table multiselect (row checkboxes with Select All / Deselect) for batch assign/remove categories, toggle favorites, and toggle hidden titles; verified at zero errors and zero warnings.
9. **[depressurizer] (projects/depressurizer) W.55i — Steam Web API Research & Endpoint Validation (API-Only Architecture)**:
   - `[depressurizer]` Validate the key-only capability set using the `https://steamapi.xpaw.me/` reference: account authorization (user `key` — account-scoped on its own — paired with the account's SteamID64 wherever beneficial, e.g. the required `steamid` on `GetOwnedGames`), full library reads (`IPlayerService/GetOwnedGames` with `include_appinfo` / `include_played_free_games` / `include_family_licenses`), achievements, and store metadata.
   - `[depressurizer]` Determine the concrete collection-customization write path available to a user API key — no `IPlayerService` collections method exists (public or undocumented); probe undocumented endpoints and the Steam cloud-storage namespace (`userdata/<id>/config/cloudstorage/`) — and document findings before implementation.
10. **[depressurizer] (projects/depressurizer) W.55j — Steam Web API Collection Synchronization ("Save to Steam")**:
   - `[depressurizer]` Implement the "Save to Steam" action as an API-only sync of category/favorite/hidden changes through the Steam Web API key — zero local Steam client access, no `save_sharedconfig` writes, no timestamped file backups; and document (UI/docs) desktop Steam-client flakiness as a troubleshooting step (if cloud-synced collections do not stick, fully close the desktop Steam client and re-apply) — advisory only, with no running-instance detection.
11. **[depressurizer] (projects/depressurizer) W.55k — Abandon & Remove Legacy Steam-Client Runtime Integration**:
    - `[depressurizer]` Remove the legacy Steam-client runtime from the new Tauri app — local Steam path autodetection (`paths.rs`), the VDF parser (`vdf.rs`), `save_sharedconfig` writes, and the local-account selection flow — and re-point library loading at the key + SteamID64 Web API pipeline.
    - `[depressurizer]` Replace local-account discovery with explicit Web API account resolution (account-scoped key plus a user-supplied or `ResolveVanityURL`-resolved SteamID64) and update the settings UI accordingly.
    - `[depressurizer]` **Retain** the `legacy/` folder (archived .NET/C# app) as an intentional historical backup and behavioural reference; it is excluded from the shipped build and must not be deleted.
12. **[depressurizer] (projects/depressurizer) W.55l — HowLongToBeat Playtime Enrichment Restoration**:
    - `[depressurizer]` Restore HowLongToBeat metadata (main story / main+extras / completionist playtimes) against a currently active HLTB API, replacing the legacy shut-down endpoint the original app targeted.
    - `[depressurizer]` Resolve entries by Steam `app_id` via the community REST wrapper with a token-gated `howlongtobeat.com/api/find` JSON fallback; surface the times in the workbench table and AutoCat playtime filters.

13. **[Ecosystem] & [depressurizer] (projects/depressurizer) W.55m — Community Health Files Standard & Rollout (Delivered for depressurizer)**:
    - `[Ecosystem]` Authored the binding rule `.agents/rules/community-health-files.md`, the reusable `.agents/templates/` community-health template set, and a self-contained `.github/pull_request_template.md` template (removing the previous workspace-coupled wording).
    - `[depressurizer]` Added root `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `TOS.md`, `CHANGELOG.md`, `GOVERNANCE.md`, and `CITATION.cff`.
    - `[depressurizer]` Added `.github/pull_request_template.md` and YAML issue forms (`config.yml`, `bug_report.yml`, `feature_request.yml`, `autocat-request.yml`); retired the legacy Markdown issue templates and linked all community documents from `README.md`.
    - `[Ecosystem]` Tracked the organization-wide rollout as Workstream **W.56** in `TODO.md`.

---

### 🚀 Sprint 33: [Ecosystem] — Organization Community Health Files Rollout (GitHub Community/Health Documents)
- **Project Identifiers:** `[Ecosystem]` (all `HELIX-Origin` repositories)
- **Target Objective:** Ensure every repository ships the standard, self-contained GitHub community-health documents — `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`, `CHANGELOG.md`, `GOVERNANCE.md`, `CITATION.cff`, conditional `TOS.md`, plus `.github/pull_request_template.md` and YAML issue forms (`.github/ISSUE_TEMPLATE/{config,bug_report,feature_request}.yml`) — all linked from the repository `README.md`, per `.agents/rules/community-health-files.md`. Documents are public-facing and must never reference the private agents ecosystem.

#### 📝 Execution Tasks

1. **[Ecosystem] W.56a — Standard, Rule & Templates (Delivered)**:
   - `[Ecosystem]` Authored `.agents/rules/community-health-files.md` and the reusable `.agents/templates/` community-health set (`contributing`, `code-of-conduct`, `security`, `support`, `privacy`, `changelog`, `governance`, `tos`, `citation.cff`, `pull-request`, `issue-template-config/bug/feature`).
2. **[depressurizer] (projects/depressurizer) W.56b — Community Health Files (Delivered)**:
   - `[depressurizer]` Added the full root community-health file set, `.github` PR + issue templates, retired the legacy Markdown issue templates, and linked everything from `README.md`.
3. **[Ecosystem] W.56c — Agents Ecosystem Knowledge Base (SQLite) — Design & Read-Only Integration (W.57)**:
   - `[Ecosystem]` W.57a — Finalize agents DB design (`.agents/skills/agents-db-design.md`) — universal org/repo support, filesystem-canonical, export/import round-trips. **(Delivered)**
   - `[Ecosystem]` W.57b — Schema prototype + migrations (`.agents/migrations/`). **(Delivered 2026-10-18 — metadata-only schema via `v002__metadata_only.sql`: `artifacts` rebuilt without `content_md`/`frontmatter`/`checksum_fs`, `kind` widened to rule/skill/agent/template/document/fragment, new `metadata_entries` key/value table; `migrate.ts` hardened with per-file applied-tracking, legacy `last_migration` backfill, and `schema_version` recompute — regression fixed where a second run re-applied `v001` and downgraded the version to 1.0.0)**
   - `[Ecosystem]` **(Delivered 2026-10-18)** Locked amendments: **local-only DB lifecycle** — `knowledge.db`/`secure.db` live in `scripts/agents-kb/data/` (next to the CLI, mirroring `logs/`), created by initial setup after cloning (`setup.ts`), gitignored with tracked `README.md`, never tracked/pushed (per-repo data stays solely per repo, locally); **metadata helpers only** — the DBs store metadata *used by* agents/rules/skills/templates (registries, tags, cross-refs, defaults) and never their content (agent tools must see that content on the filesystem at runtime). `kb-config.ts` (`DATA_DIR`/`KB_PATH`/`SECURE_KB_PATH`, `tracked: false`) + `.gitignore` updated; local DB migrated and verified (rerun → 0 applied, 2.0.0); `data/README.md` written.
   - `[Ecosystem]` **(Delivered 2026-10-18)** `.agents/skills/agents-db-design.md` corrected: metadata-helper-only invariant, v002 metadata-only `artifacts` + `metadata_entries` documented, DB → metadata export (no filesystem content regeneration), local-only lifecycle.
   - `[Ecosystem]` **(Delivered 2026-10-18)** W.57c — Read-only DB access with filesystem fallback (no behavior change): `scripts/agents-kb/kb-read.ts` implements `getByKey`/`getByPath`/`list`/`findRefs`/`search` (DB-first with filesystem merge/fallback, alias fallback, both-direction refs, scored search title 3/path 2/tags 1; `tryOpenDb()` never creates the DB and falls back on v1 schema); test body `kb-read.test.ts` (4 assertions) green.
   - `[Ecosystem]` **(Delivered 2026-10-18)** W.57d — Export/sync scripts (`scripts/agents-kb/kb-export.ts`, `scripts/agents-kb/kb-sync.ts`) with deterministic **metadata** export/import round-trips (the DB never regenerates filesystem content): `kb-sync.ts` (fs→DB upsert + soft-delete orphans; idempotent — 88 inserted then 88 unchanged), `kb-export.ts` (DB→deterministic Markdown report `kb-export.md`, 88 artifacts, byte-identical on rerun); npm scripts `sync`/`export`; typecheck clean.
   - `[Ecosystem]` **(Delivered 2026-10-18)** W.57e — Controlled write path with invariant validation: `scripts/agents-kb/kb-write.ts` (`upsertArtifact`/`upsertMetadata`/`softDeleteArtifact` with full invariant validation; `validateInvariants` + `runValidate` CLI; npm `validate`; test body `kb-write.test.ts` green; 88 artifacts validate clean).
   - `[Ecosystem]` **(Delivered 2026-10-18)** W.57f — Fork customization documented: `.agents/rules/workspace.md` "Fork customization" section (slug override via code or `AGENTS_KB_ORG`/`AGENTS_KB_ORG_SLUG`, local-only lifecycle, repo-mapping note, env override list); `defaultOrgSlug()` added to `kb-config.ts`; env vars documented in `scripts/README.md`.
4. **[Ecosystem] (projects/agents) W.58 — Session Handoff Protocol (Permanent `HANDOFF.md` Session-State Ledger) (Delivered, amended 2026-10-18)**:
   - `[Ecosystem]` Author the binding rule `.agents/rules/session-handoff.md`, skill `.agents/skills/session-handoff.md`, template `.agents/templates/handoff-template.md`, and agent playbook `.agents/agents/session-keeper/handoff-writer.md` governing the permanent workspace-root `HANDOFF.md` ledger used to split large sessions.
   - `[Ecosystem]` Lifecycle (amended): `HANDOFF.md` is git-tracked, maintained **incrementally** (created at first worth-carrying milestone, refreshed at every workstream state change, fully rewritten at session end / soft-target posture) → the new session reads it at the very start (right after `AGENTS.md`) → migrates its content into `ROADMAP.md` / `PLAN.md` / `TODO.md` / `BUGS.md` → **refreshes** it (migrated-only state collapses to one-line delivered notes). Never gitignored, never deleted.
   - `[Ecosystem]` **Active self-monitoring (binding)**: context-pressure scoreboard (token meter, DCP compress count, pressure reminders, ~40-turn / ≥3-workstream fallbacks) with self-executing postures — the agent never waits for the user to flag a limit; a crossed threshold without a refreshed handoff is a protocol failure logged in `BUGS.md`.
   - `[Ecosystem]` **DCP compression coexistence**: `HANDOFF.md` is the disk-durable store independent of compressed conversation memory; compress summaries preserve the handoff's current state; compressing never substitutes for refreshing it.
   - `[Ecosystem]` Fixed max session size (pre-computed, never re-derived): hard ceiling **120k tokens**, soft target **100k tokens**, **60% of window** for windows < 160k, with turn/workstream/compaction fallback heuristics.
   - `[Ecosystem]` Register across `AGENTS.md` (quick reference, workspace layout, session start checklist), `.agents/rules/session-management.md`, `.agents/skills/large-session-management.md`; removed the `.gitignore` rule.
5. **[Ecosystem] (projects/agents) W.59 — Headless CLI Standards: Dual Extension Mechanism, Structured Logging & Folder Documentation** — **(Delivered 2026-10-18)**:
   - `[Ecosystem]` **(Delivered 2026-10-18)** Update `.agents/rules/script-standards.md` with the headless-CLI invariant: no temp scripts (reuse via the modular CLI), dual extension mechanism (first-class TS ESM modules for real logic vs body files for pluggable content), and structured action logging to gitignored `logs/`.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Make `scripts/agents-kb/kb-config.ts` paths lazy/overridable (`kbPath()` + `AGENTS_KB_PATH` env, `TESTS_DIR`) so tests run the real pipeline against throwaway DBs (`DATA_DIR`/`LOGS_DIR` constants and local-only `scripts/agents-kb/data/` paths already in place).
   - `[Ecosystem]` **(Delivered 2026-10-18)** Add logging module `scripts/agents-kb/kb-log.ts` (per-run `logs/<cmd>-<slug>.log`, console+file tee, ISO timestamps, retention pruning to newest 50, never fails the CLI); gitignore rules for `logs/` + `data/` (with tracked `README.md` exceptions) already in place.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Add initial-setup module `scripts/agents-kb/setup.ts` (idempotent: creates `data/` + `logs/`, runs migrations, seeds the organization row) — the post-clone DB bootstrap for the local-only lifecycle.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Add body-file loader `scripts/agents-kb/kb-body.ts` (`loadBodies(dir, suffix)`: ENOENT-safe readdir, sorted, `pathToFileURL` dynamic import, default-or-named `run` export contract).
   - `[Ecosystem]` **(Delivered 2026-10-18)** Refactor `scripts/agents-kb/migrate.ts`: export `runMigrations(logger?)`, direct-run guard (`import.meta.url === pathToFileURL(process.argv[1]).href`), use `kbPath()`, log via `kb-log.ts`, return `{appliedCount, fileCount, schemaVersion}`.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Add test runner `scripts/agents-kb/test.ts` + first body `scripts/agents-kb/bodies/test/migrations.test.ts` (fresh build → 2.0.0, idempotent rerun, metadata-only schema shape, kind check, legacy backfill scope, schema_version downgrade guard); gate = `node scripts/agents-kb/test.ts` green.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Write `scripts/README.md` (purpose, CLI structure, dual extension mechanism, env overrides) and `scripts/agents-kb/logs/README.md` (log purpose, naming, retention, git policy); add `scripts/` to the `AGENTS.md` workspace layout.
6. **[Ecosystem] (projects/agents) W.60 — Project-Local Agents Interoperability & Per-Project Ecosystem Scaffolding**:
   - `[Ecosystem]` **(Delivered 2026-10-18)** Binding rule `.agents/rules/project-agents-interoperability.md` + `AGENTS.md` invariant 15 + quick-reference row + session-start checklist step: discover and honor project-local agents assets (`AGENTS.md`, `.agents/`, `.opencode/`, `.github/copilot-instructions.md`); precedence matrix (org-wide invariants never relaxed; project-local conventions win in-project); ours enhances theirs, never clobbered unprompted; ecosystem isolation preserved.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Optional headless-CLI scaffold feature `scripts/agents-kb/kb-scaffold.ts`: generate complete project-local agents ecosystems (`AGENTS.md`, `.agents/rules|skills|templates|agents/`) with dry-run, idempotent never-clobber merge, and `kb-log.ts` structured logging.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Project-type template suites as body files (`bodies/scaffold/<type>/`): `tauri-desktop`, `jekyll-theme`, `node-ts-cli`, `rust-library`, `docs-site` — engine-tailored starter rules, skills, templates, and agent playbooks.
   - `[Ecosystem]` **(Delivered 2026-10-18)** Scaffold test bodies (dry-run purity, idempotency, never-clobber, engine content) + documentation in `scripts/README.md`; KB records per-repo agent assets (W.57 linkage).

---

### 🚀 [windhawk-themes] (projects/windhawk-themes) — Milestone M.02b: Command Center Suite Polish & Geometry Alignment
- **Project Identifiers:** `[windhawk-themes]` (`projects/windhawk-themes`)
- **Target Objective:** Refine the proven Command Center Windows 11 styling suite (targeting `v0.2.0`) through precise geometry alignments, Quick Settings harmony, snap layout container theming, and tray overflow restoration, with the static gate (`tools/Test-WindhawkStyles.ps1`) holding 0 errors and 0 warnings.

#### 📝 Execution Tasks

1. **[windhawk-themes] (projects/windhawk-themes) Start Menu Geometry**:
   - `[windhawk-themes]` Phone Link companion card flush with menu top; search box left edge flush with pinned apps card; companion toggle flush right.
2. **[windhawk-themes] (projects/windhawk-themes) Action Center Quick Settings Harmony**:
   - `[windhawk-themes]` Harmonize split-button toggle and chevron backgrounds (`SplitL2Button`); eliminate high-contrast blue fallback states.
3. **[windhawk-themes] (projects/windhawk-themes) Taskbar Snap Layout Containers**:
   - `[windhawk-themes]` Theme internal snap containers (`SnapLayoutControl`, `LayoutBorder`) with Command Center glass without breaking layout bounds.
4. **[windhawk-themes] (projects/windhawk-themes) Taskbar Overflow Grid Restoration**:
   - `[windhawk-themes]` Restore frosted glass background and specular border to the system tray overflow flyout.

---

### 🚀 Sprint 31: [helix-gaming-db-00] (projects/helix-gaming-db-00) — Multi-Platform Metadata Ingestion Automation, Volume-Sharded Federation (01, 02, 03), Platform Scrapers & Scheduled Enrichment Pipeline (v1.2.0)
- **Project Identifiers:** `[helix-gaming-db-00]` (`projects/helix-gaming-db-00`), `[helix-gaming-db-01]` (`projects/helix-gaming-db-01`), `[helix-gaming-db-02]` (`projects/helix-gaming-db-02`), `[helix-gaming-db-03]` (`projects/helix-gaming-db-03`)
- **Target Objective:** Develop an automated ingestion suite, multi-repository volume sharding, and scheduled GitHub Actions workflows to progressively expand HELIX Gaming DB to cover every game across all supported platforms (PC storefronts: Steam, GOG, Epic, Itch.io, EA, Ubisoft, Battle.net, Standalone/Patreon; Emulation/Retro: NES, SNES, N64, GB/GBC/GBA, DS, 3DS, GameCube, Wii, Wii U, Switch, PS1, PS2, PS3, PSP, PS Vita, Genesis, Saturn, Dreamcast, Xbox, Arcade/MAME). Rename the core repo to `helix-gaming-db-00`, provision new volume shards `helix-gaming-db-01`, `helix-gaming-db-02`, and `helix-gaming-db-03` with identical autonomous boilerplates and shared `PAT_TOKEN` secrets, and implement multi-repo cycling across client APIs.

```mermaid
flowchart TD
    S31_0["[helix-gaming-db-00] Multi-Repo Sharding (Rename to 00, Create 01, 02, 03, Provision Secrets & Boilerplates)"] --> S31_1["[helix-gaming-db-00] Ingestion Scripts Suite (Steam, GOG, Libretro, ScreenScraper, Patreon)"]
    S31_1 --> S31_2["[helix-gaming-db-00] Batch Runner, Deduplication & Validation Engine"]
    S31_2 --> S31_3["[helix-gaming-db-00] Scheduled Ingestion Workflow (.github/workflows/scheduled-ingest.yml)"]
    S31_3 --> S31_4["[helix-gaming-db-00] Artwork Backfill Workflow (.github/workflows/enrich-artwork.yml)"]
    S31_4 --> S31_5["[helix-gaming-db-00] Multi-Stage Progressive Platform Catalog Rollout across Shards"]
```

#### 📝 Execution Tasks

0. **[helix-gaming-db-00] W.54_shard — Volume-Sharded Multi-Repository Federation, Centralized Docs/Wiki Split & Cloudflare Worker Gateway (00, 01, 02, 03, docs, wiki, api)**:
   - `[docs]` Created dedicated public repository `HELIX-Origin/docs`, provisioned `PAT_TOKEN`, configured GitHub Pages (`docs.helix-origin.club`), migrated multi-project documentation, and set up `remote_theme: HELIX-Origin/helix-jekyll-theme`.
   - `[wiki]` Created dedicated public repository `HELIX-Origin/wiki`, provisioned `PAT_TOKEN`, configured GitHub Pages (`wiki.helix-origin.club`), migrated multi-project technical wikis, and set up `remote_theme: HELIX-Origin/helix-jekyll-theme`.
   - `[helix-gaming-db-00]` Renamed existing GitHub repository `helix-gaming-db` to `helix-gaming-db-00` and updated local directory to `projects/helix-gaming-db-00`.
   - `[helix-gaming-db-00]` Migrated docs to `docs` and wiki to `wiki`, leaving `helix-gaming-db-00` as a pure REST metadata API repository.
   - `[helix-gaming-db-01]` Created public repository `HELIX-Origin/helix-gaming-db-01`, provisioned `PAT_TOKEN`, seeded with boilerplate, schemas, validation scripts, workflows, and i18n locales.
   - `[helix-gaming-db-02]` Created public repository `HELIX-Origin/helix-gaming-db-02`, provisioned `PAT_TOKEN`, seeded with boilerplate, schemas, validation scripts, workflows, and i18n locales.
   - `[helix-gaming-db-03]` Created public repository `HELIX-Origin/helix-gaming-db-03`, provisioned `PAT_TOKEN`, seeded with boilerplate, schemas, validation scripts, workflows, and i18n locales.
   - `[helix-gaming-db-00]` Implemented cross-shard deduplication & ownership verification in `scripts/verify-pr.mjs` across all 4 shard repositories and open PRs (failing PR if metadata already exists in a sibling shard).
   - `[helix-gaming-api]` Deployed Cloudflare Worker Gateway (`helix-gaming-api` v2.0) on `api.helix-origin.club` supporting Mode 2 Unified Gateway (`/api/v{1,2,3}/...`) and Mode 1 Direct Shard Proxy (`/helix-gaming-db-{NN}/...`).
   - `[universal-game-launcher]` Updated `src/lib/plugins/metadata/helix-db.ts` to seamlessly query the Unified Gateway and cycle through shards (`helix-gaming-db-00`, `01`, `02`, `03`).
   - `[Ecosystem]` Purged `docs/` folders and disabled GitHub Pages across `universal-game-launcher`, `nh-reader`, `windhawk-themes`, and `ffxiv-config`.
0b. **[Ecosystem] W.54_badges — Universal HTML Badge Standards Migration**:
   - `[Ecosystem]` Established binding HTML Badge Standard across `.agents/rules/documentation-standards.md`, `.agents/skills/gfm-content.md`, `AGENTS.md`, and `.github/copilot-instructions.md`, requiring raw HTML `<a><img src="..." alt="..." height="20" /></a>` with explicit `height="20"` to prevent badge stretching and layout shift.
   - `[Ecosystem]` Converted badges across all project READMEs (`docs`, `wiki`, `helix-origin.github.io`, `helix-jekyll-theme`, `universal-game-launcher`, `nh-reader`, `theme-toolkit`, `windhawk-themes`, `ffxiv-config`, `helix-gaming-db-00` through `03`, and workspace root) to compliant HTML badges.
1. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54a — Platform Ingestion Scripts Suite (`scripts/ingest/`) (Delivered)**:
   - `[helix-gaming-db-00]` Created `scripts/ingest/ingest-steam.mjs`: Steam App Details & Store API scraper extracting title, synopsis, creators, tags, release dates, screenshots, videos, and 600×900 capsule artwork with cross-shard sibling developer deduplication.
   - `[helix-gaming-db-00]` Created `scripts/ingest/ingest-gog.mjs`: GOG Catalog v1 & Product Details scraper extracting DRM-free metadata and cover art.
   - `[helix-gaming-db-00]` Created `scripts/ingest/ingest-libretro-rdb.mjs`: Libretro OpenVGDB database parser mapping canonical titles to Libretro Thumbnails CDN assets (Named_Boxarts, Named_Snaps, Named_Titles).
   - `[helix-gaming-db-00]` Created `scripts/ingest/ingest-patreon-itch.mjs`: Scraper for independent, Patreon, and itch.io creations with automatic mature tag detection and routing to v2 and v3 tiers.
1b. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54l — Rate-Limited Retro & Arcade Metadata Extractor (`scripts/ingest/ingest-screenscraper.mjs`)**:
   - `[helix-gaming-db-00]` Create `scripts/ingest/ingest-screenscraper.mjs`: rate-limited retro and arcade metadata extractor for titles missing from the other platform scrapers.
2. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54b — Batch Runner, Deduplication & Validation Pipeline (`scripts/ingest/run-batch.mjs`) (Delivered)**:
   - `[helix-gaming-db-00]` Authored `run-batch.mjs` orchestrating multi-platform batch ingestion with CLI args (`--platform=<id>`, `--limit=<n>`, `--shard=<00|01|02|03>`), cross-shard slug deduplication, and automated `build-search-index.mjs` compilation.
   - `[helix-gaming-db-00]` Enforced strict schema validation and automated PR verification (`npm test`) on all newly emitted payloads across all shards.
3. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54c — High-Frequency Staggered Ingestion GitHub Actions Workflow (`.github/workflows/scheduled-ingest.yml`) (Delivered)**:
   - `[helix-gaming-db-00..03]` Deployed automated ingestion batches running **4x daily per shard** (16 runs/day org-wide) on a staggered non-overlapping rotation (`00` at 00:15/06:15/12:15/18:15 UTC, `01` at 01:15/07:15/13:15/19:15 UTC, `02` at 03:15/09:15/15:15/21:15 UTC, `03` at 04:15/10:15/16:15/22:15 UTC).
   - Staggering by 75–90 minutes with non-zero minute offsets prevents race conditions, stale metadata checks, Steam/Cloudflare rate limiting, and GitHub Actions top-of-hour queues.
   - Enforced explicit `PAT_TOKEN` push authentication (`https://x-access-token:${PAT_TOKEN}@github.com/${GITHUB_REPOSITORY}.git`) and script environment variables, guaranteeing write permissions on protected branches.
4. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54d — High-Frequency Staggered Artwork Health Workflow (`.github/workflows/enrich-artwork.yml`) (Delivered)**:
   - `[helix-gaming-db-00..03]` Deployed artwork enrichment running **2x daily per shard** (8 runs/day org-wide) on a staggered schedule (`00` at 01:45/13:45 UTC, `01` at 04:45/16:45 UTC, `02` at 07:45/19:45 UTC, `03` at 10:45/22:45 UTC) with `PAT_TOKEN` push auth, completely isolated from ingestion runs.
5. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54e — Multi-Stage Progressive Platform Catalog Rollout across Shards (Active)**:
   - `[helix-gaming-db-01]` Delivered Phase 1 Expansion: Top PC Indie & Digital Hits (78 games & 80 developers in `v2`, 100% verified).
   - `[helix-gaming-db-02]` Delivered Phase 2 Expansion & Retro 3D Classics: SNES, Genesis, NES, PS1, N64, GBA, PS2, GameCube, Dreamcast, Wii, PSP, DS (81 games & 32 developers in `v2`, 100% verified).
   - `[helix-gaming-db-03]` Delivered Phase 3 Expansion: Acclaimed Visual Novels & Dedicated Adult Creations (37 games & 19 developers in `v2`, 19 titles in `v3`, 100% verified).
   - `[helix-gaming-db-00]` Core Catalog & Cross-Shard Multi-Platform Expansion: 80 flagship AAA & PC titles in `v2`, 16 in `v3`, achieving **276 unique verified games**, **35 v3 adult titles**, and **178 developers** across active volume shards with 0 schema validation errors.
   - `[helix-gaming-db-00]` Phase 5 Expansion: Long-Tail Storefronts & Retro Arcade (Epic, EA, Ubisoft, Battle.net, Arcade) (~1,000+ games).
   - `[helix-gaming-db-00]` Dynamic Sharding Policy: Symmetrical horizontal partitioning into sequential shards (`helix-gaming-db-04`, `05`, ...) whenever any shard approaches storage limits, discovered dynamically by clients without app redeployment.
6. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54f — Outdated Information & Artwork Refresh Pipeline (`check-drift.mjs` & `.github/workflows/update-metadata-drift.yml`)**:
   - `[helix-gaming-db-00]` Create `scripts/ingest/check-drift.mjs` detecting outdated synopses, changed release dates, updated Steam capsules/heroes, and 404 image URLs.
   - `[helix-gaming-db-00]` Deploy `.github/workflows/update-metadata-drift.yml` running bi-weekly drift scans and opening automated refresh PRs for actively updated games.
7. **[helix-gaming-db-00] & [universal-game-launcher] W.54g — Library-Driven Internationalization (i18next) & App Localization Integration (Delivered)**:
   - `[helix-gaming-db-00]` Integrate `i18next` library (`scripts/i18n/index.mjs`) for dynamic taxonomy resolution, language negotiation, and ISO 639-1 / BCP 47 fallback chains.
   - `[helix-gaming-db-00]` Author complete taxonomy dictionaries across 12 primary languages (`locales/{lang}/genres.json`, `categories.json`, `platforms.json`, `common.json`, and `app.json` for `en`, `ja`, `zh-CN`, `zh-TW`, `es`, `fr`, `de`, `it`, `pt-BR`, `ru`, `ko`, `pl`).
   - `[helix-gaming-db-00]` Update `scripts/build-search-index.mjs` to bundle `app` UI strings into `/api/v2/i18n/{code}/bundle.json` and emit `/api/v2/i18n/{code}/app.json`.
   - `[helix-gaming-db-01, 02, 03]` Symmetrically sync `locales/` and i18n scripts across all volume shards.
   - `[universal-game-launcher]` Replace hand-rolled hard-coded `LOCALES` system with `i18next` library, dynamically loading UI strings and taxonomy from `helix-gaming-db` API with offline caching.
8. **[helix-gaming-db-00] (projects/helix-gaming-db-00) W.54h — Multi-Repository Volume Sharding, Cross-Shard PR Deduplication & Shard Cycling Framework (Delivered)**:
   - `[helix-gaming-db-00]` Architect multi-repo volume sharding and cycling framework (`/api/v2/federation/index.json` and `shards.json`) to prevent GitHub free user storage and file count ceilings.
   - `[helix-gaming-db-00]` Purge Jekyll documentation and wiki out of `helix-gaming-db-00` into dedicated `docs` and `wiki` repositories, maintaining `00` as a pure REST API.
   - `[helix-gaming-db-00]` Implement cross-shard deduplication & ownership verification in `scripts/lib/cross-shard-dedup.mjs`, `scripts/validate.mjs`, and `scripts/verify-pr.mjs` checking both committed code and open PRs across all shard repositories.
   - `[helix-gaming-db-00]` Implement shard cycling PR router (`scripts/lib/shard-router.mjs` and `api/v2/contribute/router.json`) to target owner repos for updates and cycle new metadata PRs to the first shard without code or PR collisions.
   - `[helix-gaming-db-01, 02, 03]` Seed public repositories `helix-gaming-db-01`, `02`, `03` with identical pure API boilerplate, schemas, validation scripts, workflows, and i18n locales.
   - `[universal-game-launcher]` Implement dynamic federation discovery in `src/lib/plugins/metadata/helix-db.ts` (`getActiveShards()`) querying `/api/v2/federation/shards.json` with SQLite KV fallback to automatically discover new shards (`00` through `03` and future sequential shards).
9. **[Ecosystem] (projects/agents) W.54i — Automated Secret & PAT Replication Across Projects (Delivered)**:
   - `[Ecosystem]` Replicate shared legacy `PAT_TOKEN` secret across all organization repositories via `gh secret set`.
   - `[agents]` Protect `.env` in root `.gitignore` and save `PAT_TOKEN` / `GITHUB_TOKEN` to local untracked `.env` file for agent automation.
   - `[agents]` Create `provision-repo-secrets.ps1` helper script to instantly provision new repositories as they are created.
10. **[helix-gaming-db-00] & [Ecosystem] W.54j — Cloudflare Edge Protection, Automated GitHub Webhooks (`/_webhook/github`) & Unified Client / Documentation Synchronization (Delivered)**:
   - `[helix-gaming-api]` Configured Cloudflare rate-limiting rules (100 req/min for general endpoints, 20 req/min for bulk endpoints).
   - `[helix-gaming-db-00..03]` Created and verified GitHub push webhooks (`https://api.helix-origin.club/_webhook/github`) on all database shards (`helix-gaming-db-00`, `01`, `02`, `03`) with automated cache purging.
   - `[universal-game-launcher]` Updated client `src/lib/plugins/metadata/helix-db.ts` to aggregate multi-shard search indices, prioritize direct shard proxies, and cache data persistently in SQLite KV storage.
   - `[docs] & [wiki]` Updated centralized documentation (`docs`) and technical wiki (`wiki`) to detail rate limiting rules, webhooks, multi-shard search aggregation, and the dynamic `i18next` architecture.
11. **[docs] & [wiki] W.54k — Centralized Documentation & Wiki Routing Normalization & Front Matter Permalinks Fix (Delivered)**:
    - `[docs]` Fixed project index files (`universal-game-launcher`, `nh-reader`, `ffxiv-config`, `windhawk-themes`) that previously carried erroneous `permalink: /docs/`, causing routing collisions and HTTP 404s on project URLs.
    - `[docs]` Set explicit, predictable permalinks (`/<project>/` for root indices and `/<project>/<article>/` for all sub-articles) across all 56 markdown documentation files.
    - `[docs]` Established unique `title:` identifiers and hierarchical `parent: <Project Documentation>` front matter to prevent cross-project navigation tree collisions in `helix-jekyll-theme`'s `nav.html`.
    - `[wiki]` Fixed technical wiki index files (`universal-game-launcher`, `nh-reader`, `windhawk-themes`) that previously carried conflicting `permalink: /wiki/`.
    - `[wiki]` Normalized permalinks (`/<project>/` and `/<project>/<article>/`), sub-styler paths (`/windhawk-themes/<styler>/overview/`, `configurations/schema/`, `targets/elements/`), and hierarchical parents across all 40 markdown wiki files.
    - `[docs] & [wiki]` Converted internal cross-site links (`/wiki/...` in docs, `/docs/...` in wiki) to explicit, fully-qualified domain URLs (`https://wiki.helix-origin.club/...` and `https://docs.helix-origin.club/...`) and normalized all files to LF line endings.

---

### 🚀 Sprint 28: [universal-game-launcher] (projects/universal-game-launcher) & [Ecosystem] — Organization CI Workflow Standards & Continuous Verification Deployment
- **Project Identifiers:** `[universal-game-launcher]` (`projects/universal-game-launcher`), `[nh-reader]` (`projects/nh-reader`), `[theme-toolkit]` (`projects/theme-toolkit`), `[helix-jekyll-theme]` (`projects/helix-jekyll-theme`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- **Target Objective:** Establish continuous integration (CI) workflows as an organization standard across all active repositories in `HELIX-Origin`. Deploy repo-tailored CI workflows executing frontend type-checks (`svelte-check` / TypeScript), Rust backend compiler checks (`cargo check`, `cargo test --lib`), schema validations, and Jekyll build verification on push and pull requests to prevent regressions. Start with `universal-game-launcher` and progress sequentially across projects.

```mermaid
flowchart TD
    S28_1["[universal-game-launcher] W.51a: CI Workflow Design & Matrix (Frontend + Rust)"] --> S28_2["[universal-game-launcher] W.51b: Verification Gate & Remote Actions Run"]
    S28_2 --> S28_3["[nh-reader] W.51c: Tauri v2 CI Workflow Deployment"]
    S28_3 --> S28_4["[theme-toolkit] W.51d: Theme Studio CI Workflow Deployment"]
    S28_4 --> S28_5["[helix-jekyll-theme] W.51e: Jekyll & Sass CI Workflow Deployment"]
    S28_5 --> S28_6["[helix-origin.github.io] W.51f: Organization Portal CI Deployment"]
```

#### 📝 Execution Tasks

1. **[universal-game-launcher] (projects/universal-game-launcher) W.51a — Tauri v2 CI Workflow Creation (`.github/workflows/ci.yml`) (Done)**:
   - `[universal-game-launcher]` Create `.github/workflows/ci.yml` with dual-stage verification:
     - `frontend`: Node 22, `npm ci`, SvelteKit sync & type-check (`npm run check`).
     - `backend`: Rust stable toolchain on `windows-latest` & `ubuntu-22.04` with GTK/WebKit dependencies, `swatinem/rust-cache`, `cargo check` & `cargo test --lib`.
2. **[universal-game-launcher] (projects/universal-game-launcher) W.51b — Verification Gate & Push to Remote (Done)**:
   - `[universal-game-launcher]` Run local test suites (`npm test`: check, rust, frontend).
   - `[universal-game-launcher]` Commit and push to `main`, verify GitHub Actions run passes cleanly (Run `39016342557` passed 100%).
3. **[nh-reader] (projects/nh-reader) W.51c — Tauri v2 CI Workflow Deployment**:
   - `[nh-reader]` Create `.github/workflows/ci.yml` tailored for nh-reader (`cargo check`, `cargo test`, `npm test`).
4. **[theme-toolkit] (projects/theme-toolkit) W.51d — Theme Studio CI Workflow Deployment**:
   - `[theme-toolkit]` Create `.github/workflows/ci.yml` tailored for theme-toolkit.
5. **[helix-jekyll-theme] (projects/helix-jekyll-theme) W.51e — Jekyll Theme CI Workflow Deployment**:
   - `[helix-jekyll-theme]` Create `.github/workflows/ci.yml` with Ruby / Bundler Jekyll build validation and dart-sass check.
6. **[helix-origin.github.io] (projects/helix-origin.github.io) W.51f — Portal CI Workflow Deployment**:
   - `[helix-origin.github.io]` Create `.github/workflows/ci.yml` with Jekyll portal build validation.

---

## 🔮 Planned Sprints

### ⏳ [nh-reader] (projects/nh-reader) — Post-v0.7.5 / Milestone M13
- **Project Identifier:** `[nh-reader]` (`projects/nh-reader`)
- `[nh-reader]` Tag frequency analytics and local recommendation engine based on reading history.
- `[nh-reader]` Multi-profile library partitions (isolated blacklist/favorite spaces).
- `[nh-reader]` Background auto-update checker and GitHub release notification toasts.
- `[nh-reader]` Unified maintenance scripts standard: ensure all scripts follow canonical `main:sub:option` naming and `.mjs` conventions.

### ⏳ [helix-jekyll-theme] (projects/helix-jekyll-theme) — v1.1.0 Feature Cycle
- **Project Identifier:** `[helix-jekyll-theme]` (`projects/helix-jekyll-theme`)
- `[helix-jekyll-theme]` Native Mermaid diagram client rendering macro (`components/mermaid.html`).
- `[helix-jekyll-theme]` In-page Table of Contents sidebar module resolving `BUG-14`.
- `[helix-jekyll-theme]` Dynamic catalogue filtering scripts for software and theme showcases.

### ⏳ [helix-origin.github.io] (projects/helix-origin.github.io) — Portal v3 Enhancement
- **Project Identifier:** `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- `[helix-origin.github.io]` Live release status widgets dynamically queried via Jekyll GitHub metadata.
- `[helix-origin.github.io]` Dedicated project card and custom 16:9 vector SVG artwork for `depressurizer`.
- `[helix-origin.github.io]` Interactive showcase component consuming the `catalogue` layout.

### ⏳ [theme-toolkit] (projects/theme-toolkit) — Milestone M2 Native Packaging Implementation
- **Project Identifier:** `[theme-toolkit]` (`projects/theme-toolkit`)
- `[theme-toolkit]` Implement `makecab.exe` Diamond Directive File (`.ddf`) engine, Sound Scheme Manager, Wallpaper & Slideshow Studio, Cursor Scheme Inspector, and Color & Visual Style Editor.
- `[theme-toolkit]` Implement macOS native tooling (`macos.rs`): Dynamic Desktop timed/solar HEIC wallpaper generator, system alert `.soundpack` archiver, and cursor bundle packager.
- `[theme-toolkit]` Implement Linux native tooling (`linux.rs`): FreeDesktop Sound Theme audio packager, XDG cursor and icon theme packager, and desktop background XML generator (GNOME, KDE Plasma, XFCE, Cinnamon).
- `[theme-toolkit]` Build the Frontend Studio UI with interactive previews (wallpaper viewport, audio player, animated cursor canvas, real-time color pickers).

### ⏳ [universal-game-launcher] (projects/universal-game-launcher) — Post-v1.4.1 / Milestone M15: Cloud Gaming, Handheld Mode & Large-Library Performance
- **Project Identifier:** `[universal-game-launcher]` (`projects/universal-game-launcher`)
- `[universal-game-launcher]` Cloud Gaming & Streaming Hooks: launch hooks and URI integrations for GeForce NOW, Xbox Cloud Gaming, and Moonlight/Sunshine.
- `[universal-game-launcher]` Gamepad / Handheld Overlay Mode: controller navigation (Big Picture UI) optimized for handhelds (Steam Deck, ROG Ally, Legion Go).
- `[universal-game-launcher]` Automated Emulator Setup presets for standalone emulators (RetroArch, Dolphin, PCSX2, RPCS3).
- `[universal-game-launcher]` Large Library Indexing Optimization: incremental SQLite index tuning for libraries exceeding 10,000 titles.

### ⏳ [docs] & [wiki] (projects/docs & projects/wiki) — Centralized Documentation Expansion
- **Project Identifiers:** `[docs]` (`projects/docs`), `[wiki]` (`projects/wiki`)
- `[docs]` Author comprehensive user manuals for `depressurizer` (AutoCat rules, official Steam Web API integration, VDF backup routines).
- `[docs]` Author user manuals for `theme-toolkit`.
- `[docs] & [wiki]` Author the developer integration guide for `helix-gaming-db` and Universal Game Launcher.

### ⏳ [ffxiv-config] (projects/ffxiv-config) — 8.x Job Updates, Character Configuration Utility & Documentation
- **Project Identifier:** `[ffxiv-config]` (`projects/ffxiv-config`)
- `[ffxiv-config]` Update hotbars, job rotations, and macros for current 8.x jobs.
- `[ffxiv-config]` Author an automated installer / backup utility for character configuration files (`FFXIV_CHR.../ADDON.DAT`, `MACRO.DAT`, `HOTBAR.DAT`).
- `[ffxiv-config]` Expand documentation on `docs.helix-origin.club/ffxiv-config/`.

### ⏳ [docs] & [helix-jekyll-theme] (projects/docs & projects/helix-jekyll-theme) — Wallpapers Gallery Site & Multi-Repo Wallpaper Storage (Future Work)
- **Project Identifiers:** `[docs]` (`projects/docs`), `[helix-jekyll-theme]` (`projects/helix-jekyll-theme`)
- `[helix-jekyll-theme]` Author a new gallery layout (responsive image grid, lightbox, author attribution) in `helix-jekyll-theme` for wallpaper showcasing.
- `[docs]` Serve the wallpapers site from the dedicated docs site (`docs.helix-origin.club`) consuming the new gallery layout.
- `[docs]` Maintain a wallpaper author config file (authors + scan sources) driving automatic population of the wallpaper storage repositories.
- `[docs]` Shard wallpaper storage across multiple repositories, modeled on the `helix-gaming-db-00..03` multi-repo scope.
- `[docs]` Run an ImageMagick conversion pipeline producing true JPEG output at 90% quality (low file sizes, no visible quality loss).
- `[docs]` Keep wallpaper storage a multi-repository scope regardless of hosting platform (free-tier limits); a GitLab migration for improved structural layout may be considered — consideration only until the API subdomain domain setup is solved (domain not registered on GitLab).
- `[docs]` Support wallpaper creator "Passion of Desire" first, pulling free versions only.

---

## ✅ Completed Sprints

### ✅ Sprint 30: [universal-game-launcher] (projects/universal-game-launcher) — Three-Tier REST API Client Integration & Hand-Rolled Catalog Deprecation (v1.4.1)
- **Project Identifiers:** `[universal-game-launcher]` (`projects/universal-game-launcher`)
- ✅ `[universal-game-launcher]` **Three-Tier REST Client Architecture (`metadata-helix`)**: Upgraded `src/lib/plugins/metadata/helix-db.ts` to fully leverage the three-tier REST API (`/api/manifest.json`, `/api/v2/` relational discovery, and `/api/v3/` dedicated adult tier) with dual-tier search index caching (`cachedV2Index`, `cachedV3Index`), rich payload mapping (soundtracks, trailers, user scores), and `include_adult_content` / `api_tier` settings.
- ✅ `[universal-game-launcher]` **Persistent Serverless KV Offline Fallback**: Integrated `api.kvSetJson` and `api.kvGetJson` for multi-day local caching of search indices and game payloads, guaranteeing instant sub-millisecond retrieval and complete offline resilience without network dependencies.
- ✅ `[universal-game-launcher]` **Hand-Rolled Metadata Purge**: Deprecated and deleted all 28 hardcoded per-developer data files (`src/lib/plugins/metadata/developers/*.ts`, 3,000+ lines of static code) in favor of dynamic API resolution; streamlined `developers/index.ts` to retain high-precision studio matching (`detectKnownDeveloper`) and algorithmic candidate validation (`validateMetadataCandidate`, `titlesMatchStrict`).
- ✅ **Verification**: Passed `svelte-check` (0 errors, 0 warnings), `npm run check` (0 errors), and `node scripts/test.mjs frontend` (100% passing).

### ✅ Sprint 29: [helix-gaming-db] (projects/helix-gaming-db) — REST Metadata API Expansion: Three-Tier Endpoints, Contributor Fork/PR Suite, Dedicated Adult (18+) API, Expanded 80-Game Catalog & GitHub Issue Templates (v1.1.0)
- **Project Identifiers:** `[helix-gaming-db]` (`projects/helix-gaming-db`)
- ✅ `[helix-gaming-db]` **Three-Tier Automated Endpoint & Index Generator**: Expanded `scripts/build-search-index.mjs` to generate `/api/manifest.json` (root gateway), `/api/v1/` (flat client tier), `/api/v2/` (relational genres, platforms, tags, developers, publishers, stats, starter templates), and `/api/v3/` (dedicated adult 18+ gaming catalog, search index, developers, and tags).
- ✅ `[helix-gaming-db]` **Contributor Fork/PR Suite & Starter Schemas**: Provided developer starter templates (`api/v2/contribute/templates/game.json`, `developer.json`) and schemas to streamline forking and community pull request submissions.
- ✅ `[helix-gaming-db]` **Curated Catalog Expansion & Validation**: Expanded verified database to 80 games and 42 developers across PC indie gems, adult visual novels, and emulation classics; multi-tier validation (`npm test`) passing with 100% compliance.
- ✅ `[helix-gaming-db]` **GitHub Issue Forms & PR Template Suite**: Authored `.github/ISSUE_TEMPLATE/01_new_game_request.yml`, `02_metadata_correction.yml`, `03_new_developer_request.yml`, `config.yml`, and `pull_request_template.md`.
- ✅ `[helix-gaming-db]` **Automated PR Verification & Issue Triage Workflows**: Authored `scripts/verify-pr.mjs` scanning changed files for schema compliance, slug matching, and HTTPS artwork; deployed `.github/workflows/pr-automation.yml` (automated review verdicts and label management) and `issue-triage.yml`.
- ✅ `[helix-jekyll-theme]` **Documentation & Technical Wiki Sync**: Updated `_docs/endpoints.md`, `_docs/contributing.md`, `_docs/index.md`, and `_wiki/architecture.md` with complete 3-tier REST architecture and diagrams.
- **Project Identifiers:** `[helix-gaming-db]` (`projects/helix-gaming-db`), `[universal-game-launcher]` (`projects/universal-game-launcher`)
- ✅ `[helix-gaming-db]` **Dedicated Gaming Metadata Repository & REST API Architecture**: Scaffolded repository with Draft 2020-12 JSON schemas (`manifest.schema.json`, `game.schema.json`, `developer.schema.json`), automated validation (`scripts/validate.mjs`), and search index generator (`scripts/build-search-index.mjs`).
- ✅ `[helix-gaming-db]` **Static REST v1 Endpoints & Seed Datasets**: Authored 62 curated game payloads (`api/v1/games/*.json`), 28 studio profiles (`api/v1/developers/*.json`), `api/v1/search/index.json`, and `api/v1/manifest.json`.
- ✅ `[helix-gaming-db]` **Jekyll Remote Theme Docs & Technical Wiki**: Deployed documentation portal and wiki powered by `remote_theme: HELIX-Origin/helix-jekyll-theme` with theme-neutral API explorer and contribution guides.
- ✅ `[universal-game-launcher]` **Client Metadata Provider Integration (`metadata-helix`)**: Implemented high-priority client plugin querying `helix-origin.club` with cascade fallback to `helix-origin.github.io` and local offline catalog.
- ✅ **Verification**: Passed schema validation (62 games, 28 developers, 0 errors), `cargo check`, `cargo test` (35 passing), `svelte-check` (0 errors, 0 warnings), and live GitHub Actions CI run `39015195011`.


### ✅ Sprint 26: [universal-game-launcher] (projects/universal-game-launcher) — Universal Core Plugins & Global Helpers Architecture, Authentic Vector SVG Platform Icons, Automatic Metadata Engine & Per-Game Customization (Release v1.4.0)
- **Project Identifiers:** `[universal-game-launcher]` (`projects/universal-game-launcher`)
- ✅ `[universal-game-launcher]` **Universal Core Plugins & Global Helpers Framework (`W.49a–W.49d`)**: Consolidated fragmented platform and metadata plugins into `platform-universal`, `metadata-universal`, `utility-title-normalizer`, and `media-universal` paired with global helper functions (`getAllPlatformSpecs`, `detectPlatformLauncher`, `normalizeGameTitle`, etc.).
- ✅ `[universal-game-launcher]` **Authentic Vector SVG Platform Icons (`PlatformIcon.svelte`) (`W.49e`)**: Rendered custom vector SVG icon variants for all PC game providers and emulation consoles, eliminating generic Unicode glyphs across all views.
- ✅ `[universal-game-launcher]` **Automatic Metadata Cascade & Settings-Only Cache (`W.49c`, `W.49f`)**: Automatic multi-source resolution across Local Inspector, Libretro Thumbnails CDN, Steam Store, GOG Catalog v1 API, Wikipedia/Wikidata MediaWiki API, and PCGamingWiki Cargo; confined refresh/purge controls strictly to `/settings` (`Storage & Cache`).
- ✅ `[universal-game-launcher]` **Per-Game Customization Modal (`⚙ Manage`) (`W.49f`)**: Full per-game editing of Title, Short Description, Developers, Publishers, Release Date, Genres, and Custom Artwork in `/library` with `userEnhanced: true` protection.
- ✅ `[universal-game-launcher]` **Local Client Discovery & Hand-Rolled Developer Catalog (`W.49i`, `W.49j`)**: Native discovery for GOG Galaxy, itch.io Butler, Epic Games, EA Desktop, Ubisoft Connect, Xbox/MS Store, and Battle.net; modular hand-rolled catalog covering 21 studios and indie/Patreon creators with cross-studio mismatch validation.
- ✅ **Verification**: Passed `cargo check`, `cargo test` (35 passing), `svelte-check` (0 errors, 0 warnings), and `npm run build`.
- ✅ `[Universal-Game-Launcher]` **Product Rebranding & Visual Suite (`W.48a–W.48f`)**: Renamed package (`universal-game-launcher`), Rust library (`universal_game_launcher_lib`), and bundle identifier (`org.helixorigin.universal-game-launcher`); authored 16:9 vector banner (`universal-game-launcher.svg`), 256×256 squircle logo, multi-resolution icons, 164×314 BMP3 NSIS `sidebar.bmp`, and 850ms animated splash screen in `+layout.svelte`.
- ✅ `[Universal-Game-Launcher]` **Generic SQLite (`database.sqlite`) & In-Memory KV (`mem_kv`) (`W.48k–W.48t`)**: Standardized on generic `database.sqlite`, purged discontinued offline catalogue tables and binary seeds, tuned SQLite WAL PRAGMAs, decoupled the app from writing to external launcher files, and implemented zero-blur dark purple surfaces (`_tokens.scss`).
- ✅ `[Universal-Game-Launcher]` **Titlebar Navigation, Library-Only Sidebar & Single-Game Showcase (`W.48v–W.48am`)**: Built frameless titlebar navigation (`Dashboard`, `Library`, `Store`, `Social`, `Storage`, `Settings`), confined the collapsible platform/console accordion sidebar strictly to `/library`, and replaced the legacy multi-card grid with a single-game showcase view (hero banner, capsule cover, 10-image screenshot gallery, video trailers, and ambient audio player).
- ✅ `[Universal-Game-Launcher]` **In-App Plugins Framework, Storefront Hub (`/store`) & Social Hub (`/social`) (`W.48ao–W.48az`)**: Consolidated plugins in-app under `src/lib/plugins/`, implemented unified `utility-gamerpower` alerts/deals/patch notes, built the zero-payment Storefront discovery hub (`/store`), and built the cross-platform Social friends & presence hub (`/social`).
- ✅ `[Universal-Game-Launcher]` **EmulationStation Scaffolding & Archived ROM Auto-Extraction (`W.48bb`, `W.48bm`)**: Implemented `scaffold_emulation_folders` (`systeminfo.txt` + `systems.txt`), multi-drive ROM discovery, and automatic `.zip`/`.7z`/`.rar` extraction into `<system_dir>/<CleanTitle>/` with isolated `saves/` and `rom.ini` manifests.
- ✅ `[Universal-Game-Launcher]` **Launcher Client Exclusion, Background Worker (`worker.ts`) & Headless CLI (`--cli`) (`W.48bn–W.48bq`)**: Excluded launcher clients (`Ubisoft Game Launcher`, `upc.exe`, etc.) from game ingestion, offloaded heavy scans to `spawn_blocking` threads and `GlobalBackgroundWorker`, and built `src-tauri/src/cli.rs` (`--cli scan`, `scan-roms`, `scaffold-roms`, `normalize-title`, `inspect-local`, `launchers`).
- ✅ **Verification**: Passed `cargo check`, `cargo test`, `svelte-check` (0 errors, 0 warnings), and `npm run build`.

### ✅ Sprint 24: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Project Script Standards, Manifest Schema 1.12.0 & IDE Untracking (Hotfix v1.3.3)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Aligned package scripts to `main:sub:option` format, untracked `.vscode/` from git index, bumped version to `1.3.3`, and authored release notes `.github/releases/v1.3.3.md`.
- ✅ **Verification**: All 4 test suites passed (`check`, `rust`, `frontend`, `i18n`).

### ✅ Sprint 23: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Cross-Platform Compiler Diagnostic Elimination & Release Pipeline Hardening (Hotfix v1.3.2)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Eliminated POSIX/Windows compiler warnings in `windows.rs` and `detectors.rs`, hardened release workflow semver outputs, and bumped version to `1.3.2`.
- ✅ **Verification**: All 4 test suites passed (`check`, `rust` 43/43, `frontend` 0 errors / 0 warnings, `i18n` 30/30).

### ✅ Sprint 22: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Modular Multi-Platform Free Game Checker, Store Deals Engine, Library Patch Notes & Settings Ergonomics (Patch v1.3.1)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Created modular promotions checkers (`epic.rs`, `steam.rs`, `gog.rs`, `gamerpower.rs`), fixed 100% free discount validation (`discountPrice == 0`), implemented `get_store_deals` and `get_library_patch_notes`, built the 3-tab Dashboard notifications subpage, and added Epic Legendary / EOS overlay management.
- ✅ **Verification**: All 4 test suites passed (`check`, `rust`, `frontend`, `i18n`).

### ✅ Sprint 21: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Two-Tier Data Architecture: In-Memory Serverless Redis-Compatible KV Tier & SQLite Global Persistence Layer (v1.3.0)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Implemented fast in-memory KV engine (`mem_kv`) with TTL expiration and pattern queries backing SQLite `app_kv`, added `src/lib/redis.ts`, resolved Chromium/WebView2 Window Teardown Error 1412 via `IS_QUITTING` and explicit `window.destroy()`, reworked `/storage` into multi-platform storage analytics, and reworked `/` into the Executive Gaming Dashboard.
- ✅ **Verification**: 43/43 Rust unit tests passed, `svelte-check` 0 errors / 0 warnings.

### ✅ Sprint 20: [Ecosystem-Wide] — Multi-Platform Clean Uninstaller Architecture, Windows Uninstall Registry Invariant & Process Termination Standards
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`), `[Theme-Toolkit]` (`projects/Theme-Toolkit`)
- ✅ `[Ecosystem-Wide]` Refactored `NSIS_HOOK_PREINSTALL` and `NSIS_HOOK_PREUNINSTALL` across `.agents/templates/nsis-hooks-template.nsh` and all Tauri v2 apps, created canonical macOS (`uninstall-macos-template.sh`) and Linux (`uninstall-linux-template.sh`) uninstaller templates, and codified standards in `.agents/skills/tauri-desktop-engineering.md`.

### ✅ Sprint 19: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Multi-Platform Launcher Detection, Settings Toggle Guards & Built-in Legendary CLI Integration
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Implemented OS-specific launcher detection, portable/AppData `managed_tools_dir()`, built-in standalone `legendary` CLI downloader and OAuth flow, and `PlatformsSection.svelte` launcher guards.

### ✅ Sprint 18: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Universal Local Metadata & Artwork Caching, In-Memory Fast Lookup, CSP Domain Expansion, and Settings Cache Reset
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Expanded CSP `img-src` in `tauri.conf.json` for store CDNs, implemented persistent artwork disk caching in `art_cache/`, and added `clear_metadata_cache` command and Settings UI reset controls.

### ✅ Sprint 16–17: [Theme-Toolkit] (projects/Theme-Toolkit) & [Ecosystem-Wide] — Theme Toolkit Repository Creation, Base Framework Scaffolding, and Reusable Script Standards
- **Project Identifiers:** `[Theme-Toolkit]` (`projects/Theme-Toolkit`), `[Ecosystem-Wide]`
- ✅ `[Theme-Toolkit]` Created `HELIX-Origin/Theme-Toolkit`, scaffolded Tauri v2 + SvelteKit studio layout, implemented Rust Per-Platform Lib Architecture (`windows.rs`, `macos.rs`, `linux.rs`), and created dedicated theme engineering skills and subagent playbooks.
- ✅ `[Ecosystem-Wide]` Codified Invariant 4 in `.agents/rules/script-standards.md` mandating reusable modular script extensions across all repositories.

### ✅ Sprint 15: [Ecosystem-Wide] & [Theme-Toolkit] (projects/Theme-Toolkit) — GTK Theming Removal, Desktop Theme Engineer Repurposing & Windows Deskthemepack Engineering Suite Planning
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Windhawk-Themes]` (`projects/Windhawk-Themes`), `[Theme-Toolkit]` (`projects/Theme-Toolkit`)
- ✅ `[Ecosystem-Wide]` Purged GTK theming artifacts, created `.agents/skills/windows-deskthemepack-engineering.md`, and planned the cross-platform Theme Toolkit Tauri v2 application.

### ✅ Sprint 13: [Ecosystem-Wide] & [Universal-Game-Launcher] (projects/Universal-Game-Launcher) & [NH-Reader] (projects/NH-Reader) — Ecosystem Scripts Standard, Platform Module Isolation, and Opt-In Code Signing
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`)
- ✅ `[Ecosystem-Wide]` Created `.agents/rules/script-standards.md` and `.agents/templates/cleanup-failed-runs-workflow-template.yml`, isolated platform detectors into `windows.rs`, `macos.rs`, `linux.rs`, and implemented opt-in local code signing (`scripts/sign.mjs`).

### ✅ Sprint 1–12: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Milestones M1–M9 (Foundation through v1.2.0)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- ✅ `[Universal-Game-Launcher]` Delivered Tauri v2 + SvelteKit foundation, multi-platform game discovery (Steam, GOG, Epic, Xbox/AppModel, itch, EA, Ubisoft, Battle.net, Amazon, Rockstar), SCSS design token architecture (`src/styles/`), custom NSIS installer hooks and 164×314 sidebar bitmap, system tray integration, storage manager, custom artwork slots, and two-stage multi-platform GitHub Actions release workflows.

### ✅ [Windhawk-Themes] (projects/Windhawk-Themes) — Sprints 1–3 (Milestones M.01 – M.02b)
- **Project Identifier:** `[Windhawk-Themes]` (`projects/Windhawk-Themes`)
- ✅ `[Windhawk-Themes]` Established static validation gate `tools/Test-WindhawkStyles.ps1` (0 errors, 0 warnings), authored Notification Center styler (`M.02`), refined Start Menu and Taskbar geometry alignments (`M.02b`), and enforced theme-neutral documentation standards (`W.15` / `W.16`).

### ✅ [NH-Reader] (projects/NH-Reader) — Sprints 1–16 (Releases v0.1.0 through v0.7.5)
- **Project Identifier:** `[NH-Reader]` (`projects/NH-Reader`)
- ✅ `[NH-Reader]` Delivered foundation, browse, advanced search query builder, global blacklist stream buffering, SQLite cache, responsive reader, storage budgets & LRU pruning, 18-language localization core, custom title bar, NSIS installer polish, and unified `npm run sign` script.

### ✅ [helix-jekyll-theme] (projects/helix-jekyll-theme) — Phases 1–5 & v1.0.0 Initial Release
- **Project Identifier:** `[helix-jekyll-theme]` (`projects/helix-jekyll-theme`)
- ✅ `[helix-jekyll-theme]` Reorganized layered `_sass/` architecture, precompiled `assets/css/site.css` with Dart Sass, built 100% frontmatter-driven navigation engine, extracted universal navbar (`_includes/components/navbar.html`), unified `remote_theme: HELIX-Origin/helix-jekyll-theme` across all consuming sites, and released `v1.0.0`.

### ✅ [helix-origin.github.io] (projects/helix-origin.github.io) — Portal Modernization & Artwork Suite
- **Project Identifier:** `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- ✅ `[helix-origin.github.io]` Standardized portal landing structure on `helix-jekyll-theme` remote theme and authored custom 16:9 vector showcase artwork suite (`windhawk-themes.svg`, `nh-reader.svg`, `helix-jekyll-theme.svg`, `universal-game-launcher.svg`).

---

## 🛠️ Verification Commands

```powershell
# [universal-game-launcher] (projects/universal-game-launcher)
cargo check --manifest-path "projects/universal-game-launcher/src-tauri/Cargo.toml"
cargo test --manifest-path "projects/universal-game-launcher/src-tauri/Cargo.toml"
node "projects/universal-game-launcher/scripts/test.mjs" frontend build

# [nh-reader] (projects/nh-reader)
node "projects/nh-reader/scripts/test.mjs" all

# [windhawk-themes] (projects/windhawk-themes)
pwsh -NoProfile -File "projects/windhawk-themes/tools/Test-WindhawkStyles.ps1"
```
