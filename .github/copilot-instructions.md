# Copilot Instructions — HELIX-Origin AI Agents Ecosystem

> Auto-loaded by GitHub Copilot. `AGENTS.md` at the workspace root is the authoritative authority; this file provides high-level guidance for GitHub Copilot in this workspace.

---

## 1. Workspace Identity & Scope

- **Organization Focus:** All software and theme engineering belongs exclusively to the **HELIX Origin** organization (`https://github.com/HELIX-Origin`).
- **Project Registry:** `.agents/registry/projects.json` is the single source of truth for project IDs, relative paths, kinds, and short descriptions. Some entries may be planned and not cloned. Verify that the requested project path exists before opening it; do not rely on copied lists in handoffs or prior conversations.
- **Repository Boundaries:** This workspace root is the private `HELIX-Origin/agents` repository. Every `projects/<id>` directory is a separate Git repository whose history and working-tree status must be checked independently. The parent workspace's branch, status, and session do not describe a child project's Git state.
- **Target Resolution:** Before acting, identify the active session's actual working directory and Git root, then follow the user's explicit workspace/repository request. Do not infer a target from conversation history, a prior session, or a stale handoff. If the user requests the agents workspace, stay at this root and do not enter a project repository. If the target is ambiguous, ask before opening or editing another repository.
- **Zero Non-Org Mentions:** Never explore, modify, or directly mention by name any projects or repositories not belonging to the `HELIX-Origin` GitHub organization.

---

## 2. Hard Invariants

1. **No Unauthorized Git Operations:** Always treat git as read-only (`status`, `log`, `diff`, `show`, `ls-files`). Never execute mutating commands (`commit`, `push`, `tag`, `checkout`, `merge`, `reset`) unless explicitly instructed by the user in the current conversation.
2. **No Hardcoded Machine Paths:** Never expose absolute system paths (e.g. `C:\Users\...` or machine drives). Always use clean relative paths (`projects/<repo>`, `./`).
3. **No Secrets or Tokens:** Never write, commit, or log credentials, private keys, certificates, or tokens.
4. **Tracking Document Discipline:** Keep `ROADMAP.md`, `PLAN.md`, `TODO.md`, and `BUGS.md` 100% accurate with the active direction of all projects, with normalized, domain-categorized directives, zero non-org or deleted repo mentions, and `CHANGELOG.md` as the persistent historical record.
5. **Documentation Theme-Neutrality:** Each project's documentation must remain self-contained in its own repository. Content must be theme-neutral and mod-agnostic; theme/suite specifics belong only in a catalogue/store section. See `.agents/rules/documentation-standards.md`.
6. **HTML Badge Standard:** Always use raw HTML `<a><img src="..." alt="..." height="20" /></a>` for badges across all Markdown files (`README.md`, `docs/`, `wiki/`). Explicit `height="20"` ensures consistent sizing and prevents layout shifts. Never use Markdown badge syntax (`[![alt](src)](url)`). See `.agents/rules/documentation-standards.md`.
7. **Organization License Invariant:** Each repository under `HELIX-Origin` is licensed under the license that best fits that project — there is no single org-wide default. MIT is the common default for original code/docs/themes/tools, but a project may use any appropriate license. `depressurizer` strictly retains its original **GPL-3.0** license. Every `LICENSE*`, `package.json`, `Cargo.toml`, `.gemspec`, `README.md`, and `CITATION.cff` must state the repository's chosen license consistently. See `.agents/rules/workspace.md`.
8. **Release & Asset Attachment Invariant:** All repositories across the organization must publish GitHub Releases. However, release assets must ONLY be uploaded to repositories distributing a packaged application or resource (`windows-game-explorer`, `nh-reader`, `theme-toolkit`, `ffxiv-config`, `depressurizer`). All other repositories (`windhawk-themes`, `agents`) publish zero-asset releases with release notes and tags. See `.agents/rules/release-notes.md`.
9. **Universal Semantic Versioning Invariant:** Every repository across the organization strictly adheres to Semantic Versioning (`vMAJOR.MINOR.PATCH`). Milestone-based releases and milestone git tags are prohibited across all repositories.
10. **Repository README Minimal Entry Point Invariant:** Project root `README.md` files must be concise, minimal entry points (~30–50 lines): what the project is, install/run, and links to community-health documents. Exhaustive technical specifications and manuals do not belong in the README; keep them in the repository's own documentation files. When organization documentation and wiki hubs are rebuilt, READMEs will link to those hubs instead. See `.agents/rules/documentation-standards.md`.
11. **Mandatory Research-First & Zero-Guessing Invariant (All Work):** Guesswork and trial-and-error edits are strictly banned across **all work** (every domain, language, tool, script, config, asset, or doc — never limited to specific fields). Always research official primary documentation online (`search_web`) and verify state empirically before editing any file. See `.agents/rules/mandatory-research.md`.

---

## 3. Project Architecture & Local Instructions

Do not use this file as a detailed inventory of project architectures: those change independently
and are documented in each registered project's own repository. Resolve the project ID to its
`path` in `.agents/registry/projects.json`, confirm that path is the Git root you intend to work
in, and read that repository's `AGENTS.md` and `.github/copilot-instructions.md` (if present)
before making project changes. A project-local `.agents/` may define project-internal conventions;
the workspace-root rules still govern org-wide invariants. Never carry implementation assumptions
from another project's checkout or an old session into the selected repository.

**Windows Game Explorer** is a native C++20 Win32 application suite. Its current architecture and
quality gates are in `projects/windows-game-explorer/AGENTS.md` and its project-local rules. The
workspace skill `.agents/skills/windows-game-explorer.md` is a concise supplementary reference;
the project-local instructions and source tree are authoritative when details differ.

---

## 4. Verification Before Declaring Done

| Subsystem / Area | Verification Command |
|---|---|
| Desktop App<br>(`nh-reader`, current Tauri line) | `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n`; from v1.0.0: CMake build `/W4 /WX` + `ctest` |
| Windows Game Explorer<br>(`windows-game-explorer`) | `cmake -B build -S .`, `cmake --build build --config Release`, `ctest --test-dir build -C Release --output-on-failure` |
| Theme Toolkit<br>(`theme-toolkit`) | `cargo check`, `cargo test`, `npm run check`, `npm run build` |
| Depressurizer<br>(`depressurizer`) | `cargo check`, `cargo test`, `npm run check`, `npm run build` |
| Windhawk Theming<br>(`windhawk-themes`) | `pwsh -NoProfile -File projects/windhawk-themes/tools/Test-WindhawkStyles.ps1` |
