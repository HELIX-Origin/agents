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
   GitHub organization (`https://github.com/HELIX-Origin`): `helix-jekyll-theme`, `helix-origin.github.io`,
   `docs`, `wiki`, `nh-reader`, `universal-game-launcher`, `theme-toolkit`, `windhawk-themes`,
   `helix-gaming-db-00`, `helix-gaming-db-01`, `helix-gaming-db-02`, `helix-gaming-db-03`, `helix-gaming-db-ingest`, `ffxiv-config`, and `depressurizer`. Never work with,
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

6. **Documentation theme-neutrality & centralized hubs invariant.**
   All documentation and technical wikis live centrally in the dedicated `docs` (`docs.helix-origin.club`)
   and `wiki` (`wiki.helix-origin.club`) repositories. Content in `docs/_docs/` and `wiki/_wiki/` is
   deliberately **theme-neutral and mod-agnostic**. It explains *how to work with the software and mods*,
   never any author's theme. A specific theme/suite (its token names, values, radius scales, colours,
   geometry) may be described **only** in the **catalogue/store** (`docs/_catalogue/`).
   **Never make a catalogue theme the source of truth for the docs, and never copy its style references
   into the docs.** Project repositories contain no local `docs/` folders. See `.agents/rules/documentation-standards.md`.

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

9. **Per-project licensing — most fitting license per repository (no org-wide default).**
   Each repository under `HELIX-Origin` is licensed under the license that best fits that
   project. There is no single org-wide default; the choice is made per repository (MIT is the
   common default for original code/docs/themes/tools, but a project may use any appropriate
   license). `depressurizer` strictly retains its original copyleft license (**GPL-3.0**) as an
   upstream revival fork. Every `LICENSE*`, `package.json`, `Cargo.toml`, `.gemspec`,
   `README.md`, and `CITATION.cff` must state the repository's chosen license consistently.
   See `.agents/rules/workspace.md`.

10. **Organization release & asset attachment invariant.**
   Every repository across `HELIX-Origin` must make use of GitHub Releases. However,
   release assets must **only** be uploaded to repositories distributing a packaged application
   or resource (`universal-game-launcher`, `nh-reader`, `theme-toolkit`, `ffxiv-config`, `depressurizer`).
   All other repositories (`docs`, `wiki`, `helix-origin.github.io`, `helix-jekyll-theme`,
   `windhawk-themes`, `helix-gaming-db-00` through `03`, `agents`, `.github`) publish
   zero-asset GitHub Releases with release notes and tags. See `.agents/rules/release-notes.md`.

11. **Organization-wide Semantic Versioning invariant.**
   All repositories across the `HELIX-Origin` organization strictly adhere to **Semantic
   Versioning** (`vMAJOR.MINOR.PATCH`, e.g. `v1.0.0`, `v0.1.0`) for all releases, git tags,
   changelog headers, and version manifests. Milestone-based releases (e.g. `M.01`, `M.02b`)
   are strictly prohibited organization-wide. Milestone and sprint identifiers may only exist
   as internal planning scopes within workspace tracking documents (`ROADMAP.md`, `PLAN.md`).
   See `.agents/rules/release-notes.md`.

12. **Repository README minimal entry point invariant.**
   Repository root `README.md` files across all project repositories must be concise,
   minimal entry points (~30–50 lines). Since the organization provides dedicated, centralized
   documentation (`https://docs.helix-origin.club/<project>/`) and technical wiki
   (`https://wiki.helix-origin.club/<project>/`) hubs, project READMEs must link directly
   to these hubs rather than duplicating exhaustive technical specifications, schemas, or
   manuals. See `.agents/rules/documentation-standards.md`.

13. **Organization zero-warning invariant — warnings are treated as errors.**
   Warnings flagged as "harmless" often end up being breaking issues that directly cause uncaught
   errors and runtime instability. Therefore, warnings are not harmless and are strictly treated
   as errors. All compilers, typecheckers, linters, and bundlers across all repositories must
   execute with **zero errors and zero warnings** (`RUSTFLAGS="-D warnings" cargo check`, `cargo test`,
   `svelte-check` reporting 0 errors and 0 warnings, and bundler/transpiler output with 0 warnings).
   Never allow warnings to linger in any codebase. See `.agents/rules/verification.md`.

14. **Organization community-health files invariant.**
   Every repository under `projects/` must ship the standard, self-contained GitHub community-health
   documents: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `PRIVACY.md`,
   `CHANGELOG.md`, `GOVERNANCE.md`, `CITATION.cff`, a conditional `TOS.md` (for apps/resources that
   interact with third-party services), plus `.github/pull_request_template.md` and YAML issue forms
   (`.github/ISSUE_TEMPLATE/{config.yml,bug_report.yml,feature_request.yml}`). Each repository
   `README.md` must link these documents so GitHub surfaces them as tabs/links. They are public-facing
   and **must never** reference or mention the private agents ecosystem. See
   `.agents/rules/community-health-files.md`.

15. **Project-local agents interoperability invariant.**
   Project repositories may ship their own internal agents ecosystems (`AGENTS.md`, `.agents/`,
   `.opencode/`, `.github/copilot-instructions.md`). These are first-class: discover and honor
   them for project work, and never rewrite, normalize, or delete them unprompted. The
   workspace-root ecosystem is the base **enhancement layer** — org-wide invariants (git safety,
   licensing, SemVer, releases, community-health, ecosystem isolation, zero-warning, documentation
   standards) are never relaxed by project-local config, while project-local rules win on
   project-internal conventions. See `.agents/rules/project-agents-interoperability.md`.




## Workspace layout

```
./
├── AGENTS.md                  <- this file
├── ROADMAP.md                 <- master roadmap (architecture, milestone matrix, direction)
├── PLAN.md                    <- active sprint planning (execution tasks, gate, history)
├── TODO.md                    <- actionable checklist (update as you go)
├── BUGS.md                    <- known issues, quirks, workarounds
├── HANDOFF.md                 <- PERMANENT (git-tracked): session-state ledger, read at session start & kept current incrementally; migrated into the ledgers, never deleted
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
├── scripts/                   <- workspace headless CLI (scripts/agents-kb: setup/migrate/test + kb modules; data/ & logs/ gitignored with tracked READMEs)
├── projects/                  <- UNTRACKED: local git repositories
│   ├── helix-jekyll-theme/    <- the shared Jekyll theme (+ its preview site)
│   ├── helix-origin.github.io/ <- Organization portal (hosted at https://www.helix-origin.club)
│   ├── docs/                  <- dedicated documentation site (hosted at https://docs.helix-origin.club)
│   ├── wiki/                  <- dedicated technical wiki site (hosted at https://wiki.helix-origin.club)
│   ├── nh-reader/             <- Tauri v2 desktop reader (scripts, core, and docs in scope)
│   ├── universal-game-launcher/ <- Tauri v2 Universal Game Launcher (multi-platform library & launcher)
│   ├── theme-toolkit/         <- Tauri v2 desktop theme studio & applicator (Windows, macOS, Linux)
│   ├── windhawk-themes/       <- (docs/ in scope)
│   ├── helix-gaming-db-00/    <- REST metadata API & gaming database (shard 00 / core)
│   ├── helix-gaming-db-01/    <- REST metadata API & gaming database (shard 01)
│   ├── helix-gaming-db-02/    <- REST metadata API & gaming database (shard 02)
│   ├── helix-gaming-db-03/    <- REST metadata API & gaming database (shard 03)
│   ├── helix-gaming-db-ingest/<- Dedicated automated metadata crawler, ingestion & cross-shard router
│   ├── ffxiv-config/          <- FFXIV HUD, hotbar, and macro configuration setup
│   └── depressurizer/         <- Tauri v2 cross-platform Steam library categorizer & AutoCat manager (revival fork)
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
| Documentation & content standards (theme-neutrality, HTML badges) | `.agents/rules/documentation-standards.md` |
| Community health files standard (CONTRIBUTING/SECURITY/PRIVACY/etc.) | `.agents/rules/community-health-files.md` |
| Project-local agents interoperability (projects with own agents ecosystems) | `.agents/rules/project-agents-interoperability.md` |
| Theme engineering & packaging standards | `.agents/rules/theme-engineering-standards.md` |
| Shell command rules | `.agents/rules/shell-commands.md` |
| Project scripts & command standards | `.agents/rules/script-standards.md` |
| Large task handling rules | `.agents/rules/large-task-handling.md` |
| Background task execution rules | `.agents/rules/background-tasks.md` |
| Session & context management rules | `.agents/rules/session-management.md` |
| Session handoff rules (permanent HANDOFF.md) | `.agents/rules/session-handoff.md` |
| Clone organization repos | `.agents/skills/clone-org-repos.md` |
| Clone all org repos (scripts) | `clone-org-repos-windows.ps1`, `clone-org-repos-linux.sh`, `clone-org-repos-macos.sh` |
| Provision PAT secrets to org repos | `provision-repo-secrets.ps1` |
| Compile theme CSS (dart-sass) | `.agents/skills/sass-compile.md` |
| Modern SCSS architecture | `.agents/skills/scss-architecture.md` |
| Task decomposition & incremental steps | `.agents/skills/task-decomposition.md` |
| Large session & context management | `.agents/skills/large-session-management.md` |
| Session handoff (read, migrate & refresh HANDOFF.md) | `.agents/skills/session-handoff.md` |
| Shell command management (Windows/PowerShell) | `.agents/skills/shell-command-management.md` |
| Safe file editing (paths, EOL, exact match) | `.agents/skills/file-editing.md` |
| Test execution without blocking | `.agents/skills/test-execution.md` |
| helix-jekyll-theme knowledge / repair | `.agents/skills/helix-theme.md` |
| Project artwork generation | `.agents/skills/project-artwork-generation.md` |
| Template: Project artwork (16:9) | `.agents/templates/project-artwork-template.svg` |
| Template: Roadmap ledger | `.agents/templates/roadmap-template.md` |
| Template: Sprint plan ledger | `.agents/templates/plan-template.md` |
| Template: Task checklist ledger | `.agents/templates/todo-template.md` |
| Template: Bug tracker ledger | `.agents/templates/bugs-template.md` |
| Template: Session handoff buffer | `.agents/templates/handoff-template.md` |
| Template: Cleanup failed runs workflow | `.agents/templates/cleanup-failed-runs-workflow-template.yml` |
| Template: CI workflow (Tauri v2) | `.agents/templates/ci-tauri-workflow-template.yml` |
| Template: NSIS hooks (Tauri v2 Windows) | `.agents/templates/nsis-hooks-template.nsh` |
| Template: macOS uninstaller script | `.agents/templates/uninstall-macos-template.sh` |
| Template: Linux uninstaller script | `.agents/templates/uninstall-linux-template.sh` |
| Tauri & Rust desktop engineering | `.agents/skills/tauri-desktop-engineering.md` |
| Universal Game Launcher architecture & design system | `.agents/skills/universal-game-launcher.md` |
| Game metadata providers & multi-source enrichment | `.agents/skills/game-metadata-providers.md` |
| Steam Web API key-only integration (depressurizer) | `.agents/skills/steam-web-api.md` |
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
| Agent: Handoff writer (session keeper) | `.agents/agents/session-keeper/handoff-writer.md` |

## Session start checklist

1. Read `AGENTS.md` (done — it's this file).
2. Read `HANDOFF.md` **immediately** (permanent, git-tracked session-state ledger) — it holds the previous
   large session's progress — then migrate its content into `ROADMAP.md` / `PLAN.md` / `TODO.md` /
   `BUGS.md`, reconcile (ledgers win), and **refresh it** (never delete) per `.agents/rules/session-handoff.md`.
   Actively self-monitor context pressure every checkpoint against that rule's scoreboard — never wait for the user to flag a limit.
3. Read `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`; **ensure the agents ecosystem (`.agents/`, `AGENTS.md`, and tracking ledgers) is 100% current and synchronized first** — updating agent rules and tracking ledgers always takes priority before touching project code. Resume at the first unchecked TODO item.
4. Consult `.agents/skills/helix-theme.md` before touching helix-jekyll-theme or any consuming site.
5. Before editing **any** `docs/` content, consult `.agents/rules/documentation-standards.md` —
   the docs stay **theme-neutral/mod-agnostic**; a theme/suite's specifics belong only in the
   catalogue/store.
6. Confirm which exact git operations, if any, the user has explicitly authorized in the
   current conversation — and for which repository.
7. When touching a project, discover and honor its own internal agents assets if present
   (`AGENTS.md`, `.agents/`, `.opencode/`, `.github/copilot-instructions.md`) per
   `.agents/rules/project-agents-interoperability.md` — never clobber them unprompted; the
   workspace-root ecosystem enhances them and org-wide invariants always win.
8. If this is a large/multi-step task, load `task-decomposition` skill and follow `large-task-handling.md`. If session may be long, load `large-session-management` skill and follow `session-management.md`. Follow `background-tasks.md` for any long-running commands.
9. For any shell command, follow `.agents/skills/shell-command-management.md` (quote paths with spaces, set `workdir` instead of `cd`, PowerShell-native tools only). For file edits, follow `.agents/skills/file-editing.md` (read first, exact match, preserve EOL) — never edit files via the shell.