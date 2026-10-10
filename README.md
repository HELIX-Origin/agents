# HELIX Origin — AI Agents Ecosystem & Workspace Governance

> Centralized AI agent instructions, binding rules, engineering skills, and workspace coordination framework for all projects within the [HELIX Origin](https://github.com/HELIX-Origin) organization.

---

## 🧭 Overview

This repository houses the authoritative operational blueprint for AI coding assistants working across the **HELIX Origin** software and documentation ecosystem. It provides:

- **Binding Workspace Invariants:** Authoritative rules governing git permissions, scoping boundaries, and multi-project coordination.
- **Specialized Engineering Skills:** Deep operational runbooks for Dart Sass compilation, GitHub Pages remote theme engineering, Jekyll documentation trees, and release standards.
- **Hierarchical Role Playbooks:** Multi-tier agent profiles specialized for theme engineering, documentation site architecture, and git audit safety.
- **Single Source of Truth:** Centralized tracking files (`PLAN.md`, `TODO.md`, `BUGS.md`) ensuring persistent task handoff and state restoration across autonomous sessions.

---

## 📁 Workspace Architecture

```
./
├── README.md                  <- Ecosystem overview and setup instructions
├── AGENTS.md                  <- Authoritative rules and session start checklist
├── PLAN.md                    <- Master roadmap, strategic phases, and decisions
├── TODO.md                    <- Actionable, granular task checklist
├── BUGS.md                    <- Active defect tracker and technical workarounds
├── .gitignore                 <- Keeps projects/ and scratch/ untracked
├── .github/                   <- GitHub configuration & Copilot instructions
│   └── copilot-instructions.md<- Universal workspace guidance for GitHub Copilot
├── .opencode/                 <- OpenCode AI agent configuration & workflows
│   ├── opencode.jsonc         <- Tool permissions, plugins, and compaction config
│   ├── dcp.jsonc              <- Dynamic context pruning rules
│   └── command/               <- Workflow commands (review, release, fix-bug, etc.)
├── .agents/                   <- AI Agent core resources
│   ├── rules/                 <- Binding operational constraints
│   │   ├── git-operations.md  <- Strict read-only git safety policy
│   │   ├── release-notes.md   <- Unified SemVer vs. Milestone release standards
│   │   ├── shell-commands.md  <- PowerShell and toolchain execution conventions
│   │   └── workspace.md       <- Organization boundaries and scope invariants
│   ├── skills/                <- Technical runbooks & domain playbooks
│   │   ├── clone-org-repos.md <- Organization repository cloning procedure
│   │   ├── helix-theme.md     <- HELIX Docs theme architecture & component model
│   │   ├── jekyll-remote-theme.md <- Remote theme configuration for consuming sites
│   │   ├── sass-compile.md    <- Dart Sass compilation pipeline
│   │   └── gfm-content.md     <- GitHub Flavored Markdown and Mermaid standards
│   ├── templates/             <- Standardized document and release templates
│   │   └── release-notes-template.md <- Dual SemVer and Milestone release templates
│   └── agents/                <- Role-based operational playbooks
│       ├── theme-engineer/    <- SCSS, component, and preview engineering agents
│       ├── docs-site-engineer/<- Config, frontmatter, and content validation agents
│       └── git-guard/         <- Repository state auditing agent
├── projects/                  <- UNTRACKED: Local working copies of org repos
│   ├── helix-docs/            <- Shared Jekyll theme & preview site
│   ├── helix-origin.github.io/ <- GitHub Pages portal
│   ├── NH-Reader/             <- Desktop client for nhentai
│   ├── Windhawk-Themes/       <- Windows 11 styling suites & toolchains
│   └── Hentai-Senpai-Multi-DE-Theme/ <- Multi-DE GTK and GNOME theme
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

All projects belong in the gitignored `projects/` directory. Run the automated clone script from [`.agents/skills/clone-org-repos.md`](.agents/skills/clone-org-repos.md):

```powershell
# Create projects folder
New-Item -ItemType Directory -Force -Path "projects"

# Clone official organization repositories
gh repo clone HELIX-Origin/helix-docs projects/helix-docs
gh repo clone HELIX-Origin/helix-origin.github.io projects/helix-origin.github.io
gh repo clone HELIX-Origin/NH-Reader projects/NH-Reader
gh repo clone HELIX-Origin/Windhawk-Themes projects/Windhawk-Themes
gh repo clone HELIX-Origin/Hentai-Senpai-Multi-DE-Theme projects/Hentai-Senpai-Multi-DE-Theme
```

---

## 🛡️ Core Rules & Invariants

1. **No Unauthorized Git Operations:** AI agents are restricted to **read-only** git commands (`status`, `log`, `diff`, `show`, `ls-files`, `remote -v`). Repository-mutating operations (`commit`, `push`, `tag`, `branch`, etc.) require explicit human authorization for that exact operation on that exact repository, in the current conversation.
2. **Strict Organization Scope:** The ecosystem operates exclusively on repositories within the `HELIX-Origin` organization. Non-organization repositories are strictly off-limits.
3. **Tracking Document Discipline:** `PLAN.md`, `TODO.md`, and `BUGS.md` are continuously synchronized as work progresses to guarantee seamless session handoffs.
4. **Theme Precedence:** When shipping updates to documentation components or layouts, the shared theme repository (`helix-docs`) is verified, released, and pushed prior to consuming projects.

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
