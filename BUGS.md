# BUGS.md — HELIX Origin Consolidated Bug Tracker

> 🐛 **Living Source of Truth**: Unified tracking ledger for active bugs, environment quirks, and platform limitations across all repositories in the **HELIX Origin** organization.
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (direction), [`PLAN.md`](./PLAN.md) (sprint execution), and [`TODO.md`](./TODO.md) (task ledger).
> Complete historical post-mortems for resolved bugs live in [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md).
> Last updated: 2026-10-16

---

## 📜 Tracking Rules

- **Bare Minimal Ledger**: Resolved bugs are recorded as concise single-line entries here. Detailed root-cause analyses, scopes, and post-mortems are archived in [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md) to keep this living document clean and focused.
- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Mandatory Project Tagging**: **Every bug, quirk, and resolved issue must explicitly state its project name and repository path** (`[<project-name>] (<project-path>)`). Unscoped entries are strictly prohibited so agents never conflate repositories.
- **Active Items First**: The currently active bugs and workstreams must always precede resolved and closed archives.
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
- 🔍 **[NH-Reader] Search Semantics:** Syntax and range logic follow nhentai's query engine.
- 🔐 **[NH-Reader] Code Signing Identity:** Automated CI release packaging does not publish unsigned or self-signed release binaries without a trusted organization certificate. Local signing commands are provided in `package.json`.

### [Universal-Game-Launcher] (formerly Steam-Vault) (projects/Steam-Vault)
- 🚫 **[Universal-Game-Launcher] Zero External File Writes (Native App Isolation Invariant):** Universal Game Launcher never writes to, modifies, or backs up Steam's internal files (`shortcuts.vdf` or `cloud-storage-namespace-1.json`). Game records, collections, categories, display names, and user preferences persist exclusively in our own SQLite database (`database.sqlite`) and in-memory Redis KV tier (`mem_kv`).
- 🧩 **[Universal-Game-Launcher] Legacy Steam Tags/Collections Read-Only Discovery:** Steam tags and cloud collection files are read solely for initial one-time discovery. All user edits, additions, and deletions are saved strictly in our internal database.
- 🔑 **[Universal-Game-Launcher] Steam Web API Profile Visibility:** `IPlayerService/GetOwnedGames` returns data only when profile game details are public; otherwise Steam returns `403`. Local library data is unaffected.
- 🔌 **[Universal-Game-Launcher] Provider Fragility (keyless sources):** PCGamingWiki and Wikipedia are keyless, best-effort providers and may change shape; Steam Store `appdetails` is rate-limited. These are supplementary and never required.
- 🏷️ **[Universal-Game-Launcher] Metadata Warming Is Network-Heavy:** Full library sync can trip Steam Store rate limits; cached entries are reused and failures skipped. Run deliberately via Organize view's **Sync metadata**.
- 🖥️ **[Universal-Game-Launcher] Platform Detection Depends on Local Sources:** Launcher manifests, GOG registry, itch app library, Windows AppModel/WindowsApps packages, and Uninstall registry are read offline without external logins.
- 🌐 **[Universal-Game-Launcher] Owned-Library Sync Needs a Public Profile:** `refresh_owned_games` uses `IPlayerService/GetOwnedGames` requiring an API key and public profile. Installed games are always read locally.
- 🎭 **[Universal-Game-Launcher] Manually Added Game Attribution Is Best-Effort:** Standalone executables and custom games added outside official storefronts have no launcher platform recorded and show as "Other" until attributed in `<config>/universal-game-launcher/platform-map.json`.
- 💽 **[Universal-Game-Launcher] Storage Moves Are Real File Operations:** Cross-drive moves physically copy data. Steam must be closed and adequate free space verified.
- 🔑 **[Universal-Game-Launcher] Minimized External Metadata Providers & Optional API Keys:** Out of the box, relies on official storefront sources (Steam Store API / ACF manifests, GOG Galaxy DB, Epic manifests, Xbox AppxManifest). Optional external API keys (Steam Web API, SteamGridDB, IGDB) are used primarily for manually added titles and missing artwork.
- 🛡️ **[Universal-Game-Launcher] Discontinued WinGet Plans & Zero-Emulation Invariant:** WinGet publication plans and automated workflows have been dropped to focus on independent distribution. Emulation and ROM management tools remain permanently purged across the entire codebase.
- 🧩 **[Universal-Game-Launcher] Drop-In Self-Contained Plugin Engine:** All platform integrations, metadata engines, and utilities run as self-contained drop-in plugins loaded dynamically via `index.json`. The app core contains zero hardcoded plugin code. Support for GitHub-hosted repository entry points enables community developers to distribute and maintain independent plugins.
- 🌐 **[Universal-Game-Launcher] Out-of-the-Box System Locale:** UI language defaults directly to the host system locale (`navigator.language`) out of the box, eliminating the need for bulky hand-rolled localization files in core. Custom translation packages can be authored as drop-in plugins.
- 🖼️ **[Universal-Game-Launcher] Single-Game Showcase View & Zero-Grid Architecture:** The heavy multi-card grid layout in `/library` has been completely eliminated in favor of a Steam/GOG-style dedicated showcase view and left game list sidebar, completely eliminating missing artwork, WebView2 layout thrashing, and composite hangs.
- 💾 **[Universal-Game-Launcher] Generic SQLite Database Schema (`database.sqlite`):** Database persistence standardizes on `database.sqlite` / `database.db` decoupled from product branding, with automatic migration from legacy `steam-vault/metadata.db`.
- 🚀 **[Universal-Game-Launcher] Native Launcher Delegation Architecture:** Game installation, updates, uninstallation, and launches delegate strictly to installed official client protocols (`steam://`, `com.epicgames.launcher://`, `goggalaxy://`, `uplay://`), eliminating password storage and security liabilities while preserving official launcher overlays, cloud synchronization, friend lists, playtime tracking, and achievement unlocks.
- 💳 **[Universal-Game-Launcher] Storefront Delegation & Zero In-App Transactions:** In any future Store integration, transactions and checkout flows must strictly delegate to official platform clients or verified external browser tabs. No financial transactions, card details, or payment processing are ever conducted within the app.

---

## 💡 Explicitly Not Bugs

- 💡 **[NH-Reader] Blacklisted Galleries Accessible via Direct Link:** Blacklists govern search discovery, grids, and feeds, but do not prevent opening direct gallery URLs.
- 💡 **[Windhawk-Themes] Different Radii on Taskbar vs Start Menu:** Taskbar uses compact radii (`R1=6`, `R2=20`) because of its compact bar height, whereas Start Menu uses large panel radii (`CornerRadius=35`). This is an intentional design scale hierarchy.
- 💡 **[Windhawk-Themes] Win32 Scrollbars in File Explorer:** DirectUI scrollbars follow system mode rather than custom XAML templates.
- 💡 **[Universal-Game-Launcher] RAWG Is Not Supported:** RAWG is defunct, so no RAWG provider exists. This is intentional.

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

### [Universal-Game-Launcher] (formerly Steam-Vault) (projects/Steam-Vault)
- **[Universal-Game-Launcher] 2026-10-16 — Cache Miss Latency, Lack of Persistent Game/Collection Schema, and External Steam Writes (v1.4.0):** Decoupled app from Steam file writes; implemented internal collection and KV persistence in `database.sqlite` and `mem_kv` for 0ms transitions; eliminated all `ensure_steam_closed()` locks; purged unneeded external scrapers; updated styling across all pages to modern dark purple with hardware-accelerated animations (`translateZ(0)`) and zero backdrop blur overhead. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#universal-game-launcher-formerly-steam-vault).
- **[Universal-Game-Launcher] 2026-10-16 — Network Choking & UI Freezing from Defunct Offline Catalogue & Blocking Dashboard Waterfalls (v1.4.0):** Purged discontinued offline catalogue database schema (`game_catalog`, `catalog_lookups`), deleted 363 KB binary seed, removed dead network lookups to deleted repository `HELIX-Origin/Steam-Vault-Catalogue`, added SQLite WAL/cache PRAGMAs, added sub-millisecond Redis KV library caching, batched artwork state reactivity, and unblocked dashboard mounting from background notification feeds. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#universal-game-launcher-formerly-steam-vault).
- **[Universal-Game-Launcher] 2026-10-16 — WinGet Emulation Rejection Risk & Product Rebranding (v1.4.0):** Purged all emulation code and ROM scanners for WinGet repository compliance; rebranded product to Universal Game Launcher; standardized SQLite on generic `database.sqlite` / `database.db`. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#universal-game-launcher-formerly-steam-vault).
- **[Steam-Vault] 2026-10-16 — WinGet Publish Workflow Installer Download Pattern Mismatch (v1.3.3):** Updated `publish-winget.yml` to accept glob pattern `*x64-setup.exe`.
- **[Steam-Vault] 2026-10-16 — Package Scripts Violation of `main:sub:option` Standard (v1.3.3):** Realigned scripts to canonical `main:sub:option` hierarchy (`winget:manifest:generate`, `winget:manifest:verify`, `winget:manifest:install`).
- **[Steam-Vault] 2026-10-16 — Cross-Platform Compiler Warnings on Linux/macOS (v1.3.2):** Resolved unused `imp` re-export module and unneeded mutable variables.
- **[Steam-Vault] 2026-10-15 — CSP Image-Src Domain Restriction & Lack of Local Artwork Disk Cache:** Expanded CSP `img-src` to include all store CDN domains; built local disk cache `art_cache/` in Rust.
- **[Steam-Vault] 2026-10-15 — Free Game Promotion False Positives (v1.3.1):** Validated `discountPrice == 0` and active promotion windows; modularized checkers into per-platform files.
- **[Steam-Vault] 2026-10-15 — Microsoft Store / Xbox UWP Games Undetected & NSIS Hooks:** Added AppModel registry enumeration, NSIS process termination hooks (`hooks.nsh`), 164x314 sidebar bitmap, and tray minimize.
- **[Steam-Vault] 2026-10-15 — Windows Uninstall Registry Scan Ingesting Uninstallers:** Removed uninstall registry from active game scans; relegated to passive metadata indexing.
- **[Steam-Vault] 2026-10-15 — EA Games Subfolder Working Directory:** Scored candidate executables by depth; set `start_dir` to immediate parent directory.
- **[Steam-Vault] 2026-10-15 — Itch.io Electron Cache / Internal Directory Ingestion:** Blacklisted Electron cache folders; added multi-engine game detection.
- **[Steam-Vault] 2026-10-14 — Missing Metadata Collections for Manually Added Games:** Implemented keyless multi-provider metadata pipeline and entity splitting in `autocat.rs`.
- **[Steam-Vault] 2026-10-15 — Library 500 Error & Settings Navigation Consolidation:** Restored missing writable store export; integrated tabbed Steam-parity Artwork Manager; consolidated Settings view into 2x2 grid.

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
