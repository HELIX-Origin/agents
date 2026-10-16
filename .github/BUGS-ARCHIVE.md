# BUGS-ARCHIVE.md — HELIX Origin Historical Bug Archive

> 🗄️ **Historical Archive Ledger**: Complete archival records, detailed root-cause analyses, scopes, and post-mortems for verified and closed bugs across the **HELIX Origin** organization.
>
> For active bugs, known platform quirks, and tracking rules, refer to [`BUGS.md`](../BUGS.md).
> Last updated: 2026-10-16

---

## 📜 Archive Index

- [Ecosystem & Workspace](#ecosystem--workspace)
- [Universal-Game-Launcher (formerly Steam-Vault)](#universal-game-launcher-formerly-steam-vault)
- [Windhawk-Themes](#windhawk-themes)
- [NH-Reader](#nh-reader)
- [helix-docs](#helix-docs)

---

## Ecosystem & Workspace

#### [Ecosystem] 2026-10-14 — CRLF line-ending churn across every repository
- **Project Identifier:** `[Ecosystem]`
- **Repository Path:** Workspace Root
- **Severity**: 🟠 High (git working tree churn & false diffs)
- **Status**: ✅ resolved
- **Reported Issue**: Working tree churn and phantom modified files caused by machine system git config (`core.autocrlf=true`).
- **Root Cause**: Windows system-level git configuration rewrote LF to CRLF on checkout.
- **Resolution**:
  1. Added per-repo `.gitattributes` (`* text=auto eol=lf`; explicit text/binary types; `*.bat`/`*.cmd` -> `text eol=crlf`) to workspace root (`4e70f4a`) and all org repos.
  2. Set `core.autocrlf=input` in user-global config (`~/.gitconfig`).
  3. Force-normalized all local working trees to LF.

#### [Ecosystem-Wide] & [Steam-Vault] & [NH-Reader] 2026-10-15 — Chromium / WebView2 Window Class Teardown Error (Error 1412 / Chrome_WidgetWin_0)
- **Project Identifier:** `[Ecosystem-Wide]`, `[Steam-Vault]`, `[NH-Reader]`
- **Repository Path:** `projects/Steam-Vault`, `projects/NH-Reader`
- **Severity**: 🟡 Medium (stderr console warning & unclean Win32 class unregistration)
- **Status**: ✅ resolved
- **Scope**: `projects/Steam-Vault/src-tauri/src/lib.rs`, `projects/NH-Reader/src-tauri/src/lib.rs`, `.agents/skills/tauri-desktop-engineering.md`
- **Reported Issue**: `[1015/163451.244:ERROR:ui\gfx\win\window_impl.cc:172] Failed to unregister class Chrome_WidgetWin_0. Error = 1412` printed to console when closing or quitting.
- **Root Cause**: Win32 error 1412 (`ERROR_CLASS_HAS_WINDOWS`). In Tauri applications implementing tray minimization (`api.prevent_close()` / `window.hide()`), calling `app.exit(0)` while windows are hidden leaves native Win32 HWND handles alive, causing Chromium's `UnregisterClassW` call to fail during runtime teardown.
- **Resolution**:
  1. Introduced atomic `IS_QUITTING` boolean flag in `src-tauri/src/lib.rs`.
  2. Prior to `app.exit(0)` on tray exit, iterate through all `app.webview_windows()` and explicitly invoke `window.destroy()`.
  3. Guarded `WindowEvent::CloseRequested` to ignore `api.prevent_close()` if `IS_QUITTING` is true.
  4. Configured Windows startup environment flag `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = "--disable-logging --log-level=3"`.
  5. Codified standard in `.agents/skills/tauri-desktop-engineering.md`.

---

## Universal-Game-Launcher (formerly Steam-Vault)

#### [Universal-Game-Launcher] 2026-10-16 — Network Choking & UI Freezing from Defunct Offline Catalogue & Blocking Dashboard Waterfalls (v1.4.0)
- **Project Identifier:** `[Universal-Game-Launcher]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🔴 Critical (severe UI freeze & network hanging)
- **Status**: ✅ resolved
- **Reported Issue**: App experienced severe data and performance issues, slow loading times, UI stuttering, and freezing. In-memory Redis and SQLite integration were intended to load instantly, but instead experienced lag.
- **Root Cause**:
  1. *Defunct Catalogue Network Timeouts*: Lookups for missing game metadata and artwork fell back to querying `https://raw.githubusercontent.com/HELIX-Origin/Steam-Vault-Catalogue/main/games/{}.json`. Because that repository was deleted from the organization, every lookup triggered an unresolvable network timeout or 404, hanging async worker threads and choking UI rendering.
  2. *Blocking Dashboard Mount Waterfall*: In `src/routes/+page.svelte`, `refresh()` awaited `loadNotifications()` and `loadDownloads()` before calling `loading.set(false)`. Fetching free game promotions, store deals, and library patch notes over the network blocked the entire dashboard from rendering, even though local library games and storage metrics were already resolved.
  3. *Frontend Svelte Reactivity Thrashing*: In `library/+page.svelte`, `loadLocalArtwork()` fired individual promises for custom artwork and reassigned `customArtworks = { ...customArtworks }` inside each `.then` callback, causing hundreds of reactive re-render cycles.
  4. *Redundant Disk ACF/VDF File Reads*: Navigating between dashboard, library, and settings re-executed `collect_library` from disk without checking fast-path in-memory KV caches.
  5. *Unoptimized SQLite Defaults*: SQLite default PRAGMAs (`journal_mode = DELETE`, small cache size) caused synchronous disk flushes on cache operations.
- **Resolution**:
  1. Completely dropped `game_catalog` and `catalog_lookups` tables from SQLite via runtime migration; removed embedded `src-tauri/src/catalog_seed.bin` (363 KB reduction); wiped all catalogue IPC commands, seed functions, and dead network queries to `HELIX-Origin/Steam-Vault-Catalogue`.
  2. Configured aggressive SQLite performance PRAGMAs in `init_schema()`: `PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA cache_size = -64000; PRAGMA temp_store = MEMORY; PRAGMA mmap_size = 268435456;`.
  3. Implemented fast-path Redis KV caching (`library:default`, TTL 30s) in `load_library` with automatic cache invalidation on mutations (game installation, renaming, platform changes), enabling sub-millisecond tab navigation.
  4. Batched custom artwork loading in `loadLocalArtwork()` using `Promise.allSettled` and a single dictionary assignment.
  5. Unblocked dashboard mounting in `+page.svelte` by setting `loading.set(false)` immediately after local library and storage report resolve, executing background notification feeds asynchronously without blocking the UI.

#### [Universal-Game-Launcher] 2026-10-16 — WinGet Emulation Rejection Risk & Product Rebranding (v1.4.0)
- **Project Identifier:** `[Universal-Game-Launcher]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🔴 Critical (repository policy compliance & product alignment)
- **Status**: ✅ resolved
- **Reported Issue**: Emulation and ROM management tools present copyright and anti-piracy risks on the Microsoft WinGet repository (`microsoft/winget-pkgs`). In addition, product naming and database paths were tightly coupled to Steam-Vault.
- **Resolution**:
  1. Fully purged all emulation modules, detectors, ROM scanners, ES-DE directory scaffolding, and emulator UI filters from backend Rust and frontend SvelteKit.
  2. Rebranded product to `Universal Game Launcher`, package to `universal-game-launcher`, crate to `universal_game_launcher_lib`, and identifier to `org.helixorigin.universal-game-launcher` with updated branding across all 28 locale translation files.
  3. Standardized SQLite persistence on generic `database.sqlite` / `database.db` with automated seamless migration from legacy `steam-vault/metadata.db`.
  4. Added modern visual identity: dark futuristic purple controller 16:9 branding SVG (`universal-game-launcher.svg`), 256×256 squircle logo, standard Tauri v2 164×314 NSIS sidebar bitmap, and animated startup splash transition.

#### [Steam-Vault] 2026-10-16 — WinGet Publish Workflow Installer Download Pattern Mismatch
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (workflow failure)
- **Status**: ✅ resolved (Hotfix v1.3.3)
- **Resolution**: Updated `publish-winget.yml` to accept glob patterns (`*x64-setup.exe`) for `gh release download -p` rather than regex expressions.

#### [Steam-Vault] 2026-10-16 — Package Scripts Violation of `main:sub:option` Standard
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟡 Medium (script naming standard violation)
- **Status**: ✅ resolved (Hotfix v1.3.3)
- **Resolution**: Standardized scripts in `package.json` to canonical `main:sub:option` hierarchy (`winget:manifest:generate`, `winget:manifest:verify`, `winget:manifest:install`).

#### [Steam-Vault] 2026-10-16 — Cross-Platform Compiler Warnings on Linux/macOS CI Pipelines
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟢 Low (build diagnostics)
- **Status**: ✅ resolved (Hotfix v1.3.2)
- **Resolution**: Removed unused `imp` re-export module in `windows.rs`, added `#[allow(unused_mut)]` on `detection` in `detectors.rs`, and prefixed unused parameter `_mounted_drives` in `launchers.rs`.

#### [Steam-Vault] 2026-10-15 — CSP Image-Src Domain Restriction & Lack of Local Artwork Disk Cache Triggering Remote Load Failure
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🔴 Critical (total image failure in Library Grid & repeated network requests)
- **Status**: ✅ resolved
- **Scope**: `src-tauri/tauri.conf.json`, `src/routes/library/+page.svelte`, `src-tauri/src/cache.rs`, `src-tauri/src/commands.rs`
- **Reported Issue**: Library game capsules failed to load due to strict CSP image-src domain restrictions in WebView2, and missing persistent artwork cache forced repeat remote downloads on every render.
- **Resolution**:
  1. Expanded CSP `img-src` in `tauri.conf.json` to allow `https://*.steamstatic.com`, `https://*.akamaihd.net`, `https://*.steamgriddb.com`, `https://images.igdb.com`, `https://*.gog.com`, `https://*.gog-statics.com`, `https://*.pcgamingwiki.com`, `https://upload.wikimedia.org`, `blob:`, and `data:`.
  2. Implemented local artwork caching in Rust (`<data_dir>/universal-game-launcher/art_cache/`) with embedded in-memory fast-lookup cache layer.
  3. Prioritized local cached art in frontend cover resolution.

#### [Steam-Vault] 2026-10-15 — Free Game Promotion False Positives & Multi-Platform Architecture
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (incorrect user notification & pricing mismatch)
- **Status**: ✅ resolved (Patch v1.3.1)
- **Resolution**: Re-architected free game checker into modular per-platform files (`platforms/promotions/epic.rs`, `steam.rs`, `gog.rs`, `gamerpower.rs`). Enforced strict validation: only games with `discountPrice == 0` and active 0% promotional offers are marked `isActive: true`.

#### [Steam-Vault] 2026-10-15 — Microsoft Store / Xbox UWP Games Undetected, Missing Custom NSIS Hooks, and Lacking Tray Support
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (functional defect & installer parity)
- **Status**: ✅ resolved
- **Resolution**: Implemented Windows AppModel repository registry enumeration and `WindowsApps` scanning in `detect_xbox`; ported custom NSIS process termination hooks (`hooks.nsh`) and 164x314 sidebar bitmap; added Tauri system tray with close-to-tray handling.

#### [Steam-Vault] 2026-10-15 — Windows Uninstall Registry Scan Ingesting Uninstallers & Duplicating Library Titles
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (library pollution & duplicates)
- **Status**: ✅ resolved
- **Resolution**: Removed `detect_registry_based()` from active game scans; relegated uninstall registry to passive metadata indexing; implemented real directory scanners for Ubisoft Connect, Battle.net, and Rockstar Games.

#### [Steam-Vault] 2026-10-15 — EA Games Subfolder Working Directory & Odd Entry Discovery
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (launch failure & folder pollution)
- **Status**: ✅ resolved
- **Resolution**: Blacklisted EA log/installer directories (`InstallData`, `Logs`, `PLR`, `__Installer`); scored candidate binaries by directory depth; fixed shortcut `start_dir` to prioritize immediate parent directory.

#### [Steam-Vault] 2026-10-15 — Itch.io Electron Cache/Internal Directory Ingestion & Indie Engine Support
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟡 Medium (false positives & missing indie titles)
- **Status**: ✅ resolved
- **Resolution**: Blacklisted Electron and framework cache folders; implemented multi-engine detection for HTML5, NW.js, Ren'Py, RPG Maker, Godot, Love2D, Java, and Python.

#### [Steam-Vault] 2026-10-14 — Missing Developer/Publisher/Metadata Collections for Non-Steam Shortcuts
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (functional defect)
- **Status**: ✅ resolved
- **Resolution**: Implemented multi-provider metadata pipeline for non-Steam shortcuts (`metadata::vndb`, `metadata::steam_search`, `metadata::local`, PCGamingWiki); added `split_entities` in `autocat.rs` to break delimited entities into individual collections.

#### [Steam-Vault] 2026-10-15 — Library 500 Error, Artwork Application Refusal, and Settings Navigation Consolidation
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🔴 Critical (app render failure & layout regressions)
- **Status**: ✅ resolved
- **Resolution**: Restored missing `loading` writable store export; added WebP and ICO artwork support; integrated Steam-parity Artwork Manager tab into per-game Manage modal; consolidated `/collections`, `/platforms`, and `/organize` into tabbed sections inside `/settings`.

---

## Windhawk-Themes

#### [Windhawk-Themes] 2026-10-16 — Reversion of Regressive Start Menu & Taskbar Style Overhauls
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟠 High (visual regression across multiple stylers)
- **Status**: ✅ resolved
- **Reported Issues**:
  1. Start Menu Styler override stripped native high-contrast boundaries.
  2. Action Center Quick Settings split buttons showed color mismatches across toggle and chevron halves.
  3. Snap layout internal elements lacked consistent glass theming.
  4. Taskbar system tray overflow flyout rendered with missing or transparent backgrounds.
  5. Radii vocabulary drift between Notification Center and Start Menu.
- **Resolution**: All issues were completely eliminated when the maintainer reverted regressive experimental changes in favor of fixing and refining the original, proven Command Center styles.

#### [Windhawk-Themes] 2026-10-10 — Random explorer.exe Crash During File/Folder Actions
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🔴 Critical (shell crash)
- **Status**: ✅ resolved
- **Reported Issue**: Random `explorer.exe` crash during copy/move/delete operations and folder navigation.
- **Root Cause**: Confirmed external companion Windhawk mod **`file-operations-styler`** hooking Windows copy/delete dialogs; not caused by Command Center stylers.
- **Resolution**: Resolved by disabling the external `file-operations-styler` mod.

#### [Windhawk-Themes] 2026-10-13 — Static Gate Warnings: Duplicate Target Selectors After Suite Refactor
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟢 Low (config hygiene)
- **Status**: ✅ resolved
- **Resolution**: Merged duplicate selector declarations into unified behavior-preserving blocks in `windows-11-start-menu-styler.yml` and `windows-11-taskbar-styler.yml`, passing `Test-WindhawkStyles.ps1` with 0 errors and 0 warnings.

#### [Windhawk-Themes] 2026-10-06 — Start Menu Pins Centering & Right Drift
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟡 Medium (visual alignment)
- **Status**: ✅ resolved
- **Resolution**: Centered pins with balanced padding and restored 470px compact panel width.

#### [Windhawk-Themes] 2026-10-06 — Phone Link Companion Vertical Misalignment
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟡 Medium (visual alignment)
- **Status**: ✅ resolved
- **Resolution**: Aligned companion card top margin flush with the search box.

---

## NH-Reader

#### [NH-Reader] 2026-10-02 — Blacklist page filling & dynamic stream buffer
- **Project Identifier:** `[NH-Reader]`
- **Repository Path:** `projects/NH-Reader`
- **Severity**: 🟠 High (UX degradation)
- **Status**: ✅ resolved (v0.7.4)
- **Resolution**: Implemented continuous stream buffering in `src/lib/api.ts` (`streamBackfilledList`) with reactive `blacklistVersion` tracking.

#### [NH-Reader] 2026-10-02 — NSIS installer finish page text legibility
- **Project Identifier:** `[NH-Reader]`
- **Repository Path:** `projects/NH-Reader`
- **Severity**: 🟡 Medium (installer cosmetic)
- **Status**: ✅ resolved (v0.7.5)
- **Resolution**: Reverted to stock MUI palette while keeping branded sidebar bitmap; fixed synchronous uninstaller execution with `_?=$INSTDIR` and `ExecWait`.

#### [NH-Reader] 2026-10-02 — NSIS Korean language string fallbacks
- **Project Identifier:** `[NH-Reader]`
- **Repository Path:** `projects/NH-Reader`
- **Severity**: 🟢 Low (installer warnings)
- **Status**: ✅ resolved (v0.7.4)
- **Resolution**: Added Korean translations to `hooks.nsh`.

---

## helix-docs

#### [helix-docs] BUG-1 / BUG-2 — Sass compiler failure
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🔴 Critical (build failure)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Adopted Dart Sass (`sass-embedded` 1.105.1), verifying 432/432 styling rules.

#### [helix-docs] BUG-3 — sass-embedded binstub conflict
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (setup conflict)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Overwrote conflicting binstub with `--force`.

#### [helix-docs] BUG-5 — Missing faraday-retry gem
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (API fragility)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Added `gem "faraday-retry"` to Gemfile outside `:jekyll_plugins`.

#### [helix-docs] BUG-6 — jekyll-titles-from-headings collection title override
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟠 High (navigation breakdown)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Dropped plugin; enforced canonical `title` frontmatter.

#### [helix-docs] BUG-7 — Jekyll 3.x where_exp multi-condition syntax error
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟠 High (render failure)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Replaced multi-condition `where_exp` with `for` + `if` loops.

#### [helix-docs] BUG-8 — Liquid array subscript filter precedence
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (pagination math)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Pre-computed subscript offsets before indexing.

#### [helix-docs] BUG-9 — Primer theme leak
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (asset conflict)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Switched navigation page set to `site.html_pages`.

#### [helix-docs] BUG-10 — Defaults scope syntax linter warnings
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟢 Low (linter warning)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Standardized `{path: "", type: ...}` across all configs.

#### [helix-docs] BUG-11 — Duplicate layout frontmatter
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟢 Low (metadata warning)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Cleaned duplicate keys across companion doc pages.

#### [helix-docs] BUG-12 — XAML curly brace Kramdown interpolation
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (documentation syntax error)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Wrapped XAML bindings in `{% raw %}` blocks.

#### [helix-docs] BUG-15 — Mermaid diagrams rendered as raw code blocks
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟠 High (diagram render failure)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Inverted `components/mermaid.html` gate to opt-out (`site.mermaid == false`).

#### [helix-docs] BUG-16 — Sidebar nav tree had no hierarchy
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (visual UX)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Implemented level-1 category emoji and indented sub-page bullet dots with left-aligned markers.

#### [helix-docs] BUG-17 — Sidebar footer links were centered
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟢 Low (cosmetic alignment)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Switched footer to `justify-items: start` and `text-align: left`.

#### [helix-docs] BUG-18 — Brand logo & favicon used raw relative paths
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (broken asset links on sub-pages)
- **Status**: ✅ resolved (v1.0.0)
- **Resolution**: Resolved `logo` and `favicon` from site root across layout partials.
