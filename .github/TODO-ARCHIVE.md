# TODO-ARCHIVE.md — HELIX Origin Historical Task Archive

> 🗄️ **Historical Archive Ledger**: Complete archival checklist and implementation details for completed workstreams across the **HELIX Origin** organization (`helix-docs`, `helix-origin.github.io`, `NH-Reader`, `Universal-Game-Launcher`, `Theme-Toolkit`, `Windhawk-Themes`).
>
> For active workstreams, immediate tasks, and backlog candidates, refer to [`TODO.md`](../TODO.md).
> Last updated: 2026-10-16

---

### 🎯 [universal-game-launcher] (`projects/universal-game-launcher`) Workstream W.53: Helix Gaming DB Three-Tier REST API Integration & Hand-Rolled Catalog Deprecation (Release v1.4.1)
- **Project Identifiers:** `[universal-game-launcher]` (`projects/universal-game-launcher`)
- **Target Components:** `src/lib/plugins/metadata/helix-db.ts`, `src/lib/plugins/metadata/developers/`, `src/lib/plugins/metadata/universal.ts`

**Locked user directives (normalized by domain):**
- **Three-Tier REST API Client**: Fully integrate `universal-game-launcher` with the new Three-Tier REST API (`/api/manifest.json`, `/api/v2/` relational discovery, `/api/v3/` dedicated adult tier) deployed on `https://api.helix-origin.club/ugl-db`.
- **Hand-Rolled Metadata Replacement**: Completely replace the 28 hardcoded per-developer static game files in `src/lib/plugins/metadata/developers/*.ts` with dynamic API client calls and local cache.
- **Offline Resilience & KV Persistence**: Guarantee seamless offline capability by caching dual-tier search indices and detailed game payloads via the client's persistent serverless KV tier (`api.kvSetJson` / `api.kvGetJson`).

**Implementation checklist:**
- [x] **[universal-game-launcher] Three-Tier REST Client Implementation (`helix-db.ts`)**: Upgraded `src/lib/plugins/metadata/helix-db.ts` to support `/api/manifest.json`, `/api/v2/` relational search index and games, and `/api/v3/` dedicated adult tier with rich payload mapping (soundtracks, movies, user scores) and configurable settings (`endpoint_url`, `include_adult_content`, `api_tier`).
- [x] **[universal-game-launcher] Dual-Tier Index Caching & Serverless KV Persistence**: Implemented in-memory caching (`cachedV2Index`, `cachedV3Index`) and persistent KV fallback (`api.kvSetJson`, `api.kvGetJson`) with index fallback synthesis when offline.
- [x] **[universal-game-launcher] Hand-Rolled Metadata Purge**: Deleted all 28 redundant static developer files (`bandai-namco.ts`, `bethesda.ts`, `blizzard.ts`, `capcom.ts`, `caribdis.ts`, `cd-projekt.ts`, `dr-pink-cake.ts`, `electronic-arts.ts`, `falcom.ts`, `fromsoftware.ts`, `io-interactive.ts`, `koei-tecmo.ts`, `kompas.ts`, `konami.ts`, `microsoft.ts`, `neyor.ts`, `nintendo.ts`, `nlt-media.ts`, `proxxie.ts`, `remedy.ts`, `rockstar.ts`, `sega-atlus.ts`, `sierra-lee.ts`, `sony.ts`, `spike-chunsoft.ts`, `square-enix.ts`, `ubisoft.ts`, `valve.ts`, saving 3,000+ lines of static code).
- [x] **[universal-game-launcher] Streamlined Studio & Title Validation (`developers/index.ts`)**: Streamlined `developers/index.ts` with lightweight studio profiles preserving `detectKnownDeveloper`, `validateMetadataCandidate`, and `titlesMatchStrict` without hardcoded game arrays.
- [x] **[universal-game-launcher] Universal Waterfall Integration (`universal.ts`)**: Updated `universal.ts` to query `queryHelixGamingDb` with options and removed unused hand-rolled imports.
- [x] **[universal-game-launcher] Verification Gate**: Passed `svelte-check` (0 errors, 0 warnings), `npm run check` (0 errors), and `node scripts/test.mjs frontend` (100% passing).

---

### 🎯 [ugl-db] (`projects/ugl-db`) Workstream W.52: REST Metadata API Expansion — Comprehensive Endpoints, Contributor Fork/PR Tooling, Expanded Catalog & GitHub Issue Templates (Release v1.1.0)
- **Project Identifiers:** `[ugl-db]` (`projects/ugl-db`)
- **Target Components:** `scripts/build-search-index.mjs`, `api/v1/`, `api/v2/`, `api/v3/`, `schemas/`, `.github/ISSUE_TEMPLATE/`, `.github/workflows/`

**Locked user directives (normalized by domain):**
- **Three-Tier REST Architecture**: Expand `ugl-db` into three purpose-built tiers: Root gateway (`/api/manifest.json`), v1 Client API, v2 Relational Discovery & Contributor API, and v3 Dedicated Adult / 18+ Gaming API.
- **Contributor Fork/PR Suite**: Provide starter schemas and developer templates for forking the repository and submitting pull requests.
- **Database Catalog Expansion**: Expand curated catalog to 80 verified titles and 42 developers across PC indie gems, adult visual novels, and emulation classics.
- **Automated PR Reviews & Issue Triage**: Author structured GitHub Issue forms, PR templates, and automated verification workflows (`pr-automation.yml`, `issue-triage.yml`, `verify-pr.mjs`).

**Implementation checklist:**
- [x] **[ugl-db] Three-Tier Endpoint & Generator Suite**: Expanded `scripts/build-search-index.mjs` generating `/api/manifest.json`, `/api/v1/`, `/api/v2/`, and `/api/v3/`.
- [x] **[ugl-db] Contributor Starter Templates & Schemas**: Authored `api/v2/contribute/templates/game.json`, `developer.json`, and schemas.
- [x] **[ugl-db] Curated Catalog Expansion**: Expanded catalog to 80 verified games and 42 developers; schema validation (`npm test`) passing with 100% compliance.
- [x] **[ugl-db] Community Issue Forms & PR Template Suite**: Created `.github/ISSUE_TEMPLATE/` forms and `pull_request_template.md`.
- [x] **[ugl-db] PR Automation & Issue Triage Workflows**: Authored `scripts/verify-pr.mjs`, deployed `.github/workflows/pr-automation.yml` (automated reviews and labels) and `issue-triage.yml`.
- [x] **[helix-docs] Documentation & Technical Wiki Sync**: Updated `endpoints.md`, `contributing.md`, `index.md`, and `architecture.md`.

---

### 🎯 [ugl-db] (`projects/ugl-db`) & [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.50: HELIX Gaming DB REST API Foundation, Static v1 Endpoints, JSON Schemas, Remote Theme Docs / Wiki & UGL Integration (Release v1.0.0)
- **Project Identifiers:** `[ugl-db]` (`projects/ugl-db`), `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `api/v1/`, `schemas/`, `scripts/`, `_config.yml`, `_docs/`, `_wiki/`, `src/lib/plugins/metadata/helix-db.ts`

**Locked user directives (normalized by domain):**
- **Dedicated Gaming Metadata Repository & REST API Architecture**: Establish `ugl-db` as a dedicated repo hosted on GitHub Pages (`/api/v1/`) serving static, cacheable JSON endpoints mimicking a production REST API (`manifest.json`, `search/index.json`, `games/{slug}.json`, `developers/{slug}.json`).
- **Draft 2020-12 JSON Schemas & Automated Validation**: Implement formal schemas for manifests, games, and developers with zero-error validation via `scripts/validate.mjs`.
- **Theme-Neutral Documentation & Technical Wiki**: Deploy portal and technical wiki using `remote_theme: HELIX-Origin/helix-docs` maintaining strict theme-neutrality.
- **Client Integration in Universal Game Launcher**: Integrate `metadata-helix` as a primary high-priority provider querying `helix-origin.club` with cascade fallback to `helix-origin.github.io` and offline cache.

**Implementation checklist:**
- [x] **[ugl-db] Agent Ecosystem Synchronization**: Registered in `AGENTS.md`, `.agents/rules/workspace.md`, and tracking ledgers.
- [x] **[ugl-db] Repository Scaffolding & JSON Schemas**: Initialized repository, authoring `manifest.schema.json`, `game.schema.json`, and `developer.schema.json`.
- [x] **[ugl-db] Static REST v1 Endpoints & Seed Datasets**: Authored 62 curated game payloads, 28 studio profiles, search index, and manifest.
- [x] **[ugl-db] Jekyll Remote Theme Docs & Technical Wiki**: Deployed portal homepage and interactive API explorer with `remote_theme: HELIX-Origin/helix-docs`.
- [x] **[Universal-Game-Launcher] Client Metadata Provider Integration (`metadata-helix`)**: Created `helix-db.ts` wired into `universal.ts` metadata cascade.
- [x] **[Ecosystem] Verification Gate & Quality Assurance**: Passed schema tests, `cargo check`, `cargo test` (35 passing), `svelte-check`, and live deployment.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.49: Universal Core Plugins & Global Helpers Architecture, Authentic Vector SVG Platform Icons, Automatic Metadata Engine & Per-Game Customization (Release v1.4.0)
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `src-tauri/src/metadata/`, `src-tauri/src/plugins/`, `src-tauri/src/commands.rs`, `src/lib/plugins/`, `src/lib/components/PlatformIcon.svelte`, `src/routes/library/`

**Locked user directives (normalized by domain):**
- **Universal Core Plugins & Global Helpers**:
  - Consolidate fragmented per-platform and per-service plugin files into unified Universal Core Plugins (`platform-universal`, `metadata-universal`, `utility-title-normalizer`, `media-universal`) and paired global helper modules (`getAllPlatformSpecs`, `detectPlatformLauncher`, `installPlatformLauncher`, `getPlatformLaunchSpec`, `getPlatformUris`, `normalizeGameTitle`, `normalizeRomTitle`, `canonicalTitleKey`).
- **Title Normalization & Local Engine Inspection**:
  - Extract title normalization into a dedicated utility plugin (`utility-title-normalizer` & `title_normalizer.rs`) handling article inversion, unified subtitle separators, promotional/version noise stripping (`Relicts of Aeson`), and compound word splitting (`My Futa Family`).
  - Accurately inspect 1-level child directories for RPG Maker `System.json` (`"gameTitle"`) and parse `snake_case` itch.io receipts while excluding `Launcher`, `Legendary`, `broth`, and `downloads`.
- **Automatic Metadata Enhancement & Settings-Only Cache**:
  - Provide automatic multi-source metadata and artwork resolution via native Rust `reqwest` cascades (Local Inspector, Libretro Thumbnails CDN, Steam Store, GOG Catalog v1, Wikipedia/Wikidata MediaWiki API, PCGamingWiki Cargo).
  - Confine cache refresh and purge controls strictly to `/settings` (`Storage & Cache`).
- **Per-Game Customization Modal (`⚙ Manage`)**:
  - Provide full editing of Title, Short Description, Developers, Publishers, Release Date, Genres, and Custom Artwork in `/library` with `userEnhanced: true` protection.
- **Authentic Vector SVG Platform Icons (`PlatformIcon.svelte`)**:
  - Render authentic vector SVG platform and emulation console icons across all views, eliminating generic Unicode shapes.
- **Local Client Discovery & Hand-Rolled Developer Catalog**:
  - Implement native client discovery for GOG Galaxy, itch.io, Epic Games, EA Desktop, Ubisoft Connect, Xbox/MS Store, and Battle.net with installed detection and launch delegation.
  - Implement modular hand-rolled metadata catalogs (`src/lib/plugins/metadata/developers/` & `developers.rs`) covering 21 studios and indie/Patreon creators, blocking cross-studio mismatches.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] Agent Ecosystem & Tracking Ledger Synchronization**: Synchronized `.agents/skills/` and root tracking ledgers.
- [x] **[Universal-Game-Launcher] Dedicated Title Normalizer & Local Inspector Backend**: Implemented `title_normalizer.rs` and upgraded `local.rs` / `engine.rs`.
- [x] **[Universal-Game-Launcher] Rust IPC Commands & Placeholder Filtering**: Added `fetch_external_json` and removed placeholder strings.
- [x] **[Universal-Game-Launcher] Frontend Universal Core Plugins & Global Helper Modules**: Created `platform-universal`, `metadata-universal`, `utility-title-normalizer`, and `media-universal`, deleting legacy separate files.
- [x] **[Universal-Game-Launcher] Authentic Vector SVG Platform & Console Icons**: Created `PlatformIcon.svelte` and integrated across all views.
- [x] **[Universal-Game-Launcher] Per-Game Customization Modal & Settings-Only Cache Controls**: Upgraded `⚙ Manage` modal and removed manual refresh buttons from `/library`.
- [x] **[Universal-Game-Launcher] Quality Gate & End-to-End Verification**: Passed `cargo check`, `cargo test` (35 passing), `svelte-check` (0 errors, 0 warnings), and `npm run build`.
- [x] **[Universal-Game-Launcher] Documentation Site & Technical Wiki Modernization**: Updated guides and wiki articles.
- [x] **[Universal-Game-Launcher] Authoritative Local Client Discovery & Metadata Type Sanitization**: Implemented `client_discovery.rs` and filtered non-game media types.
- [x] **[Universal-Game-Launcher] Hand-Rolled Developer & Game Metadata Engine**: Added 21 developer files, hand-rolled titles, and cross-studio validation.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.48: Universal Game Launcher Rebranding, Generic SQLite Persistence, EmulationStation Scaffolding, Background Worker & Headless CLI Foundation (Release v1.4.0 Phase 1)
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- **Target Components:** `projects/Universal-Game-Launcher/package.json`, `projects/Universal-Game-Launcher/src-tauri/Cargo.toml`, `projects/Universal-Game-Launcher/src-tauri/tauri.conf.json`, `projects/Universal-Game-Launcher/src-tauri/src/`, `projects/Universal-Game-Launcher/src/`, `projects/Universal-Game-Launcher/docs/`, `projects/helix-origin.github.io/`

**Locked user directives (normalized by domain):**
- **Identity & Branding**:
  - Rebrand the application to `Universal Game Launcher` (`universal-game-launcher`, crate `universal_game_launcher_lib`, bundle ID `org.helixorigin.universal-game-launcher`) with a dark futuristic purple controller visual identity, 16:9 showcase banner, 164×314 BMP3 NSIS sidebar bitmap, and animated splash screen transition.
  - Eliminate legacy external client file mutations (`shortcuts.vdf`, `cloud-storage-namespace-1.json`); all collections, tags, favorites, and custom overrides persist in our own SQLite database.
  - Drop WinGet publication workflows and external plugin/catalogue dependencies so all plugins live in-app under `src/lib/plugins/`.
- **Persistence & Performance**:
  - Use generic SQLite database naming (`database.sqlite` / `database.db`) paired with an in-memory Redis-compatible KV tier (`mem_kv`) and WAL mode PRAGMAs for sub-millisecond retrieval without caching duplicate storefront game binaries.
  - Offload platform scanning, launcher detection, and metadata tasks onto non-blocking background workers (`src/lib/worker.ts` and Rust `spawn_blocking` threads) and provide a headless CLI engine (`--cli`) so tab changes and scans never lock the UI.
- **Native Launchers, Emulation & Media**:
  - Delegate game launches, installations, uninstallations, cloud saves, overlays, playtime, and achievements to official platform launchers (`steam://`, `goggalaxy://`, `com.epicgames.launcher://`, etc.) without handling user passwords.
  - Support EmulationStation with multi-drive ROM directory autodetection, standardized system folder scaffolding (`scaffold_emulation_folders`), and automatic `.zip`/`.7z`/`.rar` extraction into per-game subfolders with isolated `saves/` directories and `rom.ini` indexing.
  - Enforce a 10-image screenshot gallery limit per game for low memory usage, and support HD video trailers and ambient soundtracks in the library showcase.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Global Rebranding & Artwork Suite**:
  - [x] Updated package/crate/bundle identifiers to `Universal Game Launcher`.
  - [x] Authored 16:9 vector banner (`universal-game-launcher.svg`), 256×256 squircle logo, multi-resolution icon suite, 164×314 BMP3 NSIS `sidebar.bmp`, and 850ms animated splash screen in `+layout.svelte`.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Generic SQLite (`database.sqlite`) & In-Memory KV (`mem_kv`)**:
  - [x] Standardized database persistence on `database.sqlite`, purged discontinued offline catalogue tables, tuned SQLite WAL PRAGMAs, and isolated all collections and shortcuts to internal persistence.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Titlebar Navigation, Library-Only Sidebar & Single-Game Showcase**:
  - [x] Built custom frameless titlebar navigation (`Dashboard`, `Library`, `Store`, `Social`, `Storage`, `Settings`), confined the collapsible platform/console accordion sidebar strictly to `/library`, and built the single-game showcase view (hero banner, capsule cover, 10-image screenshot gallery, video trailers, and ambient audio player).
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) In-App Plugins Framework, Storefront Hub (`/store`) & Social Hub (`/social`)**:
  - [x] Consolidated plugins in-app under `src/lib/plugins/`, implemented unified `utility-gamerpower` alerts/deals/patch notes, built the zero-payment Storefront discovery hub (`/store`), and built the cross-platform Social friends & presence hub (`/social`).
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) EmulationStation Scaffolding & Archived ROM Auto-Extraction**:
  - [x] Implemented `scaffold_emulation_folders` (`systeminfo.txt` + `systems.txt`), multi-drive ROM discovery, and automatic `.zip`/`.7z`/`.rar` extraction into `<system_dir>/<CleanTitle>/` with isolated `saves/` and `rom.ini` manifests.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Launcher Client Exclusion, Background Worker (`worker.ts`) & Headless CLI (`--cli`)**:
  - [x] Excluded launcher clients (`Ubisoft Game Launcher`, `upc.exe`, etc.) from game ingestion, offloaded heavy scans to `spawn_blocking` threads and `GlobalBackgroundWorker`, and implemented `src-tauri/src/cli.rs` (`--cli scan`, `scan-roms`, `scaffold-roms`, `normalize-title`, `inspect-local`, `launchers`).

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.46–W.47: Cross-Platform Compiler Hygiene, Script Standards & IDE Untracking (Hotfixes v1.3.2 – v1.3.3)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Universal-Game-Launcher/package.json`, `projects/Universal-Game-Launcher/.gitignore`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/{windows,detectors,launchers}.rs`, `projects/Universal-Game-Launcher/.github/releases/`

**Locked user directives (normalized by domain):**
- **Script & Repository Hygiene**:
  - Standardize all `package.json` scripts to adhere strictly to the `main:sub:option` command hierarchy.
  - Untrack local IDE configuration directories (`.vscode/`, `.idea/`) and add comprehensive IDE exclusion rules to `.gitignore`.
- **Cross-Platform Compiler Cleanliness**:
  - Eliminate all compiler warnings across Windows, macOS, and Linux targets (`windows.rs` unused imports, `detectors.rs` unused mutability on non-Windows targets, and `launchers.rs` unused parameters).

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Script Hierarchy & Gitignore Cleanup**:
  - [x] Aligned `package.json` scripts to `main:sub:option` hierarchy and untracked `.vscode/` with updated `.gitignore` rules.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Cross-Platform Warning Elimination**:
  - [x] Removed wildcard re-export warning in `windows.rs`, added `#[allow(unused_mut)]` in `detectors.rs`, and prefixed `_mounted_drives` in `launchers.rs`.
  - [x] Verified `cargo check`, `cargo test`, `svelte-check`, and `i18n` suites pass with 0 errors and 0 warnings.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.45: Modular Multi-Platform Free Game Checker, Store Deals Engine & Library Patch Notes (Patch v1.3.1)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Universal-Game-Launcher/src-tauri/src/platforms/promotions/`, `projects/Universal-Game-Launcher/src-tauri/src/commands.rs`, `projects/Universal-Game-Launcher/src/routes/+page.svelte`, `projects/Universal-Game-Launcher/src/lib/components/settings/PlatformsSection.svelte`

**Locked user directives (normalized by domain):**
- **Multi-Platform Giveaways, Deals & Patch Notes**:
  - Provide optional free game giveaway notifications, store deals/promotions, and installed game patch notes across all enabled platforms (`epic.rs`, `steam.rs`, `gog.rs`, `gamerpower.rs`).
  - Strictly validate that free game promotions are 100% free (`discountPrice == 0` with active promotional windows) so discounted non-free games never trigger false-positive giveaway alerts.
  - Organize Dashboard notifications into three dedicated tabs: `Free Games`, `Deals & Promotions`, and `Patch Notes & Updates`, opening store claim links in the user's default browser.
- **Epic Games & Legendary Integration**:
  - Consolidate Epic Games authentication around the built-in Legendary CLI with a native Chrome user-agent for OAuth compatibility and provide a one-click Epic Online Services (EOS) overlay installer in Settings.
- **Release Notes Compliance**:
  - Ensure all GitHub release notes strictly follow `.agents/rules/release-notes.md`.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Promotions, Deals & Patch Notes Backend**:
  - [x] Created modular promotion checkers (`src-tauri/src/platforms/promotions/{epic,steam,gog,gamerpower,mod}.rs`) with strict `discountPrice == 0` validation.
  - [x] Added `get_free_game_promotions`, `get_store_deals`, and `get_library_patch_notes` (Steam News API with BBCode cleaning).
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Dashboard Notifications & EOS Overlay UI**:
  - [x] Built the 3-tab Notifications view (`Free Games`, `Deals & Promotions`, `Patch Notes & Updates`) and added EOS Overlay status detection and installation in `PlatformsSection.svelte`.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) & [NH-Reader] (`projects/NH-Reader`) Workstream W.44: Two-Tier Data Architecture (In-Memory Serverless Redis-Compatible KV Tier & SQLite Global Persistence Layer)
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`), `[Ecosystem-Wide]`
- **Target Components:** `projects/Universal-Game-Launcher/src-tauri/src/cache.rs`, `projects/Universal-Game-Launcher/src-tauri/src/commands.rs`, `projects/Universal-Game-Launcher/src-tauri/src/lib.rs`, `projects/Universal-Game-Launcher/src/lib/redis.ts`, `projects/Universal-Game-Launcher/src/routes/+page.svelte`, `projects/Universal-Game-Launcher/src/routes/storage/+page.svelte`, `projects/NH-Reader/src-tauri/src/lib.rs`

**Locked user directives (normalized by domain):**
- **Two-Tier Cache & Persistence Architecture**:
  - Pair the persistent SQLite database (`database.sqlite`) with a native in-memory serverless Redis-compatible KV tier (`mem_kv` in Rust + `src/lib/redis.ts` in TypeScript) to minimize external API calls and deliver instant UI loads.
- **Settings, Storage & Dashboard Ergonomics**:
  - Use a responsive two-column flex layout (`.settings-columns > .settings-col`) in Settings so cards shrink-wrap their content without dead vertical space.
  - Dedicate `/storage` purely to multi-platform storage usage statistics across all supported platforms and physical drives, while keeping per-game installation folder management inside each game's management view.
  - Design the Dashboard (`/`) as an executive gaming hub featuring KPI metrics, a "Jump Back In" carousel, storefront distribution charts, and drive utilization metrics.
- **Legendary CLI Path & Authentication**:
  - Support custom user-configured Legendary binary paths (`set_legendary_path`), automatic multi-drive binary discovery, and a one-click built-in downloader using the official `https://legendary.gl/epiclogin` OAuth flow.
- **Tauri v2 Window Teardown Standard**:
  - Eliminate Windows Chromium/WebView2 `Error 1412` (`Failed to unregister class Chrome_WidgetWin_0`) on application exit across all Tauri v2 apps and codify the fix in `.agents/skills/tauri-desktop-engineering.md`.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Serverless In-Memory KV & SQLite Schema**:
  - [x] Implemented `mem_kv` (`RwLock<HashMap<String, (String, Option<i64>)>>`) backing SQLite `app_kv` with TTL expiration, pattern queries, and `src/lib/redis.ts` client wrappers (`kv_get`, `kv_set`, `kv_delete`, `kv_has`, `kv_keys`, `kv_mget`, `kv_mset`, `kv_clear_expired`).
  - [x] Added `hero_image`, `logo_image`, and `icon_image` columns to `app_meta` in `cache.rs`.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Dashboard, Storage & Settings Rework**:
  - [x] Built `src/styles/dashboard.scss` and reworked `+page.svelte` into an executive gaming dashboard.
  - [x] Dedicated `/storage` to multi-platform storage statistics and drive metrics, and added `.settings-columns` flex layout in `/settings`.
  - [x] Fixed Legendary OAuth redirect (`https://legendary.gl/epiclogin`) and added custom path configuration and auto-detection.
- [x] **[Ecosystem-Wide] (`projects/Universal-Game-Launcher`, `projects/NH-Reader`) WebView2 Error 1412 Fix**:
  - [x] Added `IS_QUITTING` atomic flag, explicit `window.destroy()` loop before `app.exit(0)`, and `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` in `src-tauri/src/lib.rs`, and codified the standard in `.agents/skills/tauri-desktop-engineering.md`.

---

### 🎯 [Ecosystem-Wide] Workstream W.43: Multi-Platform Clean Uninstaller Architecture, Windows Uninstall Registry Invariant & Process Termination Standards
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`), `[Theme-Toolkit]` (`projects/Theme-Toolkit`)
- **Target Components:** `.agents/templates/nsis-hooks-template.nsh`, `.agents/templates/uninstall-macos-template.sh`, `.agents/templates/uninstall-linux-template.sh`, `projects/Universal-Game-Launcher/src-tauri/windows/hooks.nsh`, `projects/NH-Reader/src-tauri/windows/hooks.nsh`, `projects/Theme-Toolkit/src-tauri/windows/hooks.nsh`, `.agents/skills/tauri-desktop-engineering.md`

**Locked user directives (normalized by domain):**
- **Multi-Platform Uninstaller Lifecycle**:
  - Ensure Tauri v2 standards define proper Windows uninstall registry integration (`UninstallString = "$INSTDIR\uninstall.exe"`) alongside equivalent macOS and Linux uninstaller scripts so uninstallation is never blocked by running processes.
  - Keep `NSIS_HOOK_PREINSTALL` strictly for terminating running processes prior to in-place application updates, and use dedicated `NSIS_HOOK_PREUNINSTALL` and `NSIS_HOOK_POSTUNINSTALL` hooks for uninstallation.

**Implementation checklist:**
- [x] **[Ecosystem-Wide] NSIS Pre-Install vs. Pre/Post-Uninstall Hook Separation**:
  - [x] Updated `.agents/templates/nsis-hooks-template.nsh` and `windows/hooks.nsh` across `Universal-Game-Launcher`, `NH-Reader`, and `Theme-Toolkit` with `NSIS_HOOK_PREINSTALL`, `NSIS_HOOK_PREUNINSTALL` (`taskkill` + handle flush), and `NSIS_HOOK_POSTUNINSTALL`.
- [x] **[Ecosystem-Wide] Canonical macOS & Linux Uninstaller Templates**:
  - [x] Authored `.agents/templates/uninstall-macos-template.sh` and `.agents/templates/uninstall-linux-template.sh` and registered them in `AGENTS.md` and `.agents/skills/tauri-desktop-engineering.md`.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.42: Multi-Platform Launcher Detection, Settings Toggle Guards & Built-In Legendary CLI Integration
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Universal-Game-Launcher/src-tauri/src/platforms/launchers.rs`, `projects/Universal-Game-Launcher/src-tauri/src/commands.rs`, `projects/Universal-Game-Launcher/src/lib/components/settings/PlatformsSection.svelte`

**Locked user directives (normalized by domain):**
- **Cross-Platform Launcher Detection & Toggle Guards**:
  - Detect installed platform launchers across Windows (`.exe` / registry), macOS (`.app` bundles), and Linux (native binaries / Flatpaks) across standard install paths and mounted drives.
  - Guard platform toggles in Settings so uninstalled launchers cannot be enabled accidentally, providing a direct "Download Launcher ↗" action that opens the official storefront download page in the user's browser.
- **Built-In Legendary CLI Support**:
  - Provide out-of-the-box support for the standalone `legendary` CLI binary downloaded on demand into a user-accessible tools directory so Epic Games titles can be authenticated and launched without requiring the Epic Games Launcher client.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Launcher Detector & Managed Tools Directory**:
  - [x] Implemented `src-tauri/src/platforms/launchers.rs` for cross-platform launcher detection (`get_installed_launchers`) and `managed_tools_dir()` resolution.
  - [x] Added on-demand `install_legendary`, `get_legendary_status`, `legendary_login`, and `legendary_logout` commands and wired toggle guards into `PlatformsSection.svelte`.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.41: Persistent Local Artwork Disk Cache, In-Memory Fast Lookup & CSP Alignment
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Universal-Game-Launcher/src-tauri/tauri.conf.json`, `projects/Universal-Game-Launcher/src-tauri/src/cache.rs`, `projects/Universal-Game-Launcher/src-tauri/src/commands.rs`, `projects/Universal-Game-Launcher/src/routes/library/+page.svelte`, `projects/Universal-Game-Launcher/src/routes/settings/+page.svelte`

**Locked user directives (normalized by domain):**
- **Local Artwork Disk Cache & Cache Reset**:
  - Persist downloaded cover, hero, and logo artwork locally on disk (`art_cache/`) backed by an in-memory lookup map (`mem_art`) so library artwork renders in 0ms without repeat CDN requests.
  - Provide cache refresh and reset controls in `/settings` (`Storage & Cache` tab) to clear and rebuild cached metadata and artwork.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Artwork Disk Cache & Settings Cache Controls**:
  - [x] Expanded `img-src` CSP domains in `tauri.conf.json`, implemented `art_cache/` disk persistence and `get_cached_artwork_batch` in `cache.rs`/`commands.rs`, and added cache clear/rebuild controls in `settings/+page.svelte`.

---

### 🎯 [Theme-Toolkit] (`projects/Theme-Toolkit`) & [Ecosystem-Wide] Workstream W.38–W.39: Theme Toolkit Repository Creation, Base Framework Scaffolding & Dedicated Agent Suite
- **Project Identifiers:** `[Theme-Toolkit]` (`projects/Theme-Toolkit`), `[Ecosystem-Wide]`, `[NH-Reader]` (`projects/NH-Reader`), `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Theme-Toolkit/*`, `.agents/rules/theme-engineering-standards.md`, `.agents/templates/nsis-hooks-template.nsh`, `.agents/skills/windows-deskthemepack-engineering.md`, `.agents/skills/macos-theme-engineering.md`, `.agents/skills/linux-theme-engineering.md`, `.agents/agents/desktop-theme-engineer/*`

**Locked user directives (normalized by domain):**
- **Theme Toolkit Scope & Architecture**:
  - Create and scaffold `HELIX-Origin/Theme-Toolkit` (`projects/Theme-Toolkit`) as a standalone Tauri v2 desktop application for authoring, applying, and exporting local desktop themes (wallpapers/slideshows, sound schemes, cursor schemes, and system color palettes) across Windows (`.deskthemepack` via `makecab.exe`), macOS, and Linux without an online store or catalogue.
  - Include a placeholder `docs/README.md` noting that documentation is on hold until core application features mature.
- **Agents Ecosystem Isolation & Standard NSIS Format**:
  - Never store or mention `.agents/`, `AGENTS.md`, or workspace tracking files inside any public project repository.
  - Standardize all Tauri v2 Windows installers on the `NH-Reader` NSIS configuration (`installMode: "both"`, 164×314 BMP3 `sidebarImage`, `windows/hooks.nsh`, 10-language selector).

**Implementation checklist:**
- [x] **[Theme-Toolkit] (`projects/Theme-Toolkit`) Repository & Tauri v2 Framework Scaffolding**:
  - [x] Created `HELIX-Origin/Theme-Toolkit`, scaffolded Tauri v2 + SvelteKit base app, per-platform Rust modules (`windows.rs`, `macos.rs`, `linux.rs`), `.mjs` script runner suite, `cleanup-failed-runs.yml`, and `docs/README.md`.
- [x] **[Ecosystem-Wide] Theme Engineering Rules, Skills & Subagents**:
  - [x] Authored `.agents/rules/theme-engineering-standards.md`, `.agents/skills/windows-deskthemepack-engineering.md`, `.agents/skills/macos-theme-engineering.md`, `.agents/skills/linux-theme-engineering.md`, and `.agents/agents/desktop-theme-engineer/{desktop-theme-engineer,theme-packager,cursor-packager,sound-packager}.md`.
  - [x] Codified Invariant 7 (Agents Ecosystem Isolation) in `AGENTS.md` and `.agents/rules/workspace.md`.

---

### 🎯 [Ecosystem-Wide], [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) & [NH-Reader] (`projects/NH-Reader`) Workstream W.36: Ecosystem Scripts Standard, Per-Platform Rust Modules & Opt-In Code Signing
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`)
- **Target Components:** `.agents/rules/script-standards.md`, `.agents/skills/tauri-desktop-engineering.md`, `.agents/templates/cleanup-failed-runs-workflow-template.yml`, `projects/Universal-Game-Launcher/scripts/*`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/*`, `projects/NH-Reader/scripts/*`

**Locked user directives (normalized by domain):**
- **Unified Script Runner & Command Hierarchy**:
  - Standardize all Tauri v2 repositories on modular `.mjs` scripts (`scripts/{build,dev,run,test,sign}.mjs` + `scripts/lib/{logger,runner,suites}.mjs`) and non-Tauri repositories on modular TypeScript ESM scripts, using the `main:sub:option` command naming convention in `package.json`.
  - Ensure all new project scripts are built as permanent, reusable modular extensions rather than disposable one-off scripts.
- **Per-Platform Tauri Architecture & Code Signing**:
  - Isolate OS-specific Rust code into `src-tauri/src/platforms/{windows,macos,linux}.rs` and OS-specific Tauri bundle configs into `tauri.{windows,macos,linux}.conf.json`.
  - Support opt-in local code signing (`scripts/sign.mjs` / `npm run sign:local`) and include `.github/workflows/cleanup-failed-runs.yml` across all repositories.

**Implementation checklist:**
- [x] **[Ecosystem-Wide] Script Standards & Tauri Engineering Codification**:
  - [x] Authored `.agents/rules/script-standards.md`, `.agents/templates/cleanup-failed-runs-workflow-template.yml`, and updated `.agents/skills/tauri-desktop-engineering.md`.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) & [NH-Reader] (`projects/NH-Reader`) Per-Platform Configs & Signing**:
  - [x] Split platform detection into `windows.rs`, `macos.rs`, and `linux.rs`, added `tauri.{windows,macos,linux}.conf.json`, implemented `scripts/sign.mjs`, and unified `NH-Reader` and `Universal-Game-Launcher` script suites on `main:sub:option`.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.32–W.35: Multi-Platform Owned Games Detection, Multi-Provider Metadata Resolver, SCSS Architecture & System Tray
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Universal-Game-Launcher/src-tauri/src/platforms/*`, `projects/Universal-Game-Launcher/src-tauri/src/metadata/*`, `projects/Universal-Game-Launcher/src-tauri/src/commands.rs`, `projects/Universal-Game-Launcher/src/styles/*`, `projects/Universal-Game-Launcher/src/routes/library/+page.svelte`

**Locked user directives (normalized by domain):**
- **Multi-Platform Discovery & Official Launchers**:
  - Autodetect installed and owned games across Steam, GOG Galaxy (`galaxy-2.0.db`), Epic Games, Xbox / Microsoft Store (`WindowsApps` / AppModel registry), itch.io, Ubisoft Connect, EA App, Battle.net, Amazon Games, and Rockstar Games while filtering out cloud storage drives (OneDrive, Google Drive, Dropbox).
  - Support EmulationStation ROM directories (`ROMs/<system>/...`) with console platform attribution (`GameCube`, `Wii`, `PlayStation 2`, `Switch`, etc.).
- **Multi-Provider Metadata & Media Showcase**:
  - Prioritize official storefront metadata and local game manifests, automatically enhanced by keyless and optional keyed providers (Steam Store, GOG Catalog, Libretro Thumbnails, Wikipedia, PCGamingWiki, VNDB, SteamGridDB, IGDB).
  - Cap the per-game media gallery at 10 items (supporting video trailers alongside screenshots) without duplicate padding.
- **App-Wide SCSS Architecture**:
  - Migrate all component styling into modular SCSS stylesheets under `src/styles/` (`_tokens.scss`, `_mixins.scss`, `_platforms.scss`, `app.scss`, `library.scss`, `settings.scss`, `storage.scss`) and codify the SCSS-first standard in `.agents/rules/styling-standards.md` and `.agents/skills/scss-architecture.md`.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Multi-Platform Detectors & Console Identification**:
  - [x] Expanded GOG (`galaxy-2.0.db`), Xbox (`shell:AppsFolder\`), Epic, Ubisoft, EA, Battle.net, and EmulationStation console detectors, and added system tray support (`tray-icon`) in `src-tauri/src/lib.rs`.
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Multi-Provider Metadata & SCSS Migration**:
  - [x] Wired multi-provider metadata and keyword artwork search, migrated all routes to modular `src/styles/*.scss`, and authored `.agents/rules/styling-standards.md` and `.agents/skills/scss-architecture.md`.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) & [NH-Reader] (`projects/NH-Reader`) Workstream W.29: Multi-Platform Tauri v2 CI Release Workflows
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`)
- **Target Components:** `.github/workflows/release.yml`, `.github/releases/*.md`, `.agents/rules/release-notes.md`

**Locked user directives (normalized by domain):**
- **Two-Stage Tauri v2 Release Pipeline**:
  - Structure `.github/workflows/release.yml` into `create-release` (creating/updating the GitHub release from `.github/releases/vX.Y.Z.md` following `.agents/rules/release-notes.md`) and `build-and-upload` (building Windows, macOS universal, and Ubuntu desktop installers).
  - Keep code signing local-only (`scripts/sign.mjs` skipped in CI) and exclude mobile targets from the desktop release matrix.

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) & [NH-Reader] (`projects/NH-Reader`) CI Release Workflows**:
  - [x] Implemented two-stage `.github/workflows/release.yml` across both desktop repositories using `libayatana-appindicator3-dev` and `libwebkit2gtk-4.1-dev` on Ubuntu, and updated `.agents/rules/release-notes.md`.

---

### 🎯 [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Workstream W.18–W.28: Core Foundation, Custom Titlebar, i18n Localization (28+ Languages), SQLite Cache & Glassmorphism UI
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Target Components:** `projects/Universal-Game-Launcher/src-tauri/src/*`, `projects/Universal-Game-Launcher/src/*`, `projects/Universal-Game-Launcher/scripts/*`, `projects/Universal-Game-Launcher/docs/*`

**Locked user directives (normalized by domain):**
- **Desktop Foundation & Logged Tooling**:
  - Build on Tauri v2 + SvelteKit 5 (`adapter-static` SPA) + Rust with a custom frameless titlebar (`WindowControls.svelte`) and dark obsidian glassmorphism UI.
  - Wrap build, dev, and test commands in `.mjs` logger scripts writing timestamped transcripts to `logs/` with automated log retention (max 25 logs) so stale logs never accumulate.
- **SQLite Cache & Hand-Rolled i18n Localization**:
  - Bundle SQLite from source (`rusqlite` with `bundled` feature) for zero external runtime dependencies.
  - Implement a zero-dependency hand-rolled reactive i18n engine (`src/lib/i18n/`) supporting all official Steam languages (including Arabic RTL layout support).

**Implementation checklist:**
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Core Backend, SQLite Cache & Logged Scripts**:
  - [x] Built VDF/ACF parsers, platform detectors, `rusqlite` bundled persistence (`cache.rs`), artwork manager (`artwork.rs`), storage analyzer (`storage.rs`), and logged `.mjs` command scripts (`scripts/lib/{logger,runner,suites}.mjs`).
- [x] **[Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) Custom Titlebar, Glassmorphism UI & i18n Engine**:
  - [x] Built custom frameless titlebar, dark obsidian glassmorphism theme, reactive i18n localization across all supported languages with `scripts/verify-i18n.mjs`, and `docs/` GitHub Pages site on `helix-docs`.

---

### 🎯 [Ecosystem-Wide] Workstream W.13, W.16 & W.21: Agent Workflow Skills, Documentation Theme-Neutrality Invariant & Workspace Governance Isolation
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Windhawk-Themes]` (`projects/Windhawk-Themes`), `[NH-Reader]` (`projects/NH-Reader`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- **Target Components:** `AGENTS.md`, `.agents/rules/*`, `.agents/skills/*`, `.github/copilot-instructions.md`

**Locked user directives (normalized by domain):**
- **Centralized Global Agent Ecosystem**:
  - Maintain `AGENTS.md`, `.agents/`, `.backups/`, `scratch/`, and tracking ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) exclusively in the workspace root (`projects/agents`), removing all per-repo agent files or references from public project repositories.
- **Documentation Theme-Neutrality Invariant**:
  - Keep all `docs/` (`_docs/`, `_wiki/`, root guides) strictly theme-neutral and mechanism-focused; author-specific themes/suites belong exclusively in `docs/_catalogue/` or `docs/_store/`.
- **Shell & File Editing Discipline**:
  - Codify PowerShell path-quoting, non-blocking background execution, and read-before-edit rules in `.agents/skills/{shell-command-management,file-editing,task-decomposition,large-session-management,test-execution}.md`.

**Implementation checklist:**
- [x] **[Ecosystem-Wide] Global Governance & Theme-Neutrality Rules**:
  - [x] Authored `.agents/rules/documentation-standards.md`, `.agents/rules/{large-task-handling,background-tasks,session-management,shell-commands}.md`, and `.agents/skills/{shell-command-management,file-editing,task-decomposition,large-session-management,test-execution}.md`.
  - [x] Purged all legacy per-repo agent references and `scratch/`/`.backups/` folders from `Windhawk-Themes`, `NH-Reader`, and `helix-origin.github.io`.

---

### 🎯 [Windhawk-Themes] (`projects/Windhawk-Themes`) & [helix-docs] (`projects/helix-docs`) Workstream W.04–W.15: Shared Jekyll Theme v1.0.0, Squircle Branding Suite & Command Center Catalogue Documentation
- **Project Identifiers:** `[helix-docs]` (`projects/helix-docs`), `[Windhawk-Themes]` (`projects/Windhawk-Themes`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`), `[NH-Reader]` (`projects/NH-Reader`)
- **Target Components:** `projects/helix-docs/_sass/*`, `projects/helix-docs/_includes/*`, `projects/helix-docs/_docs/*`, `projects/Windhawk-Themes/docs/*`, `projects/helix-origin.github.io/*`

**Locked user directives (normalized by domain):**
- **Shared Jekyll Theme (`helix-docs`) & vCard Home Pattern**:
  - Format the theme display title as `HELIX Docs`, precompile `assets/css/site.css` with Dart Sass, enable Mermaid diagrams by default, left-align sidebar navigation with YAML-configurable category icons and sub-page bullets, widen `.catalogue-item-shell` to `min(1440px, 100%)`, and document the vCard home page pattern in `_docs/home-page.md`.
- **Squircle Branding Artwork (`logo.svg`, `icon.png`, `favicon.ico`)**:
  - Generate matching 256×256 squircle (`rx="56"`) site logos, PNG icons, and multi-size ICO favicons via ImageMagick across `helix-docs`, `Windhawk-Themes`, `NH-Reader`, and `Universal-Game-Launcher`, resolving relative asset paths from the site root across nested routes.
- **Windhawk-Themes Catalogue & Neutral Wiki**:
  - Document the Command Center suite and its 8 companion extras inside `docs/_catalogue/command-center.md` while keeping `docs/_docs/` and `docs/_wiki/` 100% theme-neutral, and validate all YAML configs with `tools/Test-WindhawkStyles.ps1`.

**Implementation checklist:**
- [x] **[helix-docs] (`projects/helix-docs`) Theme v1.0.0, Sidebar Hierarchy, Mermaid & vCard Guide**:
  - [x] Reorganized `_sass/`, precompiled `assets/css/site.css` via Dart Sass, implemented default-on Mermaid (`components/mermaid.html`) and left-aligned sidebar navigation (`components/nav.html` + `nav-icon.html`), widened `.catalogue-item-shell` to `1440px`, authored `_docs/home-page.md`, and shipped `v1.0.0`.
- [x] **[Ecosystem-Wide] Squircle Branding Artwork & Portal Showcase**:
  - [x] Generated and verified 256×256 squircle `logo.svg`, `icon.png`, and `favicon.ico` assets and 16:9 portal showcase banners across `helix-docs`, `Windhawk-Themes`, `NH-Reader`, `Universal-Game-Launcher`, and `helix-origin.github.io`.
- [x] **[Windhawk-Themes] (`projects/Windhawk-Themes`) Theme-Neutral Wiki & Command Center Catalogue**:
  - [x] Neutralized all `docs/_docs/` and `docs/_wiki/` pages, documented Command Center tokens and companion extras in `docs/_catalogue/command-center.md`, and verified 0 errors / 0 warnings via `tools/Test-WindhawkStyles.ps1`.
