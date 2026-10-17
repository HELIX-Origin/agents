# Rule: Workspace Invariants

**Status:** BINDING.

## Forbidden paths & non-organization projects

- **`ramensoftware\`** — absolutely off-limits. Not an organization repository. Do not read, list, search,
  modify, or reference it. If a search glob happens to match it, filter it out.
- Any project not belonging to the `HELIX-Origin` organization is off-limits by default.

## Scope

These rules apply to **every project** under `projects/` — the folder structure below is
the *currently active* work set (repos where only `docs/` is in scope are marked).

## In-scope organization projects (as of 2026-10-16)

- `projects/helix-docs` — theme repo (+ its own preview site).
- `projects/helix-origin.github.io` — portal; **only `docs/` is in scope**.
- `projects/NH-Reader` — Tauri v2 desktop manga reader; **full repository in scope** (scripts, workflows, desktop core, and `docs/`).
- `projects/Universal-Game-Launcher` — Tauri v2 universal game library & launcher; **full repository in scope**.
- `projects/Theme-Toolkit` — cross-platform desktop theme studio & applicator; **full repository in scope**.
- `projects/Windhawk-Themes` — **only `docs/` is in scope**.

Everything else outside `projects/` is presumptively out of scope.

## Agent ecosystem priority rule (GLOBAL RULE)

Updating and maintaining the agents ecosystem (`AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/agents/`, `.agents/templates/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) **ALWAYS takes priority** over project-level work.
- When any project is renamed, rebranded, created, archived, or undergoes an architectural or technology stack shift, the agent ecosystem MUST be updated and synchronized first across the board before ANY project code is touched.
- Agents must **NEVER** write or generate project code when the agent ecosystem contains stale, contradictory, or obsolete references to that project or any project in the workspace.
- Any obsolete, legacy, or discontinued architecture must be purged completely from agent documentation, rules, and skills so it never gets inadvertently rebuilt.

## Agents ecosystem isolation invariant

The agents ecosystem (`.agents/`, `AGENTS.md`, and workspace root tracking docs `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) lives strictly at the workspace root (`projects/agents`). It is **never** stored inside the individual project repositories under `projects/` and **must never be mentioned, referenced, or linked** inside any project repository (e.g. in `README.md`, documentation, code comments, or configuration files). Project repositories are public, standalone open-source codebases whose documentation must remain completely self-contained for external human contributors.

## Tracking docs contract

- `ROADMAP.md` — master roadmap, milestone delivery history, organization architecture, and project direction.
- `PLAN.md` — strategic active sprint planning, sprint history, decisions, and "resume point".
- `TODO.md` — actionable checklist; **toggle items from `- [ ]` to `- [x]` as they complete** and add
  new unchecked items before starting new work.
- `BUGS.md` — known issues, quirks, and workarounds. Move entries from Open to Resolved when fixed.
- **Bare Minimal Living Ledgers & Dedicated Archival**: Maintain `ROADMAP.md`, `TODO.md`, and `BUGS.md` lean, sharp, and focused on active workstreams. Detailed historical task checklists, delivered milestone technical narratives, and resolved bug post-mortems are preserved in `.github/` (`.github/ROADMAP-ARCHIVE.md`, `.github/TODO-ARCHIVE.md`, `.github/BUGS-ARCHIVE.md`) to avoid cluttering the workspace root.
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