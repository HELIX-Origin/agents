# BUGS.md — HELIX Origin Consolidated Bug Tracker

> 🐛 **Living Source of Truth**: Unified tracking ledger for active bugs, environment quirks, external limitations, and verified fixes across all repositories in the **HELIX Origin** organization.
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (direction), [`PLAN.md`](./PLAN.md) (sprint execution), and [`TODO.md`](./TODO.md) (task ledger).
> Last updated: 2026-10-14

---

## 📜 Tracking Rules

- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Consistent Formatting**: Maintain consistent formatting and style throughout all documentation to ensure readability and professionalism.
- **Clear Sectioning**: Use clear and descriptive headers for each section to improve navigation and readability.
- **Mandatory Project Tagging**: **Every bug, quirk, and resolved issue must explicitly state its project name and repository path** (`[<project-name>] (<project-path>)`). Unscoped entries are strictly prohibited so agents never conflate repositories.
- **Active Items First**: The currently active milestone, sprint, task, or workstream must always be placed at the top of the content sections.
- **Regular Updates**: Ensure that this file is regularly updated to reflect the latest developments and changes in the project.
- **Improve User Directives**: Continuously refine and clarify user directives to ensure they are easily understood and actionable.
- **Tracking Docs Stay True**: Update `ROADMAP.md`, `TODO.md`, `BUGS.md`, and `PLAN.md` first or in lockstep with code changes so a stale ledger counts as a bug.
- **Always Track Everything**: Every new feature request, enhancement, or bug report must be logged before execution.

---

## 📖 Legend

### 🚦 Status
- ⚠️ **open** — reproducible, needs fixing.
- 🚧 **investigating / fix applied** — repro, root cause, or initial code fix in progress (pending live verification).
- 🚫 **wontfix** — accepted platform limitations or deliberate architectural trade-offs.
- ✅ **resolved** — verified and fixed (moved to closed with release version or commit hash).

### 🚨 Severity
- 🔴 **Critical**: Shell or app crashes, data loss, total unreadability.
- 🟠 **High**: Significant functional, visual, or state synchronization breakdown.
- 🟡 **Medium**: Minor visual alignments, partial theming coverage, non-breaking fallbacks.
- 🟢 **Low**: Build warnings, deprecations, non-visual cosmetic quirks.

---

## 🚫 Known Quirks & External Limitations (wontfix bucket)

### [Ecosystem & helix-docs] (projects/helix-docs)
- 💎 **[helix-docs] ENV-1 — Ruby not on PATH in agent shell:** Ruby is installed to `C:\Ruby33-x64\bin` but the default shell PATH may be stale. Prepend `$env:PATH = "C:\Ruby33-x64\bin;$env:PATH"`.
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

### [Hentai-Senpai-Multi-DE-Theme] (projects/Hentai-Senpai-Multi-DE-Theme)
- 🐧 **[Hentai-Senpai] Desktop Environment Variations:** GTK4/libadwaita theming overrides and desktop specifics (GNOME, XFCE, Cinnamon, MATE, Budgie) depend on individual DE version capabilities and user window managers.

### [Steam-Vault] (projects/Steam-Vault)
- ☁️ **[Steam-Vault] Steam Cloud Collection Sync:** Modern Steam collections are stored in a cloud-synced namespace file (`userdata/<id3>/config/cloudstorage/cloud-storage-namespace-1.json`). Editing while Steam is running, or while another device changes collections, can cause a sync conflict. Mitigation: writes are refused while Steam is running, and every write is preceded by a timestamped backup.
- 🧩 **[Steam-Vault] Legacy Tags Are Often Empty:** On modern accounts the old `localconfig.vdf` `apps/<appid>/tags` categories are empty (collections moved to `cloudstorage`). Legacy tag import is therefore best-effort and may surface nothing.
- 🔑 **[Steam-Vault] Steam Web API Profile Visibility:** `IPlayerService/GetOwnedGames` returns data only when the profile's game details are public; otherwise Steam returns `403`. Local library data is unaffected.
- 🔌 **[Steam-Vault] Provider Fragility (keyless sources):** PCGamingWiki and Wikipedia are keyless, best-effort providers and may change shape; the Steam Store `appdetails` endpoint is keyless but rate-limited. These are supplementary and never required.
- 🏷️ **[Steam-Vault] Metadata Warming Is Network-Heavy and Rate-Limited:** Warming a large owned library issues many Steam Store `appdetails` requests (one per app id, with bounded concurrency) plus one `actions/ajaxgetstoretags` request per app, which can trip Steam's rate limiting; cached entries are reused within the TTL and per-app failures are skipped rather than fatal. Categorization now fetches metadata on demand (`fetchMetadata`, default `true`), so rules that need genre/tag/other metadata can trigger network calls implicitly — cache warming for a full owned library is best run deliberately via the Organize view's **Sync metadata** button.
- 🖥️ **[Steam-Vault] Platform Detection Depends on Local Sources:** External-platform detection reads only local data — launcher manifests, the GOG registry, the itch app library, and the Windows Uninstall registry. Titles that are absent from all of those (for example, Microsoft Store / Xbox Game Pass games, which are not in the classic Uninstall registry) are not detected yet.
- 🌐 **[Steam-Vault] Owned-Library Sync Needs a Public Profile:** `refresh_owned_games` uses `IPlayerService/GetOwnedGames`, which requires a Steam Web API key and a public "game details" profile setting. Installed games are always read locally regardless, and the cached owned list is only used to broaden the ordering surface.
- 🎭 **[Steam-Vault] Shortcut Platform Attribution Is Best-Effort:** A non-Steam shortcut added outside Steam Vault has no recorded platform and is shown as "Other" until it is re-imported. Attribution is kept in `<config>/steam-vault/platform-map.json`.
- 💽 **[Steam-Vault] Storage Moves Are Real File Operations:** Moving a game or a whole library physically copies data cross-drive (a same-drive move is an instant rename). Steam must be closed, a library that still holds installed games cannot be removed, and the destination must have enough free space (plus a safety margin). Every copy of `libraryfolders.vdf` is rewritten — with backups — so Steam does not re-download a relocated game.

---

## 💡 Explicitly Not Bugs

- 💡 **[NH-Reader] Blacklisted Galleries Accessible via Direct Link:** Blacklists govern search discovery, grids, and feeds, but do not prevent opening direct gallery URLs.
- 💡 **[Windhawk-Themes] Different Radii on Taskbar vs Start Menu:** Taskbar uses compact radii (`R1=6`, `R2=20`) because of its compact bar height, whereas Start Menu uses large panel radii (`CornerRadius=35`). This is an intentional design scale hierarchy.
- 💡 **[Windhawk-Themes] Win32 Scrollbars in File Explorer:** DirectUI scrollbars follow system mode rather than custom XAML templates.
- 💡 **[Hentai-Senpai] Host Build Dependencies:** System requirements (`sassc`, `optipng`, `inkscape`) are build prerequisites, not theme bugs.
- 💡 **[Steam-Vault] RAWG Is Not Supported:** RAWG is defunct, so no RAWG provider exists. This is intentional, per user directive.

---

## ⚠️ Active & Open Bugs

### [Windhawk-Themes] (projects/Windhawk-Themes)

#### [Windhawk-Themes] 2026-10-10 — Start Menu Styler Overrides Native High-Contrast Borders
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟠 High (accessibility violation)
- **Status**: 🚧 superseded by the 2026-10-13 refactor — pending live verification
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-start-menu-styler.yml`
- **Reported Issue**: The Start Menu theme forces `Visibility=Collapsed` on `Border#MainMenuHighContrastBorder` / `Border#RightCompanionHighContrastBorder`, stripping Windows' native high-contrast accessibility boundary. This is not a high-contrast theme and must not style high-contrast UI.
- **Attempted Fix (`64711d2`, rolled back)**: Removed the high-contrast border target entirely and synced `docs/_wiki/start-menu-styler/targets/elements.md`.
- **Why Rolled Back**: The removal was not purely cosmetic — it damaged the actual Start Menu styling. The borders had no visible effect until a shell refresh, after which the glass styling was broken. They participate in normal (non-HC) rendering, so a blind removal is not a valid fix.
- **Current State**: The `Visibility=Collapsed` override was restored after the `64711d2` rollback. **Update (2026-10-13, `f9f228b`)**: the user's Start Menu refactor removes both `*HighContrastBorder` targets from `windows-11-start-menu-styler.yml` entirely, superseding the rollback. The high-contrast styling concern is moot unless the targets are reintroduced; needs live verification that normal glass styling remains intact.

#### [Windhawk-Themes] 2026-10-10 — Random explorer.exe Crash During File/Folder Actions
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🔴 Critical (shell crash)
- **Status**: ⚠️ open — root cause external (companion mod); upstream report pending
- **Scope**: external Windhawk mod `file-operations-styler` (suite companion config: `projects/Windhawk-Themes/projects/command-center/extras/file-operations-styler.yml`)
- **Reported Issue**: Random `explorer.exe` crash, most often during file/folder actions and when File Explorer opens (freeze then immediate crash).
- **Root Cause (confirmed)**: The external companion Windhawk mod **`file-operations-styler`** (hooks copy/move/delete dialogs in `explorer.exe`). Reproduced by deleting a folder: explorer froze then crashed as soon as the "provide administrator permission" prompt appeared. It is a mod bug, not a suite styling issue.
- **Resolution**: In-repo mitigation is to disable the `file-operations-styler` mod until an upstream fix ships. Report to be filed with the Windhawk mods team (maintainer action).
- **Related Rollback**: The taskbar hypothesis edits from `64711d2` (bare-type flyout/menu target removal + two `RenderTransform` removals) were reverted — they were not the crash source and their removal undid intended styling.

#### [Windhawk-Themes] 2026-10-07 — Notification / Action Center Quick Settings Split Button Color Mismatch
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟠 High (visual state mismatch)
- **Status**: 🚧 investigating / fix applied (pending user desktop verification)
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-notification-center-styler.yml`
- **Reported Issue**: Section buttons in Action Center Quick Settings show color mismatches across split buttons (Wi-Fi, Bluetooth chevrons show high-contrast blue while the toggle half displays accent color; ref `media_1791431699608_c575da8b.png`).
- **Root Cause**: Quick Settings split buttons (`SplitL2Button`, `PaginatedToggleButton`) have multi-part visual trees where toggle and chevron inherit separate visual state brushes (`CommonStates` vs `CheckedStates`).
- **Resolution Applied**: Reset outer button backgrounds to `Transparent`, route state styling through `ContentPresenter#ContentPresenter@CommonStates` across both buttons, and apply canonical `$ElementBackground` and `$BorderBrush` tokens.

#### [Windhawk-Themes] 2026-10-07 — Taskbar Snap Layout Internal Elements Theming
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟡 Medium (incomplete theme coverage)
- **Status**: ⚠️ open
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-taskbar-styler.yml`
- **Reported Issue**: Snap layout container internal elements lack full Command Center glass theming.
- **Root Cause**: Snap layout elements in `snaplayout.dll` depend on strict internal margins and hit-test bounds. Selectors must theme visual properties (`Background`, `BorderBrush`, `CornerRadius`) on `LayoutBorder` without altering layout calculations.

#### [Windhawk-Themes] 2026-10-07 — Taskbar System Tray Overflow Flyout Missing Glass Background
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟡 Medium (visual regression)
- **Status**: ⚠️ open
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-taskbar-styler.yml`
- **Reported Issue**: System tray overflow flyout renders with a solid/missing background instead of frosted glass (ref `media_1791432063085_e18460b5.png`).
- **Resolution**: Restore `$Background`, `$BorderBrush`, and corner radius to `Grid#OverflowRootGrid > Border` and `Border#OverflowFlyoutBackgroundBorder`.
- **Update (2026-10-13, `f9f228b`)**: the taskbar refactor instead sets `Grid#OverflowRootGrid > Border` to `Background:=Transparent`, `BorderBrush:=Transparent`, `BorderThickness=0` (fully transparent overflow). Confirm intent (intentional design change vs regression).

#### [Windhawk-Themes] 2026-10-13 — Static Gate Warnings: Duplicate Target Selectors After Suite Refactor
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟢 Low (config hygiene; superseded style blocks)
- **Status**: ✅ resolved — gate now **0 errors / 0 warnings**
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-start-menu-styler.yml`, `windows-11-taskbar-styler.yml`
- **Reported Issue**: `tools/Test-WindhawkStyles.ps1` reported **0 errors, 8 warnings** after the 2026-10-13 refactor (`f9f228b`) — duplicate `target` selectors: `Border#AppBorder`, `Border#LayerBorder`, `Grid#AllListHeading > TextBlock#AllListHeadingText`, `TextBlock#PinnedListHeaderText`, `Border@CommonStates > … Grid#LogoContainer > Image`; `Rectangle#HorizontalTrackRect`, `Rectangle#HorizontalDecreaseRect`, `Border#SnapBarBorder`.
- **Resolution**: Merged each pair into a single entry as a **behavior-preserving union** (Windhawk applies every matching entry; later wins per property), then re-ran the gate → **0 errors, 0 warnings**. Note: the two `Border#AppBorder` entries were a collapse plus a glass style — the union keeps both, but the element is likely meant to be collapsed only (the glass panel is `Grid#Root > Border`).

#### [Windhawk-Themes] 2026-10-13 — Suite Config Hygiene Findings (post-refactor review)
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟢 Low
- **Status**: ⚠️ open — user decision
- **Scope**: `projects/command-center/windows-11-start-menu-styler.yml`, `windows-11-notification-center-styler.yml`
- **Findings** (surfaced while syncing the suite README + docs; none block the gate):
  - **NC radii/vocabulary drift:** the Notification Center config still uses `PanelRadius=13` / `CardRadius=10` / `ChipRadius=6`, while the refactored Start Menu + Taskbar moved to the new token scale. Decide whether to refactor NC (behavioral — needs live desktop verification) or leave it and document the divergence. `projects/command-center/README.md` currently documents the per-file truth.
  - **Dead token:** Start Menu `HoverCornerRadius=15` is declared in `styleConstants` but referenced by no `controlStyles` rule (hover/list surfaces resolve through `$ElementCornerRadius` = 10).
  - **Selector ambiguity:** `Grid#CompanionRoot > Border#AcrylicBorder` gets glass styling, but a more specific selector (`StartDocked.StartMenuCompanion#RightCompanion > Grid#CompanionRoot > Border#AcrylicBorder`) sets `Visibility=1` on the same element.
  - **Redundant styling:** `Border#AppBorder` is both collapsed (`Visibility=1`) and glass-styled in the merged dedup entry.

---

### [Steam-Vault] (projects/Steam-Vault)

#### [Steam-Vault] 2026-10-14 — Missing Developer/Publisher/Metadata Collections for Non-Steam Shortcuts & Multi-Entity Strings
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Severity**: 🟠 High (functional defect)
- **Status**: ✅ resolved — verified across 30 unit tests and full suite
- **Scope**: `src-tauri/src/commands.rs`, `src-tauri/src/autocat.rs`, `src-tauri/src/metadata/*`, `src-tauri/src/platforms/*`
- **Reported Issue**: When organizing by Developer, Publisher, Genre, or Release Year, non-Steam games and certain Steam games do not have their metadata detected. As a result, no collections are created for them.
- **Root Cause**:
  1. `compute_categorization` and `compute_autocats` only requested metadata for `GameKind::Steam` and queried the cache solely under `steam-store` with synthetic shortcut app IDs. Shortcuts never had metadata populated, causing `AppMeta::default()` with empty fields.
  2. Multi-developer/publisher comma-separated strings (e.g. `"Square Enix, PlatinumGames"`) were not split in `autocat::apply`, creating single monolithic collection names.
  3. No fallback metadata providers (PCGamingWiki, VNDB, Steam Store Search, local engine/receipt inspection) were integrated into the categorization pipeline.
- **Resolution**:
  1. Built multi-provider metadata pipeline: keyless VNDB Kana API provider (`metadata::vndb`), keyless Steam Store Search (`metadata::steam_search`), offline engine sniffer (`metadata::local`), and PCGamingWiki queries with title sanitization.
  2. Implemented `ensure_game_metadata` resolving metadata for both Steam games and non-Steam shortcuts, caching under both `shortcut-meta` and `steam-store` namespaces.
  3. Added `split_entities` in `autocat.rs` to break comma/semicolon/slash-delimited entities into individual collections while protecting legal company suffixes (`Co., Ltd.`, `Inc.`), plus platform publisher fallbacks for non-Steam games.
  4. Implemented automatic artwork downloading upon platform game/ROM import and added bulk auto-fetch missing artwork button.
  5. Implemented emulator and ROM detection (`Platform::Emulator`) for 11 popular emulators with tailored launch arguments.

---

### [helix-docs] (projects/helix-docs)

#### [helix-docs] BUG-4 — `_functions.scss` legacy division triggers Dart Sass deprecation
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟢 Low (cosmetic warning)
- **Status**: ⚠️ open
- **Scope**: `projects/helix-docs/_sass/support/_functions.scss`
- **GitHub Issue**: [#3](https://github.com/HELIX-Origin/helix-docs/issues/3)
- **Symptom**: Dart Sass warns about `/` division (`($px / 16px)`). Compiles cleanly.
- **Resolution**: Replace with `math.div` or `calc()`.

#### [helix-docs] BUG-13 — Default layout home page section cards vs index markup
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (markup constraint)
- **Status**: ⚠️ open / outstanding
- **Scope**: `projects/helix-docs/_layouts/default.html`
- **GitHub Issue**: [#1](https://github.com/HELIX-Origin/helix-docs/issues/1)
- **Symptom**: Inability to have `default.html` automatically partition arbitrary markdown into modular `.doc-section` cards without manual HTML in index files. Wrapping in `.landing-content` left headings bare, while wrapping in a single `.doc-section` collapsed the page into one monolith.
- **Current Pattern**: Home/landing pages author their modular card sections directly in index files using `<section class="doc-section">` with flush-left indentation.

#### [helix-docs] BUG-14 — Broken in-page Table of Contents in standalone docs layout
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Severity**: 🟡 Medium (layout limitation)
- **Status**: ⚠️ open / deferred
- **Scope**: `projects/helix-docs/_layouts/docs.html`
- **GitHub Issue**: [#2](https://github.com/HELIX-Origin/helix-docs/issues/2)
- **Symptom**: Dynamic client-side DOM TOC generation in `components/toc.html` was fragile and stripped the left sidebar.
- **Resolution**: Standalone single-column `docs.html` delegates to `layout: wiki` and defaults set `layout: wiki` for `type: docs`, providing the dual sticky sidebar tree across all docs.

---

## ✅ Closed & Resolved Bugs

### [Ecosystem] (workspace root)
- **[Ecosystem] 2026-10-14 — CRLF line-ending churn across every repository:** The machine's **system** git config (`C:/Program Files/Git/etc/gitconfig`) sets `core.autocrlf=true`, which rewrote LF→CRLF on checkout and produced spurious working-tree churn and phantom "modified" files that repeatedly confused agents. Resolved by adding a per-repo `.gitattributes` (`* text=auto eol=lf`; explicit text types; explicit binary types; `*.bat`/`*.cmd` → `text eol=crlf`) to the workspace root (`4e70f4a`) and every org repo — FFXIV-Config (`93ebb89`), helix-docs (`58adc1e`), helix-origin.github.io (`4cd863a`), Hentai-Senpai-Multi-DE-Theme (`20ed6aa`), NH-Reader (`179bd22`), Windhawk-Themes (`0255193`); Steam-Vault already had one. All working trees were force-normalized to LF (a plain `git checkout -- .` is a no-op because the new `eol=lf` attribute makes CRLF and LF equivalent to git, so the files must be removed and re-checked-out). `core.autocrlf=input` was set in the **user-global** config (`C:/Users/Joshu/.gitconfig`) to override the system `true` without needing admin. Note: `.cff` is Citation File Format (text), not a font — do not mark it binary.

### [NH-Reader] (projects/NH-Reader)
- **[NH-Reader] 2026-10-02 — Blacklist page filling & dynamic stream buffer:** In blacklist "Hide" mode, client-side filtering left pages partially empty. Resolved in v0.7.4 with continuous stream buffering in `src/lib/api.ts` (`streamBackfilledList`) and reactive `blacklistVersion` tracking.
- **[NH-Reader] 2026-10-02 — NSIS installer finish page text legibility:** Finish page retained black text on dark background (NSIS bug #443). Resolved in v0.7.5 by reverting to stock MUI palette while keeping branded sidebar bitmap. Synchronous uninstaller execution fixed with `_?=$INSTDIR` and `ExecWait`.
- **[NH-Reader] 2026-10-02 — NSIS Korean language string fallbacks:** Missing `MULTIUSER_INSTALLMODEPAGE` strings produced warnings. Added translations to `hooks.nsh` in v0.7.4.

### [Windhawk-Themes] (projects/Windhawk-Themes)
- **[Windhawk-Themes] 2026-10-06 — Start Menu Pins Centering & Right Drift:** Pinned apps drifted rightward in 3-column layout. Centered pins with balanced padding and restored 470px width.
- **[Windhawk-Themes] 2026-10-06 — Phone Link Companion Vertical Misalignment:** Companion cards hung lower than main menu top. Adjusted margin offsets flush with search box.

### [helix-docs] (projects/helix-docs)
- **[helix-docs] BUG-1 / BUG-2 — Sass compiler failure:** Ruby sass and liblibsass failed on CSS Color 4 and CSS min/max math. Fixed by adopting Dart Sass (`sass-embedded` 1.105.1). Parity verified (432/432 rules).
- **[helix-docs] BUG-3 — sass-embedded binstub conflict:** Overwrote conflicting binstub with `--force`.
- **[helix-docs] BUG-5 — Missing faraday-retry gem:** Octokit silently skipped retry middleware. Added `gem "faraday-retry"` to Gemfile outside `:jekyll_plugins`.
- **[helix-docs] BUG-6 — jekyll-titles-from-headings collection title override:** Overwrote collection document titles and broke breadcrumb matching. Dropped plugin; canonical `title` frontmatter enforced.
- **[helix-docs] BUG-7 — Jekyll 3.x where_exp multi-condition syntax error:** Replaced multi-condition `where_exp` with `for` + `if` loops.
- **[helix-docs] BUG-8 — Liquid array subscript filter precedence:** Pager arithmetic coerced Document to integer 0. Pre-computed subscript offsets.
- **[helix-docs] BUG-9 — Primer theme leak:** Switched nav pages set to `site.html_pages`.
- **[helix-docs] BUG-10 — Defaults scope syntax linter warnings:** Standardized `{path: "", type: ...}` across all configs.
- **[helix-docs] BUG-11 — Duplicate layout frontmatter:** Cleaned duplicate keys across companion doc pages.
- **[helix-docs] BUG-12 — XAML curly brace Kramdown interpolation:** Wrapped XAML bindings in `{% raw %}` blocks.
- **[helix-docs] BUG-15 — Mermaid diagrams rendered as raw code blocks:** Made the `components/mermaid.html` loader opt-out (`site.mermaid == false`). Live-verified the `mermaid@11.12.0` ESM loader on Windhawk-Themes, NH-Reader, Hentai-Senpai and helix-origin.github.io (`05b9943`).
- **[helix-docs] BUG-16 — Sidebar nav tree had no hierarchy:** Level-1 category emoji + indented sub-page bullets with left-aligned markers; icons resolved from `nav_icon` front matter → `nav_icons` map → heuristic. Live-verified `nav-bullet`/`nav-icon`/category markers on consuming wiki trees (`05b9943`).
- **[helix-docs] BUG-17 — Sidebar footer links were centered:** Footer switched to `justify-items: start` + `text-align: left`. Live-verified in the served `site.css` (`05b9943`).
- **[helix-docs] BUG-18 — Brand logo & favicon used raw relative paths:** `logo`/`favicon` now resolve from the site root in `head.html`/`header.html`/`sidebar.html` (absolute and protocol-relative URLs pass through); `apple-touch-icon` added. Live-verified on nested helix-docs routes and on Windhawk-Themes (`05b9943`, Windhawk `eb4b2a6`).
