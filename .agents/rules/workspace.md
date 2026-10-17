# Rule: Workspace Invariants

**Status:** BINDING.

## Organization-only scope & zero non-org mentions

- Any project or repository not actively part of the `HELIX-Origin` GitHub organization is strictly off-limits. Do not read, list, search, modify, or **directly mention by name** any external, third-party, or discontinued/deleted projects or repositories anywhere in `AGENTS.md`, `.agents/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, or `.github/`.
- Mentioning external projects, competitor tools, or deleted/pre-rebrand repository names in tracking files or skills is strictly prohibited to prevent agents from getting mixed up.

## Scope

These rules apply to **every active project** under `projects/` belonging to `HELIX-Origin`:

## Active `HELIX-Origin` organization projects (as of 2026-10-17)

- `projects/helix-docs` — theme repo (+ its own preview site).
- `projects/helix-origin.github.io` — portal; **only `docs/` is in scope**.
- `projects/NH-Reader` — Tauri v2 desktop manga reader; **full repository in scope** (scripts, workflows, desktop core, and `docs/`).
- `projects/Universal-Game-Launcher` — Tauri v2 universal game library & launcher; **full repository in scope**.
- `projects/Theme-Toolkit` — cross-platform desktop theme studio & applicator; **full repository in scope**.
- `projects/Windhawk-Themes` — **only `docs/` is in scope**.
- `projects/helix-gaming-db` — REST metadata API & gaming database; **full repository in scope** (docs, wiki, schemas, and `api/v1/` endpoints).

Everything else outside these active `HELIX-Origin` repositories is strictly out of scope and must never be referenced.

## Agent ecosystem priority rule (GLOBAL RULE)

Updating and maintaining the agents ecosystem (`AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/agents/`, `.agents/templates/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) **ALWAYS takes priority** over project-level work.
- When any project is renamed, rebranded, created, archived, or undergoes an architectural or technology stack shift, the agent ecosystem MUST be updated and synchronized first across the board before ANY project code is touched.
- Agents must **NEVER** write or generate project code when the agent ecosystem contains stale, contradictory, or obsolete references to that project or any project in the workspace.
- Any obsolete, legacy, or discontinued architecture must be purged completely from agent documentation, rules, and skills so it never gets inadvertently rebuilt.

## Agents ecosystem isolation invariant

The agents ecosystem (`.agents/`, `AGENTS.md`, and workspace root tracking docs `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) lives strictly at the workspace root (`projects/agents`). It is **never** stored inside the individual project repositories under `projects/` and **must never be mentioned, referenced, or linked** inside any project repository (e.g. in `README.md`, documentation, code comments, or configuration files). Project repositories are public, standalone open-source codebases whose documentation must remain completely self-contained for external human contributors.

## Tracking docs contract

- `ROADMAP.md` — master roadmap, milestone delivery history, organization architecture, and project direction.
- `PLAN.md` — strategic active sprint planning (`## 🎯 Active Sprints` contains ONLY currently active sprints; finished sprints move immediately to `## ✅ Completed Sprints`).
- `TODO.md` — actionable checklist; **toggle items from `- [ ]` to `- [x]` as they complete** and add
  new unchecked items before starting new work.
- `BUGS.md` — known issues, architectural invariants, quirks, and workarounds. Move entries from Open to Resolved when fixed, and immediately purge or update any quirk entry superseded by a new architectural decision.
- **100% Active Direction Accuracy Invariant (Root & Archives)**: All tracking documents (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`), their archival counterparts (`.github/ROADMAP-ARCHIVE.md`, `.github/TODO-ARCHIVE.md`, `.github/BUGS-ARCHIVE.md`), and `.agents/` skills/rules MUST reflect the **current, active direction** of every project with zero contradictions. When a user decision pivots or supersedes an earlier requirement (e.g., consolidating plugins, changing UI navigation, restoring or dropping a feature, or rebranding a project), agents MUST **replace or remove** the superseded statements everywhere — including inside `.github/*-ARCHIVE.md` — rather than leaving obsolete history that could confuse agents.
- **Normalized & Categorized Locked User Directives (Root & Archives)**: Never leave raw, chronological chat quotes or contradictory historical directives in `TODO.md` or `.github/TODO-ARCHIVE.md`. All `Locked user directives` across both active and archived workstreams MUST be:
  1. **Normalized & Polished**: Rewritten into clear, concise, typo-free engineering specifications.
  2. **Categorized by Domain / Component**: Grouped under explicit bold sub-headers (e.g., **Plugin & Helper Architecture**, **Metadata & Cache Management**, **UI Layout & Platform Icons**, **Per-Game Customization**) so it is immediately clear what goes to what.
  3. **Deduplicated & Aligned**: Merged in place when requirements evolve, ensuring zero conflicting rules or obsolete project/feature references across active and archived workstreams.
- **Atomic Checklist Groups & Prompt Workstream Archival**:
  - Group `Implementation checklist` items in `TODO.md` and `.github/TODO-ARCHIVE.md` and `Execution Tasks` in `PLAN.md` by functional component (`- [ ] **[<project-name>] Component Group**:` followed by atomic `- [ ]` sub-tasks). Never stuff multiple distinct deliverables into a single run-on paragraph bullet.
  - When a major workstream or sprint phase finishes and a new architectural scope begins, archive the completed workstream checklist into `.github/TODO-ARCHIVE.md` (preserving its normalized, domain-categorized directives and atomic checklist groups) and open a fresh, focused workstream ID (`W.XX` / `Sprint XX`).
- **Bare Minimal Living Ledgers & Normalized Dedicated Archival**: Maintain `ROADMAP.md`, `TODO.md`, and `BUGS.md` lean, sharp, and focused on active workstreams. Detailed historical task checklists, delivered milestone technical narratives, and resolved bug post-mortems in `.github/` (`.github/ROADMAP-ARCHIVE.md`, `.github/TODO-ARCHIVE.md`, `.github/BUGS-ARCHIVE.md`) must be kept equally clean, normalized, and free of non-organization or deleted repository mentions.
- **Mandatory Project Tagging**: In workspace root tracking documents (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) and `.github/*-ARCHIVE.md` files,
  every milestone, sprint, task, workstream, quirk, or bug MUST be explicitly prefixed with its current active project tag
  and relative path (`[<project-name>] (<project-path>)`, e.g. `[Universal-Game-Launcher] (projects/Universal-Game-Launcher)`). Never omit
  project attribution or leave stale pre-rebrand repository paths in active or archived sections.
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