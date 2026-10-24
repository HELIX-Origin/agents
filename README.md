# HELIX Origin — AI Agents Ecosystem & Workspace Governance

<p align="center">
  <a href="https://github.com/HELIX-Origin"><img src="https://img.shields.io/badge/Organization-HELIX--Origin-blue?logo=github" alt="HELIX Origin" height="20" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" height="20" /></a>

</p>


> Centralized AI agent instructions, binding rules, engineering skills, templates, and workspace coordination framework for all active repositories within the [HELIX Origin](https://github.com/HELIX-Origin) organization (`nh-reader`, `windows-game-explorer`, `theme-toolkit`, `windhawk-themes`, `ffxiv-config`, `depressurizer`). Additional repositories (`helix-jekyll-theme` and the centralized docs/wiki/portal hubs) are retired and planned for future rebuilds.

---

## 🧭 Overview

This repository houses the authoritative operational blueprint for AI coding assistants working across the **HELIX Origin** software, desktop application, theming, and documentation ecosystem. It provides:

- **Binding Workspace Invariants:** Authoritative rules governing read-only git permissions, strict organization scoping (zero non-organization project mentions), SCSS-first styling, theme-neutral documentation, and multi-project coordination.
- **Specialized Engineering Skills:** Operational runbooks for Native C++ Windows desktop engineering, Windows Game Explorer shell integration & library management, Tauri v2 & Rust desktop engineering, Windows `.deskthemepack` / macOS / Linux theme packaging, and Windhawk styler engineering.
- **Hierarchical Role Playbooks:** Multi-tier agent profiles specialized for desktop engineering, desktop theme packaging, vector artwork design, documentation site validation, security review, and git audit safety.
- **Single Source of Truth & Living Ledgers:** Living root tracking ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`) paired with `CHANGELOG.md` as the historical record, ensuring 100% accuracy with the current active direction of every project.

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
├── HANDOFF.md                 <- Session-state ledger & context handoff record
├── CHANGELOG.md               <- Historical record of delivered changes (Keep a Changelog)
├── .gitignore                 <- Keeps projects/ and scratch/ untracked
├── clone-org-repos-windows.ps1<- Clone all HELIX-Origin repos into projects/ (Windows)
├── clone-org-repos-linux.sh   <- Clone all HELIX-Origin repos into projects/ (Linux)
├── clone-org-repos-macos.sh   <- Clone all HELIX-Origin repos into projects/ (macOS)
├── .github/                   <- GitHub configuration & Copilot instructions
│   └── copilot-instructions.md<- Universal workspace guidance for GitHub Copilot
├── .agents/                   <- Universal AI agent resources (rules, skills, commands, templates, roles)
│   ├── commands/              <- Tool-agnostic workflow runbooks (onboard, verify, fix-bug, release, etc.)
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
│   │   ├── helix-theme.md               <- HELIX Jekyll theme architecture & component model
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
│   │   ├── windows-game-explorer.md     <- Windows Game Explorer shell extension, config & manager
│   │   ├── windhawk-styler-engineering.md <- Windhawk theming & XAML styler mod engineering
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
│   ├── nh-reader/             <- Native C++ Windows desktop reader
│   ├── windows-game-explorer/ <- Native C++ Windows Game Explorer (shell extension & library)
│   ├── theme-toolkit/         <- Native C++ Windows Theme Studio
│   ├── windhawk-themes/       <- Windhawk theming suites for Windows 11
│   ├── depressurizer/         <- Native C++ Steam library categorizer (revival fork)
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
2. **Strict Organization Scope & Zero Non-Org Mentions:** The ecosystem operates exclusively on active repositories within the `HELIX-Origin` organization. Never read, modify, or directly mention by name any external, third-party, or deleted projects or repositories across any workspace file.
3. **100% Active Direction Accuracy & Living Ledgers:** `ROADMAP.md`, `PLAN.md`, `TODO.md`, and `BUGS.md` are continuously synchronized with normalized, domain-categorized directives and atomic checklist groups to guarantee 100% accuracy, while `CHANGELOG.md` serves as the persistent historical record.
4. **Agents Ecosystem Priority & Isolation:** Updating the agents ecosystem (`AGENTS.md`, `.agents/`, and root tracking files) always takes priority before touching project code, and `.agents/` is never stored or referenced inside public project repositories.

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
