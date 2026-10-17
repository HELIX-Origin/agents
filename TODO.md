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
- **Project Identifiers:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- **Target Components:** `projects/Universal-Game-Launcher/package.json`, `projects/Universal-Game-Launcher/src-tauri/Cargo.toml`, `projects/Universal-Game-Launcher/src-tauri/tauri.conf.json`, `projects/Universal-Game-Launcher/src-tauri/src/main.rs`, `projects/Universal-Game-Launcher/src-tauri/src/lib.rs`, `projects/Universal-Game-Launcher/src-tauri/src/cache.rs`, `projects/Universal-Game-Launcher/src-tauri/src/settings.rs`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/mod.rs`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/detectors.rs`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/launchers.rs`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/windows.rs`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/linux.rs`, `projects/Universal-Game-Launcher/src-tauri/src/platforms/macos.rs`, `projects/Universal-Game-Launcher/src-tauri/src/commands.rs`, `projects/Universal-Game-Launcher/src/routes/+layout.svelte`, `projects/Universal-Game-Launcher/src/routes/+page.svelte`, `projects/Universal-Game-Launcher/src/routes/library/+page.svelte`, `projects/Universal-Game-Launcher/src/routes/storage/+page.svelte`, `projects/Universal-Game-Launcher/src/routes/settings/+page.svelte`, `projects/Universal-Game-Launcher/src/lib/types.ts`, `projects/Universal-Game-Launcher/src/lib/api.ts`, `projects/Universal-Game-Launcher/src/lib/plugins/`, `projects/Universal-Game-Launcher/README.md`, `projects/helix-origin.github.io/docs/index.md`, `projects/helix-origin.github.io/docs/assets/images/universal-game-launcher.svg`

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
- "ROM support is actually being restored via the plugins. Since we won't be publishing to WinGet we don't have to worry about any issues caused by supporting emulation."
- "All of our game providers, metadata providers, etc. are also going to be provided via plugins."
- "Note: Free game alerts, promotions, patch notes are also features that will be provided via plugins."
- "The general idea is that the core launcher will have the UI, the storage stats, and all internal necessary files, while the features will be provided via plugins."
- "This also means we will use our own crates where beneficial or necessary."
- "And make sure all agents, plans, and docs properly explain what this app ACTUALLY is: a universal game launcher app. Don't fabricate bullshit that will cause you to lose our features and UI that we are building."
- "Plugins are built directly into the application via an in-app plugins directory (`src/lib/plugins/`), eliminating Cloudflare network blockages, CDN rate limits, runtime script execution risks, and fragile external JSON manifests while preserving clean drop-in modularity."
- "The native Tauri/TypeScript framework is used for plugins instead of external JSON manifests or runtime `.mjs` downloads."
- "Internally these function as native modules hosting app functionality with an engine for ease of management, allowing developers to easily contribute new modules without modifying core code."
- "Visibly, modules are strictly called 'Plugins' across all user-facing interfaces, settings, and documentation due to their drop-in modular nature."
- "No custom detached Cargo crate is needed for the plugin engine; the engine operates cleanly as an internal library module within `universal_game_launcher_lib` and the frontend TypeScript manager."
- "Every supported platform and metadata provider has its own dedicated file (zero monolithic bundle files)."
- "Platform plugins integrate all features the native client provides outside of the store: friends list, game installation/uninstallation protocols, achievements, and launching with official overlays/cloud saves/playtime."
- "The standalone Universal-Game-Launcher-Plugins repository is permanently dropped and deleted since plugins are built directly into the app repository under `src/lib/plugins/`."

**Implementation checklist:**
- [x] `[Universal-Game-Launcher]` **Global Rebranding Configuration** — Updated package name (`universal-game-launcher`), product name (`Universal Game Launcher`), Rust library crate (`universal_game_launcher_lib`), app identifier (`org.helixorigin.universal-game-launcher`), and window titles across `package.json`, `Cargo.toml`, `Cargo.lock`, `tauri.conf.json`, `main.rs`, and `app.html`.
- [x] `[Universal-Game-Launcher]` **Generic SQLite Persistence Naming (`database.sqlite`)** — Replaced brittle branding database filenames in `src-tauri/src/cache.rs` with generic `database.sqlite` / `database.db` under `universal-game-launcher` data directories, including seamless copy/migration fallback for legacy `steam-vault/metadata.db`.
- [x] `[Universal-Game-Launcher]` **Brand Title Locale Synchronization** — Updated `brandTitle: "Universal Game Launcher"` across all 28 locale translation files in `src/lib/i18n/locales/*.ts`.
- [x] `[Universal-Game-Launcher]` **Branding Vector Artwork & Showcase Banner** — Authored 1920×1080 16:9 dark futuristic purple controller vector SVG banner conforming to `.agents/rules/project-artwork.md` in `projects/helix-origin.github.io/docs/assets/images/universal-game-launcher.svg` and `projects/Universal-Game-Launcher/static/universal-game-launcher.svg`.
- [x] `[Universal-Game-Launcher]` **Vector Logo & Multi-Resolution App Icon Suite** — Designed 256×256 vector squircle logo (`static/logo.svg`) with dark futuristic purple gamepad and neon violet/cyan trims; generated complete multi-platform icon suite (`icon.png`, `128x128@2x.png`, `128x128.png`, `64x64.png`, `32x32.png`, `icon.ico`, `tray-icon.png`, `StoreLogo.png`, `Square*Logo.png`, and `favicon.png`) via ImageMagick (`magick`).
- [x] `[Universal-Game-Launcher]` **Tauri v2 NSIS Sidebar Bitmap Specification** — Designed and generated `src-tauri/windows/sidebar.bmp` with exact standard dimensions **164 × 314 pixels** in BMP3 format matching default Tauri v2 NSIS packaging specifications.
- [x] `[Universal-Game-Launcher]` **Animated Splash Screen Transition** — Implemented pulsing dark futuristic purple controller splash transition in `src/routes/+layout.svelte` with minimum 850ms duration, smooth scale/fade exit transition, and neon progress bar.
- [x] `[Universal-Game-Launcher]` **Decoupled Architecture for ROM & Emulation Plugins** — Dropped hardcoded emulation code from core binary; established architecture where ROM organizers and emulator platforms are delivered via in-app modular plugins (`src/lib/plugins/`).
- [x] `[Universal-Game-Launcher]` **Purge & Deletion of Universal-Game-Launcher-Plugins Repository** — Permanently deleted the separate plugins repository and removed all references across the agent ecosystem and tracking files, fully consolidating plugins into `src/lib/plugins/`.
- [x] `[Universal-Game-Launcher]` **Managed Tools & Storage Paths Migration** — Updated `managed_tools_dir()` in `launchers.rs` and user data directories to `universal-game-launcher` with seamless backward-compatible fallback for legacy `Steam-Vault`.
- [x] `[Universal-Game-Launcher]` **Catalogue Repository Deletion** — Confirmed `Steam-Vault-Catalogue` repository will be permanently deleted rather than archived to prevent organization clutter. Removed all references across workspace tracking docs, architecture diagrams, and portal hub.
- [x] `[Universal-Game-Launcher]` **Native Launcher Integration & Auth Architecture Documentation** — Codified native launcher delegation invariant (`tauri-desktop-engineering.md`) documenting zero credential handling, preservation of official overlays/playtime/achievements, and external metadata provider minimization.
- [x] `[Universal-Game-Launcher]` **Repository README Modernization** — Updated `projects/Steam-Vault/README.md` to reflect Universal Game Launcher branding, banner asset, and multi-store architecture.
- [x] `[Universal-Game-Launcher]` **Documentation Terminology & Multi-Launcher Phrasing Alignment** — Eliminated redundant "Steam and non-Steam shortcuts" phrasing across `projects/Steam-Vault/README.md`, `docs/index.md`, `docs/_docs/*.md`, `docs/_wiki/*.md`, and root tracking files; realigned framing around all popular storefront launchers (Steam, Epic, GOG, Xbox, EA, Ubisoft, Battle.net, itch, Amazon) with native support for manually adding local games.
- [x] `[Universal-Game-Launcher]` **Discontinued Offline Catalogue Database Purge (Backend)** — Completely purge discontinued offline catalogue tables (`game_catalog`, `catalog_lookups`) from SQLite schema with runtime `DROP TABLE IF EXISTS` migrations; delete embedded binary seed `src-tauri/src/catalog_seed.bin` (363 KB); eliminate catalog structs, seed methods, and defunct `HELIX-Origin/Steam-Vault-Catalogue` network fallback timeouts in `commands.rs` and `cache.rs`.
- [x] `[Universal-Game-Launcher]` **Catalogue Purge (Frontend & IPC Registration)** — Unregister catalog Tauri commands in `src-tauri/src/lib.rs`, remove catalog API endpoints and types in `src/lib/api.ts` and `src/lib/types.ts`, and remove catalog sync/stats controls from `src/routes/settings/+page.svelte` and `src/routes/library/+page.svelte`.
- [x] `[Universal-Game-Launcher]` **Full App Performance & Data Optimization (Instant Loading)** — Tune SQLite database PRAGMAs (`journal_mode = WAL`, `cache_size = -64000`, `synchronous = NORMAL`, `temp_store = MEMORY`, `mmap_size = 268435456`); streamline in-memory serverless Redis KV layer (`mem_kv`) with fast-path library caching (`library:default`) and metadata cache (`mem_meta`) for instant sub-millisecond retrieval; batch reactive artwork updates in `library/+page.svelte`; unblock dashboard mounting in `+page.svelte` from background notification feeds.
- [x] `[Universal-Game-Launcher]` **Decouple App from Writing to Steam & External Providers** — Ceased writing to Steam files (`shortcuts.vdf`, `cloud-storage-namespace-1.json`). Persisted collections, categories, custom names, tags, favorites, and shortcuts in local SQLite (`database.sqlite`) and in-memory Redis KV tier (`mem_kv`). Removed process-blocking `ensure_steam_closed()` checks and removed Steam file backup settings.
- [x] `[Universal-Game-Launcher]` **Purge External Metadata Scrapers from Core** — Decoupled third-party scrapers from hardcoded binary into drop-in plugins; core relies on native storefront APIs and user-enabled plugins.
- [x] `[Universal-Game-Launcher]` **Minimal Necessary Caching Architecture (`collections`, `app_kv`, `artwork_cache`)** — Dropped duplicate `games` table from SQLite. Platform storefront launchers cache installed game files on disk; our app persists only collections, custom user overrides (`app_kv`), and artwork mappings (`artwork_cache`). Preloaded collections into `mem_kv` on database initialization for 0ms access.
- [x] `[Universal-Game-Launcher]` **Drop WinGet Publication Plans & Purge Manifest Automation** — Dropped WinGet release pipeline, removed `.github/workflows/publish-winget.yml`, `scripts/generate-winget-manifest.mjs`, `winget/` directory, and `winget:*` package scripts.
- [x] `[Universal-Game-Launcher]` **Steam-Style Title Bar Navigation Menu** — Restructured title bar in `src/routes/+layout.svelte` to host the primary application navigation links (`Dashboard`, `Library`, `Storage`, `Plugins`, `Settings`) directly beside the brand logo with clean uppercase typography and active purple glow.
- [x] `[Universal-Game-Launcher]` **Steam & GOG Left Game List Sidebar** — Re-purposed the global left sidebar into an interactive game launcher list with instant name/platform filter search, fast filter pills (`All`, `Installed`, `★ Favorites`), manual background platform scan button (`↻ Scan`), and live selection tree.
- [x] `[Universal-Game-Launcher]` **Library Dedicated Showcase View & Grid Purge** — Completely eliminated the heavy multi-card grid layout in `src/routes/library/+page.svelte` to prevent composite hangs and missing artwork. Directly showcases the selected title with hero banner, capsule cover, 10-image screenshot media gallery with fullscreen lightbox, meta reference links, game details, storage footprint, and display name manager.
- [x] `[Universal-Game-Launcher]` **Internal Modular Engine Architecture (Purge `crates/plugin-engine`)** — Removed detached cargo crate `crates/plugin-engine` from `src-tauri/Cargo.toml`; streamlined the plugin engine into an internal module of `universal_game_launcher_lib` (`src-tauri/src/plugins/`) and frontend TypeScript manager (`src/lib/plugins/engine.ts`).
- [x] `[Universal-Game-Launcher]` **Dedicated Per-Plugin Architecture (Zero Monolithic Files)** — Authored separate dedicated modules for every platform (`src/lib/plugins/platforms/steam.ts`, `gog.ts`, `epic.ts`, `itch.ts`, `xbox.ts`, `ea.ts`, `ubisoft.ts`, `battlenet.ts`, `amazon.ts`, `rockstar.ts`, `standalone.ts`) and metadata provider (`src/lib/plugins/metadata/steam-store.ts`, `steamgriddb.ts`, `igdb.ts`, `itch-store.ts`, `howlongtobeat.ts`, `pcgamingwiki.ts`, `protondb.ts`, `rawg.ts`, `gog-catalog.ts`, `epic-store.ts`).
- [x] `[Universal-Game-Launcher]` **Full Launcher Capabilities Integration** — Equipped platform plugins with game launching, native install/uninstall URIs (`steam://install/{id}`, `steam://uninstall/{id}`), friends list social rosters (`steam://friends/status`, `goggalaxy://openFriends`), and official achievement hooks.
- [x] `[Universal-Game-Launcher]` **Library-Only Sidebar Visibility & Full-Width Outer Pages** — Confined the Steam/GOG games list sidebar strictly to the Library view (`/library`) since the sidebar directly drives library selection; other views (`Dashboard`, `Storage`, `Settings`, `Plugins`) render full-width without sidebar clutter.
- [x] `[Universal-Game-Launcher]` **Sidebar Game Title Clarity & Platform Badge Purge** — Removed redundant platform indicators (`STM`, `GOG`, `EAS`, `XBO`, etc.) from individual game titles in the sidebar to eliminate visual noise and match Steam/GOG Galaxy clarity; platform information is cleanly presented in the main showcase game details view.
- [x] `[Universal-Game-Launcher]` **Collapsible Platform Accordions in Library Sidebar** — Grouped library titles into collapsible platform accordions (`Steam`, `GOG Galaxy`, `Epic Games`, `Xbox`, `itch.io`, etc.) with game counts, toggle chevrons (`▾`/`▸`), and live state; seamlessly transitions to instant flat search list when query text is typed.
- [x] `[Universal-Game-Launcher]` **Universal Per-Plugin Settings Modal & Tab Synchronization** — Created `src/lib/components/settings/PluginSettingsModal.svelte` rendering password fields with eye visibility toggles, text, number, and boolean inputs for plugins declaring `settings.fields`; integrated reactive `?tab=plugins` URL query parameter synchronization with top title bar navigation.
- [x] `[Universal-Game-Launcher]` **Consolidated In-App Modular Plugin Architecture & Repository Purge** — Deleted separate `Universal-Game-Launcher-Plugins` repository from disk; purged references from agent rules, skills, and layout; cleaned up Settings UI in `src/routes/settings/+page.svelte` removing obsolete AppData JSON plugins folder button and GitHub URL installer in favor of native in-app modular plugins and `PluginSettingsDialog.svelte`.
- [x] `[Universal-Game-Launcher]` **Purge Abandonware RAWG API Plugin** — Permanently removed `src/lib/plugins/metadata/rawg.ts`, unregistered from `src/lib/plugins/index.ts`, and purged all references across UI, documentation, and agent ledgers.
- [x] `[Universal-Game-Launcher]` **Comprehensive User Guides & Technical Wiki Overhaul** — Overhauled all 14 documentation guides (`_docs/*.md`), 8 technical wiki articles (`_wiki/*.md`), and root `README.md` to accurately document Universal Game Launcher, its Steam/GOG UI, generic SQLite/Redis KV architecture, native launcher protocols, and clear developer guides for writing plugins.
- [x] `[Universal-Game-Launcher]` **Generic Certificate Paths & Secrets Standard** — Made code-signing certificate file path (`certificates/certificate.pfx`, `certificate.p12`), fallback password (`youshallnotpass`), and verification environment variables (`CODESIGN_PFX_FILE`, `CODESIGN_PFX_PASS`) completely generic across `Universal-Game-Launcher`, `Theme-Toolkit`, and `NH-Reader`. Documented the futility of pushing self-signed certs to GitHub Secrets for web distribution due to Mark-of-the-Web (MOTW) and SmartScreen reputation requirements.
- [x] `[Universal-Game-Launcher]` **Monolithic `launchers.rs` Purge & Per-Launcher Plugin Autonomy** — Completely deleted `src-tauri/src/platforms/launchers.rs` to eliminate monolithic launcher coupling. Moved detection, download, and silent installation options into per-launcher plugins (`src/lib/plugins/platforms/*.ts`) with binary autodetection, custom path fallbacks, and user-configurable custom launcher directories (`custom_launchers_dir`).
- [x] `[Universal-Game-Launcher]` **Full Provider Integration (Social Roster & Achievement Tracking)** — Equipped platform plugins with unified friends list and achievement hooks. Built the Social page (`/social`) displaying unified live friends rosters and in-game presence across providers (Steam, GOG, Epic, Xbox), and integrated trophy/achievement tracking cards onto the Executive Dashboard.
- [x] `[Universal-Game-Launcher]` **EmulationStation Modular Platform Plugin & ROM Directory Scaffolding** — Created dedicated `platform-emulationstation` plugin (`src/lib/plugins/platforms/emulationstation.ts`) allowing users to configure custom ROMs directory placement (`romsPath`) and EmulationStation executable path (`esExecutablePath`). Implemented backend scaffolding command `scaffold_emulation_folders(roms_dir)` creating standard system subdirectories (`nes`, `snes`, `n64`, `gc`, `wii`, `wiiu`, `switch`, `gb`, `gba`, `gbc`, `nds`, `n3ds`, `psx`, `ps2`, `ps3`, `psp`, `psvita`, `megadrive`, `genesis`, `saturn`, `dreamcast`, `arcade`, `mame`, `neogeo`, etc.) populated with necessary `systeminfo.txt` files inside each directory and a master `systems.txt` / `README.txt` at the root following the `retrogamecorps/ES-DE-Directories` standard.
- [x] `[Universal-Game-Launcher]` **Intelligent ROM Title Normalization Engine** — Implemented `normalize_rom_title` stripping dump tags (`(USA)`, `(Europe)`, `[!]`, `(Rev 1)`, `(Beta)`, `(En,Ja,Fr)`), GoodTools/No-Intro brackets, NKit compound extensions (`.nkit.iso`, `.nkit.gcz`, `.nkit.ciso`, `.nkit.rvz`, etc.), multi-disc groupings, and file extensions while attributing clean console metadata and clean title capitalization with subtitle/article inversion.
- [x] `[Universal-Game-Launcher]` **Native Provider Data Fetching for All Platforms** — Equipped all platform provider plugins (`platform-steam`, `platform-epic`, `platform-gog`, `platform-itch`, `platform-ea`, `platform-emulationstation`, `platform-standalone`) with `queryMetadata` and `queryArtwork` to fetch authoritative game details and artwork directly from their own platform source for the library.
- [x] `[Universal-Game-Launcher]` **Manual Metadata Enhancement UI & Metadata Source Role Clarification** — Implemented manual metadata enhancement workflows in `src/routes/library/+page.svelte` ("✨ Enhance Metadata" button in showcase and Manage modal source selector), ensuring third-party metadata providers (TheGamesDB, ScreenScraper, IGDB, SteamGridDB, HowLongToBeat, PCGamingWiki, ProtonDB) are run on-demand by the user to enhance game details by filling in missing metadata.
- [x] `[Universal-Game-Launcher]` **Metadata Provider Override Protection & Cache Reset Invariant** — Enforced the invariant that game providers are only allowed to override metadata from metadata providers if the user explicitly chooses to reset the metadata cache. Tagged enhanced records with `userEnhanced: true`, protected user-enhanced fields during normal refreshes, and provided an explicit "Reset Cache to Provider Defaults" action.
- [x] `[Universal-Game-Launcher]` **EmulationStation ROM Scan Unification** — Wired EmulationStation ROM scanning into `handleScanAllPlatforms` in `src/routes/+layout.svelte` so ROMs are automatically scanned, normalized, and imported into their console platform groups on global platform scan.
- [x] `[Universal-Game-Launcher]` **Full Verification Suite** — Validated Rust compiler (`cargo check`, 25/25 unit tests pass), Svelte type-check (`svelte-check` 0 errors 0 warnings), and frontend production build (`npm run build` succeeds).
- [x] `[Universal-Game-Launcher]` **Comprehensive Documentation Audit & Home Page Feature Separation** — Correct `docs/index.md` to strictly differentiate primary core application features from modular plugin-provided features, eliminate dead third-party scrapers, accurately define the metadata role hierarchy, and document the cache reset invariant.
- [x] `[Universal-Game-Launcher]` **Exhaustive Available Plugins Reference in `_docs`** — Create `docs/_docs/Available-Plugins.md` documenting all 27 available plugins across all 4 categories (`platforms`, `metadata`, `utility`, `media`) with IDs, names, versions, authors, descriptions, exact declared features, configuration fields, and capabilities.
- [x] `[Universal-Game-Launcher]` **Audit & Correction of User Guides in `_docs`** — Audit and update `Metadata-Providers.md`, `External-Platforms.md`, `Storage-Management.md`, `Artwork-Management.md`, `Troubleshooting.md`, `FAQ.md`, `Organizing-Your-Library.md`, `Non-Steam-Games.md`, and `Settings-and-API-Keys.md` to purge obsolete references (writing to Steam, moving Steam folders, loose AppData JSON manifests, dead scrapers) ensuring 100% technical accuracy with v1.4.0 codebase.
- [x] `[Universal-Game-Launcher]` **Detailed Plugin Developer Guide in Technical Wiki (`_wiki`)** — Author `docs/_wiki/Plugin-Developer-Guide.md` with comprehensive step-by-step guides and complete TypeScript templates for authoring Platform Plugins, Metadata Plugins, Utility Plugins, and Media Plugins, and synchronize `Plugins-Architecture.md`, `Architecture.md`, and `index.md`.

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
