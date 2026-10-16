# ROADMAP-ARCHIVE.md — HELIX Origin Historical Milestone Archive

> 🗄️ **Historical Archive Ledger**: Complete architectural histories and milestone implementation details for delivered milestones across the **HELIX Origin** organization.
>
> For active project roadmaps, live milestone matrices, and upcoming milestones, refer to [`ROADMAP.md`](../ROADMAP.md).
> Last updated: 2026-10-16

---

## 📜 Archive Index

- [Universal-Game-Launcher (formerly Steam-Vault) (M1–M12)](#universal-game-launcher-formerly-steam-vault)
- [NH-Reader (M1–M12)](#nh-reader)
- [helix-docs (v1.0.0)](#helix-docs)

---

## Universal-Game-Launcher (formerly Steam-Vault)

*Target Path: `projects/Steam-Vault` · Tauri v2 / Rust / SvelteKit Desktop App*

### Milestone M1: Foundation (DELIVERED)
- Clean-room, cross-platform revival of **Depressurizer** as a Tauri v2 app.
- Steam discovery (registry + cross-platform fallbacks), library/account aggregation from `libraryfolders.vdf`, `appmanifest_*.acf`, `localconfig.vdf`, and non-Steam `shortcuts.vdf`.
- Modern Steam collection read/write against the cloud namespace store, with backups and a Steam-must-be-closed guard.
- Metadata provider layer: Steam Store (`appdetails`), Steam Web API, SteamGridDB, IGDB (Twitch), PCGamingWiki, Wikipedia. **RAWG intentionally excluded (service defunct).** Steam Web API, SteamGridDB, and IGDB are the only keyed providers.
- AutoCats engine + Allowed/Required/Excluded filter model; JSON metadata cache; local settings.
- `docs/` GitHub Pages site on the `helix-docs` remote theme, live at `https://helix-origin.github.io/Steam-Vault/` (source `main` / `docs`).

### Milestone M2: Whole-Library Organizing (DELIVERED)
- **Custom title bar** — frameless window (`decorations: false`), a draggable app header, and platform-aware window controls (macOS traffic lights, Windows-style buttons elsewhere).
- **Whole owned library** — the Steam Web API's `GetOwnedGames` result is cached to `owned-games.json` and merged into the Library view, so owned-but-not-installed games can be organized too.
- **External platform detection** — GOG, Epic Games, itch.io, Amazon Games, Ubisoft Connect, EA, Battle.net, Rockstar, and other publishers, read from local launcher manifests, the GOG registry, the itch app library, and the Windows Uninstall registry (no scraping, no launcher login).
- **Import as non-Steam shortcuts** — appids derived exactly as Steam does (`crc32(exe + name) | 0x80000000`), quoted `Exe` / `StartDir`, de-duplication, and a persisted appid → platform map.
- **Collection creation from any sorting option** — genre, developer, publisher, Steam feature, tag, release year, user score, platform, installed state, playtime, and name — previewed, then written in a single backed-up operation.
- New **Platforms** and **Organize** views added to the navigation.

### Developer Tooling: Logged Command Scripts + Metadata Cache Warming (COMPLETE)
- **Logged command scripts** — `scripts/*.mjs` wrap `tauri dev` / `tauri build` (and any command via `npm run log`) so each run streams live and leaves a timestamped, ANSI-stripped transcript in `logs/` (`<type>-<YYYY-MM-DD_HH-MM-SS>.log`, never overwritten).
- **On-demand metadata cache warming** — the Steam Store provider also fetches store **tags** (`actions/ajaxgetstoretags`); `ensure_steam_metadata` de-duplicates ids, fetches `appdetails` per app id with bounded concurrency, and reuses cached entries; a `sync_library_metadata` command warms the whole owned library; collection creation can fetch metadata on demand (`fetchMetadata`, default on).

### Milestone M3: Filter Builder, Non-Steam Sources & Storage Manager (DELIVERED)
- **Filter builder in Organize** — Depressurizer-style **Allowed / Required / Excluded** term lists with name search and a kind selector, plus a live match count, applied when creating collections.
- **Configurable non-Steam sources** — Settings gains per-launcher enable/disable and extra search folders; platform detection honours them and can scan all mounted drives.
- **Storage manager** — a new **Storage** view (with `steam/storage.rs` and seven Tauri commands) reports drives, libraries, and game placement/sizes; registers or removes libraries; and moves a game or a whole library between drives, rewriting **every** `libraryfolders.vdf` with backups and a Steam-closed guard, with live `storage-progress` events.
- **Steam Store fetch fix** — metadata is fetched per app id with bounded concurrency (fixes the HTTP 400 from comma-joined `appids`).
- **Agent-friendly test runner** — `scripts/test.mjs` + `scripts/lib/suites.mjs` run named suites with stdin closed, a per-step timeout, transcripts, and a PASS/FAIL summary (`npm test`, `verify`, …).

### Milestone M4: Custom Artwork Manager (DELIVERED)
- **Artwork view** — inspect and replace the five custom-artwork slots Steam reads from `userdata/<id3>/config/grid/` (portrait grid, landscape grid, hero, logo, icon) for **Steam games and non-Steam shortcuts alike**.
- **SteamGridDB by app id** — real Steam games are matched by their exact app id (no search ambiguity); non-Steam shortcuts, which have no store page, are matched by name with an exact-title preference.
- **Local-file import** — apply a PNG or JPEG directly; the image's real format is sniffed from its magic bytes so Steam always loads it (with a 64 MiB cap).
- **Backup-on-replace** — every overwrite and removal archives the previous image into the timestamped backup store first.
- Six new commands, `steam/artwork.rs` module (7 unit tests), and eight-item navigation.

### Milestone M5: Platform, VNDB & i18n Localization (DELIVERED)
- Storefront launch URIs for Epic (`com.epicgames.launcher://apps/<id>`) and itch written as launch options.
- Per-game platform override command and UI selector.
- Microsoft Store / Xbox Game Pass detection with zero scraping.
- Keyless VNDB Kana API provider for visual novel developers, publishers, release dates, tags, and covers.
- Steam Store Search provider matching non-Steam/indie titles to official Steam app IDs.
- Local engine and game sniffer for itch.io `receipt.json`, Ren'Py, RPG Maker, and Windows PE VersionInfo.
- Automatic artwork fetching for non-Steam shortcuts upon import and scan.
- Hand-rolled reactive i18n localization engine supporting all 30 official Valve/Steam languages with Arabic RTL layout.
- High-performance volume enumeration using `sysinfo::Disks`.

### Milestone M6: Dynamic (Filter-Spec) Collections (DELIVERED)
- Persist named filter presets (`filter-presets.json`) and evaluate dynamic matching rules.
- Native Valve `filterSpec` smart collections persisted directly to `cloud-storage-namespace-1.json`.
- "Smart Collection" badges and one-click "↻ Re-evaluate" in Collections view.

### Milestone M7: SQLite Metadata Cache (DELIVERED)
- Embedded SQLite database (`metadata.db`) via `rusqlite` bundled from source (zero system dependencies).
- WAL mode, multi-column indexing on `(provider, app_id)`, TTL handling, and zero-touch auto-migration from legacy JSON cache.

### Milestone M8: Glassmorphism UI Pass (DELIVERED)
- Complete modern dark obsidian glass styling pass across `app.css` and all 8 views with frosted panels, atmospheric gradients, tactile buttons, and refined glow borders.

### Milestone M9: v1.0 Release Packaging (DELIVERED)
- HELIX squircle 16:9 branding artwork (`static/steam-vault.svg`, `docs/assets/images/steam-vault.svg`, portal card).
- GitHub issue templates (`config.yml`, `1_bug_report.yml`, `2_feature_proposal.yml`).
- SemVer v1.0.0 release notes, CHANGELOG v1.0.0, and version bumps.

### Milestone M12: Serverless Redis KV Tier, Deals & Free Games v1.3.1 (DELIVERED)
- High-performance in-memory serverless Redis-compatible KV tier and SQLite global persistence layer.
- Modular multi-platform free game checker and store deals feed (Steam, Epic Games, GOG, GamerPower).
- Library game patch notes feed via Steam News API with rich BBCode rendering.
- Ergonomic sidebar settings gear button and streamlined platform launcher management.

---

## NH-Reader

*Target Path: `projects/NH-Reader` · Tauri / Rust / SvelteKit Native Client*

### Milestone History (M1–M12 Shipped)
- **M1–M4**: Foundation, Browse, Advanced Query Search & Filter Drawer, Global Blacklist engine.
- **M5–M8**: SQLite Cache, Responsive Reader, Throttled Background Workers, Portable Packaging.
- **M9–M11**: 18-Language Localization Core, Disk Storage Budgets & LRU Pruning, Official Archive Downloads & Library Hub.
- **M12 (v0.7.3 – v0.7.5)**: Complete 17 community language packs, custom title bar with per-OS window controls, RTL polish, multi-platform portable archives, unified `npm run sign` (`scripts/sign.mjs`), squircle website assets (`logo.svg`, `favicon.ico`, `icon.png`).

---

## helix-docs

*Target Path: `projects/helix-docs` · Organization Documentation & Wiki Engine*

### v1.0.0 Delivery (SHIPPED)
- Layered SCSS architecture (`support/`, `modules/`, `color_schemes/`, `vendor/`, `custom/`).
- Precompiled Dart Sass `assets/css/site.css` (zero build-time SCSS compilation on GitHub Pages).
- Pure frontmatter-driven 3-level tree navigation (`_includes/components/nav.html`).
- Modular `<section class="doc-section">` landing cards with zero Kramdown indentation bugs.
- Wiki layout delegation for docs collections (`layout: wiki`).
- Extracted universal site-wide top navbar partial (`_includes/components/navbar.html`).
- Expanded catalogue column min-width to 400px.
