# ROADMAP-ARCHIVE.md — HELIX Origin Historical Milestone Archive

> 🗄️ **Historical Archive Ledger**: Complete architectural histories and milestone implementation details for delivered milestones across the **HELIX Origin** organization (`helix-docs`, `helix-origin.github.io`, `NH-Reader`, `Universal-Game-Launcher`, `Theme-Toolkit`, `Windhawk-Themes`).
>
> For active project roadmaps, live milestone matrices, and upcoming milestones, refer to [`ROADMAP.md`](../ROADMAP.md).
> Last updated: 2026-10-16

---

## 📜 Archive Index

- [Universal-Game-Launcher (M1–M12)](#universal-game-launcher)
- [NH-Reader (M1–M12)](#nh-reader)
- [helix-docs (v1.0.0)](#helix-docs)
- [Windhawk-Themes (M.01–M.02)](#windhawk-themes)
- [Theme-Toolkit (M1)](#theme-toolkit)

---

## Universal-Game-Launcher

*Target Path: `projects/Universal-Game-Launcher` · Tauri v2 / Rust / SvelteKit Desktop App*

### Milestone M1: Foundation (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - Cross-platform Tauri v2 + SvelteKit 5 desktop game library and launcher foundation.
  - Steam installation discovery (Windows registry + cross-platform fallbacks), library/account aggregation from `libraryfolders.vdf`, `appmanifest_*.acf`, and `localconfig.vdf`.
  - Multi-provider metadata architecture: Steam Store (`appdetails`), Steam Web API, SteamGridDB, IGDB (Twitch), PCGamingWiki, and Wikipedia.
  - Auto-categorization engine, Allowed/Required/Excluded filter model, and local settings store.
  - `docs/` GitHub Pages site built on the `helix-docs` remote theme (`source: main / docs`).

### Milestone M2: Whole-Library Organizing & Multi-Platform Discovery (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - **Custom Frameless Title Bar**: Frameless window (`decorations: false`), draggable app header, and platform-aware window controls (macOS traffic lights, Windows-style buttons elsewhere).
  - **Whole Owned Library**: Steam Web API `GetOwnedGames` cached locally and merged into the Library view so owned-but-uninstalled games are organized alongside installed titles.
  - **External Platform Detection**: GOG Galaxy, Epic Games, itch.io, Amazon Games, Ubisoft Connect, EA App, Battle.net, and Rockstar Games Launcher detected from local launcher manifests, databases, and installation folders without scraping or handling user credentials.
  - **Deterministic App IDs**: Imported platform games receive deterministic CRC32 high-bit app IDs (`crc32(exe + name) | 0x80000000`) with persisted platform attribution.
  - **Automated Collection Creation**: Generate collections by genre, developer, publisher, feature, tag, release year, user score, platform, install state, playtime, or title.

### Milestone M3: Filter Builder, Platform Sources & Storage Manager (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - **Logged Command Runner Suite**: Native `.mjs` command wrappers (`scripts/*.mjs`) streaming live output and writing ANSI-stripped, timestamped transcripts to `logs/` (`<type>-<YYYY-MM-DD_HH-MM-SS>.log`), plus `scripts/test.mjs` + `scripts/lib/suites.mjs` for non-blocking test execution.
  - **Configurable Platform Sources**: Per-launcher enable/disable toggles, custom search directories, and opt-in multi-drive scanning across all mounted physical volumes.
  - **Multi-Platform Storage Analyzer**: Dedicated `/storage` view reporting physical drive utilization, platform storage breakdown, and installed game disk footprints.
  - **Bounded Concurrency Metadata Fetching**: Per-app-ID Steam Store metadata and tag resolution with bounded concurrency (`MAX_CONCURRENT_REQUESTS = 8`).

### Milestone M4: Custom Artwork Manager (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - **Multi-Slot Artwork Management**: Inspect and customize portrait capsule, landscape header, hero banner, transparent logo, and icon slots for any game in the library.
  - **SteamGridDB & Multi-Provider Resolution**: Exact App ID lookup for Steam titles and normalized title matching for other platforms.
  - **Local File Import**: Apply PNG, JPEG, WebP, or ICO files directly with magic-byte format verification and automatic timestamped backups.

### Milestone M5: Extended Storefronts, Local Inspector & 28-Language Localization (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - **Native Storefront Launch URIs**: Direct launch URI wiring for Epic (`com.epicgames.launcher://`), GOG (`goggalaxy://`), itch.io (`itch://`), Xbox (`shell:AppsFolder\`), and Steam (`steam://`).
  - **Microsoft Store & Xbox Detection**: Zero-scraping Windows AppModel registry and `WindowsApps` (`MicrosoftGame.config` / `AppxManifest.xml`) game discovery.
  - **Local Game Engine & Manifest Inspector**: Automatic extraction of titles, developers, versions, and local icons from itch.io `.itch/receipt.json.gz`, RPG Maker `www/data/System.json` (`gameTitle`), Ren'Py `.rpa` scripts, Unity `globalgamemanagers`, Unreal Engine manifests, and Windows PE VersionInfo headers.
  - **Keyless Visual Novel & Indie Resolution**: Keyless VNDB Kana API and Steam Store Search (`storesearch`) integration.
  - **Reactive i18n Localization Engine**: Hand-rolled reactive localization supporting 28+ official languages including Arabic RTL layout support.

### Milestone M6: Dynamic Smart Collections (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - Named filter presets (`filter-presets.json`) and dynamic rule evaluation against the unified multi-platform library.
  - Smart collection badges and one-click re-evaluation in the Collections manager.

### Milestone M7: Embedded SQLite Persistence Engine (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - Embedded SQLite database (`database.sqlite`) via `rusqlite` (`bundled` feature, zero system dependencies).
  - Write-Ahead Logging (`PRAGMA journal_mode = WAL`), multi-column indexing on `(provider, app_id)`, TTL expiration sweeps, and local artwork disk caching (`art_cache/`).

### Milestone M8: Obsidian Glassmorphism UI System (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - Modern dark obsidian glassmorphism design system across all views using modular SCSS (`src/styles/_tokens.scss`, `_mixins.scss`, `_platforms.scss`, `app.scss`, `dashboard.scss`, `library.scss`, `settings.scss`, `storage.scss`).

### Milestone M9–M12: Multi-Platform CI, Serverless KV Tier, Deals Hub & v1.4.0 Rebrand Foundation (DELIVERED)
- **`[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)**:
  - **Product Identity**: Rebranded to **Universal Game Launcher** (`org.helixorigin.universal-game-launcher`) with dark futuristic purple controller 16:9 vector banner (`universal-game-launcher.svg`), 256×256 squircle logo, 164×314 BMP3 NSIS sidebar bitmap, and 850ms animated splash screen.
  - **Two-Tier Cache Architecture**: Sub-millisecond in-memory Redis-compatible KV tier (`mem_kv`) backed by persistent SQLite `app_kv` and `app_meta` tables in `database.sqlite`.
  - **Storefront Deals, Giveaways & Patch Notes**: Keyless promotions engine querying Epic Games, Steam, GOG, and GamerPower (`utility-gamerpower`) for verified 100% free giveaways, store deals, and Steam News API patch notes.
  - **EmulationStation & ROM Management**: Standardized 35+ console directory scaffolding (`scaffold_emulation_folders` with `systeminfo.txt` + `systems.txt`), multi-drive ROM discovery, and automatic `.zip`/`.7z`/`.rar` extraction into per-game folders with isolated `saves/` and `rom.ini` manifests.
  - **Background Worker & Headless CLI**: Non-blocking background worker (`src/lib/worker.ts`) and headless CLI engine (`--cli scan`, `scan-roms`, `scaffold-roms`, `normalize-title`, `inspect-local`, `launchers`).

---

## NH-Reader

*Target Path: `projects/NH-Reader` · Tauri v2 / Rust / SvelteKit Native Client*

### Milestones M1–M12 (DELIVERED — v0.7.5)
- **`[NH-Reader]` (`projects/NH-Reader`)**:
  - **M1–M4**: Core foundation, gallery browsing, advanced query search & filter drawer, and global tag/artist blacklist engine with continuous stream backfill (`streamBackfilledList`).
  - **M5–M8**: Embedded SQLite cache, responsive manga reader, throttled background workers, and portable multi-platform packaging.
  - **M9–M11**: 18-language localization core, disk storage budgets with LRU pruning, and official archive downloads & local library hub.
  - **M12**: Custom frameless title bar with per-OS window controls, RTL layout support, unified `.mjs` script runner suite (`main:sub:option`), opt-in local code signing (`scripts/sign.mjs`), and 256×256 squircle branding assets (`logo.svg`, `favicon.ico`, `icon.png`).

---

## helix-docs

*Target Path: `projects/helix-docs` · Shared Organization Jekyll Documentation & Wiki Theme*

### Release v1.0.0 (DELIVERED)
- **`[helix-docs]` (`projects/helix-docs`)**:
  - Layered SCSS architecture (`support/`, `modules/`, `color_schemes/`, `vendor/`, `custom/`) precompiled via Dart Sass (`sass-embedded`) to `assets/css/site.css`.
  - Pure frontmatter-driven 3-level tree navigation (`_includes/components/nav.html` + `nav-icon.html`) with left-aligned category emoji and sub-page bullet markers.
  - vCard home page pattern (`_docs/home-page.md`) with `<section class="doc-section">` landing cards.
  - Default-on Mermaid diagram rendering (`_includes/components/mermaid.html`) and universal top navbar partial (`_includes/components/navbar.html`).

---

## Windhawk-Themes

*Target Path: `projects/Windhawk-Themes` · Windows 11 Styling Suites & Theme-Neutral Documentation*

### Milestones M.01–M.02 (DELIVERED)
- **`[Windhawk-Themes]` (`projects/Windhawk-Themes`)**:
  - Theme-neutral documentation and technical wiki (`docs/_docs/`, `docs/_wiki/`) explaining Windhawk styler mod mechanisms without coupling to any specific author's suite.
  - Dedicated catalogue (`docs/_catalogue/`) hosting suite-specific configurations, token tables, and companion extras instructions.
  - Automated PowerShell static validation gate (`tools/Test-WindhawkStyles.ps1`) enforcing zero duplicate target selectors and valid XAML property syntax.

---

## Theme-Toolkit

*Target Path: `projects/Theme-Toolkit` · Cross-Platform Desktop Theme Studio & Applicator*

### Milestone M1: Repository & Base Framework Scaffolding (DELIVERED)
- **`[Theme-Toolkit]` (`projects/Theme-Toolkit`)**:
  - Tauri v2 + SvelteKit base application framework with per-platform Rust library modules (`src-tauri/src/platforms/{windows,macos,linux}.rs`).
  - Standard `.mjs` script runner suite (`scripts/{build,dev,run,test,sign}.mjs`) following the `main:sub:option` command hierarchy.
  - Dedicated agent playbooks and skills for lossless Windows `.deskthemepack` cabinet packaging (`makecab.exe`), cursor schemes, sound schemes, and macOS/Linux desktop theme packaging.
