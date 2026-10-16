# TODO.md — HELIX Origin Consolidated Task Ledger

> 📋 **Living Source of Truth**: Actionable task ledger across all projects in the **HELIX Origin** organization.
> Statuses: ⬜ backlog · 🚧 in progress · ✅ done (tracked as `- [ ]` and `- [x]` checkboxes).
> High-level direction lives in [`ROADMAP.md`](./ROADMAP.md), active sprint planning in [`PLAN.md`](./PLAN.md), issues in [`BUGS.md`](./BUGS.md).
> Completed historical workstreams live in [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
> Last updated: 2026-10-16

---

## 📜 Tracking Rules

- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Bare Minimal Ledger**: Completed historical workstreams are recorded as concise single-line entries here. Detailed task checklists, scopes, and implementation notes are archived in [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md) to keep this living document clean and focused.
- **Consistent Formatting**: Maintain consistent formatting and style throughout all documentation to ensure readability and professionalism.
- **Clear Sectioning**: Use clear and descriptive headers for each section to improve navigation and readability.
- **Mandatory Project Tagging**: **Every single task, workstream, and backlog item must explicitly include its project tag** (`[<project-name>]`). Agents must never guess which repository a task belongs to.
- **Active Items First**: The currently active milestone, sprint, task, or workstream must always be placed at the top of the content sections.
- **Regular Updates**: Ensure that this file is regularly updated to reflect the latest developments and changes in the project.
- **Improve User Directives**: Continuously refine and clarify user directives to ensure they are easily understood and actionable.
- **Same-Change Updates**: When a task changes behavior or scope, update this file in the same change.
- **Done Moves Down**: When a task is done, check it off and archive completed sections under Completed Workstreams.
- **Tracking Docs Stay True**: Update `ROADMAP.md`, `TODO.md`, `BUGS.md`, and `PLAN.md` first or in lockstep with code changes.
- **Always Track Everything**: Every new feature request, enhancement, or bug report must be logged before execution.

---

## 🔥 Active Workstreams

### 🎯 [Universal-Game-Launcher] Workstream W.48: Universal Game Launcher Rebranding, Zero Emulation Purge for WinGet, Generic SQLite Persistence & Modern Visual Identity (Release v1.4.0)
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Steam-Vault`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- **Target Components:** `projects/Steam-Vault/package.json`, `projects/Steam-Vault/src-tauri/Cargo.toml`, `projects/Steam-Vault/src-tauri/tauri.conf.json`, `projects/Steam-Vault/src-tauri/src/main.rs`, `projects/Steam-Vault/src-tauri/src/lib.rs`, `projects/Steam-Vault/src-tauri/src/cache.rs`, `projects/Steam-Vault/src-tauri/src/settings.rs`, `projects/Steam-Vault/src-tauri/src/platforms/mod.rs`, `projects/Steam-Vault/src-tauri/src/platforms/detectors.rs`, `projects/Steam-Vault/src-tauri/src/platforms/launchers.rs`, `projects/Steam-Vault/src-tauri/src/platforms/windows.rs`, `projects/Steam-Vault/src-tauri/src/platforms/linux.rs`, `projects/Steam-Vault/src-tauri/src/platforms/macos.rs`, `projects/Steam-Vault/src-tauri/src/commands.rs`, `projects/Steam-Vault/src/routes/+layout.svelte`, `projects/Steam-Vault/src/routes/+page.svelte`, `projects/Steam-Vault/src/routes/library/+page.svelte`, `projects/Steam-Vault/src/routes/storage/+page.svelte`, `projects/Steam-Vault/src/routes/settings/+page.svelte`, `projects/Steam-Vault/src/lib/types.ts`, `projects/Steam-Vault/src/lib/api.ts`, `projects/Steam-Vault/src/lib/i18n/locales/*.ts`, `projects/Steam-Vault/README.md`, `projects/helix-origin.github.io/docs/index.md`, `projects/helix-origin.github.io/docs/assets/images/universal-game-launcher.svg`

**Locked user directives:**
- "Note, using YouTube embed codes for videos in the media carousel should be possible without needing YouTube API keys."
- "However if there is any chance it might get blocked due to content restrictions or anti-bot policies we can drop video support in the media carousel."
- "The 10 image limit is designed to keep the resource usage manageable."
- "We should also make sure the SQLite database file is not using a naming scheme that will get broken by rebranding. Something like database.sqlite or database.db is generic and prevents such problems."
- "We are also going to remove emulation/ROM support since we are planning to publish to the WinGet package repository."
- "Our branding image will be a dark futuristic purple controller image on a futuristic dark purple background."
- "Our sidecar image dimensions should also use the same height and width that the default Tauri v2 NSIS packaging uses. We will need to generate a new sidecar image of course matching our branding concepts."
- "A new banner image for the repo README and documentation will also need to be generated."
- "With this update, we might be able to also implement an animated splash screen transition at app launch. We should consider this if it is feasible."
- "No. Emulation must be removed. No support or mention of it can be allowed since emulation is often used for piracy and may get us blocked from publishing to the WinGet package repository."
- "One more thing, we more or less use the official game launchers to find all owned games for the authenticated user. This allows installing, uninstalling, and launching properly without needing to handle the authentication ourselves."
- "This also allows proper playtime, friend list, and achievement tracking, as well as pretty much everything else that can be supported through this method."
- "Note: This method may end up minimizing the amount of support we end up needing for external metadata providers, and we should keep in mind that right now they are primarily beneficial for manually added games with the addition of being able to enhance the metadata and artwork for all games."
- "Note: If direct launcher integration we are working towards allows us to implement a store tab, we can consider it, but only if all platforms support it."
- "Note: If a store tab is implemented, it will be strictly mandatory that it always passes to the official app when handling orders. No payment processing or orders will ever be done directly in our app."
- "Note: Cloud gaming support can also be considered as a future plan if we can find a way to get an in-app browser window to work with xCloud and GeForce NOW."
- "We should update our agents and tracking files now, since they are the authoritative sources in all of our projects."
- "Wording in the Universal Game Launcher documentation and repo root markdown files should be correct. Referencing Steam and non-Steam shortcuts is redundant since the app now focuses on all popular game launchers with support for manually adding local games."
- "We don't write to Steam anymore. This app is our project. We need to stop writing to external sources and providers and focus on our own universal game launcher."
- "Every feature of the app needs to load instantly so we need a proper way to handle instant data management and persistence. No more waiting for data to load, and no locking the app on tab changes. All tabs should load instantly without having to wait and without locking up the app."
- "Dropping the external metadata providers will help at the very least. So we will drop them in favor of the providers and the web search method for custom art management. But we still need to have a better data management architecture to ensure instant loading and interaction with no UI locking at all."
- "We actually don't need to cache the games ourselves. The platform's own launchers do that. We can minimize how much we are caching by only caching the things we explicitly need to cache."

**Implementation checklist:**
- [x] `[Universal-Game-Launcher]` **Global Rebranding Configuration** — Updated package name (`universal-game-launcher`), product name (`Universal Game Launcher`), Rust library crate (`universal_game_launcher_lib`), app identifier (`org.helixorigin.universal-game-launcher`), and window titles across `package.json`, `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, `main.rs`, and `app.html`.
- [x] `[Universal-Game-Launcher]` **Generic SQLite Persistence Naming (`database.sqlite`)** — Replaced brittle branding database filenames in `src-tauri/src/cache.rs` with generic `database.sqlite` / `database.db` under `universal-game-launcher` data directories, including seamless copy/migration fallback for legacy `steam-vault/metadata.db`.
- [x] `[Universal-Game-Launcher]` **Brand Title Locale Synchronization** — Updated `brandTitle: "Universal Game Launcher"` across all 28 locale translation files in `src/lib/i18n/locales/*.ts`.
- [x] `[Universal-Game-Launcher]` **Branding Vector Artwork & Showcase Banner** — Authored 1920×1080 16:9 dark futuristic purple controller vector SVG banner conforming to `.agents/rules/project-artwork.md` in `projects/helix-origin.github.io/docs/assets/images/universal-game-launcher.svg` and `projects/Steam-Vault/static/universal-game-launcher.svg`.
- [x] `[Universal-Game-Launcher]` **Vector Logo & Multi-Resolution App Icon Suite** — Designed 256×256 vector squircle logo (`static/logo.svg`) with dark futuristic purple gamepad and neon violet/cyan trims; generated complete multi-platform icon suite (`icon.png`, `128x128@2x.png`, `128x128.png`, `64x64.png`, `32x32.png`, `icon.ico`, `tray-icon.png`, `StoreLogo.png`, `Square*Logo.png`, and `favicon.png`) via ImageMagick (`magick`).
- [x] `[Universal-Game-Launcher]` **Tauri v2 NSIS Sidebar Bitmap Specification** — Designed and generated `src-tauri/windows/sidebar.bmp` with exact standard dimensions **164 × 314 pixels** in BMP3 format matching default Tauri v2 NSIS packaging specifications.
- [x] `[Universal-Game-Launcher]` **Animated Splash Screen Transition** — Implemented pulsing dark futuristic purple controller splash transition in `src/routes/+layout.svelte` with minimum 850ms duration, smooth scale/fade exit transition, and neon progress bar.
- [x] `[Universal-Game-Launcher]` **Zero Emulation Purge for WinGet Compliance (Backend)** — Deleted `src-tauri/src/metadata/emulation.rs`; removed `Provider::Emulation`; removed `EmulatorConfig` and `Platform::Emulator` from `platforms/mod.rs`, `settings.rs`, `windows.rs`, `macos.rs`, and `linux.rs`; removed `emulator_library_dirs`, `KNOWN_EMULATORS`, `scan_emulator_dir`, `determine_console_platform`, and emulator tests from `detectors.rs`; removed `detect_emulator_installed` from `launchers.rs`; deleted `get_es_de_systems` and `scaffold_es_de_directories` from `commands.rs` and `lib.rs`.
- [x] `[Universal-Game-Launcher]` **Zero Emulation Purge for WinGet Compliance (Frontend)** — Removed `emulator` from `Platform` type, removed `EmulatorConfig` and `EsDeSystemInfo` in `types.ts`; removed `getEsDeSystems` and `scaffoldEsDeDirectories` in `api.ts`; removed `emulator` entries in `library/+page.svelte`, `+page.svelte`, and `storage/+page.svelte`; purged leftover emulator state and scaffolding methods in `settings/+page.svelte` and `PlatformsSection.svelte`.
- [x] `[Universal-Game-Launcher]` **Managed Tools & Storage Paths Migration** — Updated `managed_tools_dir()` in `launchers.rs` and user data directories to `universal-game-launcher` with seamless backward-compatible fallback for legacy `Steam-Vault`.
- [x] `[Universal-Game-Launcher]` **Catalogue Repository Deletion** — Confirmed `Steam-Vault-Catalogue` repository will be permanently deleted rather than archived to prevent organization clutter. Removed all references across workspace tracking docs, architecture diagrams, and portal hub.
- [x] `[Universal-Game-Launcher]` **Native Launcher Integration & Auth Architecture Documentation** — Codified native launcher delegation invariant (`tauri-desktop-engineering.md`) documenting zero credential handling, preservation of official overlays/playtime/achievements, and external metadata provider minimization.
- [x] `[Universal-Game-Launcher]` **Repository README Modernization** — Updated `projects/Steam-Vault/README.md` to reflect Universal Game Launcher branding, banner asset, multi-store architecture, and WinGet compliance.
- [x] `[Universal-Game-Launcher]` **Documentation Terminology & Multi-Launcher Phrasing Alignment** — Eliminated redundant "Steam and non-Steam shortcuts" phrasing across `projects/Steam-Vault/README.md`, `docs/index.md`, `docs/_docs/*.md`, `docs/_wiki/*.md`, and root tracking files; realigned framing around all popular storefront launchers (Steam, Epic, GOG, Xbox, EA, Ubisoft, Battle.net, itch, Amazon) with native support for manually adding local games.
- [x] `[Universal-Game-Launcher]` **Full Test Suite & WinGet Verification** — Run `cargo check`, `cargo test` (41/41 pass), `svelte-check`, and `verify-i18n.mjs`.
- [x] `[Universal-Game-Launcher]` **Discontinued Offline Catalogue Database Purge (Backend)** — Completely purge discontinued offline catalogue tables (`game_catalog`, `catalog_lookups`) from SQLite schema with runtime `DROP TABLE IF EXISTS` migrations; delete embedded binary seed `src-tauri/src/catalog_seed.bin` (363 KB); eliminate catalog structs, seed methods, and defunct `HELIX-Origin/Steam-Vault-Catalogue` network fallback timeouts in `commands.rs` and `cache.rs`.
- [x] `[Universal-Game-Launcher]` **Catalogue Purge (Frontend & IPC Registration)** — Unregister catalog Tauri commands in `src-tauri/src/lib.rs`, remove catalog API endpoints and types in `src/lib/api.ts` and `src/lib/types.ts`, and remove catalog sync/stats controls from `src/routes/settings/+page.svelte` and `src/routes/library/+page.svelte`.
- [x] `[Universal-Game-Launcher]` **Full App Performance & Data Optimization (Instant Loading)** — Tune SQLite database PRAGMAs (`journal_mode = WAL`, `cache_size = -64000`, `synchronous = NORMAL`, `temp_store = MEMORY`, `mmap_size = 268435456`); streamline in-memory serverless Redis KV layer (`mem_kv`) with fast-path library caching (`library:default`) and metadata cache (`mem_meta`) for instant sub-millisecond retrieval; batch reactive artwork updates in `library/+page.svelte`; unblock dashboard mounting in `+page.svelte` from background notification feeds.
- [x] `[Universal-Game-Launcher]` **Performance & Purge Verification Suite** — Verify pristine compilation and test passes across `cargo check`, `cargo test` (40/40 tests pass), `svelte-check` (0 errors, 0 warnings), and `verify-i18n.mjs` (30/30 languages validated).
- [x] `[Universal-Game-Launcher]` **Decouple App from Writing to Steam & External Providers** — Ceased writing to Steam files (`shortcuts.vdf`, `cloud-storage-namespace-1.json`). Persisted collections, categories, custom names, tags, favorites, and shortcuts in local SQLite (`database.sqlite`) and in-memory Redis KV tier (`mem_kv`). Removed process-blocking `ensure_steam_closed()` checks and removed Steam file backup settings.
- [x] `[Universal-Game-Launcher]` **Purge External Metadata Scrapers (PCGamingWiki, Wikipedia, VNDB, IndieDB)** — Removed third-party web scrapers from automatic metadata resolution pipelines. Metadata resolution now relies authoritatively on official native storefront APIs (Steam, GOG, Epic, Itch), local engine inspection, and web search for artwork.
- [x] `[Universal-Game-Launcher]` **Minimal Necessary Caching Architecture (`collections`, `app_kv`, `artwork_cache`)** — Dropped duplicate `games` table from SQLite. Platform storefront launchers cache installed game files on disk; our app persists only collections, custom user overrides (`app_kv`), and artwork mappings (`artwork_cache`). Preloaded collections into `mem_kv` on database initialization for 0ms access.
- [x] `[Universal-Game-Launcher]` **Drop WinGet Publication Plans & Purge Manifest Automation** — Dropped WinGet release pipeline, removed `.github/workflows/publish-winget.yml`, `scripts/generate-winget-manifest.mjs`, `winget/` directory, and `winget:*` package scripts.
- [x] `[Universal-Game-Launcher]` **Steam-Style Title Bar Navigation Menu** — Restructured title bar in `src/routes/+layout.svelte` to host the primary application navigation links (`Dashboard`, `Library`, `Platforms`, `Storage`, `Settings`) directly beside the brand logo with clean uppercase typography and active purple glow.
- [x] `[Universal-Game-Launcher]` **Steam & GOG Left Game List Sidebar** — Re-purposed the global left sidebar into an interactive game launcher list with instant name/platform filter search, fast filter pills (`All`, `Installed`, `★ Favorites`), manual background platform scan button (`↻ Scan`), and live selection tree.
- [x] `[Universal-Game-Launcher]` **Library Dedicated Showcase View & Grid Purge** — Completely eliminated the heavy multi-card grid layout in `src/routes/library/+page.svelte` to prevent composite hangs and missing artwork. Directly showcases the selected title with hero banner, capsule cover, 10-image screenshot media gallery with fullscreen lightbox, meta reference links, game details, storage footprint, and display name manager.
- [x] `[Universal-Game-Launcher]` **Self-Contained Drop-In Plugin Engine** — Built modular plugin engine (`src-tauri/src/plugins/`) loading platforms, metadata providers, and utilities dynamically from drop-in manifests (`index.json`). Implemented GitHub repository entrypoint installer (`install_plugin_package`) and auto-deployed 24 built-in provider plugins.
- [x] `[Universal-Game-Launcher]` **Settings Community & Drop-In Plugins Tab** — Implemented dedicated Plugins panel in `src/routes/settings/+page.svelte` to inspect installed plugins, toggle plugins on/off, install community plugins via GitHub repo / `index.json` URLs, and open the local plugins folder.
- [x] `[Universal-Game-Launcher]` **Drop Hand-Rolled Localization & Adopt System Locale** — Dropped hardcoded 30-language hand-rolled dictionary files and localization verification script (`verify-i18n.mjs`). Adopted out-of-the-box system locale matching (`navigator.language`). Custom localization can be provided via community plugins.
- [x] `[Universal-Game-Launcher-Plugins]` **Dedicated Plugins Repository & Standard Structure** — Created public GitHub repository `HELIX-Origin/Universal-Game-Launcher-Plugins` (`projects/Universal-Game-Launcher-Plugins`) with `.gitattributes`, `.gitignore`, BSD-3 license, `package.json`, and standard `plugins/<category>/<slug>/` layout containing `index.json` and `README.md`.
- [x] `[Universal-Game-Launcher-Plugins]` **Extensive Official Plugins Suite (28 Plugins)** — Authored 11 platform plugins (Steam, GOG, Epic, Itch, Xbox, EA, Ubisoft, Battle.net, Amazon, Rockstar, Standalone) and 17 rich metadata providers (Steam Store, GOG Catalog, Epic Store, Itch Store, SteamGridDB, IGDB, VNDB, IndieDB/ModDB, PCGamingWiki, Wikipedia, MobyGames, RAWG, Giant Bomb, ProtonDB, HowLongToBeat, Metacritic, OpenCritic).
- [x] `[Universal-Game-Launcher-Plugins]` **Standard JSON Schema & User Settings Configuration** — Defined `schemas/plugin.schema.json` with user-configurable settings (`requiresApiKey`, `fields`), platform launch specifications, and artwork templates.
- [x] `[Universal-Game-Launcher-Plugins]` **Continuous Conformance Validation Suite** — Created `scripts/validate.mjs` running schema checks, manifest verification, and documentation enforcement (28/28 valid, 0 errors).
- [x] `[Universal-Game-Launcher]` **Documentation Suite & Wiki Architecture** — Authored `docs/_docs/Plugin-Development.md`, `docs/_wiki/Plugins-Architecture.md`, updated `docs/_docs/Metadata-Providers.md`, and created root `README.md` for `Universal-Game-Launcher-Plugins`.
- [x] `[Universal-Game-Launcher]` **Full Verification Suite** — Validated `node scripts/test.mjs check rust frontend build` in `projects/Steam-Vault` (Rust check PASS, 37 Rust unit tests PASS, frontend type-check 0 errors 0 warnings, static frontend production build PASS).

## ⬜ Backlog / Candidate Tasks

### [NH-Reader] (projects/NH-Reader) — Post-v0.7.5 / M13 Candidates
- [ ] `[NH-Reader]` **Tag Frequency Analytics**: Local reading history analytics showing top consumed tags, artists, and languages.
- [ ] `[NH-Reader]` **Multi-Profile Partitioning**: Allow switching between isolated library/blacklist profile stores.
- [ ] `[NH-Reader]` **Background Update Inspection**: Non-intrusive GitHub release notification check on app launch.

### [helix-docs] (projects/helix-docs) — v1.1.0 Candidates
- [ ] `[helix-docs]` **Mermaid Helper Component**: Client-side rendering helper for legible ` ```mermaid ` fences.
- [ ] `[helix-docs]` **In-Page TOC Module**: Robust sidebar TOC parser resolving `BUG-14`.
- [ ] `[helix-docs]` **Dynamic Catalogue Filters**: Interactive category filtering for software and theme showrooms.

### [Windhawk-Themes] (projects/Windhawk-Themes) — M.04 Candidates
- [ ] `[Windhawk-Themes]` **Theme Catalogue Integration**: Generate Jekyll showcase documentation in `docs/_catalogue/`.
- [ ] `[Windhawk-Themes]` **Full Multi-Mod Windows 11 Verification**: Validate cohesive visual language across 22H2, 23H2, and 24H2.

### [Theme-Toolkit] (projects/Theme-Toolkit) — Candidates (Planned)
- [ ] `[Theme-Toolkit]` **Core Tauri v2 Scaffolding**: Setup Tauri v2 app with SvelteKit frontend and Rust backend.
- [ ] `[Theme-Toolkit]` **Makecab & DDF Packaging Engine**: Rust engine generating Diamond Directive Files (`.ddf`) and executing `makecab.exe`.
- [ ] `[Theme-Toolkit]` **Sound Scheme Manager**: Win32 Sound Event mapping and `.wav` audio preview / bundling.
- [ ] `[Theme-Toolkit]` **Wallpaper & Slideshow Studio**: Desktop background viewport, slideshow interval / shuffle controls, and alignment settings.
- [ ] `[Theme-Toolkit]` **Cursor Scheme Inspector**: 15 standard Win32 cursor role configuration with `.ani` and `.cur` frame previews.
- [ ] `[Theme-Toolkit]` **Color & Visual Style Editor**: Real-time DWM accent colorization and dark/light system mode toggles.

---

## ✅ Completed Workstreams (Bare-Minimal Index)

> 📖 **Full Archive Details**: For complete task checklists, locked user directives, and technical scope notes, see [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [Universal-Game-Launcher] (formerly Steam-Vault) (projects/Steam-Vault)
- **[Steam-Vault] W.47 — Project Script Standards, WinGet Manifest Schema 1.12.0 & IDE Untracking (Hotfix v1.3.3)**: Canonical `main:sub:option` scripts, schema 1.12.0 validation, .vscode untracking, release CI. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.46 — Cross-Platform Compiler Warning Elimination & Hardened WinGet Publishing Pipeline (Hotfix v1.3.2)**: Posix/Windows compiler warnings resolved, standalone WinGet workflow, release v1.3.2. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.45 — Modular Multi-Platform Free Game Checker, Store Deals Engine, Library Patch Notes & Settings Ergonomics (Patch v1.3.1)**: Per-platform checkers, deals engine, patch notes feed, sidebar cog. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.44 — Two-Tier Data Architecture: In-Memory Serverless Redis-Compatible KV Tier & SQLite Global Persistence Layer**: Redis mock in-memory tier and SQLite persistence. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.42 — Multi-Platform Launcher Detection, Settings Toggle Guards & Built-in Legendary CLI**: Detection guards, Legendary OAuth authentication. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.41 — Persistent Local Artwork Cache, In-Memory Fast Lookup, CSP Alignment & Settings Cache Reset**: `art_cache/` local disk cache, CSP `img-src` expansion. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.35 — Multi-Provider Metadata Parity, Lightweight Catalogue Index Manifest, Settings & Per-Game Refresh**: Full metadata synchronization and 30-language localization. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.34 — Library 500 Repair, Steam-Parity Artwork & Custom Display Name Sub-Window, Settings Consolidation**: Restored store export, Steam artwork slot manager. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.33 — Multi-Platform Owned Games Detection, Official & Enhanced Metadata Engine, Interactive Library Grid**: Multi-platform aggregation and per-game management. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.32 — Windows Store & Xbox Game Detection, Custom NSIS Installer, and System Tray Support**: AppModel scan, NSIS mutex hooks, tray minimize. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Steam-Vault] W.18–W.28 — Milestones M1–M9 (Foundation through v1.0.0 Packaging)**: Depressurizer revival, whole library, filter builder, storage manager, custom artwork, VNDB, smart collections, SQLite cache, glassmorphism UI, v1.0.0 release. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [Windhawk-Themes] (projects/Windhawk-Themes)
- **[Windhawk-Themes] W.15 — Command Center Suite Docs Sync (2026-10-13 Refactor)**: Cleaned stale references, synchronized README, static gate 0 errors / 0 warnings. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Windhawk-Themes] W.12 — Command Center — High-Contrast & explorer.exe Crash Fixes**: Confirmed crash caused by external mod; resolved high contrast fallback issues. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Windhawk-Themes] W.11 — Command Center Catalogue — Companion Extras Documentation**: Documented Phone Link and companion integration in docs catalogue. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Windhawk-Themes] W.08 — Site Branding Artwork (logo / icon / favicon)**: Squircle SVG logo, multi-size favicon suite. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Windhawk-Themes] W.04 — Suite Refinements & Geometry Alignment**: Start menu pin centering, companion card alignment. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Windhawk-Themes] Milestones M.01 & M.02 Foundation**: Initial agent ecosystem rules, Notification Center styler with frosted glass and rim highlights. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [NH-Reader] (projects/NH-Reader)
- **[NH-Reader] Milestones M1–M12 & Web Assets (v0.1.0 – v0.7.5)**: Core foundation, browse, search filter drawer, blacklist stream buffering, responsive reader, 18-language localization core, NSIS installer polish, squircle website assets, unified `npm run sign` script. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [helix-docs] (projects/helix-docs)
- **[helix-docs] W.14 — Doc Site Refinements — Catalogue Width & ShareX Copy**: Expanded catalogue min column width to 400px, ShareX workflow docs. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[helix-docs] W.10 — Home Page (vCard Pattern) Documentation**: Modular card authoring guide for landing pages. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[helix-docs] W.06 & W.07 — Sidebar, Mermaid Rendering & Branding Artwork**: Fixed mermaid rendering, SVG squircle logo and multi-size favicon. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[helix-docs] Theme Phases 1–5 & v1.0.0 Release**: Layered SCSS architecture, precompiled Dart Sass CSS, pure frontmatter nav engine, modular cards, universal navbar. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [Theme-Toolkit] (projects/Theme-Toolkit)
- **[Theme-Toolkit] W.39 — Theme Toolkit Repository Creation, Base Framework Scaffolding, and Dedicated Agent Suite**: Tauri v2 app scaffolding, Per-Platform Lib isolation, dedicated agents and rules. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Ecosystem-Wide] & [Theme-Toolkit] W.38 — GTK Theming Removal, Desktop Theme Engineer Repurposing & Windows Deskthemepack Engineering Suite Planning**: Purged GTK theming; pivoted to cross-platform Theme Toolkit and Microsoft `makecab.exe` DDF standards. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [helix-origin.github.io] (projects/helix-origin.github.io)
- **[helix-origin.github.io] W.09 & Portal Modernization**: Remote theme standardization, 16:9 vector showcase artwork integration (`universal-game-launcher.svg`, `nh-reader.svg`, `windhawk-themes.svg`, `helix-docs.svg`). See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).

### [Ecosystem & Infrastructure] (workspace root)
- **[Ecosystem-Wide] W.43 — Multi-Platform Clean Uninstaller Architecture, Windows Uninstall Registry Invariant & Process Termination Standards**: NSIS mutex termination hooks, registry hygiene, macOS/Linux uninstaller templates. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Ecosystem-Wide] W.36 — Ecosystem Scripts Standard, Platform Module Isolation, Opt-In Code Signing, and WinGet Registration**: Canonical `main:sub:option` standard, local code signing, WinGet CI. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Ecosystem] W.21 & W.05 — Agent Governance, Workflow Skills & Template Architecture**: Workspace rules, task decomposition, file editing, shell command management, and tracking ledger templates. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Ecosystem] W.16 — Global Documentation Theme-Neutrality Invariant**: Enforced mod-agnostic and theme-neutral documentation standards across all projects. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
- **[Ecosystem] W.13 — Stale Agents-Ecosystem Reference Cleanup**: Removed internal workspace references from all standalone public repositories. See [`.github/TODO-ARCHIVE.md`](./.github/TODO-ARCHIVE.md).
