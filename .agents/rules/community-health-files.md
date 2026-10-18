# Rule: Community Health Files Standard

**Status:** BINDING — GLOBAL.
**Scope:** Every repository under `projects/` in the `HELIX-Origin` organization.
**Applies to:** The root community-health documents of every project repository and the community links in each project `README.md`.

---

## Purpose

GitHub surfaces a repository's community-health files as discoverable tabs and sidebar links
(*Code of Conduct*, *Contributing*, *Security*, *License*, and the README "About" card). Every
`HELIX-Origin` repository is a public, standalone open-source codebase, so each one must present a
**complete, consistent, self-contained set** of these documents. Nothing in them may reference the
private agents ecosystem.

---

## 1. Required files (every repository)

| File | Purpose | Required |
| --- | --- | --- |
| `README.md` | Minimal entry point (see `documentation-standards.md`) | ✅ |
| `LICENSE` | `BSD-3-Clause` — **except** `depressurizer`, which keeps `GPL-3.0-or-later` (revival-fork exception) | ✅ |
| `CONTRIBUTING.md` | Dev setup, conventions, quality gate, PR process | ✅ |
| `CODE_OF_CONDUCT.md` | Contributor Covenant v2.1 (org-adapted) | ✅ |
| `SECURITY.md` | Private vulnerability reporting + scope | ✅ |
| `SUPPORT.md` | Where and how to get help | ✅ |
| `PRIVACY.md` | What data is stored/transmitted; local-first posture | ✅ |
| `CHANGELOG.md` | [Keep a Changelog](https://keepachangelog.com/) + SemVer | ✅ |
| `GOVERNANCE.md` | Roles, decision-making, release authority | ✅ |
| `CITATION.cff` | Citation File Format 1.2.0 | ✅ |
| `TOS.md` | Terms of Service — required for apps/resources that talk to **third-party services** | ⚠️ Conditional |
| `.github/pull_request_template.md` | PR checklist | ✅ |
| `.github/ISSUE_TEMPLATE/config.yml` | Issue chooser config | ✅ |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Bug report form | ✅ |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Feature request form | ✅ |
| `.github/FUNDING.yml` | Sponsorship links (optional) | ⬜ Optional |

`.github/ISSUE_TEMPLATE/*` use GitHub **issue forms** (`.yml`), not legacy Markdown templates.
Project-specific extra forms (e.g. a rule/feature request) may be added alongside the standard two.

---

## 2. Placement & naming

- All community documents live at the **repository root**, except `.github/` items.
- File names are exactly as listed above (uppercase, `.md` / `.cff` / `.yml`).
- Project repositories contain **no** local `docs/` or `wiki/` folders (see `documentation-standards.md` §3).

---

## 3. Content requirements

### `CONTRIBUTING.md`
- Prerequisites (toolchain versions), `npm install` / build / dev commands.
- The project's **quality gate** command(s) and the **zero-warning** rule (`verification.md`).
- Coding conventions and the Conventional-Commits style used across the organization.
- Branch/PR process and a pointer to `CODE_OF_CONDUCT.md` and `SECURITY.md`.
- Never instruct contributors to touch the agents ecosystem.

### `CODE_OF_CONDUCT.md`
- Contributor Covenant **v2.1** adapted for HELIX Origin, with a private enforcement contact
  (a maintainer/org contact — never a workspace path).

### `SECURITY.md`
- **Do not open a public issue** for vulnerabilities; use GitHub **private vulnerability reporting**
  (`https://github.com/HELIX-Origin/<repo>/security`) .
- Supported versions table, scope/out-of-scope, response expectations, and a short "security design
  notes" section where relevant.

### `SUPPORT.md`
- Point to the centralized **docs** (`https://docs.helix-origin.club/<project>/`) and **wiki**
  (`https://wiki.helix-origin.club/<project>/`) hubs first, then [Discussions]/Issues, then the
  organization portal (`https://www.helix-origin.club/`).

### `PRIVACY.md`
- State the **local-first** posture explicitly: what is stored (and where), what is transmitted
  (and to whom), and what is **never** collected (no telemetry, no analytics by default).
- Name every outbound host/provider the app contacts (e.g. Valve endpoints, third-party metadata
  APIs) and note the user's ability to remove local data.

### `CHANGELOG.md`
- Keep a Changelog sections (`Added` / `Changed` / `Fixed` / `Removed` / `Security`) under
  `## [Unreleased]` plus released SemVer headings. **Never** use milestone identifiers.

### `GOVERNANCE.md`
- Maintainer/contributor roles, how decisions are made, and who may cut releases/tags.

### `TOS.md` (conditional)
- Required when the app/resource interacts with a third-party service (e.g. Valve/Steam, nhentai).
- Must state the app is **unofficial/unaffiliated**, is a client/consumer only, respects the
  provider's terms, and is provided "AS IS" under the repository's license.

### `CITATION.cff`
- Citation File Format **1.2.0**, `title`, `authors` (`HELIX Origin`), `license`, `repository-code`,
  and `version` matching the current SemVer. Keep it machine-valid.

---

## 4. README linkage (mandatory)

Each project `README.md` must link its community documents so GitHub renders them as tabs/links.
Add a compact section (or reuse the existing footer) linking at minimum:
`CONTRIBUTING.md`, `SECURITY.md`, `PRIVACY.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`,
`CHANGELOG.md`, and — when present — `TOS.md` and `GOVERNANCE.md`.
License links use the repository's own `LICENSE`.

---

## 5. Invariants

1. **Ecosystem isolation** (`workspace.md` / `AGENTS.md` invariant 7): project repositories must
   **never** mention, reference, or link `.agents/`, `AGENTS.md`, the workspace `ROADMAP.md`/
   `PLAN.md`/`TODO.md`/`BUGS.md`, or any workspace path. All community documents are
   self-contained for external human contributors.
2. **License correctness** (`AGENTS.md` invariant 9): `BSD-3-Clause` everywhere, with the sole
   `depressurizer` `GPL-3.0-or-later` revival-fork exception. Never state MIT.
3. **Semantic Versioning** (`release-notes.md`): `vMAJOR.MINOR.PATCH`; no milestone IDs.
4. **HTML badges** (`documentation-standards.md` §4): raw `<a>`/`<img>` with `height="20"`.
5. **Theme neutrality** (`documentation-standards.md` invariant 6): community documents describe
   the software, never a specific author's theme/suite.
6. **Secret hygiene** (`security-hygiene.md`): no credentials, tokens, or personal machine paths.

---

## 6. Templates

Reusable starters live in `.agents/templates/`:

| Template | Produces |
| --- | --- |
| `contributing-template.md` | `CONTRIBUTING.md` |
| `code-of-conduct-template.md` | `CODE_OF_CONDUCT.md` |
| `security-template.md` | `SECURITY.md` |
| `support-template.md` | `SUPPORT.md` |
| `privacy-template.md` | `PRIVACY.md` |
| `changelog-template.md` | `CHANGELOG.md` |
| `governance-template.md` | `GOVERNANCE.md` |
| `tos-template.md` | `TOS.md` |
| `citation-template.cff` | `CITATION.cff` |
| `pull-request-template.md` | `.github/pull_request_template.md` |
| `issue-template-config.yml` | `.github/ISSUE_TEMPLATE/config.yml` |
| `issue-template-bug.yml` | `.github/ISSUE_TEMPLATE/bug_report.yml` |
| `issue-template-feature.yml` | `.github/ISSUE_TEMPLATE/feature_request.yml` |

Replace `{{PLACEHOLDER}}` tokens per project.

---

## 7. Enforcement

Any repository missing a required community-health file, using Markdown badge syntax, stating the
wrong license, or referencing the agents ecosystem in a project document must be corrected
immediately. Adding/updating these files is a **maintenance task**, not optional polish.
