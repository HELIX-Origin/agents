# TODO.md — Organization & Ecosystem Actionable Checklist

> 📋 **Living Source of Truth**: Actionable task ledger for the **HELIX-Origin Agents Ecosystem**.
> Detail lives in each repository's own `TODO.md`; high-level architecture in [`ROADMAP.md`](./ROADMAP.md), active sprints in [`PLAN.md`](./PLAN.md), issues in [`BUGS.md`](./BUGS.md).
> Historical delivery record lives in [`CHANGELOG.md`](./CHANGELOG.md).

---

## 📜 Tracking Rules

- **100% Active Direction Accuracy**: Reflect the current, active state of the ecosystem with zero contradictions.
- **Normalized Directives**: Rewrite user directives into clean, typo-free engineering requirements grouped by domain sub-headers.
- **Done Moves Down**: When a workstream is done, collapse it to a one-line entry under Completed Workstreams with full history in `CHANGELOG.md`.
- **Mandatory Project Tagging**: Prefix every item with its active project tag (`[Ecosystem]`, `[<project-name>]`).

---

## 🧭 Project Tracking Index

> Entry point to per-project **TODO** tracking: one line per project (short title + link). Detail lives only in each repository. Regenerate with `npm --prefix scripts run index`; do not edit between the markers.

<!-- project-index:start -->
- **[nh-reader]** — [No active item recorded](./projects/nh-reader/TODO.md) · _Native C++ Windows desktop reader_
- **[windows-game-explorer]** — [Bug Resolution Workstream (Zero Guessing / Research-Backed Fixes)](./projects/windows-game-explorer/TODO.md) · _Native C++ Windows Game Explorer (File Explorer shell extension & game library)_
- **[theme-toolkit]** — [Workstream W.01: Native Windows C++ Architecture & Rebrand to Theme Studio (v1.0.0)](./projects/theme-toolkit/TODO.md) · _Native C++ Windows theme studio & applicator for Windows 2000 to 11+ (Theme Studio)_
- **[depressurizer]** — [Workstream W.05: Native Windows C++ Modernization & UI Polish (v1.0.0)](./projects/depressurizer/TODO.md) · _Native C++ Windows Steam categorizer & AutoCat manager (revival fork)_
- **[windhawk-themes]** — [Workstream W.01: Suite Polish & Multi-Mod Verification](./projects/windhawk-themes/TODO.md) · _Windhawk styler mod themes_
- **[ffxiv-config]** — [Workstream W.01: 8.x Configuration Sync, Media Asset & Governance Alignment](./projects/ffxiv-config/TODO.md) · _FFXIV HUD, hotbar and macro configuration_
<!-- project-index:end -->

---

## 🔥 Active Workstreams

### 🎯 [Ecosystem] Workstream W.65: Agents Ecosystem Enhancement, Per-Project Scaffolding & Tool-Agnostic Workflows
- **Project Identifiers:** `[Ecosystem]` (workspace root & all active org projects)
- **Status:** 🚧 In progress (session state).
- **Target Components:** Global `.agents/` ecosystem, per-project `.agents/` ecosystems, tracking ledgers, and scripts.

**Locked user directives (normalized by domain):**
- **Tool-Agnostic Commands**: Build a comprehensive, tool-agnostic command runbook directory under `.agents/commands/` (`onboard.md`, `verify.md`, `fix-bug.md`, `implement-feature.md`, `review-change.md`, `update-docs.md`, `cut-release.md`) so any AI agent can follow identical workflow protocols.
- **Drop Legacy Tooling**: Completely remove all `.opencode/` folders workspace-wide. Scrub all legacy tool references across rules, skills, playbooks, and tracking ledgers.
- **Living Ledgers & Archive Retirement**: Retire all `*-ARCHIVE.md` files (`.github/BUGS-ARCHIVE.md`, `.github/ROADMAP-ARCHIVE.md`, `.github/TODO-ARCHIVE.md`). Living ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) remain clean and concise entry points with bare-minimal one-line completed summaries; `CHANGELOG.md` serves as the permanent chronological record.
- **Expand Skill Library**: Author dedicated modular skills for all languages, frameworks, and tools across the organization (`svelte5-runes.md`, `rust-patterns.md`, `typescript-esm-scripts.md`, `sqlite-in-app.md`, `sveltekit-frontend.md`, `github-actions-ci.md`).
- **Complete Per-Project Scaffolding**: Ensure all 6 active repositories (`nh-reader`, `windows-game-explorer`, `theme-toolkit`, `depressurizer`, `windhawk-themes`, `ffxiv-config`) have complete, self-contained `.agents/` directories (`rules/`, `skills/`, `agents/`) and clean `AGENTS.md` entry points.
- **Windows Game Explorer Project Rebrand & Authentic Game Library Invariant**: Formally establish **Windows Game Explorer** (`projects/windows-game-explorer`). The project's goal is strictly to revive and modernize the classic Windows 7/Vista Game Explorer (`shell:Games`) directly inside Windows 11 File Explorer. Falling back to a generic shortcuts folder (`CDefView` file rows) completely defeats the project's purpose and is strictly prohibited.
- **Modern Storefront Auto-Discovery Architecture**: Unlike Microsoft's abandoned Game Explorer that relied on manual Game Definition Files (GDF XML), installer COM calls, and defunct online servers, Windows Game Explorer automatically discovers and indexes games directly from installed store manifests on disk (Steam, Epic, GOG, itch.io, Battle.net, and standalone executables) and uses the installed storefront providers directly as the sole source of truth for metadata and box art (eliminating external third-party scrapers like IGDB, VNDB, and SteamGridDB).
- **Game Explorer Manager Companion Application (`GameExplorerManager.exe`)**: Revive the classic Game Explorer Manager (GEM) utility as a dedicated Win32 management companion for adding local games, selecting box art (~2:3 case style), editing metadata, and persisting definitions to `%USERPROFILE%\Game Explorer\metadata\<appId>.json`.
- **Authentic Two-Section Categorization**: Organize File Explorer items into two distinct collapsible sections via native Windows Shell `ICategoryProvider` and `ICategorizer`: `▾ Game Providers (N)` for installed storefront clients and `▾ Games (N)` for installed game titles.
- **Ban on Blind Trial-and-Error Shell Extension Code Loops**: Forbid iterative guesswork and toggling between broken raw `IShellView` hacks and dumb `CDefView` shortcuts. Require thorough research into official Microsoft documentation on `FOLDERTYPEID_Games`, `IThumbnailProvider`, `IPreviewHandler`, `IPropertyStore`, and modern Windows 11 WinUI 3 / XAML island shell architecture before touching shell integration code.
- **Encoding & Parsing Integrity**: Ensure all markdown and ledger files are strictly valid UTF-8 without BOM or CP-1252 double-encoding corruption.
- **Native Build & Verification Tooling for C++ Projects**: Replace legacy Node.js `.mjs` Tauri v2 scripts across native C++ projects (`windows-game-explorer`, `nh-reader`, `theme-toolkit`, `depressurizer`) with a native CMake/CTest/PowerShell (or native C++ CLI) build, test, and signing runner that requires zero Node.js/Tauri dependencies.

**Implementation checklist:**
- [x] **[Ecosystem] 1. Tool-Agnostic Commands Directory**:
  - [x] `[Ecosystem]` Create `.agents/commands/` with `README.md`, `onboard.md`, `verify.md`, `fix-bug.md`, `implement-feature.md`, `review-change.md`, `update-docs.md`, `cut-release.md`.
- [x] **[Ecosystem] 2. Drop Legacy Tooling Workspace-Wide**:
  - [x] `[Ecosystem]` Remove `.opencode/` directories workspace-wide and across all project repositories.
  - [x] `[Ecosystem]` Scrub references from `AGENTS.md`, `README.md`, rules, skills, and tracking files.
- [x] **[Ecosystem] 3. Archive Retirement & Living Ledger Model**:
  - [x] `[Ecosystem]` Delete `.github/*-ARCHIVE.md` files; establish root `CHANGELOG.md` (Keep a Changelog format).
  - [x] `[Ecosystem]` Update invariant 3 in `AGENTS.md` and update all ledger templates.
- [x] **[Ecosystem] 4. Universal Skills Library Expansion**:
  - [x] `[Ecosystem]` Create `svelte5-runes.md`, `rust-patterns.md`, `typescript-esm-scripts.md`, `sqlite-in-app.md`, `sveltekit-frontend.md`, `github-actions-ci.md`.
- [x] **[Ecosystem] 5. Per-Project Agents Ecosystem Scaffolding**:
  - [x] `[Ecosystem]` Complete `.agents/{rules,skills,agents}/` and `AGENTS.md` in `nh-reader`.
  - [x] `[Ecosystem]` Complete `.agents/{rules,skills,agents}/` and `AGENTS.md` in `windows-game-explorer`.
  - [x] `[Ecosystem]` Complete `.agents/{rules,skills,agents}/` and `AGENTS.md` in `theme-toolkit`.
  - [x] `[Ecosystem]` Complete `.agents/{rules,skills,agents}/` and `AGENTS.md` in `depressurizer`.
  - [x] `[Ecosystem]` Complete `.agents/{rules,skills,agents}/` and `AGENTS.md` in `windhawk-themes`.
  - [x] `[Ecosystem]` Complete `.agents/{rules,skills,agents}/` and `AGENTS.md` in `ffxiv-config`.
- [x] **[Ecosystem] 6. Windows Game Explorer Rebrand & Shell Extension Governance**:
  - [x] `[Ecosystem]` Author `.agents/rules/windows-shell-extension.md` banning generic shortcut folder degradation and blind trial-and-error shell loops.
  - [x] `[Ecosystem]` Rename and update `.agents/skills/windows-game-explorer.md` to authoritative Windows Game Explorer architecture.
  - [x] `[Ecosystem]` Update `.agents/registry/projects.json` to reflect `windows-game-explorer` (`projects/windows-game-explorer`).
  - [x] `[windows-game-explorer]` Align `README.md`, `HANDOFF.md`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`.
- [x] **[Ecosystem] 7. Verification & Ledger Synchronization**:
  - [x] `[Ecosystem]` Run `npm --prefix scripts run index` and `index:check`.
  - [x] `[Ecosystem]` Run `npm --prefix scripts run sync` and `export`.
  - [x] `[Ecosystem]` Run `npm --prefix scripts test` (6/6 passing).
  - [x] `[Ecosystem]` Update `HANDOFF.md` with final session status.

---

### ⏳ [Web & Docs] Workstream W.66: Documentation Hubs & Glassmorphism Jekyll Theme Rebuild (Queued — v1.3.0)
- **Target Components:** `helix-origin.github.io`, `docs`, `wiki` + custom glassmorphism Jekyll theme (`helix-jekyll-theme` rebuilt from scratch).
- **Architecture & Design:**
  - Build a custom glassmorphism styled Jekyll theme with modern SCSS tokens, frosted glass blur, glowing borders, and responsive portal layouts.
  - Recreate `helix-origin.github.io` as the main organization landing portal showcasing all active projects and resources.
  - Recreate `docs` as the comprehensive user documentation hub with installation, usage, and quickstart guides.
  - Recreate `wiki` as the extensive technical reference and engineering specification hub.
  - Setup zero-warning GitHub Actions CI/CD deployment pipelines for GitHub Pages.

**Implementation checklist:**
- [ ] **[Web & Docs] 1. Custom Glassmorphism Jekyll Theme**:
  - [ ] `[Web & Docs]` Rebuild Jekyll theme from scratch with Dart Sass architecture, glassmorphism token scales, and responsive layout primitives.
  - [ ] `[Web & Docs]` Build portal card layouts, navigation sidebars, and high-contrast typography.
- [ ] **[Web & Docs] 2. Organization Portal (`helix-origin.github.io`)**:
  - [ ] `[Web & Docs]` Recreate repository; implement landing portal showcasing all HELIX-Origin projects.
- [ ] **[Web & Docs] 3. User Documentation Hub (`docs`)**:
  - [ ] `[Web & Docs]` Recreate repository; implement comprehensive, theme-neutral documentation for all org projects.
- [ ] **[Web & Docs] 4. Technical Wiki Hub (`wiki`)**:
  - [ ] `[Web & Docs]` Recreate repository; implement technical architecture specifications and developer manuals.
- [ ] **[Web & Docs] 5. GitHub Pages Deployment Workflows**:
  - [ ] `[Web & Docs]` Author GitHub Actions CI workflows for building and deploying each site to GitHub Pages.

---

## Completed Workstreams (Bare-Minimal Index)

> Detailed historical changes are recorded in [`CHANGELOG.md`](./CHANGELOG.md). Per-project workstreams live in each repository's own tracking ledgers (`projects/<repo>/TODO.md`).

- **[Ecosystem]** W.64 — Legacy Tool Suite Deprecation: Retired legacy tool configurations.
- **[Ecosystem]** W.63 — Legacy Configuration Modernization & Evaluation: Completed and superseded by tool-agnostic architecture.
- **[Ecosystem]** W.62 — Context-Pressure Self-Monitoring: Codified into permanent `HANDOFF.md` self-monitoring protocol and `session-handoff.md` rule.
- **[Ecosystem]** W.61 — Curated Tool Ecosystem Watch: Audited and consolidated into universal agent rules.
- **[Ecosystem]** W.60 — Project-Local Agents Interoperability & CLI Scaffolder: First-class interoperability rule, CLI scaffolder engine (`kb-scaffold.ts`).
- **[Ecosystem]** W.59 — Headless CLI Standards: Dual extension mechanism, structured logging, folder documentation.
- **[Ecosystem]** W.58 — Session Handoff Protocol: Permanent git-tracked `HANDOFF.md` ledger and self-monitoring scoreboard.
- **[Ecosystem]** W.57 — SQLite Metadata Knowledge Base (`knowledge.db`): Schema migrations, query API, sync, and export engines.
- **[Ecosystem]** W.56 — Organization Community Health Files Standard: Community-health documents across all active repositories.
