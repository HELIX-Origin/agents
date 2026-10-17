# AGENTS.md — Workspace Rules for AI Agents

> Authoritative rules for any agent working inside this workspace.
> Read this file first, every session, before touching anything.
> **Scope: the entire workspace — this file and `.agents/` cover ALL projects under
> `projects/`, not just the ones listed below.**

## Absolute invariants — never violate

1. **No unauthorized git operations.**
   By default you may run **read-only** git commands (`status`, `log`, `diff`, `show`,
   `ls-files`, `remote -v`). You may **never** run `add`, `commit`, `push`, `pull`, `merge`,
   `rebase`, `reset`, `stash`, `checkout`, `switch`, `clean`, `tag`, `branch`, `mv`, or any
   other repository-mutating command — **unless the user explicitly authorizes that exact
   operation on that exact repository in the current conversation.**
   When in doubt: **ask first.** Rationale: prevents pushing unverified or half-finished
   code to the user's projects. See `.agents/rules/git-operations.md`.

2. **Organization scope invariant — never mention non-org projects or repositories.**
   This agents ecosystem is engineered exclusively for active repositories within the `HELIX-Origin`
   GitHub organization (`https://github.com/HELIX-Origin`): `helix-docs`, `helix-origin.github.io`,
   `nh-reader`, `universal-game-launcher`, `theme-toolkit`, `windhawk-themes`, `helix-gaming-db`, and `ffxiv-config`. Never work with,
   read, explore, modify, or **directly mention by name** any external, third-party, or deleted
   projects or repositories that are not part of the `HELIX-Origin` organization across rules,
   skills, playbooks, or tracking files. This is mandatory to prevent agents from getting mixed up.

3. **Keep the tracking docs and `.github/*-ARCHIVE.md` files 100% accurate, normalized, and current.** `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and their archival counterparts (`.github/ROADMAP-ARCHIVE.md`, `.github/TODO-ARCHIVE.md`, `.github/BUGS-ARCHIVE.md`) are the workspace memory and must reflect the **100% current, active direction** of all projects with zero contradictions:
   - **Active Direction Accuracy (Root & Archives)**: When a user decision supersedes or changes an earlier direction, immediately replace or remove the superseded statements across all root tracking files AND `.github/*-ARCHIVE.md` files. Never leave raw chat logs, obsolete project names, deleted repository references, or superseded features in either active or archived ledgers.
   - **Normalized & Categorized Locked User Directives**: Rewrite all user directives (in both `TODO.md` and `.github/TODO-ARCHIVE.md`) into clean, typo-free engineering specifications grouped under explicit bold domain sub-headers so it is immediately clear what goes to what. Never dump raw chronological chat quotes into `TODO.md` or `.github/TODO-ARCHIVE.md`.
   - **Atomic Checklist Groups & Archival**: Organize `TODO.md` and `.github/TODO-ARCHIVE.md` checklists and `PLAN.md` execution tasks into categorized component groups with atomic items. Move completed workstreams to `.github/TODO-ARCHIVE.md` and completed sprints to `## ✅ Completed Sprints`.
   - **Mandatory Project Tagging**: Every tracked item across all root and archive documents must be explicitly prefixed with its current active project tag (`[<project-name>] (<project-path>)`). See `.agents/rules/workspace.md`.

4. **No scope creep.** Repos under `projects/` that are not part of the active task are
   someone else's work. Don't touch them unless asked.

5. **Rely on `.agents/`.** The binding constraints, domain knowledge, and role playbooks for
   this workspace live in `.agents/`. If a rule there conflicts with anything else, the
   `.agents/rules` files win.

6. **Documentation theme-neutrality invariant.**
   The `docs/` documentation site — including `docs/_docs/`, `docs/_wiki/`, and root guides — is
   deliberately **theme-neutral and mod-agnostic**. It explains *how to work with the mods*, never
   any author's theme. A specific theme/suite (its token names, values, radius scales, colours,
   geometry) may be described **only** in the **catalogue/store** (`docs/_catalogue/`,
   `docs/_store/`). **Never make a catalogue theme the source of truth for the docs, and never copy
   its style references into the docs.** See `.agents/rules/documentation-standards.md`.

7. **Agents ecosystem isolation invariant.**
   The agents ecosystem (`.agents/`, `AGENTS.md`, and workspace root tracking docs `ROADMAP.md`,
   `PLAN.md`, `TODO.md`, `BUGS.md`) lives strictly at the workspace root (`projects/agents`).
   It is **never** stored inside the individual project repositories under `projects/` and
   **must never be mentioned, referenced, or linked** inside any project repository (e.g. in
   `README.md`, documentation, code comments, or configuration files). Project repositories are
   public, standalone open-source codebases whose documentation must remain completely self-contained
   for external human contributors. See `.agents/rules/workspace.md`.

8. **Agent ecosystem updates ALWAYS take priority (Global Rule).**
   Before beginning ANY work, modification, refactoring, feature development, or code generation
   on ANY project in the workspace, the agent ecosystem (`AGENTS.md`, `.agents/rules/`,
   `.agents/skills/`, `.agents/agents/`, `.agents/templates/`, and workspace root tracking docs
   `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) MUST be updated and synchronized first.
   Whenever a project is renamed, rebranded, created, archived, or when its architecture, scope,
   or technology stack changes:
   - ALL references, names, paths, standards, and rules in the agents ecosystem MUST be updated
     immediately across the board.
   - Agents must **NEVER** touch project code while the agent ecosystem contains stale, outdated,
     or conflicting information about that project or any project in the workspace.
   - Updating and maintaining the agents ecosystem is the **#1 highest priority** above all
     project implementation tasks. See `.agents/rules/workspace.md`.


## Workspace layout

```
./
├── AGENTS.md                  <- this file
├── ROADMAP.md                 <- master roadmap (architecture, milestone matrix, direction)
├── PLAN.md                    <- active sprint planning (execution tasks, gate, history)
├── TODO.md                    <- actionable checklist (update as you go)
├── BUGS.md                    <- known issues, quirks, workarounds
├── .gitignore                 <- keeps projects/ and scratch/ untracked
├── provision-repo-secrets.ps1 <- Securely provision PAT_TOKEN secrets to HELIX-Origin repos (Windows)
├── clone-org-repos-windows.ps1<- Clone all HELIX-Origin repos into projects/ (Windows)
├── clone-org-repos-linux.sh   <- Clone all HELIX-Origin repos into projects/ (Linux)
├── clone-org-repos-macos.sh   <- Clone all HELIX-Origin repos into projects/ (macOS)
├── .github/                   <- GitHub configuration, Copilot instructions & completed archives
│   ├── copilot-instructions.md<- Universal workspace guidance for GitHub Copilot
│   ├── BUGS-ARCHIVE.md        <- Historical resolved bugs & post-mortems archive
│   ├── ROADMAP-ARCHIVE.md     <- Historical delivered milestones archive
│   └── TODO-ARCHIVE.md        <- Completed workstreams & historical task archive
├── .opencode/                 <- OpenCode configuration & workflow commands
│   ├── opencode.jsonc         <- Tool permissions, plugins, and compaction config
│   ├── dcp.jsonc              <- Dynamic context pruning rules
│   └── command/               <- Workflow commands (review, release, fix-bug, etc.)
├── .agents/                   <- agent resources (rules, skills, roles)
│   ├── rules/                 <- binding constraints
│   ├── skills/                <- domain knowledge packs
│   ├── templates/             <- document & release templates
│   └── agents/                <- role playbooks: agents/<primary>/<sub>/…
├── projects/                  <- UNTRACKED: local git repositories
│   ├── helix-docs/            <- the shared Jekyll theme (+ its preview site)
│   ├── helix-origin.github.io/ <- GitHub Pages portal (docs/ in scope)
│   ├── nh-reader/             <- Tauri v2 desktop reader (scripts, core, and docs in scope)
│   ├── universal-game-launcher/ <- Tauri v2 Universal Game Launcher (multi-platform library & launcher)
│   ├── theme-toolkit/         <- Tauri v2 desktop theme studio & applicator (Windows, macOS, Linux)
│   ├── windhawk-themes/       <- (docs/ in scope)
│   ├── helix-gaming-db/       <- REST metadata API & gaming database (docs, wiki, and api/v1/ in scope)
│   └── ffxiv-config/          <- FFXIV HUD, hotbar, and macro configuration setup
└── (other projects)           <- out of scope unless asked
```

## Environment quirks (Windows 11)

- Commands run through **PowerShell**.
- Ensure Ruby is accessible in PATH (prepend local Ruby bin if needed):
  `$env:PATH = "<ruby-bin-dir>;$env:PATH"`
- **Line endings are LF everywhere.** Every repository carries a `.gitattributes`
  (`* text=auto eol=lf`; explicit text/binary types; `*.bat`/`*.cmd` → `text eol=crlf`), and the
  effective `core.autocrlf` is `input`. Write LF for all text files; never introduce CRLF and never
  strip a repo's `.gitattributes`.
- **Never trust a single tool result.** Tool output is occasionally corrupted or fabricated —
  verify git mutations with `git ls-remote origin <branch>` before acting (see
  `.agents/rules/git-operations.md`).
- Use `git -C <repo> <cmd>` when operating on sub-projects inside `projects/`.

## Quick reference

| Task | Where |
| --- | --- |
| Git permission rules | `.agents/rules/git-operations.md` |
| Workspace invariants | `.agents/rules/workspace.md` |
| Release notes standards | `.agents/rules/release-notes.md` |
| Project artwork standards | `.agents/rules/project-artwork.md` |
| Verification standards | `.agents/rules/verification.md` |
| Security & secret hygiene | `.agents/rules/security-hygiene.md` |
| Styling standards & SCSS-first | `.agents/rules/styling-standards.md` |
| Documentation & content standards (theme-neutrality) | `.agents/rules/documentation-standards.md` |
| Theme engineering & packaging standards | `.agents/rules/theme-engineering-standards.md` |
| Shell command rules | `.agents/rules/shell-commands.md` |
| Project scripts & command standards | `.agents/rules/script-standards.md` |
| Large task handling rules | `.agents/rules/large-task-handling.md` |
| Background task execution rules | `.agents/rules/background-tasks.md` |
| Session & context management rules | `.agents/rules/session-management.md` |
| Clone organization repos | `.agents/skills/clone-org-repos.md` |
| Clone all org repos (scripts) | `clone-org-repos-windows.ps1`, `clone-org-repos-linux.sh`, `clone-org-repos-macos.sh` |
| Provision PAT secrets to org repos | `provision-repo-secrets.ps1` |
| Compile theme CSS (dart-sass) | `.agents/skills/sass-compile.md` |
| Modern SCSS architecture | `.agents/skills/scss-architecture.md` |
| Task decomposition & incremental steps | `.agents/skills/task-decomposition.md` |
| Large session & context management | `.agents/skills/large-session-management.md` |
| Shell command management (Windows/PowerShell) | `.agents/skills/shell-command-management.md` |
| Safe file editing (paths, EOL, exact match) | `.agents/skills/file-editing.md` |
| Test execution without blocking | `.agents/skills/test-execution.md` |
| helix-docs theme knowledge / repair | `.agents/skills/helix-theme.md` |
| Project artwork generation | `.agents/skills/project-artwork-generation.md` |
| Template: Project artwork (16:9) | `.agents/templates/project-artwork-template.svg` |
| Template: Roadmap ledger | `.agents/templates/roadmap-template.md` |
| Template: Sprint plan ledger | `.agents/templates/plan-template.md` |
| Template: Task checklist ledger | `.agents/templates/todo-template.md` |
| Template: Bug tracker ledger | `.agents/templates/bugs-template.md` |
| Template: Cleanup failed runs workflow | `.agents/templates/cleanup-failed-runs-workflow-template.yml` |
| Template: CI workflow (Tauri v2) | `.agents/templates/ci-tauri-workflow-template.yml` |
| Template: NSIS hooks (Tauri v2 Windows) | `.agents/templates/nsis-hooks-template.nsh` |
| Template: macOS uninstaller script | `.agents/templates/uninstall-macos-template.sh` |
| Template: Linux uninstaller script | `.agents/templates/uninstall-linux-template.sh` |
| Tauri & Rust desktop engineering | `.agents/skills/tauri-desktop-engineering.md` |
| Universal Game Launcher architecture & design system | `.agents/skills/universal-game-launcher.md` |
| Game metadata providers & multi-source enrichment | `.agents/skills/game-metadata-providers.md` |
| HELIX Gaming DB multi-platform expansion & ingestion | `.agents/skills/helix-gaming-db-expansion.md` |
| Windhawk styler mod engineering | `.agents/skills/windhawk-styler-engineering.md` |
| Windows deskthemepack & theme packaging | `.agents/skills/windows-deskthemepack-engineering.md` |
| macOS desktop theme engineering | `.agents/skills/macos-theme-engineering.md` |
| Linux desktop theme engineering | `.agents/skills/linux-theme-engineering.md` |
| GFM content rules (+ mermaid) | `.agents/skills/gfm-content.md` |
| Remote-theme config for a site | `.agents/skills/jekyll-remote-theme.md` |
| Agent: SCSS engineer | `.agents/agents/theme-engineer/scss-engineer.md` |
| Agent: Components & layouts | `.agents/agents/theme-engineer/components-engineer.md` |
| Agent: Preview builder | `.agents/agents/theme-engineer/preview-builder.md` |
| Agent: Artwork designer | `.agents/agents/artwork-designer/artwork-designer.md` |
| Agent: Config fixer | `.agents/agents/docs-site-engineer/config-fixer.md` |
| Agent: Frontmatter fixer | `.agents/agents/docs-site-engineer/frontmatter-fixer.md` |
| Agent: Content validator (GFM) | `.agents/agents/docs-site-engineer/content-validator.md` |
| Agent: Desktop engineer (Rust/Tauri) | `.agents/agents/desktop-engineer/desktop-engineer.md` |
| Agent: Desktop theme engineer (Multi-Platform Theme Toolkit & Windows Styler) | `.agents/agents/desktop-theme-engineer/desktop-theme-engineer.md` |
| Agent: Theme packager (Theme Toolkit) | `.agents/agents/desktop-theme-engineer/theme-packager.md` |
| Agent: Cursor packager (Theme Toolkit) | `.agents/agents/desktop-theme-engineer/cursor-packager.md` |
| Agent: Sound packager (Theme Toolkit) | `.agents/agents/desktop-theme-engineer/sound-packager.md` |
| Agent: Security reviewer | `.agents/agents/security-reviewer/security-reviewer.md` |
| Agent: Git auditor | `.agents/agents/git-guard/git-auditor.md` |

## Session start checklist

1. Read `AGENTS.md` (done — it's this file).
2. Read `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`; **ensure the agents ecosystem (`.agents/`, `AGENTS.md`, and tracking ledgers) is 100% current and synchronized first** — updating agent rules and tracking ledgers always takes priority before touching project code. Resume at the first unchecked TODO item.
3. Consult `.agents/skills/helix-theme.md` before touching helix-docs or any consuming site.
4. Before editing **any** `docs/` content, consult `.agents/rules/documentation-standards.md` —
   the docs stay **theme-neutral/mod-agnostic**; a theme/suite's specifics belong only in the
   catalogue/store.
5. Confirm which exact git operations, if any, the user has explicitly authorized in the
   current conversation — and for which repository.
6. If this is a large/multi-step task, load `task-decomposition` skill and follow `large-task-handling.md`. If session may be long, load `large-session-management` skill and follow `session-management.md`. Follow `background-tasks.md` for any long-running commands.
7. For any shell command, follow `.agents/skills/shell-command-management.md` (quote paths with spaces, set `workdir` instead of `cd`, PowerShell-native tools only). For file edits, follow `.agents/skills/file-editing.md` (read first, exact match, preserve EOL) — never edit files via the shell.