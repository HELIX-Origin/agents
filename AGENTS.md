# AGENTS.md — Workspace Rules for AI Agents

> Authoritative rules for any agent working inside `D:\Projects` (this workspace).
> Read this file first, every session, before touching anything.
> **Scope: the entire workspace — this file and `.agents/` cover ALL projects under
> `D:\Projects`, not just the ones listed below.**

## Absolute invariants — never violate

1. **No unauthorized git operations.**
   By default you may run **read-only** git commands (`status`, `log`, `diff`, `show`,
   `ls-files`, `remote -v`). You may **never** run `add`, `commit`, `push`, `pull`, `merge`,
   `rebase`, `reset`, `stash`, `checkout`, `switch`, `clean`, `tag`, `branch`, `mv`, or any
   other repository-mutating command — **unless the user explicitly authorizes that exact
   operation on that exact repository in the current conversation.**
   When in doubt: **ask first.** Rationale: prevents pushing unverified or half-finished
   code to the user's projects. See `.agents/rules/git-operations.md`.

2. **Ignore `ramensoftware` entirely.** Never read, modify, or explore
   `D:\Projects\ramensoftware` unless the user explicitly says otherwise.

3. **Keep the tracking docs current.** `PLAN.md`, `TODO.md`, `BUGS.md` at `D:\Projects\`
   are the session handoff mechanism. Update them any time you start, finish, or re-scope a
   work item. If credits run out mid-task, the next session resumes from these files.

4. **No scope creep.** Repos under `D:\Projects\` that are not part of the active task are
   someone else's work. Don't touch them unless asked.

5. **Rely on `.agents/`.** The binding constraints, domain knowledge, and role playbooks for
   this workspace live in `.agents/`. If a rule there conflicts with anything else, the
   `.agents/rules` files win.

## Workspace layout

```
D:\Projects\
├── AGENTS.md                  <- this file
├── PLAN.md                    <- master plan (phases, decisions, resume point)
├── TODO.md                    <- actionable checklist (update as you go)
├── BUGS.md                    <- known issues, quirks, workarounds
├── .gitignore                 <- keeps projects/ and scratch/ untracked
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
├── ramensoftware/             <- FORBIDDEN — never touch
└── (other projects)           <- out of scope unless asked
```

## Environment quirks (Windows 11)

- Commands run through **PowerShell**.
- Ruby 3.3.12 lives at `C:\Ruby33-x64` but the shell PATH is often stale — prepend it:
  `$env:PATH = "C:\Ruby33-x64\bin;$env:PATH"`
- The end-of-line style is the projects' existing convention; match the file you edit.
- Use `git -C <repo> <cmd>` and set `workdir:` explicitly; the `D:\Projects` root is not a
  git repo itself.

## Quick reference

| Task | Where |
| --- | --- |
| Git permission rules | `.agents/rules/git-operations.md` |
| Workspace invariants | `.agents/rules/workspace.md` |
| Release notes standards | `.agents/rules/release-notes.md` |
| Compile theme CSS (dart-sass) | `.agents/skills/sass-compile.md` |
| helix-docs theme knowledge / repair | `.agents/skills/helix-theme.md` |
| GFM content rules (+ mermaid) | `.agents/skills/gfm-content.md` |
| Remote-theme config for a site | `.agents/skills/jekyll-remote-theme.md` |
| Agent: SCSS engineer | `.agents/agents/theme-engineer/scss-engineer.md` |
| Agent: Components & layouts | `.agents/agents/theme-engineer/components-engineer.md` |
| Agent: Preview builder | `.agents/agents/theme-engineer/preview-builder.md` |
| Agent: Config fixer | `.agents/agents/docs-site-engineer/config-fixer.md` |
| Agent: Frontmatter fixer | `.agents/agents/docs-site-engineer/frontmatter-fixer.md` |
| Agent: Content validator (GFM) | `.agents/agents/docs-site-engineer/content-validator.md` |
| Agent: Git auditor | `.agents/agents/git-guard/git-auditor.md` |

## Session start checklist

1. Read `AGENTS.md` (done — it's this file).
2. Read `PLAN.md` → `TODO.md` → `BUGS.md`; resume at the first unchecked TODO item.
3. Consult `.agents/skills/helix-theme.md` before touching helix-docs or any consuming site.
4. Confirm what (if any) git operations the user has authorized this session.