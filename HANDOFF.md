# HANDOFF.md — Agents Ecosystem Session Handoff

**Last updated:** 2026-10-24
**Current session status:** W.65 delivered & windows-game-explorer v2.1.1 released · All 6 active project ecosystems scaffolded; tool-agnostic `.agents/commands/` established; archives retired; Windows Game Explorer (`projects/windows-game-explorer`) artwork discovery hub, responsive GUI layout, unblocked SafeSearch / NSFW toggle, generic Chrome user agent, and secure credential masking delivered with 20/20 unit tests passing and official v2.1.1 release published.
**Workspace Root:** D:\Projects\GitHub\HELIX Origin

> Permanent, git-tracked session-state ledger for the **Agents Ecosystem**. Maintained **incrementally** — refresh at every
> workstream state change, fully rewrite at session end / soft-target posture. New session: read
> this file right after `AGENTS.md`, migrate every item into `ROADMAP.md` / `PLAN.md` /
> `TODO.md` / `BUGS.md`, then **refresh this file** (migrated-only state collapses to one-line
> delivered notes). **Never delete it.** See `.agents/rules/session-handoff.md`.
> Project-specific session state lives strictly in each project's own repository (`projects/<repo>/HANDOFF.md`).

---

## 🧭 Project Tracking Index

> Entry point to per-project **HANDOFF** tracking: one line per project (short title + link). Detail lives only in each repository. Regenerate with `npm --prefix scripts run index`; do not edit between the markers.

<!-- project-index:start -->
- **[nh-reader]** — [Delivered · 0 open workstreams](./projects/nh-reader/HANDOFF.md) · _Native C++ Windows desktop reader_
- **[windows-game-explorer]** — [W.57 delivered · v2.1.1 released & documentation suite delivered · Primary Metadata Provider Architecture (SteamGridDB & IGDB primary defau…](./projects/windows-game-explorer/HANDOFF.md) · _Native C++ Windows Game Explorer (File Explorer shell extension & game library)_
- **[theme-toolkit]** — [W.01 active · Rebranded to Theme Studio · Supporting Windows 2000 to Windows 11+ · Pivot to Native C++ Windows Desktop Theme Studio (Tauri…](./projects/theme-toolkit/HANDOFF.md) · _Native C++ Windows theme studio & applicator for Windows 2000 to 11+ (Theme Studio)_
- **[depressurizer]** — [W.05 active · Pivot to Native Windows C++ Modernization & UI Polish (Tauri v2 rewrite abandoned).](./projects/depressurizer/HANDOFF.md) · _Native C++ Windows Steam categorizer & AutoCat manager (revival fork)_
- **[windhawk-themes]** — [Initialized · 0 open workstreams](./projects/windhawk-themes/HANDOFF.md) · _Windhawk styler mod themes_
- **[ffxiv-config]** — [8.x Configuration Sync & Governance Alignment Completed](./projects/ffxiv-config/HANDOFF.md) · _FFXIV HUD, hotbar and macro configuration_
<!-- project-index:end -->

---

## 1) [Ecosystem] W.65: Agents Ecosystem Enhancement & Per-Project Scaffolding (Delivered, v1.2.0)
- **State:** Delivered (v1.2.0). All ecosystem scaffolding, tool-agnostic commands, skills, and tracking ledgers validated with 0 errors.
- **Delivered (this session):**
  - **Tool-Agnostic Commands (`.agents/commands/`):** Established universal runbooks for `onboard.md`, `verify.md`, `fix-bug.md`, `implement-feature.md`, `review-change.md`, `update-docs.md`, and `cut-release.md`.
  - **Legacy Tooling Removal:** Scrubbed and removed all `.opencode/` folders across workspace root and all projects.
  - **Archive Retirement & Living Ledgers:** Deleted `.github/*-ARCHIVE.md` files; created root `CHANGELOG.md` (Keep a Changelog standard); updated invariant 3 across `AGENTS.md` and templates.
  - **Universal Skills Library Expansion:** Authored 6 new modular skills: `svelte5-runes.md`, `rust-patterns.md`, `typescript-esm-scripts.md`, `sqlite-in-app.md`, `sveltekit-frontend.md`, `github-actions-ci.md`.
  - **Complete Per-Project `.agents/` Scaffolding:** Authored tailored `.agents/{rules,skills,agents}/` and `AGENTS.md` across all 6 active repositories (`nh-reader`, `windows-game-explorer`, `theme-toolkit`, `depressurizer`, `windhawk-themes`, `ffxiv-config`).
  - **Windows Game Explorer Project Rebrand & Binding Shell Rules:**
    - Formally rebranded project to **Windows Game Explorer** (`projects/windows-game-explorer`) across `.agents/registry/projects.json`, `AGENTS.md`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and project-local files.
    - Authored `.agents/rules/windows-shell-extension.md` establishing the **Game Library Experience Invariant** (generic shortcut folder degradation is strictly prohibited; the project is dedicated to reviving the classic Windows 7 Game Explorer inside modern Windows 11 with rich box art, preview pane, and properties) and the **Ban on Blind Trial-and-Error Shell Loops** (requiring official Microsoft documentation research on `FOLDERTYPEID_Games`, `IThumbnailProvider`, `IPreviewHandler`, `IPropertyStore`, and modern WinUI 3 XAML island Explorer).
    - Locked architectural directives: retired external third-party scrapers (IGDB, VNDB, SteamGridDB) in favor of installed storefronts directly providing metadata and box art; defined the **Game Explorer Manager** (`GameExplorerManager.exe`) companion GUI revival for local game additions and box art management; implemented two-section categorization (`▾ Game Providers (N)` and `▾ Games (N)`).
    - Pruned all invalid legacy Tauri v2 bugs from `BUGS.md`.
    - Renamed and aligned global skill `.agents/skills/windows-game-explorer.md` to pure native C++20 Win32 architecture, scrubbing all remaining Tauri/Svelte references.
  - **Encoding & Parsing:** Cleaned CP-1252 double-encoding / mojibake in root ledgers; verified UTF-8 without BOM.
- **Next tasks:** Begin Workstream W.66: Documentation Hubs & Glassmorphism Jekyll Theme Rebuild (recreating `helix-origin.github.io`, `docs`, and `wiki` from scratch with custom glassmorphism Jekyll theme and homepage portals).
- **Ledgers:** `TODO.md` (W.65 delivered / W.66 queued), `PLAN.md` (Sprint 35 delivered / Sprint 36 queued), `ROADMAP.md` (v1.2.0 delivered / v1.3.0 planned).

---

## 2) Delivered Workstreams (Bare-Minimal Summary)
- **[Ecosystem]** W.64 — Legacy Tool Suite Deprecation: Retired legacy tool configurations.
- **[Ecosystem]** W.63 — Legacy Configuration Modernization & Evaluation: Completed and superseded by tool-agnostic architecture.
- **[Ecosystem]** W.62 — Context-Pressure Self-Monitoring: Codified into permanent `HANDOFF.md` self-monitoring protocol and `session-handoff.md` rule.
- **[Ecosystem]** W.61 — Curated Tool Ecosystem Watch: Audited and consolidated into universal agent rules.
- **[Ecosystem]** W.60 — Project-Local Agents Interoperability & CLI Scaffolder: First-class interoperability rule, CLI scaffolder engine (`kb-scaffold.ts`).
- **[Ecosystem]** W.59 — Headless CLI Standards: Dual extension mechanism, structured logging, folder documentation.
- **[Ecosystem]** W.58 — Session Handoff Protocol: Permanent git-tracked `HANDOFF.md` ledger and self-monitoring scoreboard.
- **[Ecosystem]** W.57 — SQLite Metadata Knowledge Base (`knowledge.db`): Schema migrations, query API, sync, and export engines.
- **[Ecosystem]** W.56 — Organization Community Health Files Standard: Community-health documents across all active repositories.

---

## 3) Shell / Tooling Notes
- Node v26.8.1 — native TS type stripping; `.ts` imports need explicit extensions; package at `scripts/package.json` (ESM, engines ≥22.18, strict tsconfig).
- Never run inline `node -e` (PowerShell strips quotes) — write CLI module files under `scripts/`.
- Read-only git by default; only mutate repositories with explicit user permission in current conversation.
- LF everywhere; `.gitattributes` `* text=auto eol=lf`; `core.autocrlf=input`.
- Tool reads can be fabricated — verify with shell reads (`Get-Content`/`Select-String`) before editing.
- **Keep turns concise** — format in clean GitHub-style markdown.

---

## Quick Resume Checklist (New Session)
1. Read `AGENTS.md`
2. Read this file immediately, then `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`
3. Migrate this file's open items into the ledgers, then refresh it (never delete).
4. Verify ecosystem health: `npm --prefix scripts test` and `npm --prefix scripts run validate`.
