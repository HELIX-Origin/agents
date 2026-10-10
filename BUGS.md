# BUGS.md — HELIX Origin Consolidated Bug Tracker

> 🐛 **Living Source of Truth**: Unified tracking ledger for active bugs, environment quirks, external limitations, and verified fixes across all repositories in the **HELIX Origin** organization.
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (direction), [`PLAN.md`](./PLAN.md) (sprint execution), and [`TODO.md`](./TODO.md) (task ledger).
> Last updated: 2026-10-10

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

---

## 💡 Explicitly Not Bugs

- 💡 **[NH-Reader] Blacklisted Galleries Accessible via Direct Link:** Blacklists govern search discovery, grids, and feeds, but do not prevent opening direct gallery URLs.
- 💡 **[Windhawk-Themes] Different Radii on Taskbar vs Start Menu:** Taskbar uses compact radii (`R1=6`, `R2=20`) due to its 38px bar height, whereas Start Menu uses large panel radii (`R0=35`). This is an intentional design scale hierarchy.
- 💡 **[Windhawk-Themes] Win32 Scrollbars in File Explorer:** DirectUI scrollbars follow system mode rather than custom XAML templates.
- 💡 **[Hentai-Senpai] Host Build Dependencies:** System requirements (`sassc`, `optipng`, `inkscape`) are build prerequisites, not theme bugs.

---

## ⚠️ Active & Open Bugs

### [Windhawk-Themes] (projects/Windhawk-Themes)

#### [Windhawk-Themes] 2026-10-10 — Start Menu Styler Overrides Native High-Contrast Borders
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🟠 High (accessibility violation)
- **Status**: 🚧 fix applied (pending user desktop verification)
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-start-menu-styler.yml`
- **Reported Issue**: The Start Menu theme forced `Visibility=Collapsed` on `Border#MainMenuHighContrastBorder` / `Border#RightCompanionHighContrastBorder`, stripping Windows' native high-contrast accessibility boundary. This is not a high-contrast theme and must not style high-contrast UI.
- **Root Cause**: The only literal high-contrast targeting in the suite was a single `controlStyles` block collapsing the two native high-contrast borders.
- **Resolution Applied**: Removed the high-contrast border target entirely (the borders are already hidden outside high-contrast mode, so there is no visual regression) and updated `docs/_wiki/start-menu-styler/targets/elements.md`.

#### [Windhawk-Themes] 2026-10-10 — Random explorer.exe Crash During File/Folder Actions
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Severity**: 🔴 Critical (shell crash)
- **Status**: 🚧 fix applied (pending user desktop verification)
- **Scope**: `projects/Windhawk-Themes/projects/command-center/windows-11-taskbar-styler.yml`
- **Reported Issue**: Random `explorer.exe` crash, most often during file/folder actions and when File Explorer opens (freeze then immediate crash).
- **Root Cause (hypothesis)**: The Taskbar Styler injects into every `explorer.exe`, including File Explorer windows. Three unanchored, bare-type selectors (`FlyoutPresenter`, `MenuFlyoutPresenter > Border`, `MenuFlyoutSubItem`) applied a `WindhawkBlur` `$Background` to File Explorer's context menus/flyouts, violating the "anchor broad types" selector-hygiene rule (Evidence-Protocol §2).
- **Resolution Applied**: Removed the three bare-type flyout/menu targets (taskbar flyout cards remain styled via their specific named selectors). Also removed two no-op `RenderTransform` overrides (`Taskbar.TaskbarExtensionElement`, `Taskbar.TaskListButtonPanel#ExperienceToggleButtonRootPanel`) that clobbered the taskbar's internal transforms for zero visual effect.

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
