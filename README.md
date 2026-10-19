# HELIX Origin — AI Agents Ecosystem & Workspace Governance

<p align="center">
  <a href="https://github.com/HELIX-Origin"><img src="https://img.shields.io/badge/Organization-HELIX--Origin-blue?logo=github" alt="HELIX Origin" height="20" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" height="20" /></a>
  <a href="https://docs.helix-origin.club"><img src="https://img.shields.io/badge/Docs-docs.helix--origin.club-brightgreen" alt="Documentation Hub" height="20" /></a>
  <a href="https://wiki.helix-origin.club"><img src="https://img.shields.io/badge/Wiki-wiki.helix--origin.club-brightgreen" alt="Technical Wiki" height="20" /></a>
</p>


> Centralized AI agent instructions, binding rules, engineering skills, templates, and workspace coordination framework for all active repositories within the [HELIX Origin](https://github.com/HELIX-Origin) organization (`helix-jekyll-theme`, `helix-origin.github.io`, `docs`, `wiki`, `nh-reader`, `universal-game-launcher`, `theme-toolkit`, `windhawk-themes`, `helix-gaming-db-00` through `03`, `ffxiv-config`).

---

## 🧭 Overview

This repository houses the authoritative operational blueprint for AI coding assistants working across the **HELIX Origin** software, desktop application, theming, and documentation ecosystem. It provides:

- **Binding Workspace Invariants:** Authoritative rules governing read-only git permissions, strict organization scoping (zero non-organization project mentions), SCSS-first styling, theme-neutral documentation, and multi-project coordination.
- **Specialized Engineering Skills:** Operational runbooks for Tauri v2 & Rust desktop engineering, Universal Game Launcher architecture & metadata providers, Windows `.deskthemepack` / macOS / Linux theme packaging, Windhawk styler engineering, Dart Sass compilation, and `helix-docs` Jekyll remote theme integration.
- **Hierarchical Role Playbooks:** Multi-tier agent profiles specialized for desktop engineering, desktop theme packaging, vector artwork design, documentation site validation, security review, and git audit safety.
- **Single Source of Truth & Normalized Archives:** Living root tracking ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) paired with normalized historical archives in `.github/` (`.github/ROADMAP-ARCHIVE.md`, `.github/TODO-ARCHIVE.md`, `.github/BUGS-ARCHIVE.md`), ensuring 100% accuracy with the current active direction of every project.

---

## 📁 Workspace Architecture

```text
./
├── README.md                  <- Ecosystem overview and setup instructions
├── AGENTS.md                  <- Authoritative rules and session start checklist
├── ROADMAP.md                 <- Master roadmap (architecture, milestone matrix, direction)
├── PLAN.md                    <- Active sprint planning (execution tasks, gate, history)
├── TODO.md                    <- Actionable checklist (normalized directives & atomic groups)
├── BUGS.md                    <- Active defect tracker, invariants, and platform quirks
├── .gitignore                 <- Keeps projects/ and scratch/ untracked
├── clone-org-repos-windows.ps1<- Clone all HELIX-Origin repos into projects/ (Windows)
├── clone-org-repos-linux.sh   <- Clone all HELIX-Origin repos into projects/ (Linux)
├── clone-org-repos-macos.sh   <- Clone all HELIX-Origin repos into projects/ (macOS)
├── .github/                   <- GitHub configuration, Copilot instructions & normalized archives
│   ├── copilot-instructions.md<- Universal workspace guidance for GitHub Copilot
│   ├── BUGS-ARCHIVE.md        <- Normalized historical resolved bugs & post-mortems archive
│   ├── ROADMAP-ARCHIVE.md     <- Normalized historical delivered milestones archive
│   └── TODO-ARCHIVE.md        <- Normalized completed workstreams & historical task archive
├── .opencode/                 <- OpenCode AI agent configuration & workflow commands
│   ├── opencode.jsonc         <- Tool permissions, plugins, and compaction config
│   ├── dcp.jsonc              <- Dynamic context pruning rules
│   └── command/               <- Workflow commands (review, release, fix-bug, etc.)
├── .agents/                   <- AI Agent core resources (rules, skills, templates, roles)
│   ├── rules/                 <- Binding operational constraints
│   │   ├── background-tasks.md          <- Non-blocking execution & log capture rules
│   │   ├── documentation-standards.md   <- Theme-neutrality & content separation rules
│   │   ├── git-operations.md            <- Strict read-only git safety policy
│   │   ├── large-task-handling.md       <- Incremental decomposition requirements
│   │   ├── project-artwork.md           <- 16:9 vector SVG & squircle artwork standards
│   │   ├── release-notes.md             <- Unified SemVer vs. Milestone release standards
│   │   ├── script-standards.md          <- .mjs / .ts ESM scripts & main:sub:option hierarchy
│   │   ├── security-hygiene.md          <- Zero secret leakage & certificate safety rules
│   │   ├── session-management.md        <- Context handoff & compression discipline
│   │   ├── shell-commands.md            <- PowerShell and toolchain execution conventions
│   │   ├── styling-standards.md         <- SCSS-first architecture & design token rules
│   │   ├── theme-engineering-standards.md <- Multi-platform desktop theme packaging rules
│   │   ├── verification.md              <- Per-repository static & runtime quality gates
│   │   └── workspace.md                 <- Organization boundaries & tracking ledger contract
│   ├── skills/                <- Technical runbooks & domain playbooks
│   │   ├── clone-org-repos.md           <- Organization repository cloning procedure
│   │   ├── file-editing.md              <- Safe file editing (paths, LF EOL, exact match)
│   │   ├── game-metadata-providers.md   <- Multi-source metadata & automatic enhancement
│   │   ├── gfm-content.md               <- GitHub Flavored Markdown and Mermaid standards
│   │   ├── helix-theme.md               <- HELIX Docs theme architecture & component model
│   │   ├── jekyll-remote-theme.md       <- Remote theme configuration for consuming sites
│   │   ├── large-session-management.md  <- Long-running session & context management
│   │   ├── linux-theme-engineering.md   <- FreeDesktop sound, XDG cursor & XML wallpaper themes
│   │   ├── macos-theme-engineering.md   <- macOS Dynamic Desktop HEIC & soundset packaging
│   │   ├── project-artwork-generation.md<- 16:9 vector banner & ImageMagick validation guide
│   │   ├── sass-compile.md              <- Dart Sass compilation pipeline
│   │   ├── scss-architecture.md         <- Token-driven SCSS partial & loop architecture
│   │   ├── shell-command-management.md  <- Windows/PowerShell command & path quoting playbook
│   │   ├── task-decomposition.md        <- Atomic step decomposition & verification playbook
│   │   ├── tauri-desktop-engineering.md <- Tauri v2, Rust per-platform libs & NSIS standards
│   │   ├── test-execution.md            <- Non-blocking test runner execution & log inspection
│   │   ├── universal-game-launcher.md   <- Universal Game Launcher UI, plugins & global helpers
│   │   ├── windhawk-styler-engineering.md <- Windows 11 Windhawk XAML styler mod engineering
│   │   └── windows-deskthemepack-engineering.md <- Windows .deskthemepack & makecab.exe packaging
│   ├── templates/             <- Standardized document, installer & workflow templates
│   │   ├── bugs-template.md             <- Canonical bug tracker ledger template
│   │   ├── cleanup-failed-runs-workflow-template.yml <- Universal GitHub Actions cleanup workflow
│   │   ├── milestone-summary-template.md<- Milestone-based release summary template
│   │   ├── nsis-hooks-template.nsh      <- Tauri v2 Windows NSIS pre-install & uninstall hooks
│   │   ├── plan-template.md             <- Canonical sprint plan ledger template
│   │   ├── project-artwork-template.svg <- 16:9 1920x1080 vector project banner template
│   │   ├── pull-request-template.md     <- Standard pull request verification template
│   │   ├── release-notes-template.md    <- Dual SemVer and Milestone release notes templates
│   │   ├── roadmap-template.md          <- Canonical roadmap ledger template
│   │   ├── todo-template.md             <- Canonical task checklist ledger template
│   │   ├── uninstall-linux-template.sh  <- Standard Linux process-safe uninstaller script
│   │   └── uninstall-macos-template.sh  <- Standard macOS process-safe uninstaller script
│   └── agents/                <- Role-based operational playbooks
│       ├── artwork-designer/            <- Vector artwork & portal showcase designer
│       ├── desktop-engineer/            <- Tauri v2, Rust & SvelteKit desktop engineer
│       ├── desktop-theme-engineer/      <- Theme Toolkit, cursor, sound & Windhawk engineers
│       ├── docs-site-engineer/          <- Config, frontmatter, and GFM content validators
│       ├── git-guard/                   <- Repository state & git authorization auditor
│       ├── security-reviewer/           <- Secret, credential & path hygiene reviewer
│       └── theme-engineer/              <- SCSS, component, and Jekyll preview engineers
├── projects/                  <- UNTRACKED: Local working copies of active org repos
│   ├── helix-jekyll-theme/    <- Shared Jekyll theme & preview site
│   ├── helix-origin.github.io/ <- Organization portal (hosted at https://www.helix-origin.club)
│   ├── docs/                  <- Dedicated documentation site (hosted at https://docs.helix-origin.club)
│   ├── wiki/                  <- Dedicated technical wiki site (hosted at https://wiki.helix-origin.club)
│   ├── nh-reader/             <- Tauri v2 desktop reader
│   ├── universal-game-launcher/ <- Tauri v2 Universal Game Launcher
│   ├── theme-toolkit/         <- Tauri v2 cross-platform desktop theme studio
│   ├── windhawk-themes/       <- Windows 11 Windhawk styling suites
│   ├── helix-gaming-db-00/    <- REST metadata API & gaming database (shard 00 / core)
│   ├── helix-gaming-db-01/    <- REST metadata API & gaming database (shard 01)
│   ├── helix-gaming-db-02/    <- REST metadata API & gaming database (shard 02)
│   ├── helix-gaming-db-03/    <- REST metadata API & gaming database (shard 03)
│   └── ffxiv-config/          <- FFXIV HUD, hotbar, and macro configuration setup
└── scratch/                   <- UNTRACKED: Temporary agent working files
```

---

## ⚡ Quick Start: Environment Setup

### 1. Clone the Ecosystem

```bash
git clone https://github.com/HELIX-Origin/agents.git
cd agents
```

### 2. Clone Organization Repositories

All active projects belong in the gitignored `projects/` directory. Run the cross-platform clone script (see [`.agents/skills/clone-org-repos.md`](.agents/skills/clone-org-repos.md)):

```powershell
# Windows (PowerShell)
./clone-org-repos-windows.ps1
```

```bash
# Linux / macOS
bash clone-org-repos-linux.sh
bash clone-org-repos-macos.sh
```

---

## 🛡️ Core Rules & Invariants

1. **No Unauthorized Git Operations:** AI agents are restricted to **read-only** git commands (`status`, `log`, `diff`, `show`, `ls-files`, `remote -v`). Repository-mutating operations (`add`, `commit`, `push`, `tag`, `branch`, `reset`, etc.) require explicit human authorization for that exact operation on that exact repository in the current conversation.
2. **Strict Organization Scope & Zero Non-Org Mentions:** The ecosystem operates exclusively on active repositories within the `HELIX-Origin` organization. Never read, modify, or directly mention by name any external, third-party, or deleted projects or repositories across any workspace or archive file.
3. **100% Active Direction Accuracy & Normalized Archives:** `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and `.github/*-ARCHIVE.md` are continuously synchronized with normalized, domain-categorized directives and atomic checklist groups to guarantee 100% accuracy and seamless session handoffs.
4. **Agents Ecosystem Priority & Isolation:** Updating the agents ecosystem (`AGENTS.md`, `.agents/`, root tracking files, and `.github/*-ARCHIVE.md`) always takes priority before touching project code, and `.agents/` is never stored or referenced inside public project repositories.

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
