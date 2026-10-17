# BUGS-ARCHIVE.md — HELIX Origin Historical Bug Archive

> 🗄️ **Historical Archive Ledger**: Complete archival records, root-cause analyses, scopes, and post-mortems for verified and closed bugs across the **HELIX Origin** organization (`helix-docs`, `helix-origin.github.io`, `NH-Reader`, `Universal-Game-Launcher`, `Theme-Toolkit`, `Windhawk-Themes`).
>
> For active bugs, known platform quirks, and tracking rules, refer to [`BUGS.md`](../BUGS.md).
> Last updated: 2026-10-16

---

## 📜 Archive Index

- [Ecosystem & Workspace](#ecosystem--workspace)
- [Universal-Game-Launcher](#universal-game-launcher)
- [Windhawk-Themes](#windhawk-themes)
- [NH-Reader](#nh-reader)
- [helix-docs](#helix-docs)

---

## Ecosystem & Workspace

#### [Ecosystem] (Workspace Root) 2026-10-14 — CRLF Line-Ending Churn Across Repositories
- **Project Identifier:** `[Ecosystem]` (`./`)
- **Severity:** 🟠 High (git working tree churn & false diffs)
- **Status:** ✅ Resolved
- **Reported Issue:** Working tree churn and phantom modified files caused by machine system git config (`core.autocrlf=true`).
- **Root Cause:** Windows system-level git configuration rewrote LF to CRLF on checkout.
- **Resolution:**
  1. Added per-repo `.gitattributes` (`* text=auto eol=lf`; explicit text/binary types; `*.bat`/`*.cmd` → `text eol=crlf`) to the workspace root and all organization repositories.
  2. Configured `core.autocrlf=input` and normalized all working trees to LF.

#### [Ecosystem-Wide] (`projects/Universal-Game-Launcher`, `projects/NH-Reader`) 2026-10-15 — Chromium / WebView2 Window Class Teardown Error (Error 1412 / Chrome_WidgetWin_0)
- **Project Identifiers:** `[Ecosystem-Wide]`, `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`), `[NH-Reader]` (`projects/NH-Reader`)
- **Severity:** 🟡 Medium (stderr console warning & unclean Win32 class unregistration)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/src/lib.rs`, `.agents/skills/tauri-desktop-engineering.md`
- **Reported Issue:** `[ERROR:ui\gfx\win\window_impl.cc:172] Failed to unregister class Chrome_WidgetWin_0. Error = 1412` printed to console when closing or quitting.
- **Root Cause:** Win32 error 1412 (`ERROR_CLASS_HAS_WINDOWS`). In Tauri applications implementing tray minimization (`api.prevent_close()` / `window.hide()`), calling `app.exit(0)` while windows are hidden leaves native Win32 HWND handles alive, causing Chromium's `UnregisterClassW` call to fail during runtime teardown.
- **Resolution:**
  1. Introduced atomic `IS_QUITTING` boolean flag in `src-tauri/src/lib.rs`.
  2. Prior to `app.exit(0)` on tray exit, iterate through all `app.webview_windows()` and explicitly invoke `window.destroy()`.
  3. Guarded `WindowEvent::CloseRequested` to bypass `api.prevent_close()` when `IS_QUITTING` is true.
  4. Configured Windows startup environment variable `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = "--disable-logging --log-level=3"` and codified the pattern in `.agents/skills/tauri-desktop-engineering.md`.

---

## Universal-Game-Launcher

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-16 — Circular Import in In-App Plugins Suite Triggering 500 Internal Error Across App Pages (v1.4.0)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🔴 Critical (500 internal error crash on Dashboard, Store, Social, and Settings pages)
- **Status:** ✅ Resolved
- **Scope:** `src/lib/plugins/index.ts`, `src/lib/plugins/engine.ts`, `src/lib/plugins/catalog.ts`
- **Reported Issue:** Loading the Dashboard (`/`), Store (`/store`), Social (`/social`), or Settings (`/settings`) route triggered an immediate SvelteKit 500 Internal Error.
- **Root Cause:** `src/lib/plugins/index.ts` re-exported `./engine` before defining `ALL_PLUGINS`, while `engine.ts` imported `ALL_PLUGINS` from `./index` and iterated over it inside `new PluginEngineManager()`, hitting a Temporal Dead Zone (TDZ) `TypeError: ALL_PLUGINS is not iterable`.
- **Resolution:**
  1. Extracted plugin registries into a leaf module `src/lib/plugins/catalog.ts` with zero imports from `engine.ts` or `index.ts`.
  2. Updated `engine.ts` to import `ALL_PLUGINS` directly from `./catalog` with a defensive `ensureInitialized()` guard.

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-16 — Blocking Dashboard Mount Waterfall, Svelte Reactivity Thrashing & SQLite WAL Tuning (v1.4.0)
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🔴 Critical (UI freeze & slow tab switching)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/src/cache.rs`, `src-tauri/src/commands.rs`, `src/routes/+page.svelte`, `src/routes/library/+page.svelte`
- **Reported Issue:** Navigating between views and mounting the dashboard experienced lag and UI stuttering instead of sub-millisecond in-memory cache loads.
- **Root Cause:**
  1. Legacy offline seed lookup code attempted network requests against discontinued endpoints.
  2. `src/routes/+page.svelte` awaited remote promotion/deal network fetches before clearing `loading.set(false)`.
  3. `loadLocalArtwork()` in `library/+page.svelte` reassigned `customArtworks` inside individual `.then()` callbacks instead of batching.
  4. SQLite used default synchronous disk journal settings rather than WAL + memory-mapped I/O.
- **Resolution:**
  1. Purged all legacy offline catalog tables and network fallbacks from `cache.rs` and `commands.rs`.
  2. Configured SQLite WAL performance PRAGMAs (`journal_mode = WAL`, `synchronous = NORMAL`, `cache_size = -64000`, `temp_store = MEMORY`, `mmap_size = 268435456`).
  3. Added fast-path in-memory KV caching (`library:default`) in `load_library` and batched artwork resolution via `get_cached_artwork_batch`.
  4. Unblocked dashboard mounting so local library and storage metrics render immediately while notifications load asynchronously in the background.

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-15 — CSP Image-Src Domain Restriction & Local Artwork Disk Cache
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🔴 Critical (remote capsule image load failures)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/tauri.conf.json`, `src-tauri/src/cache.rs`, `src-tauri/src/commands.rs`, `src/routes/library/+page.svelte`
- **Reported Issue:** Remote store and metadata provider images failed to render under WebView2 CSP restrictions and re-downloaded on every session.
- **Resolution:**
  1. Expanded CSP `img-src` in `tauri.conf.json` to allow `https://*.steamstatic.com`, `https://*.akamaihd.net`, `https://*.steamgriddb.com`, `https://images.igdb.com`, `https://*.gog.com`, `https://*.gog-statics.com`, `https://*.pcgamingwiki.com`, `https://upload.wikimedia.org`, `https://thumbnails.libretro.com`, `blob:`, and `data:`.
  2. Implemented persistent local artwork disk caching (`<data_dir>/universal-game-launcher/art_cache/`) paired with an in-memory fast-lookup map (`mem_art`) and `get_cached_artwork_batch`.

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-15 — Free Game Promotion False Positives & Multi-Platform Promotions Architecture
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🟠 High (non-free discounted games appearing in free game notifications)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/src/platforms/promotions/{mod,epic,steam,gog,gamerpower}.rs`
- **Resolution:** Enforced strict `discountPrice == 0` and active promotional window verification across Epic Games, Steam, GOG, and GamerPower so only genuinely 100% free giveaways appear in active free game alerts.

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-15 — Microsoft Store / Xbox UWP Discovery, Custom NSIS Hooks & System Tray Support
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🟠 High (missing UWP game detection & installer lifecycle)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/src/platforms/detectors.rs`, `src-tauri/windows/hooks.nsh`, `src-tauri/src/lib.rs`
- **Resolution:** Added Windows AppModel registry enumeration and `WindowsApps` manifest parsing (`shell:AppsFolder\` AUMID launch targets), custom NSIS process-termination hooks (`hooks.nsh`), 164×314 BMP3 sidebar artwork, and system tray close-to-tray handling.

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-15 — Uninstall Registry False Positives, EA Subfolder Working Directories & Itch.io Engine Sniffing
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🟠 High (uninstaller/launcher binary ingestion & working directory launch errors)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/src/platforms/detectors.rs`, `src-tauri/src/metadata/local.rs`, `src-tauri/src/plugins/engine.rs`
- **Resolution:**
  1. Relegated Windows Uninstall registry to passive metadata enrichment and built dedicated manifest/folder scanners for Ubisoft Connect, Battle.net, EA App, and Rockstar Games.
  2. Excluded launcher clients (`Ubisoft Game Launcher`, `upc.exe`, `EADesktop.exe`, `Launcher`, `Legendary`) and internal framework caches (`InstallData`, `Logs`, `__Installer`, `broth`, `downloads`).
  3. Set game `start_dir` to the executable's immediate parent directory and added multi-engine local metadata extraction for RPG Maker (`www/data/System.json`), Ren'Py, Unity, Unreal, Godot, Love2D, and itch.io `.itch/receipt.json.gz`.

#### [Universal-Game-Launcher] (`projects/Universal-Game-Launcher`) 2026-10-16 — Cross-Platform Compiler Warnings & Package Script Hierarchy Alignment
- **Project Identifier:** `[Universal-Game-Launcher]` (`projects/Universal-Game-Launcher`)
- **Severity:** 🟢 Low (Linux/macOS compiler warnings & script naming conventions)
- **Status:** ✅ Resolved
- **Scope:** `src-tauri/src/platforms/{windows,detectors,launchers}.rs`, `package.json`
- **Resolution:** Eliminated non-Windows unused import/mutability warnings in `platforms/` and standardized all `package.json` scripts on the workspace `main:sub:option` hierarchy.

---

## Windhawk-Themes

#### [Windhawk-Themes] (`projects/Windhawk-Themes`) 2026-10-16 — Reversion of Experimental Start Menu & Taskbar Style Overhauls
- **Project Identifier:** `[Windhawk-Themes]` (`projects/Windhawk-Themes`)
- **Severity:** 🟠 High (visual regression across multiple stylers)
- **Status:** ✅ Resolved
- **Resolution:** Reverted experimental style overhauls in favor of refining the proven Command Center configurations.

#### [Windhawk-Themes] (`projects/Windhawk-Themes`) 2026-10-13 — Static Gate Duplicate Target Selector Warnings
- **Project Identifier:** `[Windhawk-Themes]` (`projects/Windhawk-Themes`)
- **Severity:** 🟢 Low (config hygiene)
- **Status:** ✅ Resolved
- **Resolution:** Merged duplicate target selector declarations into unified blocks in `windows-11-start-menu-styler.yml` and `windows-11-taskbar-styler.yml`, passing `Test-WindhawkStyles.ps1` with 0 errors and 0 warnings.

#### [Windhawk-Themes] (`projects/Windhawk-Themes`) 2026-10-10 — External Companion Mod `explorer.exe` Crash Isolation
- **Project Identifier:** `[Windhawk-Themes]` (`projects/Windhawk-Themes`)
- **Severity:** 🔴 Critical (shell crash during file operations)
- **Status:** ✅ Resolved
- **Resolution:** Isolated crash root cause to an external third-party file-operations mod hooking Windows copy/delete dialogs rather than the repository's XAML styler configurations.

#### [Windhawk-Themes] (`projects/Windhawk-Themes`) 2026-10-06 — Start Menu Pins Centering & Phone Link Companion Vertical Alignment
- **Project Identifier:** `[Windhawk-Themes]` (`projects/Windhawk-Themes`)
- **Severity:** 🟡 Medium (visual alignment)
- **Status:** ✅ Resolved
- **Resolution:** Centered pinned apps with balanced padding in the 470px compact panel and aligned the companion card top margin flush with the search box.

---

## NH-Reader

#### [NH-Reader] (`projects/NH-Reader`) 2026-10-02 — Blacklist Page Filling & Dynamic Stream Buffer
- **Project Identifier:** `[NH-Reader]` (`projects/NH-Reader`)
- **Severity:** 🟠 High (UX degradation on filtered pages)
- **Status:** ✅ Resolved (v0.7.4)
- **Resolution:** Implemented continuous stream buffering in `src/lib/api.ts` (`streamBackfilledList`) with reactive `blacklistVersion` tracking so pages always fill to capacity when items are filtered out.

#### [NH-Reader] (`projects/NH-Reader`) 2026-10-02 — NSIS Installer Finish Page Legibility & Korean Localization
- **Project Identifier:** `[NH-Reader]` (`projects/NH-Reader`)
- **Severity:** 🟡 Medium (installer UI contrast & localization)
- **Status:** ✅ Resolved (v0.7.5)
- **Resolution:** Standardized on the stock MUI finish page palette with branded 164×314 BMP3 sidebar bitmap, added Korean translations to `hooks.nsh`, and configured `NSIS_HOOK_PREINSTALL` and `NSIS_HOOK_PREUNINSTALL` process termination.

---

## helix-docs

#### [helix-docs] (`projects/helix-docs`) 2026-10-01 — Dart Sass Migration, Frontmatter Navigation & Mermaid Default-On (BUG-1 through BUG-18)
- **Project Identifier:** `[helix-docs]` (`projects/helix-docs`)
- **Severity:** 🔴 Critical to 🟢 Low (theme build, navigation hierarchy, and asset resolution)
- **Status:** ✅ Resolved (v1.0.0)
- **Resolution:**
  1. **Dart Sass Precompilation (`BUG-1`–`BUG-3`)**: Adopted `sass-embedded` to precompile `assets/css/site.css` with 100% rule parity.
  2. **Jekyll & Liquid Compatibility (`BUG-5`–`BUG-12`)**: Added `faraday-retry`, dropped `jekyll-titles-from-headings`, replaced multi-condition `where_exp` filters with Liquid `for`/`if` loops, switched navigation page set to `site.html_pages`, standardized `{path: "", type: ...}` defaults scopes, and wrapped XAML curly braces in `{% raw %}` blocks.
  3. **Mermaid & Sidebar Hierarchy (`BUG-15`–`BUG-18`)**: Made Mermaid rendering default-on (`site.mermaid != false`), implemented left-aligned category emoji and sub-page bullet markers in `_includes/components/nav.html`, left-aligned sidebar footer links, and resolved relative `logo`/`favicon` paths from site root across all nested routes.
