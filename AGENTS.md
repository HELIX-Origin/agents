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

## Workspace layout

```
./
├── AGENTS.md                  <- this file
├── ROADMAP.md                 <- master roadmap (architecture, milestone matrix, direction)
├── PLAN.md                    <- active sprint planning (execution tasks, gate, history)
├── TODO.md                    <- actionable checklist (update as you go)
├── BUGS.md                    <- known issues, quirks, workarounds
├── .gitignore                 <- keeps projects/ and scratch/ untracked
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
│   ├── Windhawk-Themes/       <- (docs/ in scope)
│   └── Hentai-Senpai-Multi-DE-Theme/ <- (docs/ in scope)
└── (other projects)           <- out of scope unless asked
```

## Environment quirks (Windows 11)

- Commands run through **PowerShell**.
- Ensure Ruby is accessible in PATH (prepend local Ruby bin if needed):
  `$env:PATH = "<ruby-bin-dir>;$env:PATH"`
- The end-of-line style is the projects' existing convention; match the file you edit.
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
| Clone organization repos | `.agents/skills/clone-org-repos.md` |
| Compile theme CSS (dart-sass) | `.agents/skills/sass-compile.md` |
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
4. Confirm what (if any) git operations the user has authorized this session.