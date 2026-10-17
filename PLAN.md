# PLAN.md — HELIX Origin Master Plan & Sprints

> 🎯 **Master Plan**: Active sprint planning, execution architecture, and completed sprint history across all active repositories in the **HELIX Origin** organization.
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (strategic direction), [`TODO.md`](./TODO.md) (executable tasks), and [`BUGS.md`](./BUGS.md) (known issues).
> Historical delivered milestones and task archives live in [`.github/`](./.github/).
> Last updated: 2026-10-16

---

## 📜 Organizational Tracking Contract

- **Single Pane of Glass:** All repository sprint plans are consolidated here at workspace root.
- **100% Active Direction Accuracy:** Active sprints and architectural descriptions must always reflect the current, active direction of all projects with zero contradictions. Superseded tasks or decisions must be updated in place rather than appended as conflicting statements.
- **Zero Non-Organization Mentions:** Only reference active repositories belonging to the `HELIX-Origin` GitHub organization (`helix-docs`, `helix-origin.github.io`, `NH-Reader`, `Universal-Game-Launcher`, `Theme-Toolkit`, `Windhawk-Themes`). Never directly mention external, third-party, or deleted projects/repositories by name.
- **Active Sprints Only in Top Section:** `## 🎯 Active Sprints` contains ONLY currently active sprints. Completed sprints move immediately to `## ✅ Completed Sprints` (newest first).
- **Mandatory Project Tagging Invariant:** Every sprint, workstream, task, and verification command **must explicitly state its current project name and repository path** (`[<project-name>] (<project-path>)`). Unscoped items are strictly prohibited so agents never conflate repositories.

---

## 🎯 Active Sprints

### 🚀 Sprint 26: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Universal Core Plugins & Global Helpers Architecture, Authentic Vector SVG Platform Icons, Automatic Metadata Engine & Per-Game Customization (Release v1.4.0)
- **Project Identifier:** `[Universal-Game-Launcher]`
- **Repository Path:** `projects/Universal-Game-Launcher`
- **Target Objective:** Consolidate fragmented per-platform and per-service plugin files into Universal Core Plugins (`platform-universal`, `metadata-universal`, `utility-title-normalizer`, `media-universal`) paired with Global Helper Modules; replace generic Unicode platform shapes with authentic vector SVG platform/console icons (`PlatformIcon.svelte`); make multi-source metadata and artwork enhancement automatic with cache refresh/purge buttons strictly in `/settings`; and equip the `/library` per-game `⚙ Manage` modal with full title, metadata, and artwork customization.

```mermaid
flowchart TD
    S26_1["[Universal-Game-Launcher] W.49a: Agent Ecosystem & Tracking Normalization"] --> S26_2["[Universal-Game-Launcher] W.49b: Title Normalizer & Local Inspector Backend"]
    S26_2 --> S26_3["[Universal-Game-Launcher] W.49c: Rust Universal Metadata Cascade & IPC Proxy"]
    S26_3 --> S26_4["[Universal-Game-Launcher] W.49d: Frontend Universal Core Plugins & Global Helpers"]
    S26_4 --> S26_5["[Universal-Game-Launcher] W.49e: Authentic Vector SVG Platform Icons (PlatformIcon.svelte)"]
    S26_5 --> S26_6["[Universal-Game-Launcher] W.49f: Per-Game Customization Modal & Settings-Only Cache"]
    S26_6 --> S26_Gate["[Universal-Game-Launcher] W.49g: Verification Gate (CLI, Cargo, Svelte-Check)"]
```

#### 📝 Execution Tasks

1. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49a — Agent Ecosystem & Tracking Ledger Normalization (Completed)**:
   - `[Universal-Game-Launcher]` Synchronize `.agents/skills/universal-game-launcher.md` and `.agents/skills/game-metadata-providers.md` with the actual frameless title bar (`Dashboard`, `Library`, `Store`, `Social`, `Storage`, `Settings` with no right quick-filter bar), `/library`-only conditional left sidebar, `_tokens.scss` dark purple palette, Universal Core Plugins + Global Helpers architecture, and Authentic Vector SVG Platform Icons.
   - `[Universal-Game-Launcher]` Reorganize `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and `.agents/rules/workspace.md` with domain-categorized directives, atomic checklist groups, and zero non-organization project mentions.
2. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49b — Dedicated Title Normalizer Plugin & Local Engine Inspector Backend (Completed)**:
   - `[Universal-Game-Launcher]` Extract title normalization out of `emulation.rs` into `src-tauri/src/plugins/title_normalizer.rs` (`normalize_game_title`, `normalize_rom_title`, `canonical_title_key`) handling article inversion, unified `: ` subtitle separators, promotional/version suffix removal (`Relicts of Aeson`), and compound word splitting (`My Futa Family`).
   - `[Universal-Game-Launcher]` Update `src-tauri/src/metadata/local.rs` and `src-tauri/src/plugins/engine.rs` to inspect 1-level child folders for RPG Maker `System.json` (`"gameTitle"`), support `snake_case` itch.io receipt fields, and exclude `Launcher`, `Legendary`, `broth`, and `downloads` directories.
3. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49c — Rust Universal Metadata Cascade & Native IPC Proxy (In Progress)**:
   - `[Universal-Game-Launcher]` Implement `src-tauri/src/metadata/universal.rs` (`resolve_game_metadata`) executing automatic field-by-field metadata and artwork cascades across Local Inspector, Libretro Thumbnails CDN (`Named_Boxarts`, `Named_Titles`, `Named_Snaps`, `Named_Logos`), Steam Store, GOG Catalog v1 API, Wikipedia + Wikidata MediaWiki API (`P178` developer, `P123` publisher, `P136` genre, `P577` release date), and PCGamingWiki Cargo API.
   - `[Universal-Game-Launcher]` Strip legacy placeholder strings (`"Emulated title for..."`) in `get_cached_game_metadata` and `import_platform_games`, and expose `fetch_external_json` in `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`, and `src/lib/api.ts`.
4. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49d — Frontend Universal Core Plugins & Global Helper Modules (`src/lib/plugins/`)**:
   - `[Universal-Game-Launcher]` Consolidate all 12 platform plugins into `src/lib/plugins/platforms/universal.ts` (`platform-universal`) paired with global helper functions (`getAllPlatformSpecs`, `detectPlatformLauncher`, `installPlatformLauncher`, `getPlatformLaunchSpec`, `getPlatformUris`), and delete the 12 obsolete separate platform plugin files.
   - `[Universal-Game-Launcher]` Consolidate all 11 metadata plugins into `src/lib/plugins/metadata/universal.ts` (`metadata-universal`) paired with global metadata helpers, and delete the 11 obsolete separate metadata plugin files.
   - `[Universal-Game-Launcher]` Create `src/lib/plugins/utility/title-normalizer.ts` (`utility-title-normalizer`) and `src/lib/plugins/media/universal.ts` (`media-universal`), delete obsolete `trailers.ts` and `ambient.ts`, and synchronize `catalog.ts`, `engine.ts`, `index.ts`, `defaults.rs`, and `worker.ts`.
5. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49e — Authentic Vector SVG Platform & Console Icons (`src/lib/components/PlatformIcon.svelte`)**:
   - `[Universal-Game-Launcher]` Create `src/lib/components/PlatformIcon.svelte` rendering authentic vector SVG variants for all PC game providers (`steam`, `gog`, `epic`, `itch`, `xbox`, `ea`, `ubisoft`, `battlenet`, `amazon`, `rockstar`, `standalone`) and emulation consoles (`Nintendo GameCube`, `PlayStation`, `Nintendo 64`, `Super Nintendo`, `Game Boy Advance`, `Nintendo Switch`, `Sega Dreamcast`, etc.).
   - `[Universal-Game-Launcher]` Replace generic Unicode shapes (`♨`, `◈`, `▲`, `●`, `🎲`, etc.) with `<PlatformIcon />` across `+layout.svelte`, `library/+page.svelte`, `+page.svelte` (Dashboard), `store/+page.svelte`, `social/+page.svelte`, `storage/+page.svelte`, and `PlatformsSection.svelte`.
6. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49f — Per-Game Customization Modal & Settings-Only Cache Refresh/Purge**:
   - `[Universal-Game-Launcher]` Remove manual "Refresh Metadata" and "Enhance Metadata" buttons from `src/routes/library/+page.svelte` so cache refresh and purge actions live exclusively in `/settings` (`Storage & Cache` tab).
   - `[Universal-Game-Launcher]` Upgrade the `⚙ Manage` modal in `src/routes/library/+page.svelte` with full per-game customization of Title, Short Description, Developers, Publishers, Release Date, Genres, and Custom Artwork (Portrait Capsule Cover, Hero Wallpaper Banner, Transparent Logo via URL or local file picker).
7. **[Universal-Game-Launcher] (projects/Universal-Game-Launcher) W.49g — Verification Gate**:
   - `[Universal-Game-Launcher]` Run `--cli scan` to verify clean titles (`Relicts of Aeson`, `My Futa Family`, `The Legend of Zelda: The Wind Waker`) and zero duplicate entries, followed by `cargo check`, `cargo test`, `svelte-check`, and `npm run build`.

---

## 🔮 Planned Sprints

### ⏳ [NH-Reader] (projects/NH-Reader) — Post-v0.7.5 / Milestone M13
- **Project Identifier:** `[NH-Reader]` (`projects/NH-Reader`)
- `[NH-Reader]` Tag frequency analytics and local recommendation engine based on reading history.
- `[NH-Reader]` Multi-profile library partitions (isolated blacklist/favorite spaces).
- `[NH-Reader]` Background auto-update checker and GitHub release notification toasts.

### ⏳ [helix-docs] (projects/helix-docs) — v1.1.0 Feature Cycle
- **Project Identifier:** `[helix-docs]` (`projects/helix-docs`)
- `[helix-docs]` Native Mermaid diagram client rendering macro (`components/mermaid.html`).
- `[helix-docs]` In-page Table of Contents sidebar module resolving `BUG-14`.
- `[helix-docs]` Dynamic catalogue filtering scripts for software and theme showcases.

### ⏳ [helix-origin.github.io] (projects/helix-origin.github.io) — Portal v3 Enhancement
- **Project Identifier:** `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- `[helix-origin.github.io]` Live release status widgets dynamically queried via Jekyll GitHub metadata.
- `[helix-origin.github.io]` Interactive showcase component consuming the `catalogue` layout.

### ⏳ [Theme-Toolkit] (projects/Theme-Toolkit) — Milestone M2 Native Packaging Implementation
- **Project Identifier:** `[Theme-Toolkit]` (`projects/Theme-Toolkit`)
- `[Theme-Toolkit]` Implement `makecab.exe` Diamond Directive File (`.ddf`) engine, Sound Scheme Manager, Wallpaper & Slideshow Studio, Cursor Scheme Inspector, and Color & Visual Style Editor.

---

## ✅ Completed Sprints

### ✅ Sprint 25: [Universal-Game-Launcher] (projects/Universal-Game-Launcher) — Product Rebranding, Generic SQLite Persistence, EmulationStation Scaffolding, Background Worker & Headless CLI Foundation (v1.4.0 Phase 1)
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
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

### ✅ [helix-docs] (projects/helix-docs) — Phases 1–5 & v1.0.0 Initial Release
- **Project Identifier:** `[helix-docs]` (`projects/helix-docs`)
- ✅ `[helix-docs]` Reorganized layered `_sass/` architecture, precompiled `assets/css/site.css` with Dart Sass, built 100% frontmatter-driven navigation engine, extracted universal navbar (`_includes/components/navbar.html`), unified `remote_theme: HELIX-Origin/helix-docs` across all consuming sites, and released `v1.0.0`.

### ✅ [helix-origin.github.io] (projects/helix-origin.github.io) — Portal Modernization & Artwork Suite
- **Project Identifier:** `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- ✅ `[helix-origin.github.io]` Standardized portal landing structure on `helix-docs` remote theme and authored custom 16:9 vector showcase artwork suite (`windhawk-themes.svg`, `nh-reader.svg`, `helix-docs.svg`, `universal-game-launcher.svg`).

---

## 🛠️ Verification Commands

```powershell
# [Universal-Game-Launcher] (projects/Universal-Game-Launcher)
cargo check --manifest-path "projects/Universal-Game-Launcher/src-tauri/Cargo.toml"
cargo test --manifest-path "projects/Universal-Game-Launcher/src-tauri/Cargo.toml"
node "projects/Universal-Game-Launcher/scripts/test.mjs" frontend build

# [NH-Reader] (projects/NH-Reader)
node "projects/NH-Reader/scripts/test.mjs" all

# [Windhawk-Themes] (projects/Windhawk-Themes)
pwsh -NoProfile -File "projects/Windhawk-Themes/tools/Test-WindhawkStyles.ps1"
```
