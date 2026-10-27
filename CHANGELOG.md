# Changelog

All notable changes to the **HELIX Origin AI Agents Ecosystem & Workspace Governance** repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Windows Game Explorer v2.5.0 Released (`v2.5.0`, commit `c573ce5`, tagged and published)**: Game Explorer Studio
  (`GameExplorerStudio.exe`) hosts Library Manager, Game Catalogue and Configuration. The Game
  Catalogue is a single paged list of every owned storefront game (search; storefront, install-state,
  genre, tag, year, rating, playtime and family filters; title/release/playtime/last-played/storefront/
  size sorting; 12/24/48/96 page sizes; delegated Install and Store page actions) with no details pane
  by design. Sources are read in memory from Steam's Web API or local client, GOG Galaxy, itch butler,
  Xbox `AsyncCache`, Ubisoft Connect's read-only `ownership` + `configurations` caches, an optional
  authenticated legendary cache for Epic, and the installed-store scanners. Cross-store titles
  deduplicate into one row with edition-aware install/store-page popup menus; a single Windows-only gate
  (`StorefrontSource::windowsInstallable` + `FilterWindowsInstallableOwnedGames()`) drops
  console/mobile/macOS/Linux-only editions. `GameExplorerService.exe` runs as a background service with
  a Task Scheduler bootstrap; registration moved to `scripts/register.ps1` / `unregister.ps1`. Install
  location is delegated entirely to each storefront client — the base-folder/`InstallTargets`
  scaffolding was dropped because a store install URI (`steam://install/<appid>`) cannot be pointed at
  a folder. Verified on this machine: 59 owned Ubisoft titles and 250 owned Epic titles beyond the
  installed library; 0 errors / 0 warnings under `/W4 /WX`, 61/61 unit tests. The NSIS license page now
  reads an installer-only copy of the MIT text with unwrapped paragraphs, so rich-edit wrapping fits the
  dialog instead of adding breaks on top of 78-column hard wraps. Version `2.5.0` is stamped in
  `CMakeLists.txt`, the NSIS installer, the changelog and the release notes; planned game relocation and
  in-app install-progress tracking were dropped with the install-location handling (user decision
  2026-10-26), leaving M18 scoped to Windows 10 vs 11 shell compatibility research.
- **Windows Game Explorer Unified CLI Dispatcher**: The four root batch launchers (`build.bat`,
  `release.bat`, `register.bat`, `unregister.bat`) were replaced by one `game-explorer.bat` with
  explicit subcommands (`build`, `test`, `lint`, `package`, `release`, `register`, `unregister`, `sign`,
  `art`, `setup-signing`, `help`). It runs the `scripts/*.ps1` runbooks in the current console (no
  second window), validates script availability, propagates exit codes, and requires an
  already-elevated terminal for registration; shared banners/colours moved to `scripts/_common.ps1`,
  and registration now fails fast with rerun instructions instead of self-elevating. `scripts/lint.ps1`
  adds the workspace zero-warning gate for PowerShell with PSScriptAnalyzer (also enforced by
  `release`). The portable ZIP ships the dispatcher plus `scripts/register.ps1`, `unregister.ps1` and
  `_common.ps1`; the NSIS installer ships and retires the same layout. Verified: `help` exit 0,
  unknown command exit 1, 0 errors / 0 warnings, 61/61 tests, 0 PSScriptAnalyzer diagnostics, clean
  packaging.
- **FFXIV DAT Toolkit (`ffxiv-dat-toolkit`, CLI `fudat`) Captured as a Planned Project**: A new, FFXIV-only utility project was migrated out of `HANDOFF.md` into the authoritative ledgers — `ROADMAP.md` (Planned Org Projects: three-tier architecture and scope boundary), `PLAN.md` (Sprint 38: four delivery phases), `TODO.md` (Workstream W.01 with normalized directives and an atomic checklist), and `BUGS.md` (Domain Constraints: brittle client verification, expansion-era schema volatility, multibyte payloads). Registered in `.agents/registry/projects.json` (`kind: ffxiv-toolkit`) and listed as *planned* in `AGENTS.md`, so the tracking index now shows it with a "repository not cloned locally" status until `projects/ffxiv-dat-toolkit` is scaffolded. Scope is explicitly Final Fantasy XIV only — it is not a generic game-file toolkit.
- **`.opencode/` Ecosystems Reinstated (Workspace Root + All Six Active Projects)**: A self-contained `.opencode/` folder now ships in the workspace root and in `depressurizer`, `ffxiv-config`, `nh-reader`, `theme-toolkit`, `windhawk-themes`, and `windows-game-explorer`. Each contains `opencode.jsonc` (single-model pin `opencode/big-pickle`, provider `policies` that deny every provider and allow only `opencode`, compaction budget `keep 20000` / `buffer 24000`, tool-output caps, image caps, background compaction), `plugins/big-pickle-only.ts` (removes every other provider and model from the catalog and pins the default), `plugins/context-budget.ts` (appends one escalating context-economy hint per request, idempotent across duplicate discovery), and `instructions/opencode-protocols.md` (model rule, context discipline, tool hygiene, git safety, zero-warning verification). Project copies are standalone and never reference the private agents ecosystem. Verified live: the model catalog now lists exactly one model (`opencode/big-pickle`) and the OpenCode log shows both plugins loading with zero errors or warnings. Each copy type-checks with zero diagnostics via a standalone `.opencode/tsconfig.json` and a local `types/opencode-plugin.d.ts` shim for the runtime-provided `@opencode/plugin` module (editors would otherwise report a missing module and implicit `any` parameters).
- **Windows Game Explorer v2.4.0 Workstream Recorded (released)**: Project ledgers, `CHANGELOG.md`, `PLAN.md`, and `HANDOFF.md` now cover the 2.4.0 workstream (FFXIV official source + secondary launcher dropdown, store-artwork exclusivity, rich synopsis formatting, background achievement auto-sync with Config GUI control, background disk-footprint measurement, pruning-crash and heading-parse fixes), the owned-games catalogue (`M17` / `CAT-01`), and the delivered background service (`SVC-01`).
- **Windows Game Explorer Scope & Architectural Invariants**: Codified strict architecture boundaries in `.agents/rules/windows-shell-extension.md`: Windows Game Explorer is an Explorer shell integration and library organizer for local PC games that delegates through official platform clients; cloud gaming and handheld big picture overlays are unsupported; OneDrive is exclusively a write-only backup and disaster recovery destination; cache reset completely purges existing cache and rebuilds fresh metadata from installed games.
- **Windows Game Explorer v2.2.0 Release**: Packaged official `v2.2.0` release assets (`windows-game-explorer-v2.2.0-setup.exe`, `windows-game-explorer-v2.2.0-win64.zip`, `windows-game-explorer-v2.2.0-ROMs-template.zip`) with VNDB Kana API visual novel/adult metadata provider, itch.io storefront scraping, loose aspect ratio validation (0.25f–2.50f covers, 0.80f–4.50f heroes), strict candidate title verification in SteamGridDB/IGDB, cache reset and repopulation engine (`Reset Cache`), and module-anchored portable companion launching.

### Changed
- **Owned-games direction reinstated (supersedes the earlier "drop all owned games" directive):** owned games are supported as a dedicated Catalogue page inside one unified companion GUI (`CAT-01`), tracked as milestone `M17` in the project roadmap. The shell namespace library itself stays installed-games-only; no cloud-gaming or handheld-overlay scope is reintroduced.
- Transitioned root ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`) to serve strictly as entry-point indexes linking to per-project tracking files.
- Retired legacy `.github/*-ARCHIVE.md` files; completed work is maintained as bare-minimal one-line ledger entries, with `CHANGELOG.md` serving as the persistent historical record.
- `.opencode/` configuration is no longer dropped: it returns as the OpenCode-specific layer **on top of** the tool-agnostic `.agents/commands/` runbooks. `AGENTS.md` and `.agents/rules/` stay authoritative and no invariant is relaxed.
- Scaffolding and cataloging expanded with new language and runtime skills (`svelte5-runes.md`, `rust-patterns.md`, `typescript-esm-scripts.md`, `sqlite-in-app.md`, `sveltekit-frontend.md`, `github-actions-ci.md`).
- Dropped references to retired/dropped repositories (`ugl-db-00` through `03`, `ugl-db-ingest`, `docs`, `wiki`, `helix-origin.github.io`, and `helix-jekyll-theme`).

### Removed
- **Windows Game Explorer tag-triggered release workflow**: deleted `.github/workflows/release.yml`.
  It rebuilt only `GameExplorerShell.dll` and `GameExplorerStudio.exe`, so it could never produce the
  manually shipped release set (service, dispatcher, runbooks, NSIS setup, portable ZIP, ROMs
  template). `ci.yml` continues to enforce the zero-warning build, tests and PSScriptAnalyzer lint on
  `main` and pull requests, and `cleanup-failed-runs.yml` remains; releases are packaged with
  `game-explorer.bat release` and published manually. The two historical release failures (`v2.3.0`,
  `v2.4.0`) were the environment-sensitive `PlatformLauncherEmulatorDiscovery` test, fixed at HEAD
  `93eba3e` (latest `main` CI is green), not workflow infrastructure.
