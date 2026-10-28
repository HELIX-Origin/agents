# Rule: Workspace Invariants

**Status:** BINDING.

## Organization-only scope & zero non-org mentions

- Any project or repository not actively part of the `HELIX-Origin` GitHub organization is strictly off-limits. Do not read, list, search, modify, or **directly mention by name** any external, third-party, or discontinued/deleted projects or repositories anywhere in `AGENTS.md`, `.agents/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, or `.github/`.
- Mentioning external projects, competitor tools, or deleted/pre-rebrand repository names in tracking files or skills is strictly prohibited to prevent agents from getting mixed up.

## Scope and repository routing

These rules apply to this agents workspace and its registered HELIX-Origin project repositories.
The canonical inventory is `.agents/registry/projects.json`; do not maintain a second hand-written
active-project list here. Registry entries define project ID, workspace-relative path, project kind,
and a short description. An entry may be planned or not cloned, so verify that its path exists
before opening it.

- The agents repository root and every `projects/<id>` directory are separate Git repositories.
  The `projects/` directory is local-only/ignored by the agents repository; project files are not
  part of the agents repository's tracked tree.
- Resolve the task's target from the user's explicit request and the live session/workspace root.
  Never infer it from a prior session, a project name in conversation history, or a stale handoff.
- For an agents-workspace task, remain in the agents repository and do not inspect or edit project
  repositories. For a project task, use exactly the registry path, confirm its Git root/status,
  then read that project's own `AGENTS.md` and local agent instructions.
- Do not create or switch sessions, worktrees, repositories, or branches to compensate for an
  unresolved target. Ask the user when their target is genuinely ambiguous.

## Mandatory research-first & zero-guessing invariant (GLOBAL RULE — ALL WORK)

- Guesswork, unverified assumptions, and trial-and-error edits are strictly prohibited across **ALL work** in all repositories (every domain, language, tool, script, configuration, asset, or documentation task — never limited to specific fields).
- Before touching or editing any file, agents **MUST** first conduct online documentation research (`search_web` against official primary documentation and specifications) and empirical measurement/inspection to prove the exact root cause or specification.
- Never use build, test, or register cycles as a speculative debugging loop. See `.agents/rules/mandatory-research.md`.

## Agent ecosystem priority rule (GLOBAL RULE)

Updating and maintaining the agents ecosystem (`AGENTS.md`, `.agents/rules/`, `.agents/skills/`, `.agents/agents/`, `.agents/templates/`, `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) **ALWAYS takes priority** over project-level work.
- When any project is renamed, rebranded, created, archived, or undergoes an architectural or technology stack shift, the agent ecosystem MUST be updated and synchronized first across the board before ANY project code is touched.
- Agents must **NEVER** write or generate project code when the agent ecosystem contains stale, contradictory, or obsolete references to that project or any project in the workspace.
- Any obsolete, legacy, or discontinued architecture must be purged completely from agent documentation, rules, and skills so it never gets inadvertently rebuilt.

## Agents ecosystem isolation invariant

The agents ecosystem (`.agents/`, `AGENTS.md`, and workspace root tracking docs `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) lives strictly at the root of the `HELIX-Origin/agents` repository. It is **never** copied into the individual project repositories under `projects/` and **must never be mentioned, referenced, or linked** inside any project repository (e.g. in `README.md`, documentation, code comments, or configuration files). Project repositories are public, standalone open-source codebases whose documentation must remain completely self-contained for external human contributors. The workspace root is not a child of `projects/`; `projects/<id>` entries are separate clones.

**Project-local ecosystems (W.56):** every project repository owns its **own, fully self-contained** agents ecosystem (`AGENTS.md`, `.agents/`, `.github/copilot-instructions.md`) and its **own tracking files** (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) holding that repository's items only. They are generated from the headless CLI scaffold (`kb-scaffold.ts`) plus the workspace templates, contain no workspace-root paths or ledger references, carry no `[project] (path)` tags (single-project scope), and never relax org-wide invariants. Per-repo items migrate from the root ledgers into the owning repo; the root ledgers retain only ecosystem and cross-repo items plus a one-line pointer per migrated workstream.

## OpenCode configuration layer (`.opencode/`)

`.opencode/` is the **OpenCode-specific adapter** on top of the tool-agnostic `.agents/` ecosystem — not a replacement for it, and never a place to hide an org-wide invariant.

- **Location:** one `.opencode/` at the workspace root and one self-contained `.opencode/` in **each** active project repository (`nh-reader`, `windows-game-explorer`, `theme-toolkit`, `depressurizer`, `windhawk-themes`, `ffxiv-config`).
- **Mandatory contents per copy:** `opencode.jsonc`, `plugins/big-pickle-only.ts`, `plugins/context-budget.ts`, `instructions/opencode-protocols.md`, plus `types/opencode-plugin.d.ts` and `tsconfig.json` for standalone type checking of the plugins (a root `README.md` is added on top).
- **Single-model invariant:** only **Big Pickle** (`opencode/big-pickle`) may be used. Enforced twice — `model` + `policies` in `opencode.jsonc`, and a catalog-filtering plugin. Never add another provider, model, or model override to any configuration.
- **Precedence:** `AGENTS.md` and `.agents/rules/` always win. `.opencode/` may add operating protocols, context budget limits, and git-mutation prompts; it may never relax git safety, licensing, SemVer/release, community-health, zero-warning, documentation, or isolation rules.
- **Isolation:** a project's `.opencode/` must stay standalone and must never reference or link the private agents ecosystem, exactly like its `AGENTS.md` / `.agents/` (see the isolation invariant above). Plugin identifiers use a neutral `helix.*` prefix and plugin docs stay generic.
- **Maintenance:** changing an org-wide OpenCode setting means updating the root copy **and** every project copy in the same change, keeping them behaviourally identical.

## Per-Project Licensing (BINDING, with Revival Fork Exception)

Each repository under `HELIX-Origin` is licensed under the license that best fits that project.
There is no single org-wide default license; the choice is made per repository.
- **Default for original work:** MIT is the common default for original code, documentation,
  themes, and tools, but a project may use any appropriate license (BSD-3-Clause, Apache-2.0,
  CC-BY-4.0, etc.) when it is a better fit. The license must be chosen deliberately and
  documented.
- Every original project repository must contain a root `LICENSE` (or `LICENSE.md`) file with
  the standard legal text for its chosen license, copyright to `HELIX Origin` (or the upstream
  author where applicable).
- All license fields must agree: `LICENSE*`, `package.json`, `Cargo.toml`, `.gemspec`,
  `README.md` badge, and `CITATION.cff`.
- **Revival Fork Exception:** Upstream revival forks of archived third-party repositories
  (`depressurizer`) strictly retain their original copyleft license (**GPL-3.0**) to respect
  open-source copyright laws and upstream author licensing.
- License badges in `README.md` must use the HTML badge standard matching the chosen license,
  e.g. MIT:
  ```html
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" height="20" /></a>
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
- **100% Active Direction Accuracy Invariant**: All tracking documents (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) and `.agents/` skills/rules MUST reflect the **current, active direction** of every project with zero contradictions. When a user decision pivots or supersedes an earlier requirement (e.g., consolidating plugins, changing UI navigation, restoring or dropping a feature, or rebranding a project), agents MUST **replace or remove** the superseded statements everywhere rather than leaving obsolete history that could confuse agents.
- **Normalized & Categorized Locked User Directives**: Never leave raw, chronological chat quotes or contradictory historical directives in `TODO.md`. All `Locked user directives` MUST be:
  1. **Normalized & Polished**: Rewritten into clear, concise, typo-free engineering specifications.
  2. **Categorized by Domain / Component**: Grouped under explicit bold sub-headers (e.g., **Plugin & Helper Architecture**, **Metadata & Cache Management**, **UI Layout & Platform Icons**, **Per-Game Customization**) so it is immediately clear what goes to what.
  3. **Deduplicated & Aligned**: Merged in place when requirements evolve, ensuring zero conflicting rules or obsolete project/feature references.
- **Atomic Checklist Groups & Bare-Minimal Completion**:
  - Group `Implementation checklist` items in `TODO.md` and `Execution Tasks` in `PLAN.md` by functional component (`- [ ] **[<project-name>] Component Group**:` followed by atomic `- [ ]` sub-tasks). Never stuff multiple distinct deliverables into a single run-on paragraph bullet.
  - When a major workstream or sprint phase finishes and a new architectural scope begins, collapse the completed workstream to a one-line entry under Completed Workstreams, record the details in `CHANGELOG.md`, and open a fresh, focused workstream ID (`W.XX` / `Sprint XX`).
- **Bare Minimal Living Ledgers (no archive files)**: Maintain `ROADMAP.md`, `PLAN.md`, `TODO.md`, and `BUGS.md` lean, sharp, and focused on active work. There are no separate archive ledgers; completed work is a bare-minimal one-line entry in the primary ledger and `CHANGELOG.md` is the historical record. Keep every ledger free of non-organization or deleted repository mentions.
- **Mandatory Project Tagging**: In workspace root tracking documents (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`),
  every milestone, sprint, task, workstream, quirk, or bug MUST be explicitly prefixed with its current active project tag
  and relative path (`[<project-name>] (<project-path>)`, e.g. `[windows-game-explorer] (projects/windows-game-explorer)`). Never omit
  project attribution or leave stale pre-rebrand repository paths.
- Update all four when: starting a task, completing a task, hitting a blocker, or changing scope.

## Communication

- Use clear paths relative to the selected repository (for example, `projects/<id>/src/...`).
- Report progress against TODO items, not just prose.
- If credits may run out mid-task, leave TODO.md in a state a fresh session can resume from
  (first unchecked item = next action).

## Environment

- PowerShell. Windows 11.
- Ensure Ruby is accessible in PATH (prepend local Ruby bin if needed).
- Always specify target repo: `git -C projects/<repo> <cmd>`.