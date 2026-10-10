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
- `projects/NH-Reader` — **only `docs/` is in scope**.
- `projects/Windhawk-Themes` — **only `docs/` is in scope**.
- `projects/Hentai-Senpai-Multi-DE-Theme` — **only `docs/` is in scope**.

Everything else outside `projects/` is presumptively out of scope.

## Tracking docs contract

- `PLAN.md` — strategic plan, phases, decisions, "resume point".
- `TODO.md` — checklist; **toggle items from `- [ ]` to `- [x]` as they complete** and add
  new unchecked items before starting new work.
- `BUGS.md` — anything that breaks or surprises, with status and workaround. Move entries
  from Open to Resolved when fixed.
- Update all three when: starting a task, completing a task, hitting a blocker, or changing
  scope.

## Communication

- Use clear paths (`projects/helix-docs/_includes/nav.html`).
- Report progress against TODO items, not just prose.
- If credits may run out mid-task, leave TODO.md in a state a fresh session can resume from
  (first unchecked item = next action).

## Environment

- PowerShell. Windows 11.
- Ensure Ruby is accessible in PATH (prepend local Ruby bin if needed).
- Always specify target repo: `git -C projects/<repo> <cmd>`.