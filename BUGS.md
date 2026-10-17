# BUGS.md — HELIX Origin Consolidated Bug Tracker

> 🐛 **Living Source of Truth**: Unified tracking ledger for active bugs, environment quirks, and platform limitations across all active repositories in the **HELIX Origin** organization.
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (direction), [`PLAN.md`](./PLAN.md) (sprint execution), and [`TODO.md`](./TODO.md) (task ledger).
> Complete historical post-mortems for resolved bugs live in [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md).
> Last updated: 2026-10-16

---

## 📜 Tracking Rules

- **100% Active Direction Accuracy**: All entries under `## 🚫 Known Quirks & External Limitations` and `## ⚠️ Active & Open Bugs` must reflect the current, active architecture of each project. Immediately replace or remove any entry superseded by an architectural update.
- **Zero Non-Organization Mentions**: Only reference active repositories belonging to the `HELIX-Origin` GitHub organization (`helix-docs`, `helix-origin.github.io`, `NH-Reader`, `Universal-Game-Launcher`, `Theme-Toolkit`, `Windhawk-Themes`). Never directly mention external, third-party, or deleted projects/repositories by name.
- **Bare Minimal Ledger**: Resolved bugs are recorded as concise single-line entries here. Detailed root-cause analyses, scopes, and post-mortems are archived in [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md) to keep this living document clean and focused.
- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Mandatory Project Tagging**: **Every bug, quirk, and resolved issue must explicitly state its current project name and repository path** (`[<project-name>] (<project-path>)`). Unscoped entries are strictly prohibited so agents never conflate repositories.
- **Active Items First**: Active bugs and workstreams always precede resolved and closed archives.
- **Tracking Docs Stay True**: Update `ROADMAP.md`, `TODO.md`, `BUGS.md`, and `PLAN.md` first or in lockstep with code changes so a stale ledger counts as a bug.

---

## 📖 Legend

### 🚦 Status
- ⚠️ **open** — reproducible, needs fixing.
- 🚧 **investigating / fix applied** — repro, root cause, or initial code fix in progress (pending live verification).
- 🚫 **wontfix** — accepted platform limitations or deliberate architectural trade-offs.
- ✅ **resolved** — verified and fixed (archived with release version or commit hash).

### 🚨 Severity
- 🔴 **Critical**: Shell or app crashes, data loss, total unreadability.
- 🟠 **High**: Significant functional, visual, or state synchronization breakdown.
- 🟡 **Medium**: Minor visual alignments, partial theming coverage, non-breaking fallbacks.
- 🟢 **Low**: Build warnings, deprecations, non-visual cosmetic quirks.

---

## 🚫 Known Quirks & External Limitations (wontfix bucket)

### [Ecosystem & helix-docs] (projects/helix-docs)
- 💎 **[helix-docs] ENV-1 — Ruby not on PATH in agent shell:** Ruby is installed to `C:\Ruby33-x64\bin` but default shell PATH may be stale. Prepend `$env:PATH = "C:\Ruby33-x64\bin;$env:PATH"`.
- 💎 **[helix-docs] ENV-2 — Precompiled Theme CSS:** `helix-docs` commits precompiled `assets/css/site.css` so GitHub Pages remote-theme consumers don't compile SCSS at build time. Always regenerate with Dart Sass after SCSS edits.
- 💎 **[helix-docs] ENV-3 — Missing Source Map:** `site.css` references `site.css.map` which is not committed. Cosmetic only; browsers ignore missing maps.
- 💎 **[helix-docs] ENV-4 — Explicit Paths in Shell Commands:** Use absolute/explicit paths for shell tools (`git -C <repo>`, `jekyll --source <abs> --destination <abs>`).

### [Windhawk-Themes] (projects/Windhawk-Themes)
- 🪟 **[Windhawk-Themes] Classic Win32 DirectUI File List:** Explorer file/folder views and navigation trees are Win32 DirectUI controls. Full translucency requires unstable system modifications that the framework avoids. Safe glass pattern is applied to WinUI 3 chrome only.
- ⏱️ **[Windhawk-Themes] One-Time Evaluation of Target Selectors:** Windhawk stylers match selectors when elements enter the visual tree. If properties change without visual state transitions, selectors are not re-evaluated. Always target static visual states (`@CommonStates`).
- 📦 **[Windhawk-Themes] Windows 11 24H2 ShellHost Process Migration:** On Win11 24H2, Quick Settings flyout runs in `ShellHost.exe` instead of `ShellExperienceHost.exe`. Notification Center Styler targets both.

### [NH-Reader] (projects/NH-Reader)
- 🐢 **[NH-Reader] Upstream API Rate Limiting (429s):** The upstream API throttles rapid bursts. The Rust client throttles requests; the UI must back off gracefully.
- 🖼️ **[NH-Reader] Image CDN 404s:** Legacy galleries occasionally return 404s on upstream image hosts. Mitigated via proxy fallback (`proxy_image`) and graceful placeholder rendering.
- 🔒 **[NH-Reader] Single-Instance Enforcement:** Running a second instance focuses the existing window by design.
- 🔍 **[NH-Reader] Search Semantics:** Syntax and range logic follow upstream query semantics.
- 🔐 **[NH-Reader] Code Signing Identity:** Automated CI release packaging does not publish unsigned or self-signed release binaries without a trusted organization certificate. Local signing commands are provided in `package.json`.

### [Universal-Game-Launcher] (projects/Universal-Game-Launcher)
- 🚫 **[Universal-Game-Launcher] Zero External File Writes (Native App Isolation Invariant):** Universal Game Launcher never writes to, modifies, or backs up external launcher files (`shortcuts.vdf`, `cloud-storage-namespace-1.json`, or `appmanifest.acf`). Game records, collections, categories, custom display names, custom metadata/artwork overrides, and user preferences persist exclusively in our own SQLite database (`database.sqlite`) and in-memory Redis KV tier (`mem_kv`).
- 🧩 **[Universal-Game-Launcher] Universal Core Plugins & Global Helper Modules Architecture:** Core capabilities are delivered through consolidated **Universal Core Plugins** (`platform-universal`, `metadata-universal`, `utility-title-normalizer`, `media-universal`, `utility-gamerpower`, `utility-storage`) under `src/lib/plugins/` and `src-tauri/src/`, paired with global helper modules (`getAllPlatformSpecs`, `detectPlatformLauncher`, `installPlatformLauncher`, `getPlatformLaunchSpec`, `getPlatformUris`, `normalizeGameTitle`, `normalizeRomTitle`, `canonicalTitleKey`).
- ⚡ **[Universal-Game-Launcher] Automatic Metadata Enhancement & Settings-Only Cache Refresh/Purge:** Metadata and artwork enrichment (`metadata-universal`) runs automatically in the background via native Rust `reqwest` cascades (Local Engine/Receipt Inspector, Libretro Thumbnails CDN, Steam Store, GOG Catalog v1 API, Wikipedia + Wikidata MediaWiki API, PCGamingWiki Cargo, ProtonDB, and optional authenticated APIs). Manual refresh and cache purge buttons reside exclusively in `/settings` (`Storage & Cache` tab), never in `/library`.
- 🎨 **[Universal-Game-Launcher] Per-Game Management & Customization (`⚙ Manage` Modal):** Users can customize any game's Title (Display Name), Short Description, Developers, Publishers, Release Date, Genres, and Custom Artwork (Portrait Capsule Cover, Hero Wallpaper Banner, Transparent Logo) directly inside the game's `⚙ Manage` modal in `/library`. User-customized records (`userEnhanced: true`) are protected from automatic provider overwrites unless the metadata cache is explicitly reset in `/settings`.
- 🖼️ **[Universal-Game-Launcher] Authentic Vector SVG Platform & Console Icons (`PlatformIcon.svelte`):** All platform headers, pills, and fallback capsules across `/library`, `/`, `/store`, `/social`, `/storage`, and `/settings` render custom vector SVG icon variants (`<PlatformIcon />`) representing each actual provider and emulation console logo rather than generic Unicode shapes.
- 🕹️ **[Universal-Game-Launcher] Emulation & Archived ROM Support via Universal Plugins:** EmulationStation (`platform-universal`) and `emulation.rs` support multi-drive ROM discovery, standardized system directory scaffolding (`scaffold_emulation_folders`), and automatic `.zip`/`.7z`/`.rar` extraction into per-game subfolders (`<system_dir>/<CleanTitle>/`) with isolated `saves/` directories and `rom.ini` indexing.
- 🔑 **[Universal-Game-Launcher] Steam Web API Profile Visibility:** `IPlayerService/GetOwnedGames` returns data only when profile game details are public; otherwise Steam returns `403`. Local library data is always discovered offline.
- ⚙️ **[Universal-Game-Launcher] Categorized Inline Settings Workspace (`/settings`):** All application and plugin settings are organized into 5 inline categories (`General`, `Providers`, `API & Credentials`, `Media & Audio`, `Storage & Cache`) with password visibility toggles and real-time connection verification (`🔌 Test Connection`).
- 🌐 **[Universal-Game-Launcher] Out-of-the-Box System Locale:** UI language defaults directly to the host system locale (`navigator.language`).
- 🖥️ **[Universal-Game-Launcher] Single-Game Showcase View & Conditional Left Sidebar:** The custom frameless title bar (`Dashboard`, `Library`, `Store`, `Social`, `Storage`, `Settings`) contains no right quick-filter bar, and the collapsible platform/console accordion sidebar is rendered exclusively on `/library` to drive the single-game showcase view.
- 💾 **[Universal-Game-Launcher] Generic SQLite Database Schema (`database.sqlite`):** Database persistence standardizes on `database.sqlite` / `database.db` decoupled from product branding.
- 🚀 **[Universal-Game-Launcher] Native Launcher Delegation & Zero In-App Transactions:** Game installation, updates, uninstallation, launches, and store checkouts delegate strictly to official platform clients or verified external browser tabs. No user passwords or financial transactions are ever processed inside the app.

### [helix-gaming-db] (projects/helix-gaming-db)
- 🌐 **[helix-gaming-db] Static REST Endpoint Model:** HELIX Gaming DB operates entirely through static, versioned JSON endpoints served via GitHub Pages (`/api/v1/`). Endpoints are immutable per release, highly cacheable, and require no backend server or database infrastructure.
- 📐 **[helix-gaming-db] Strict Schema Validation Invariant:** All game and developer records in `api/v1/` must strictly validate against `schemas/game.schema.json` and `schemas/developer.schema.json` before being committed or published.
- 📚 **[helix-gaming-db] Documentation Theme-Neutrality Invariant:** The documentation site and wiki powered by `helix-docs` explain API specifications, REST conventions, and curation workflows in a theme-neutral manner, never importing author theme references.

---

## 💡 Explicitly Not Bugs

- 💡 **[NH-Reader] Blacklisted Galleries Accessible via Direct Link:** Blacklists govern search discovery, grids, and feeds, but do not prevent opening direct gallery URLs.
- 💡 **[Windhawk-Themes] Different Radii on Taskbar vs Start Menu:** Taskbar uses compact radii (`R1=6`, `R2=20`) because of its compact bar height, whereas Start Menu uses large panel radii (`CornerRadius=35`). This is an intentional design scale hierarchy.
- 💡 **[Windhawk-Themes] Win32 Scrollbars in File Explorer:** DirectUI scrollbars follow system mode rather than custom XAML templates.

---

## ⚠️ Active & Open Bugs

### [helix-docs] (projects/helix-docs)

#### [helix-docs] BUG-4 — `_functions.scss` legacy division triggers Dart Sass deprecation
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟢 Low (cosmetic warning)
- **Status**: ⚠️ open
- **Scope:** `projects/helix-docs/_sass/support/_functions.scss`
- **GitHub Issue:** [#3](https://github.com/HELIX-Origin/helix-docs/issues/3)
- **Symptom:** Dart Sass warns about `/` division (`($px / 16px)`). Compiles cleanly.
- **Resolution**: Replace with `math.div` or `calc()`.

#### [helix-docs] BUG-13 — Default layout home page section cards vs index markup
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (markup constraint)
- **Status**: ⚠️ open / outstanding
- **Scope:** `projects/helix-docs/_layouts/default.html`
- **GitHub Issue:** [#1](https://github.com/HELIX-Origin/helix-docs/issues/1)
- **Symptom:** Inability to have `default.html` automatically partition arbitrary markdown into modular `.doc-section` cards without manual HTML in index files. Wrapping in `.landing-content` left headings bare, while wrapping in a single `.doc-section` collapsed the page into one monolith.
- **Current Pattern**: Home/landing pages author their modular card sections directly in index files using `<section class="doc-section">` with flush-left indentation.

#### [helix-docs] BUG-14 — Broken in-page Table of Contents in standalone docs layout
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (layout limitation)
- **Status**: ⚠️ open / deferred
- **Scope:** `projects/helix-docs/_layouts/docs.html`
- **GitHub Issue:** [#2](https://github.com/HELIX-Origin/helix-docs/issues/2)
- **Symptom:** Dynamic client-side DOM TOC generation in `components/toc.html` was fragile and stripped the left sidebar.
- **Resolution**: Standalone single-column `docs.html` delegates to `layout: wiki` and defaults set `layout: wiki` for `type: docs`, providing the dual sticky sidebar tree across all docs.

---

## ✅ Closed & Resolved Bugs (Bare-Minimal Ledger)

> 📖 **Full Archive Details**: For root-cause investigations, code diffs, and deep technical post-mortems, see [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md).

### [Ecosystem] (workspace root)
- **[Ecosystem] 2026-10-14 — CRLF Line-Ending Churn:** Machine system git config (`core.autocrlf=true`) rewrote line endings. Resolved by adding explicit `.gitattributes` to all repos and setting user-global `core.autocrlf=input`. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#ecosystem--workspace).
- **[Ecosystem-Wide] 2026-10-15 — Chromium / WebView2 Window Class Teardown Error (1412):** Clean Win32 HWND unregistration on app exit via atomic `IS_QUITTING` flag and explicit `window.destroy()`. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#ecosystem--workspace).

### [Universal-Game-Launcher] (projects/Universal-Game-Launcher)
- **[Universal-Game-Launcher] 2026-10-16 — Settings Tabs Unresponsive, Archived ROMs Undetected, Launcher Client False Positives, & Standalone Metadata Resolution (v1.4.0):** Removed conflicting `$effect` in `settings/+page.svelte` that reset `activeTab` to `"general"`; added multi-drive ROM directory autodetection, automatic `.zip`/`.7z` extraction into per-game subfolders with `saves/` isolation and `rom.ini` indexing; excluded launcher client folders/binaries (`Ubisoft Game Launcher`, `upc.exe`, etc.) from game scanning and pruned stale entries; and removed faulty `Standalone & Local` developer/publisher attribution and placeholder descriptions so standalone games resolve full store metadata and artwork.
- **[Universal-Game-Launcher] 2026-10-16 — Circular Import in In-App Plugins Suite Triggering 500 Internal Error (v1.4.0):** Decoupled plugin list definitions into `src/lib/plugins/catalog.ts` and guarded `engine.ts` with lazy initialization, resolving 500 crashes across Dashboard, Store, Social, and Settings pages.
- **[Universal-Game-Launcher] 2026-10-16 — Third-Party Store Metadata & Artwork Mismatches on Standalone/Patreon/Indie Games (v1.4.0):** External storefront queries (e.g. GOG Catalog searching for FFXIV) blindly took search results array index `[0]`, contaminating games with unrelated titles and artwork (e.g. Ys VIII assigned to Final Fantasy XIV). Resolved by implementing modular per-developer metadata catalogs (`src/lib/plugins/metadata/developers/` & `src-tauri/src/metadata/developers.rs`), strict title and franchise matching (`titlesMatchStrict`), cross-developer validation (`validateMetadataCandidate`), and rich hand-rolled metadata and artwork fallbacks for mainstream and Patreon/indie creators (`Crossdressing in Camelot`, `Relicts of Aeson`, `The Last Sovereign`, `Third Crisis`, `My Futa Family`, etc.).
- **[Universal-Game-Launcher] 2026-10-16 — Settings Page Redundant Buttons & Plugins Tab Cleanup (v1.4.0):** Removed duplicate "Plugin Settings" tab button, duplicate credentials card in General Settings, and obsolete AppData folder / URL installer controls in favor of categorized inline settings tabs.
- **[Universal-Game-Launcher] 2026-10-16 — Storage Page UI Hang & Non-Blocking Background Worker (v1.4.0):** Offloaded synchronous disk scan in `get_storage_report` to `tauri::async_runtime::spawn_blocking` in Rust; eliminated blocking `await refresh()` and top-level `{#if report}` DOM teardown in `storage/+page.svelte`.
- **[Universal-Game-Launcher] 2026-10-16 — Cloudflare Blockage & Manifest Fragility via External JSON Plugins (v1.4.0):** Eliminated remote download dependencies and detached cargo crate (`crates/plugin-engine`). Migrated all platform and metadata providers to native in-app modules under `src/lib/plugins/` and `src-tauri/src/`.
- **[Universal-Game-Launcher] 2026-10-16 — Cache Miss Latency, Lack of Persistent Game/Collection Schema, and External File Writes (v1.4.0):** Decoupled app from external launcher file writes; implemented internal collection and KV persistence in `database.sqlite` and `mem_kv` for 0ms transitions; updated styling across all pages to modern dark purple with hardware-accelerated animations (`translateZ(0)`) and zero backdrop blur overhead.
- **[Universal-Game-Launcher] 2026-10-16 — Network Choking & UI Freezing from Discontinued Offline Catalogue & Blocking Dashboard Waterfalls (v1.4.0):** Purged discontinued offline catalogue database schema (`game_catalog`, `catalog_lookups`), deleted 363 KB binary seed, added SQLite WAL/cache PRAGMAs, added sub-millisecond Redis KV library caching, batched artwork state reactivity, and unblocked dashboard mounting.
- **[Universal-Game-Launcher] 2026-10-16 — Package Scripts Violation of `main:sub:option` Standard (v1.3.3):** Realigned scripts to canonical `main:sub:option` hierarchy.
- **[Universal-Game-Launcher] 2026-10-16 — Cross-Platform Compiler Warnings on Linux/macOS (v1.3.2):** Resolved unused `imp` re-export module and unneeded mutable variables.
- **[Universal-Game-Launcher] 2026-10-15 — CSP Image-Src Domain Restriction & Lack of Local Artwork Disk Cache:** Expanded CSP `img-src` to include all store CDN domains; built local disk cache `art_cache/` in Rust.
- **[Universal-Game-Launcher] 2026-10-15 — Free Game Promotion False Positives (v1.3.1):** Validated `discountPrice == 0` and active promotion windows.
- **[Universal-Game-Launcher] 2026-10-15 — Microsoft Store / Xbox UWP Games Undetected & NSIS Hooks:** Added AppModel registry enumeration, NSIS process termination hooks (`hooks.nsh`), 164×314 sidebar bitmap, and tray minimize.
- **[Universal-Game-Launcher] 2026-10-15 — Windows Uninstall Registry Scan Ingesting Uninstallers:** Removed uninstall registry from active game scans; relegated to passive metadata indexing.
- **[Universal-Game-Launcher] 2026-10-15 — EA Games Subfolder Working Directory:** Scored candidate executables by depth; set `start_dir` to immediate parent directory.
- **[Universal-Game-Launcher] 2026-10-15 — Itch.io Electron Cache / Internal Directory Ingestion:** Blacklisted Electron cache folders; added multi-engine game detection.
- **[Universal-Game-Launcher] 2026-10-14 — Missing Metadata for Manually Added Games:** Implemented keyless multi-provider metadata pipeline.
- **[Universal-Game-Launcher] 2026-10-15 — Library 500 Error & Settings Navigation Consolidation:** Restored missing writable store export and consolidated Settings view.

### [Windhawk-Themes] (projects/Windhawk-Themes)
- **[Windhawk-Themes] 2026-10-16 — Reversion of Regressive Start Menu & Taskbar Style Overhauls:** All Start Menu high-contrast border overrides, Quick Settings split button color mismatches, Snap layout container theming regressions, and taskbar overflow flyout background loss were completely eliminated when the maintainer reverted regressive experimental changes in favor of fixing and refining the original, proven Command Center styles. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#windhawk-themes).
- **[Windhawk-Themes] 2026-10-10 — Random explorer.exe Crash During File/Folder Actions:** Confirmed caused by external companion mod `file-operations-styler` hooking Explorer copy/delete dialogs, not Windhawk-Themes stylers. Resolved by disabling the external mod. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#windhawk-themes).
- **[Windhawk-Themes] 2026-10-13 — Static Gate Warnings (Duplicate Target Selectors):** Merged duplicate selector declarations into unified behavior-preserving blocks; static validation gate now passes with 0 errors and 0 warnings.
- **[Windhawk-Themes] 2026-10-06 — Start Menu Pins Centering & Right Drift:** Centered pins with balanced padding and restored 470px width.
- **[Windhawk-Themes] 2026-10-06 — Phone Link Companion Vertical Misalignment:** Aligned companion card top margin flush with search box.

### [NH-Reader] (projects/NH-Reader)
- **[NH-Reader] 2026-10-02 — Blacklist Page Filling & Dynamic Stream Buffer (v0.7.4):** Implemented continuous stream buffering in `api.ts`.
- **[NH-Reader] 2026-10-02 — NSIS Installer Finish Page Text Legibility (v0.7.5):** Reverted finish page to stock MUI palette while keeping branded sidebar bitmap.
- **[NH-Reader] 2026-10-02 — NSIS Korean Language Fallbacks (v0.7.4):** Added Korean translations to `hooks.nsh`.

### [helix-docs] (projects/helix-docs)
- **[helix-docs] BUG-1 / BUG-2 — Sass Compiler Failure (v1.0.0):** Migrated to Dart Sass (`sass-embedded`).
- **[helix-docs] BUG-3 — sass-embedded Binstub Conflict (v1.0.0):** Overwrote conflicting binstub with `--force`.
- **[helix-docs] BUG-5 — Missing faraday-retry Gem (v1.0.0):** Added `gem "faraday-retry"` to Gemfile.
- **[helix-docs] BUG-6 — jekyll-titles-from-headings Title Override (v1.0.0):** Dropped plugin; enforced canonical `title` frontmatter.
- **[helix-docs] BUG-7 — Jekyll 3.x where_exp Syntax Error (v1.0.0):** Replaced multi-condition `where_exp` with `for` + `if` loops.
- **[helix-docs] BUG-8 — Liquid Subscript Filter Precedence (v1.0.0):** Pre-computed subscript offsets before indexing.
- **[helix-docs] BUG-9 — Primer Theme Leak (v1.0.0):** Switched navigation page set to `site.html_pages`.
- **[helix-docs] BUG-10 — Defaults Scope Syntax Linter Warnings (v1.0.0):** Standardized `{path: "", type: ...}` across all configs.
- **[helix-docs] BUG-11 — Duplicate Layout Frontmatter (v1.0.0):** Cleaned duplicate keys across companion doc pages.
- **[helix-docs] BUG-12 — XAML Curly Brace Kramdown Interpolation (v1.0.0):** Wrapped XAML bindings in `{% raw %}` blocks.
- **[helix-docs] BUG-15 — Mermaid Diagrams Rendered as Raw Code Blocks (v1.0.0):** Made `mermaid.html` opt-out (`site.mermaid == false`).
- **[helix-docs] BUG-16 — Sidebar Nav Tree Had No Hierarchy (v1.0.0):** Level-1 category emoji and indented bullet dots with left-aligned markers.
- **[helix-docs] BUG-17 — Sidebar Footer Links Centered (v1.0.0):** Switched footer to `justify-items: start` and `text-align: left`.
- **[helix-docs] BUG-18 — Brand Logo & Favicon Used Raw Relative Paths (v1.0.0):** Resolved from site root across all layout partials.
