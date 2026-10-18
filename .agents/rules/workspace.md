# Rule: Workspace Invariants

**Status:** BINDING.

## Organization-only scope & zero non-org mentions

- Any project or repository not actively part of the `HELIX-Origin` GitHub organization is strictly off-limits. Do not read, list, search, modify, or **directly mention by name** any external, third-party, or discontinued/deleted projects or repositories anywhere in `AGENTS.md`, `.agents/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, or `.github/`.
- Mentioning external projects, competitor tools, or deleted/pre-rebrand repository names in tracking files or skills is strictly prohibited to prevent agents from getting mixed up.

## Scope

These rules apply to **every active project** under `projects/` belonging to `HELIX-Origin`:

## Active `HELIX-Origin` organization projects (as of 2026-10-17)

- `projects/docs` — dedicated organization-wide documentation hub (`https://docs.helix-origin.club`).
- `projects/wiki` — dedicated organization-wide technical knowledge base & wiki (`https://wiki.helix-origin.club`).
- `projects/helix-jekyll-theme` — shared remote Jekyll theme engine (+ its own preview site).
- `projects/helix-origin.github.io` — organization discovery portal (`https://www.helix-origin.club`).
- `projects/nh-reader` — Tauri v2 desktop manga/comic reader (scripts, workflows, desktop core).
- `projects/universal-game-launcher` — Tauri v2 universal game library & launcher.
- `projects/theme-toolkit` — cross-platform desktop theme studio & applicator (Windows, macOS, Linux).
- `projects/windhawk-themes` — Windows 11 styling suites for Windhawk styler mods.
- `projects/helix-gaming-db-00` — REST metadata API & database (core / volume shard 00).
- `projects/helix-gaming-db-01` — REST metadata API & database (volume shard 01).
- `projects/helix-gaming-db-02` — REST metadata API & database (volume shard 02).
- `projects/helix-gaming-db-03` — REST metadata API & database (volume shard 03).
- `projects/ffxiv-config` — FFXIV HUD, hotbar, and macro configuration setup.
- `projects/depressurizer` — Steam library categorizing & management tool (revival fork).

Everything else outside these active `HELIX-Origin` repositories is strictly out of scope and must never be referenced.

## Agent ecosystem priority rule (GLOBAL RULE)

Updating and maintaining the agents ecosystem (`AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/agents/`, `.agents/templates/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) **ALWAYS takes priority** over project-level work.
- When any project is renamed, rebranded, created, archived, or undergoes an architectural or technology stack shift, the agent ecosystem MUST be updated and synchronized first across the board before ANY project code is touched.
- Agents must **NEVER** write or generate project code when the agent ecosystem contains stale, contradictory, or obsolete references to that project or any project in the workspace.
- Any obsolete, legacy, or discontinued architecture must be purged completely from agent documentation, rules, and skills so it never gets inadvertently rebuilt.

## Agents ecosystem isolation invariant

The agents ecosystem (`.agents/`, `AGENTS.md`, and workspace root tracking docs `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) lives strictly at the workspace root (`projects/agents`). It is **never** copied into the individual project repositories under `projects/` and **must never be mentioned, referenced, or linked** inside any project repository (e.g. in `README.md`, documentation, code comments, or configuration files). Project repositories are public, standalone open-source codebases whose documentation must remain completely self-contained for external human contributors.

**Project-local ecosystems (W.56):** every project repository owns its **own, fully self-contained** agents ecosystem (`AGENTS.md`, `.agents/`, `.github/copilot-instructions.md`) and its **own tracking files** (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) holding that repository's items only. They are generated from the headless CLI scaffold (`kb-scaffold.ts`) plus the workspace templates, contain no workspace-root paths or ledger references, carry no `[project] (path)` tags (single-project scope), and never relax org-wide invariants. Per-repo items migrate from the root ledgers into the owning repo; the root ledgers retain only ecosystem and cross-repo items plus a one-line pointer per migrated workstream.

## Organization License Invariant — BSD 3-Clause (BINDING, with Revival Fork Exception)

Every repository, project, package, and document authored across the `HELIX-Origin` organization is strictly licensed under the **BSD 3-Clause "New" or "Revised" License** (`BSD-3-Clause`).
- **Never use MIT or other licenses for original work.** Any occurrence of MIT or other license types in `package.json`, `Cargo.toml`, `.gemspec`, `LICENSE*`, or `README.md` is a violation of organization invariants and must be corrected immediately to `BSD-3-Clause`.
- Every original project repository and workspace root must contain a root `LICENSE.md` (or `LICENSE`) file with the standard BSD 3-Clause legal text copyright to `HELIX Origin`.
- **Revival Fork Exception:** Upstream revival forks of archived third-party repositories (`depressurizer`) strictly retain their original copyleft license (**GPL-3.0**) to respect open-source copyright laws and upstream author licensing.
- All license badges in `README.md` must use the HTML badge standard:
  ```html
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD--3--Clause-blue.svg" alt="License: BSD-3-Clause" height="20" /></a>
  ```


## Fork customization (org_slug, repo mappings)
- The knowledge base is keyed by an **organization slug** (`org_slug`, default `HELIX-Origin`). A fork that wants to track a different organization must change the slug before running setup:
  - **Code**: edit `defaultOrgSlug()` in `scripts/agents-kb/kb-config.ts` (or set the `AGENTS_KB_ORG` / `AGENTS_KB_ORG_SLUG` environment variable at runtime).
  - **Database**: the slug becomes the `organizations.org_slug` row created by `setup.ts`; existing clones keep their slug (the DB is local-only, so changing the slug means re-running setup against a fresh DB).
- **Repo mappings**: the KB scans the canonical `.agents/` tree (rules/skills/agents/templates) plus the root ledgers (`AGENTS.md`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`). There is no per-repo mapping table yet — a fork with a different repo set simply gets a different scanned artifact set after `npm run sync`.
- **Local-only lifecycle**: `scripts/agents-kb/data/` and `logs/` are gitignored; forks start clean via `npm run setup` and never inherit another clone's data. See `.agents/skills/agents-db-design.md` (Sync & lifecycle).
- **Environment overrides**: `AGENTS_KB_PATH` (DB file), `AGENTS_KB_ORG`/`AGENTS_KB_ORG_SLUG` (organization slug), `AGENTS_KB_EXPORT_PATH` (export report path), `AGENTS_KB_SECURE_PATH` (secure DB).

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
  and relative path (`[<project-name>] (<project-path>)`, e.g. `[universal-game-launcher] (projects/universal-game-launcher)`). Never omit
  project attribution or leave stale pre-rebrand repository paths in active or archived sections.
- Update all four when: starting a task, completing a task, hitting a blocker, or changing scope.

## Communication

- Use clear paths (`projects/helix-jekyll-theme/_includes/nav.html`).
- Report progress against TODO items, not just prose.
- If credits may run out mid-task, leave TODO.md in a state a fresh session can resume from
  (first unchecked item = next action).

## Environment

- PowerShell. Windows 11.
- Ensure Ruby is accessible in PATH (prepend local Ruby bin if needed).
- Always specify target repo: `git -C projects/<repo> <cmd>`.