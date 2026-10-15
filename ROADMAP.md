# HELIX Origin — Organization Roadmap & Milestones

> 🗺️ **Living Source of Truth**: Unified organizational roadmap, multi-project milestone matrix, and long-term product direction across all repositories under **HELIX Origin**.
>
> Pair with [`PLAN.md`](./PLAN.md) (sprint execution), [`TODO.md`](./TODO.md) (task ledger), and [`BUGS.md`](./BUGS.md) (open issues and quirks).
> Last updated: 2026-10-14

---

## 📜 Organizational Tracking Contract

- **Single Pane of Glass:** All repository roadmaps, sprints, tasks, and bugs are synchronized here at workspace root.
- **Mandatory Project Tagging Invariant:** Every tracked milestone, sprint, task, bug, and backlog candidate **must explicitly state its project name and repository path** (`[<project-name>] (<project-path>)`). Unscoped items are strictly prohibited so agents never conflate repositories.
- **Active Milestones First:** Active workstreams and upcoming milestones must always precede completed historical records.
- **Strict Typing:** Differentiate explicitly between **SemVer repositories** (`helix-docs`, `NH-Reader`, `Hentai-Senpai-Multi-DE-Theme`) and **Milestone/Sprint-tracked repositories** (`Windhawk-Themes`, `helix-origin.github.io`).
- **No Stale Ledgers:** Updates to roadmap milestones must occur before or alongside code and configuration changes.

---

## 🔭 Organization Vision & Architecture

```mermaid
flowchart TB
    Org[HELIX Origin Organization] --> DocsTheme["[helix-docs] Remote Jekyll Theme"]
    Org --> Portal["[helix-origin.github.io] Portal Hub"]
    Org --> DesktopApp["[NH-Reader] Desktop/Mobile App"]
    Org --> ShellMods["[Windhawk-Themes] Shell Styler Suite"]
    Org --> LinuxTheme["[Hentai-Senpai] Multi-DE GTK Theme"]

    DocsTheme -.->|remote_theme| Portal
    DocsTheme -.->|remote_theme| DesktopApp
    DocsTheme -.->|remote_theme| ShellMods
    DocsTheme -.->|remote_theme| LinuxTheme
```

1. 🎨 **Unified Design Tokens**: A cohesive dark obsidian aesthetic (`#07111f` / `#0d1b2d`) with cyan (`#48d8f2`) and purple (`#b06cff`) accents across documentation, desktop apps, and OS styling suites.
2. 🚀 **Zero-Install Remote Documentation**: All organizational web properties consume `HELIX-Origin/helix-docs` via GitHub Pages without local build duplication or hardcoded navigation data.
3. 🔒 **Privacy & Local Independence**: User-facing clients operate 100% on-device (local SQLite, zero forced telemetry, self-contained runtimes).

---

## 🗺️ Master Milestone & Project Status Matrix

| Project Identifier | Target Repository Path | Tracking Model | Current Milestone / Release | Status | Primary Focus |
|---|---|---|---|---|---|
| **[helix-docs]** | `projects/helix-docs` | SemVer | [v1.0.0](https://github.com/HELIX-Origin/helix-docs/releases/tag/v1.0.0) | ✅ Shipped | Frontmatter nav engine, modular cards, universal navbar |
| **[helix-origin.github.io]** | `projects/helix-origin.github.io` | Rolling Sprints | Portal v2 | 🚀 Active | 16:9 vector artwork integration, project showcase cards |
| **[NH-Reader]** | `projects/NH-Reader` | SemVer | [v0.7.5](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.7.5) | ✅ Shipped (M12) | M13 Planning: unified sign script, multi-platform toolchain |
| **[Windhawk-Themes]** | `projects/Windhawk-Themes` | Milestones | Milestone M.02b | 🚀 Active | Suite polish: Start Menu alignments, Quick Settings split buttons |
| **[Steam-Vault]** | `projects/Steam-Vault` | SemVer | [v1.2.0](https://github.com/HELIX-Origin/Steam-Vault/releases/tag/v1.2.0) | 🚀 Active | Library Grid launcher, per-game management sub-page, right sidebar filters, streamlined storage & multi-scope lists |
| **[Steam-Vault-Catalogue]** | `projects/Steam-Vault-Catalogue` | SemVer | [v1.1.0](https://github.com/HELIX-Origin/Steam-Vault-Catalogue/releases/tag/v1.1.0) | 🚀 Active | Community open game catalogue, modular TypeScript manager, main:sub:option scripts & living index |

---

## 🚀 Active Project Roadmaps

### 1. [Windhawk-Themes] — Command Center Suite
*Target Path: `projects/Windhawk-Themes` · Windows 11 Shell Theming Framework*

```mermaid
flowchart LR
    M1["M.01: Agent Ecosystem ✅"] --> M2["M.02: Notification Center ✅"]
    M2 --> M2b["M.02b: Suite Polish 🚀"]
    M2b -.-> M3["M.03: File Explorer (Shelved ⏸️)"]
    M2b --> M4["M.04: Suite Verification ⏳"]
```

- **[Windhawk-Themes] Milestone M.02b: Suite Polish & Geometry Alignment (ACTIVE):**
  - **Start Menu Geometry**: Phone Link companion cards aligned flush with menu top; search box left edge flush with pinned apps card; companion toggle button right edge flush with pinned apps card.
  - **Action Center Quick Settings**: Harmonize split-button toggle and chevron backgrounds (`SplitL2Button`); eliminate high-contrast blue fallback states.
  - **Taskbar Snap Layout Containers**: Theme internal snap containers (`SnapLayoutControl`, `LayoutBorder`) with Command Center glass without breaking layout bounds.
  - **Taskbar Overflow Grid**: Restore frosted glass background and specular border to system tray overflow flyout.
  - **Docs Neutrality & Config Hygiene** (2026-10-13): corrected the documentation site to stay theme-neutral (mod mechanism only — the catalogue is the sole suite-specific surface, now codified as a global agents rule); synced `projects/command-center/README.md` to the current configs; deduplicated the static gate to **0 errors / 0 warnings**.
- **[Windhawk-Themes] Milestone M.03: Windows 11 File Explorer Styler (SHELVED / DEFERRED):**
  - Shelved per maintainer decision (2026-10-07) to avoid unstable system-wide translucency injectors or breaking Win32 DirectUI controls.
- **[Windhawk-Themes] Milestone M.04: Unified Suite Verification & Catalog Showcase (PLANNED):**
  - Full multi-mod Windows 11 desktop verification and Jekyll showcase catalogue generation in `docs/_catalogue/`.

---

### 2. [NH-Reader] — Desktop & Android Reader
*Target Path: `projects/NH-Reader` · Tauri / Rust / SvelteKit Native Client*

- **[NH-Reader] Milestone History (M1–M12 Shipped):**
  - **M1–M4**: Foundation, Browse, Advanced Query Search & Filter Drawer, Global Blacklist engine.
  - **M5–M8**: SQLite Cache, Responsive Reader, Throttled Background Workers, Portable Packaging.
  - **M9–M11**: 18-Language Localization Core, Disk Storage Budgets & LRU Pruning, Official Archive Downloads & Library Hub.
  - **M12 (v0.7.3 – v0.7.5)**: Complete 17 community language packs, custom title bar with per-OS window controls, RTL polish, multi-platform portable archives, unified `npm run sign` (`scripts/sign.mjs`), squircle website assets (`logo.svg`, `favicon.ico`, `icon.png`).
- **[NH-Reader] Milestone M13 (UPCOMING / PLANNED):**
  - Tag frequency analytics and recommended read suggestions based on local history.
  - Multi-profile library partitions (e.g. separate blacklist/favorites sets).
  - Background auto-update inspection and release notification toasts.

---

### 3. [helix-docs] — Remote Jekyll Theme
*Target Path: `projects/helix-docs` · Organization Documentation & Wiki Engine*

- **[helix-docs] v1.0.0 Delivery (SHIPPED):**
  - Layered SCSS architecture (`support/`, `modules/`, `color_schemes/`, `vendor/`, `custom/`).
  - Precompiled Dart Sass `assets/css/site.css` (zero build-time SCSS compilation on GitHub Pages).
  - Pure frontmatter-driven 3-level tree navigation (`_includes/components/nav.html`).
  - Modular `<section class="doc-section">` landing cards with zero Kramdown indentation bugs.
  - Wiki layout delegation for docs collections (`layout: wiki`).
  - Extracted universal site-wide top navbar partial (`_includes/components/navbar.html`).
  - Expanded catalogue column min-width to 400px.
- **[helix-docs] v1.1.0 Roadmap (PLANNED):**
  - Dedicated client-side Mermaid diagram rendering helper (`components/mermaid.html`).
  - Dynamic in-page Table of Contents sidebar module (solving `BUG-14`).
  - Native catalogue filtering scripts for software and theme showrooms.

---

### 4. [helix-origin.github.io] — Organization Portal
*Target Path: `projects/helix-origin.github.io` · Central Discovery Hub*

- **[helix-origin.github.io] Portal v2 Delivery (ACTIVE):**
  - Standardized on `remote_theme: HELIX-Origin/helix-docs`.
  - 16:9 standalone vector artwork system (`docs/assets/images/*.svg`) replacing remote bitmaps.
  - Added dedicated project card and custom artwork for `helix-docs`.
- **[helix-origin.github.io] Portal v3 Roadmap (PLANNED):**
  - Live GitHub release status badge widgets fetched via Octokit / Jekyll GitHub metadata.
  - Interactive software catalogue showcase consuming the `catalogue` layout.

---

### 5. [Hentai-Senpai-Multi-DE-Theme] — Nord GTK Theme
*Target Path: `projects/Hentai-Senpai-Multi-DE-Theme` · Linux Desktop Customization*

- **[Hentai-Senpai-Multi-DE-Theme] v1.0.0 Delivery (SHIPPED):**
  - Unified installer script supporting GNOME, Cinnamon, XFCE, Budgie, and MATE.
  - Vector icon asset suite (`icon.svg`, `logo.ico`, `my-avatar.png`).
  - Documentation migrated to `helix-docs` remote theme with frontmatter navigation.
- **[Hentai-Senpai-Multi-DE-Theme] Future Roadmap:**
  - Automated libadwaita / GTK4 user override configuration scripts.
  - Optional custom accent color generator presets.

---

### 6. [Steam-Vault] — Steam Library Organizer
*Target Path: `projects/Steam-Vault` · Tauri v2 / Rust / SvelteKit Desktop App*

```mermaid
flowchart LR
    M1["[Steam-Vault] M1: Foundation ✅"] --> M2["[Steam-Vault] M2: Whole-Library Organizing ✅"]
    M2 --> M2b["[Steam-Vault] Tooling: Logged Scripts + Cache Warming ✅"]
    M2b --> M3["[Steam-Vault] M3: Filter Builder & Storage Manager ✅"]
    M3 --> M3b["[Steam-Vault] Test Runner: Agent-friendly suites ✅"]
    M3b --> M4["[Steam-Vault] M4: Custom Artwork Manager ✅"]
    M4 --> M5["[Steam-Vault] M5: Platforms, Emulators, VNDB & i18n ✅"]
    M5 --> M6["[Steam-Vault] M6: Dynamic (Filter-Spec) Collections ✅"]
    M6 --> M7["[Steam-Vault] M7: SQLite Metadata Cache ✅"]
    M7 --> M8["[Steam-Vault] M8: Glassmorphism UI Pass ✅"]
    M8 --> M9["[Steam-Vault] M9: v1.0 Release Packaging ✅"]
```

- **[Steam-Vault] Milestone M1: Foundation (DELIVERED):**
  - Clean-room, cross-platform revival of **Depressurizer** as a Tauri v2 app.
  - Steam discovery (registry + cross-platform fallbacks), library/account aggregation from
    `libraryfolders.vdf`, `appmanifest_*.acf`, `localconfig.vdf`, and non-Steam `shortcuts.vdf`.
  - Modern Steam collection read/write against the cloud namespace store, with backups and a
    Steam-must-be-closed guard.
  - Metadata provider layer: Steam Store (`appdetails`), Steam Web API, SteamGridDB, IGDB (Twitch),
    PCGamingWiki, Wikipedia. **RAWG intentionally excluded (service defunct).** Steam Web API,
    SteamGridDB, and IGDB are the only keyed providers.
  - AutoCats engine + Allowed/Required/Excluded filter model; JSON metadata cache; local settings.
  - `docs/` GitHub Pages site on the `helix-docs` remote theme, live at
    **https://helix-origin.github.io/Steam-Vault/** (source `main` / `docs`).
- **[Steam-Vault] Milestone M2: Whole-Library Organizing (DELIVERED):**
  - **Custom title bar** — frameless window (`decorations: false`), a draggable app header, and
    platform-aware window controls (macOS traffic lights, Windows-style buttons elsewhere).
  - **Whole owned library** — the Steam Web API's `GetOwnedGames` result is cached to
    `owned-games.json` and merged into the Library view, so owned-but-not-installed games can be
    organized too.
  - **External platform detection** — GOG, Epic Games, itch.io, Amazon Games, Ubisoft Connect, EA,
    Battle.net, Rockstar, and other publishers, read from local launcher manifests, the GOG registry,
    the itch app library, and the Windows Uninstall registry (no scraping, no launcher login).
  - **Import as non-Steam shortcuts** — appids derived exactly as Steam does
    (`crc32(exe + name) | 0x80000000`), quoted `Exe` / `StartDir`, de-duplication, and a persisted
    appid → platform map.
  - **Collection creation from any sorting option** — genre, developer, publisher, Steam feature,
    tag, release year, user score, platform, installed state, playtime, and name — previewed, then
    written in a single backed-up operation.
  - New **Platforms** and **Organize** views added to the navigation.
- **[Steam-Vault] Developer Tooling: Logged Command Scripts + Metadata Cache Warming (COMPLETE):**
  - **Logged command scripts** — `scripts/*.mjs` wrap `tauri dev` / `tauri build` (and any command via
    `npm run log`) so each run streams live and leaves a timestamped, ANSI-stripped transcript in
    `logs/` (`<type>-<YYYY-MM-DD_HH-MM-SS>.log`, never overwritten).
  - **On-demand metadata cache warming** — the Steam Store provider also fetches store **tags**
    (`actions/ajaxgetstoretags`); `ensure_steam_metadata` de-duplicates ids, fetches `appdetails`
    per app id with bounded concurrency, and reuses cached entries; a `sync_library_metadata` command
    warms the whole owned library; collection creation can fetch metadata on demand (`fetchMetadata`,
    default on).
- **[Steam-Vault] Milestone M3: Filter Builder, Non-Steam Sources & Storage Manager (DELIVERED):**
  - **Filter builder in Organize** — Depressurizer-style **Allowed / Required / Excluded** term lists
    with name search and a kind selector, plus a live match count, applied when creating collections.
  - **Configurable non-Steam sources** — Settings gains per-launcher enable/disable and extra search
    folders; platform detection honours them and can scan all mounted drives.
  - **Storage manager** — a new **Storage** view (with `steam/storage.rs` and seven Tauri commands)
    reports drives, libraries, and game placement/sizes; registers or removes libraries; and moves a
    game or a whole library between drives, rewriting **every** `libraryfolders.vdf` with backups and
    a Steam-closed guard, with live `storage-progress` events.
  - **Steam Store fetch fix** — metadata is fetched per app id with bounded concurrency (fixes the
    HTTP 400 from comma-joined `appids`).
  - **Agent-friendly test runner** — `scripts/test.mjs` + `scripts/lib/suites.mjs` run named suites
    with stdin closed, a per-step timeout, transcripts, and a PASS/FAIL summary (`npm test`,
    `verify`, …).
- **[Steam-Vault] Milestone M4: Custom Artwork Manager (DELIVERED):**
  - **Artwork view** — inspect and replace the five custom-artwork slots Steam reads from
    `userdata/<id3>/config/grid/` (portrait grid, landscape grid, hero, logo, icon) for **Steam games
    and non-Steam shortcuts alike**.
  - **SteamGridDB by app id** — real Steam games are matched by their exact app id (no search
    ambiguity); non-Steam shortcuts, which have no store page, are matched by name with an
    exact-title preference.
  - **Local-file import** — apply a PNG or JPEG directly; the image's real format is sniffed from its
    magic bytes so Steam always loads it (with a 64 MiB cap).
  - **Backup-on-replace** — every overwrite and removal archives the previous image into the
    timestamped backup store first.
  - Six new commands, `steam/artwork.rs` module (7 unit tests), and eight-item navigation.
- **[Steam-Vault] Milestone M5: Platform, Emulators, VNDB & i18n Localization (DELIVERED):**
  - Storefront launch URIs for Epic (`com.epicgames.launcher://apps/<id>`) and itch written as launch options.
  - Per-game platform override command and UI selector.
  - Microsoft Store / Xbox Game Pass detection with zero scraping.
  - Keyless VNDB Kana API provider for visual novel developers, publishers, release dates, tags, and covers.
  - Steam Store Search provider matching non-Steam/indie titles to official Steam app IDs.
  - Local engine and game sniffer for itch.io `receipt.json`, Ren'Py, RPG Maker, and Windows PE VersionInfo.
  - Emulator and ROM detection supporting 11 popular emulators with automated CLI launch arguments.
  - Automatic artwork fetching for non-Steam shortcuts upon import and scan.
  - Hand-rolled reactive i18n localization engine supporting all 30 official Valve/Steam languages with Arabic RTL layout.
  - High-performance volume enumeration using `sysinfo::Disks` and pre-located emulators.
- **[Steam-Vault] Milestone M6: Dynamic (Filter-Spec) Collections (DELIVERED):**
  - Persist named filter presets (`filter-presets.json`) and evaluate dynamic matching rules.
  - Native Valve `filterSpec` smart collections persisted directly to `cloud-storage-namespace-1.json`.
  - "Smart Collection" badges and one-click "↻ Re-evaluate" in Collections view.
- **[Steam-Vault] Milestone M7: SQLite Metadata Cache (DELIVERED):**
  - Embedded SQLite database (`metadata.db`) via `rusqlite` bundled from source (zero system dependencies).
  - WAL mode, multi-column indexing on `(provider, app_id)`, TTL handling, and zero-touch auto-migration from legacy JSON cache.
- **[Steam-Vault] Milestone M8: Glassmorphism UI Pass (DELIVERED):**
  - Complete modern dark obsidian glass styling pass across `app.css` and all 8 views with frosted panels, atmospheric gradients, tactile buttons, and refined glow borders.
- **[Steam-Vault] Milestone M9: v1.0 Release Packaging (DELIVERED):**
  - HELIX squircle 16:9 branding artwork (`static/steam-vault.svg`, `docs/assets/images/steam-vault.svg`, portal card).
  - GitHub issue templates (`config.yml`, `1_bug_report.yml`, `2_feature_proposal.yml`).
  - SemVer v1.0.0 release notes, CHANGELOG v1.0.0, and version bumps.
- **[Steam-Vault] Milestone M10: Catalogue & Console Expansion v1.1.0 (DELIVERED):**
  - Native integration with Community Game Catalogue (`Steam-Vault-Catalogue`) via embedded compressed SQLite seed (`catalog_seed.bin`, curated multi-platform games) and online sync.
  - High-precision console platform determination (`determine_console_platform`) for emulated ROMs with Platforms view badges.
  - Automated binary `shortcuts.vdf` `tags` injection for native Steam client console grouping and collection ingestion.
  - Keyless MediaWiki wikitext infobox parser in `metadata::extra::wikipedia_game_lookup` for console titles and retro platforms.
  - SemVer v1.1.0 release packaging, release notes, and documentation synchronization.
- **[Steam-Vault] Milestone M11: Library Grid Launcher, Per-Game Management & Multi-Storefront Ingestion v1.2.0 (ACTIVE):**
  - **Zero-API-Key Architecture Pivot**: Phased transition moving metadata sources solely to official integrations (Steam Store API / ACF manifests, GOG Galaxy DB / store APIs, Epic manifests, Xbox AppxManifest / WindowsApps, itch receipts, PE headers) and our open Community Catalogue (`Steam-Vault-Catalogue`). Furthermore, the **Steam Web API key is planned to be completely optional**, as Steam Vault is designed to read the user's authenticated local Steam installation directly (`appinfo.vdf`, `packageinfo.vdf`, `localconfig.vdf`) to discover all owned games without external API dependencies—paralleling the zero-friction, keyless architecture established across GOG, Epic, and Xbox.
  - **Redesigned Library Grid Launcher (`/library`)**: Vertical game capsule grid view as the central launcher hub with responsive cover artwork, platform badges, install status pills, and one-click play controls.
  - **Collapsible Right Sidebar**: Instant sort controls (Name A-Z/Z-A, Playtime high/low, Last played, Size on disk) and granular filters (installation state, platform counts across Steam, GOG, Epic, Itch, Ubisoft, EA, Battle.net, Amazon, Xbox, Rockstar, Emulators, Other, collection dropdown, and favorites/hidden toggles).
  - **Extensive Per-Game Management Sub-Page**: 10-image media gallery with fullscreen lightbox modal, meta links card (Store, PCGamingWiki, SteamDB, ProtonDB, Wikipedia, Community Catalogue), comprehensive details cards, playtime tracking, Play/Install button (via `steam://run/{app_id}`, `steam://install/{app_id}`, and native fallbacks), and Manage button opening a sub-window modal.
  - **Streamlined Storage Statistics (`/storage`)**: Dedicated storage statistics dashboard and Steam Library Folder management, removing redundant game lists.
  - **Streamlined Organize Scopes List (`/organize`)**: Multi-select scope list (Genre, Developer, Publisher, Release Year, Platform) with custom Depressurizer-style rule builder to organize the Steam library without clutter.
  - **Multi-Platform Owned Games Detection**: GOG Galaxy SQLite database reader (`galaxy-2.0.db`), Epic manifests, WindowsApps/Xbox packages, and platform launch URIs.

---

### 7. [Steam-Vault-Catalogue] — Community Game Catalogue & Crawler
*Target Path: `projects/Steam-Vault-Catalogue` · Open Metadata Ingestion Engine*

- **[Steam-Vault-Catalogue] Milestone M1: Catalog Foundation & CI Release Pipeline (DELIVERED):**
  - Formal JSON schema (`schema/game.schema.json`), initial curated game database in `games/*.json`.
  - Automated CI crawler querying IGDB, SteamGridDB, Steam Store API, and VNDB.
  - Living `index.json` compiled for client lookup and distribution.
- **[Steam-Vault-Catalogue] Milestone M2: Modular Catalogue Engine, Standardized Scripts & Living Index v1.1.0 (ACTIVE):**
  - **Modular TypeScript ESM Catalogue Manager** (`scripts/manage-catalogue.ts`, `scripts/modules/*`): Ingestion engine, schema validator, and index builder.
  - **Direct Root Index Access**: Living `index.json` committed directly in repository root for zero-dependency client access.
  - **Standardized `main:sub:option` NPM Scripts**: `catalogue:update:all`, `catalogue:update:missing`, `catalogue:populate:games`, `catalogue:populate:seeds`, `catalogue:validate`, and `catalogue:build:index`.
  - **Multi-Storefront Schema Expansion**: Official integration identifiers (`gogId`, `epicAppName`, `ubisoftId`, `eaOfferId`, `xboxPackageFamily`) and launch URIs.
  - **Documentation Site (`docs/`)**: Jekyll site powered by `HELIX-Origin/helix-docs` with 5-section vCard homepage and squircle branding artwork.
