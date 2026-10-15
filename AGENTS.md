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

2. **Organization scope invariant & ignore non-org directories.**
   This agents ecosystem is engineered exclusively for repositories within the `HELIX-Origin`
   organization (`https://github.com/HELIX-Origin`). Never work with, read, explore, or modify
   projects that are not part of the organization. Specifically, **`ramensoftware`** is
   strictly off-limits and must be completely ignored unless explicitly authorized.

3. **Keep the tracking docs current.** `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`
   at workspace root are the session handoff mechanism. Update them any time you start,
   finish, or re-scope a work item. Every tracked item across all four documents must be
   explicitly prefixed with its project tag (`[<project-name>] (<project-path>)`). If credits
   run out mid-task, the next session resumes from these files.

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

## Workspace layout

```
./
├── AGENTS.md                  <- this file
├── ROADMAP.md                 <- master roadmap (architecture, milestone matrix, direction)
├── PLAN.md                    <- active sprint planning (execution tasks, gate, history)
├── TODO.md                    <- actionable checklist (update as you go)
├── BUGS.md                    <- known issues, quirks, workarounds
├── .gitignore                 <- keeps projects/ and scratch/ untracked
├── clone-org-repos-windows.ps1<- Clone all HELIX-Origin repos into projects/ (Windows)
├── clone-org-repos-linux.sh   <- Clone all HELIX-Origin repos into projects/ (Linux)
├── clone-org-repos-macos.sh   <- Clone all HELIX-Origin repos into projects/ (macOS)
├── .github/                   <- GitHub configuration & Copilot instructions
│   └── copilot-instructions.md<- Universal workspace guidance for GitHub Copilot
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
│   ├── NH-Reader/             <- (docs/ in scope)
│   ├── Steam-Vault/           <- Tauri v2 Steam library organizer (Depressurizer revival)
│   ├── Steam-Vault-Catalogue/ <- Community-maintained open game catalogue & crawler
│   ├── Windhawk-Themes/       <- (docs/ in scope)
│   └── Hentai-Senpai-Multi-DE-Theme/ <- (docs/ in scope)
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
| Shell command rules | `.agents/rules/shell-commands.md` |
| Large task handling rules | `.agents/rules/large-task-handling.md` |
| Background task execution rules | `.agents/rules/background-tasks.md` |
| Session & context management rules | `.agents/rules/session-management.md` |
| Clone organization repos | `.agents/skills/clone-org-repos.md` |
| Clone all org repos (scripts) | `clone-org-repos-windows.ps1`, `clone-org-repos-linux.sh`, `clone-org-repos-macos.sh` |
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
| Tauri & Rust desktop engineering | `.agents/skills/tauri-desktop-engineering.md` |
| Windhawk styler mod engineering | `.agents/skills/windhawk-styler-engineering.md` |
| Linux & GTK theme engineering | `.agents/skills/gtk-desktop-theming.md` |
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
| Agent: Desktop theme engineer | `.agents/agents/desktop-theme-engineer/desktop-theme-engineer.md` |
| Agent: Security reviewer | `.agents/agents/security-reviewer/security-reviewer.md` |
| Agent: Git auditor | `.agents/agents/git-guard/git-auditor.md` |

## Session start checklist

1. Read `AGENTS.md` (done — it's this file).
2. Read `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`; resume at the first unchecked TODO item.
3. Consult `.agents/skills/helix-theme.md` before touching helix-docs or any consuming site.
4. Before editing **any** `docs/` content, consult `.agents/rules/documentation-standards.md` —
   the docs stay **theme-neutral/mod-agnostic**; a theme/suite's specifics belong only in the
   catalogue/store.
5. Confirm which exact git operations, if any, the user has explicitly authorized in the
   current conversation — and for which repository.
6. If this is a large/multi-step task, load `task-decomposition` skill and follow `large-task-handling.md`. If session may be long, load `large-session-management` skill and follow `session-management.md`. Follow `background-tasks.md` for any long-running commands.
7. For any shell command, follow `.agents/skills/shell-command-management.md` (quote paths with spaces, set `workdir` instead of `cd`, PowerShell-native tools only). For file edits, follow `.agents/skills/file-editing.md` (read first, exact match, preserve EOL) — never edit files via the shell.