# Rule: Project-Local Agents Interoperability

> BINDING. Individual project repositories may carry their own internal agents ecosystems
> (`AGENTS.md`, `.agents/`, `.github/copilot-instructions.md`). The workspace-root
> ecosystem is designed to **work alongside and enhance** those project-local systems — never to
> replace, clobber, or conflict with them.

## Discovery

When starting work on any project under `projects/`, check for project-local agent assets:

- `AGENTS.md` (project root)
- `.agents/` (`rules/`, `skills/`, `templates/`, `agents/`, …)
- `.github/copilot-instructions.md`

Load and honor them for all project-internal work. Absence is normal — not every project has
its own ecosystem.

## Precedence matrix

| Scope | Winner |
| --- | --- |
| Org-wide invariants (git safety, licensing, SemVer, releases & assets, community-health files, ecosystem isolation, zero-warning, documentation standards) | Workspace root (`AGENTS.md` + `.agents/rules/`) — non-negotiable |
| Project-internal conventions (code style, build/test commands, architecture, local workflows) | Project-local agents files |
| Shared skills/templates with equivalents on both sides | Project-local version for project work; workspace version for workspace-wide work |
| Conflict on an org-wide matter | Workspace root wins; log the conflict in `BUGS.md` |

## Scaffold integration (W.60)

The headless CLI provides `scripts/agents-kb/kb-scaffold.ts` to generate a project-local
agents ecosystem from engine-specific template suites under
`scripts/agents-kb/bodies/scaffold/<type>/` (e.g. `tauri-desktop`, `jekyll-theme`,
`node-ts-cli`, `rust-library`, `docs-site`). Usage:

```
node scripts/agents-kb/kb-scaffold.ts --list
node scripts/agents-kb/kb-scaffold.ts --type <engine> --path <project> [--license <type>] [--with-tracking] [--dry-run] [--force]
```

- `--license <type>` specifies the project's license identifier (defaulting to standard GitHub `MIT`; configurable to any license such as `BSD-3-Clause`, `Apache-2.0`, `GPL-3.0`).
- `--with-tracking` (or `--tracking`) generates initial project-scoped tracking ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`).
- `--dry-run` reports what would be created without writing.
- Default mode never overwrites existing project-local files (idempotent, never-clobber).
- `--force` overrides the never-clobber guard (use deliberately).
- All runs are structured-logged via `kb-log.ts` to `scripts/agents-kb/logs/`.

Per-repo agent assets discovered this way are recorded as KB artifacts (W.57) so the
ecosystem can track which projects carry their own agents ecosystems.

## Enhancement direction (ours enhances theirs)

- Workspace-root skills, templates, and agent playbooks are the **base layer** projects may
  adopt: copy into the project's own `.agents/` (self-contained, public-safe) or reference
  locally. Never push workspace-root ecosystem files into a project repository — the ecosystem
  isolation invariant still applies: project repos stay self-contained for external contributors.
- When a project already has its own agents assets, extend or repair them in place **only when
  asked**; never rewrite, normalize, or delete project-local agents files unprompted.
- The agents knowledge DB (W.57) records per-repo agent assets (`kind` = rule/skill/agent/
  template/document, scoped by repo) so enhancements can be targeted precisely at projects that
  maintain their own ecosystems.

## Invariants

1. Project-local agents files are first-class: discovered and honored before working in the
   project; never clobbered, normalized, or deleted unprompted.
2. Ecosystem isolation still holds: workspace-root `.agents/`, `AGENTS.md`, and the tracking
   ledgers are never copied into or referenced from project repositories; enhancement is
   delivered as the project's own self-contained files.
3. Org-wide invariants are never relaxed by project-local config.
4. Precedence conflicts on org-wide matters are logged in `BUGS.md`.

## Integration

- `AGENTS.md` invariant "project-local agents interoperability" + session start checklist.
- `.agents/rules/workspace.md` (ecosystem isolation boundary).
- Agents knowledge DB design `.agents/skills/agents-db-design.md` (per-repo artifact scoping).
