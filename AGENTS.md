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
   This ecosystem covers repositories registered in `.agents/registry/projects.json` under the
   `HELIX-Origin` GitHub organization. That registry is the canonical project inventory; entries
   may be planned and not cloned. Verify the requested project's path before opening it. Never
   work with, read, explore, modify, or directly mention projects outside the active organization
   scope.

3. **Keep the tracking docs 100% accurate, normalized, and current.** `ROADMAP.md`, `PLAN.md`, `TODO.md`, and `BUGS.md` are the workspace memory and must reflect the **100% current, active direction** of all projects with zero contradictions. There are no separate archive ledgers: completed work stays as bare-minimal one-line entries in the primary ledgers, and `CHANGELOG.md` is the historical record:
   - **Active Direction Accuracy**: When a user decision supersedes or changes an earlier direction, immediately replace or remove the superseded statements across all root tracking files. Never leave raw chat logs, obsolete project names, deleted repository references, or superseded features in any ledger.
   - **Normalized & Categorized Locked User Directives**: Rewrite all user directives in `TODO.md` into clean, typo-free engineering specifications grouped under explicit bold domain sub-headers so it is immediately clear what goes to what. Never dump raw chronological chat quotes into `TODO.md`.
   - **Atomic Checklist Groups & Bare-Minimal Completion**: Organize `TODO.md` checklists and `PLAN.md` execution tasks into categorized component groups with atomic items. When a workstream finishes, collapse it to a one-line entry under Completed Workstreams (details belong in `CHANGELOG.md`) and move completed sprints to `## ✅ Completed Sprints`.
   - **Mandatory Project Tagging**: Every tracked item across all root tracking documents must be explicitly prefixed with its current active project tag (`[<project-name>] (<project-path>)`). See `.agents/rules/workspace.md`.

4. **No scope creep.** Repos under `projects/` that are not part of the active task are
   someone else's work. Don't touch them unless asked.

5. **Rely on `.agents/`.** The binding constraints, domain knowledge, and role playbooks for
   this workspace live in `.agents/`. If a rule there conflicts with anything else, the
   `.agents/rules` files win.

6. **Documentation theme-neutrality invariant (documentation hubs currently retired).**
   The centralized documentation and technical-wiki hub sites are retired; rebuilds are planned for later
   (unscheduled). While no hub exists, never link to retired hub addresses and keep each project's
   documentation self-contained in its own repository. Any documentation content (current or future hub)
   is deliberately **theme-neutral and mod-agnostic**: it explains *how to work with the software and mods*,
   never any author's theme. A specific theme/suite (its token names, values, radius scales, colours,
   geometry) may be described **only** in a catalogue/store section.
   **Never make a catalogue theme the source of truth for the docs, and never copy its style references
   into the docs.** See `.agents/rules/documentation-standards.md`.

7. **Agents ecosystem isolation invariant.**
   The agents ecosystem (`.agents/`, `AGENTS.md`, and workspace root tracking docs `ROADMAP.md`,
   `PLAN.md`, `TODO.md`, `BUGS.md`) lives strictly at this agents repository root.
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
   or resource (`windows-game-explorer`, `nh-reader`, `theme-toolkit`, `ffxiv-config`, `depressurizer`).
   All other repositories (`windhawk-themes`, `agents`, `.github`) publish
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
   minimal entry points (~30–50 lines): what the project is, install/run, and links to the community-health
   documents. Exhaustive technical specifications, schemas, and manuals do not belong in the README; keep
   them in the repository's own documentation files. When the organization's centralized documentation
   and wiki hubs are rebuilt, READMEs link to those hubs instead. See `.agents/rules/documentation-standards.md`.

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
   `.github/copilot-instructions.md`). These are first-class: discover and honor
   them for project work, and never rewrite, normalize, or delete them unprompted. The
   workspace-root ecosystem is the base **enhancement layer** — org-wide invariants (git safety,
   licensing, SemVer, releases, community-health, ecosystem isolation, zero-warning, documentation
   standards) are never relaxed by project-local config, while project-local rules win on
   project-internal conventions. See `.agents/rules/project-agents-interoperability.md`.

16. **Resolve the requested repository before acting.**
   This checkout is the private `HELIX-Origin/agents` workspace; each directory under `projects/`
   is a separate repository, not a subdirectory of the agents repository. At task start, verify
   the actual working directory and Git root. The user's explicit repository/workspace selection
   is authoritative: do not infer a target from a previous session, a linked session, a project
   name mentioned in context, or a stale handoff. If the user asks to work in the agents workspace,
   stay at this repository root and do not open or edit a project repository. If they ask for a
   project, target exactly `projects/<id>` from `.agents/registry/projects.json`, then read that
   repository's own `AGENTS.md` and local instructions before any project work. Do not create or
   switch sessions, worktrees, repositories, or Git branches as a substitute for resolving scope.

17. **Mandatory research-first & zero-guessing invariant (applies to ALL work).**
   Guesswork and speculative trial-and-error edits are strictly banned across **all work** in all
   repositories — never limited to any specific field, language, or subsystem. Before writing or
   editing any code, script, configuration, asset, or documentation, you **MUST** first perform
   online documentation research (`search_web` against official primary documentation and
   specifications) and empirical inspection to establish the verified root cause or exact
   specification. Never edit files based on assumptions or use build/test cycles as a guessing
   loop. See `.agents/rules/mandatory-research.md`.




## Workspace layout

```
./
├── AGENTS.md                  <- this file
├── ROADMAP.md                 <- master roadmap (architecture, milestone matrix, direction)
├── PLAN.md                    <- active sprint planning (execution tasks, gate, history)
├── TODO.md                    <- actionable checklist (update as you go)
├── BUGS.md                    <- known issues, quirks, workarounds
├── HANDOFF.md                 <- PERMANENT (git-tracked): session-state ledger, read at session start & kept current incrementally; migrated into the ledgers, never deleted
├── CHANGELOG.md               <- historical record of delivered changes (Keep a Changelog)
├── .gitignore                 <- keeps projects/ and scratch/ untracked
├── provision-repo-secrets.ps1 <- Securely provision PAT_TOKEN secrets to HELIX-Origin repos (Windows)
├── clone-org-repos-windows.ps1<- Clone all HELIX-Origin repos into projects/ (Windows)
├── clone-org-repos-linux.sh   <- Clone all HELIX-Origin repos into projects/ (Linux)
├── clone-org-repos-macos.sh   <- Clone all HELIX-Origin repos into projects/ (macOS)
├── .github/                   <- GitHub configuration & Copilot instructions
│   └── copilot-instructions.md<- Universal workspace guidance for GitHub Copilot
├── .opencode/                 <- OpenCode layer: Big Pickle-only model pin + context plugins + protocols
│   ├── opencode.jsonc         <-   model/policies, compaction, tool-output & media caps, git-ask permissions
│   ├── plugins/               <-   catalog enforcement (Big Pickle only) + context-budget hint
│   └── instructions/          <-   OpenCode operating protocols (never relaxes .agents/ rules)
├── .agents/                   <- universal agent resources (any agent can read them)
│   ├── rules/                 <- binding constraints
│   ├── skills/                <- domain knowledge packs
│   ├── commands/              <- tool-agnostic workflow runbooks (onboard, verify, fix-bug, release, ...)
│   ├── registry/              <- project registry that drives the tracking index
│   ├── migrations/            <- SQLite KB schema migrations
│   ├── templates/             <- document & release templates
│   └── agents/                <- role playbooks: agents/<primary>/<sub>/…
├── scripts/                   <- workspace headless CLI (scripts/agents-kb: setup/migrate/test + kb modules; data/ & logs/ gitignored with tracked READMEs)
├── projects/                  <- UNTRACKED: local git repositories
│   ├── nh-reader/             <- nhentai.net desktop reader (Tauri v2 now; Win32/Direct2D rewrite planned)
│   ├── windows-game-explorer/ <- Native C++20 Win32 Game Explorer: Shell DLL, Studio GUI & service
│   ├── theme-toolkit/         <- Native C++ Windows Theme Studio and applicator
│   ├── windhawk-themes/       <- Windhawk theming suites for Windows 11
│   ├── ffxiv-config/          <- FFXIV HUD, hotbar, and macro configuration setup
│   ├── depressurizer/         <- Native C++ Windows Steam categorizer & AutoCat manager (revival fork)
│   └── (registered projects)  <- See .agents/registry/projects.json; some may be planned, not cloned
└── scratch/                   <- UNTRACKED: temporary workspace files
```

`projects/<id>` is a project repository root with its own Git history and potentially its own
agent instructions and tracking files. `.agents/registry/projects.json` is the canonical
ID-to-relative-path-and-project-kind map; a registry entry does not guarantee that a local clone
exists, so check the path before opening it. Never treat project files as part of the agents
repository or use the root workspace's branch/status to describe a project's Git state.

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
| OpenCode configuration layer (root + per-project) | `.opencode/README.md` |
| OpenCode operating protocols | `.opencode/instructions/opencode-protocols.md` |
| Git permission rules | `.agents/rules/git-operations.md` |
| Mandatory research-first & zero-guessing rule | `.agents/rules/mandatory-research.md` |
| Workspace invariants | `.agents/rules/workspace.md` |
| Release notes standards | `.agents/rules/release-notes.md` |
| Project artwork standards | `.agents/rules/project-artwork.md` |
| Verification standards | `.agents/rules/verification.md` |
| Native GUI visual verification (screenshots, OCR, ImageMagick pixel probes) | `.agents/skills/native-gui-visual-verification.md` |
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
| Subagent management (orchestration) | `.agents/rules/subagent-management.md` |
| Session handoff rules (permanent HANDOFF.md) | `.agents/rules/session-handoff.md` |
| Clone organization repos | `.agents/skills/clone-org-repos.md` |
| Clone all org repos (scripts) | `clone-org-repos-windows.ps1`, `clone-org-repos-linux.sh`, `clone-org-repos-macos.sh` |
| Provision PAT secrets to org repos | `provision-repo-secrets.ps1` |
| Compile theme CSS (dart-sass) | `.agents/skills/sass-compile.md` |
| Modern SCSS architecture | `.agents/skills/scss-architecture.md` |
| Task decomposition & incremental steps | `.agents/skills/task-decomposition.md` |
| Large session & context management | `.agents/skills/large-session-management.md` |
| Session handoff (read, migrate & refresh HANDOFF.md) | `.agents/skills/session-handoff.md` |
| Subagent management playbook | `.agents/skills/subagent-management.md` |
| Shell command management (Windows/PowerShell) | `.agents/skills/shell-command-management.md` |
| Safe file editing (paths, EOL, exact match) | `.agents/skills/file-editing.md` |
| Test execution without blocking | `.agents/skills/test-execution.md` |
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
| Windows Shell extensions & Game Library invariants | `.agents/rules/windows-shell-extension.md` |
| Native C++ Windows desktop engineering (Win2K to 11+) | `.agents/skills/native-windows-cpp.md` |
| Tauri & Rust desktop engineering (legacy reference) | `.agents/skills/tauri-desktop-engineering.md` |
| Windows Game Explorer architecture & design system | `.agents/skills/windows-game-explorer.md` |
| Game metadata providers & multi-source enrichment | `.agents/skills/game-metadata-providers.md` |
| Steam Web API key-only integration (depressurizer) | `.agents/skills/steam-web-api.md` |
| Windhawk styler mod engineering | `.agents/skills/windhawk-styler-engineering.md` |
| Windows deskthemepack & theme packaging | `.agents/skills/windows-deskthemepack-engineering.md` |
| macOS desktop theme engineering | `.agents/skills/macos-theme-engineering.md` |
| Linux desktop theme engineering | `.agents/skills/linux-theme-engineering.md` |
| GFM content rules (+ mermaid) | `.agents/skills/gfm-content.md` |
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
| Agent: Subagent orchestrator (split work, keep parent lean) | `.agents/agents/subagent-orchestrator/subagent-orchestrator.md` |

## Session start checklist

1. Read `AGENTS.md` (done — it's this file).
2. Confirm the actual session working directory and Git root. Resolve the user's explicit target:
   this agents repository or one exact `projects/<id>` repository from `.agents/registry/projects.json`.
   Do not infer the target from previous sessions, chat history, or a handoff. If the user asks for
   agents-workspace work, remain at this root and do not open project repositories.
3. For agents-workspace work, read this root `HANDOFF.md`, then the root `ROADMAP.md` → `PLAN.md` →
   `TODO.md` → `BUGS.md`; reconcile handoff against the root ledgers. For project work, first enter
   only the explicitly selected project's existing registry path and read that repository's own
   `AGENTS.md`, local rules, and project `HANDOFF.md` / ledgers. Root tracking documents describe
   cross-project work and are not evidence of a project's current Git state or checkpoint.
4. Before editing documentation, consult `.agents/rules/documentation-standards.md`.
5. Confirm which exact Git operations, if any, the user has authorized in the current conversation
   and for which repository.
6. When touching a project, discover and honor its own `AGENTS.md`, `.agents/`, and
   `.github/copilot-instructions.md` per `.agents/rules/project-agents-interoperability.md`.
7. For large/multi-step tasks, follow `large-task-handling.md`; for long sessions, follow
   `session-management.md`; for long-running commands, follow `background-tasks.md`.
8. Follow `.agents/skills/shell-command-management.md` for commands and
   `.agents/skills/file-editing.md` for edits. Read files before editing and preserve their
   line endings; never edit files via shell commands.