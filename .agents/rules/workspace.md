# Rule: Workspace Invariants

**Status:** BINDING.

## Forbidden paths & non-organization projects

- **`ramensoftware\`** — absolutely off-limits. Not an organization repository. Do not read, list, search,
  modify, or reference it. If a search glob happens to match it, filter it out.
- Any project not belonging to the `HELIX-Origin` organization is off-limits by default.

## Scope

These rules apply to **every project** under `projects/` — the folder structure below is
the *currently active* work set (repos where only `docs/` is in scope are marked).

## In-scope organization projects (as of 2026-10-10)

- `projects/helix-docs` — theme repo (+ its own preview site).
- `projects/helix-origin.github.io` — portal; **only `docs/` is in scope**.
- `projects/NH-Reader` — Tauri v2 desktop manga reader; **full repository in scope** (scripts, workflows, desktop core, and `docs/`).
- `projects/Steam-Vault` — Tauri v2 desktop app & library launcher; **full repository in scope**.
- `projects/Steam-Vault-Catalogue` — open community game catalogue & crawler; **full repository in scope**.
- `projects/Windhawk-Themes` — **only `docs/` is in scope**.
- `projects/Hentai-Senpai-Multi-DE-Theme` — **DISCONTINUED & ARCHIVED** (unmaintained, read-only).

Everything else outside `projects/` is presumptively out of scope.

## Tracking docs contract

- `ROADMAP.md` — master roadmap, milestone delivery history, organization architecture, and project direction.
- `PLAN.md` — strategic active sprint planning, sprint history, decisions, and "resume point".
- `TODO.md` — actionable checklist; **toggle items from `- [ ]` to `- [x]` as they complete** and add
  new unchecked items before starting new work.
- `BUGS.md` — known issues, quirks, and workarounds. Move entries from Open to Resolved when fixed.
- **Mandatory Project Tagging**: In workspace root tracking documents (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`),
  every milestone, sprint, task, workstream, quirk, or bug MUST be explicitly prefixed with its project tag
  and relative path (`[<project-name>] (<project-path>)`, e.g. `[NH-Reader] (projects/NH-Reader)`). Never omit
  project attribution so agents never mix up distinct repositories.
- Update all four when: starting a task, completing a task, hitting a blocker, or changing scope.

## Communication

- Use clear paths (`projects/helix-docs/_includes/nav.html`).
- Report progress against TODO items, not just prose.
- If credits may run out mid-task, leave TODO.md in a state a fresh session can resume from
  (first unchecked item = next action).

## Environment

- PowerShell. Windows 11.
- Ensure Ruby is accessible in PATH (prepend local Ruby bin if needed).
- Always specify target repo: `git -C projects/<repo> <cmd>`.