# Copilot Instructions — HELIX-Origin AI Agents Ecosystem

> Auto-loaded by GitHub Copilot. `AGENTS.md` at the workspace root is the authoritative authority; this file provides high-level guidance for GitHub Copilot in this workspace.

---

## 1. Workspace Identity & Scope

- **Organization Focus:** All software and theme engineering belongs exclusively to the **HELIX Origin** organization (`https://github.com/HELIX-Origin`).
- **Organization Repositories:** All active projects reside under the gitignored `projects/` directory (`projects/nh-reader`, `projects/windows-game-explorer`, `projects/theme-toolkit`, `projects/windhawk-themes`, `projects/ffxiv-config`, `projects/depressurizer`). (`helix-jekyll-theme` and the centralized docs/wiki/portal hubs are retired and reserved for future rebuilds.)
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

---

## 3. Subsystem Architecture

- **`projects/nh-reader`**: Cross-platform desktop client built with Tauri (Rust) and SvelteKit (Svelte 5 runes). Version manifests (`package.json`, `tauri.conf.json`, `Cargo.toml`) must move together.
- **`projects/windows-game-explorer`**: Native C++20 Windows Game Explorer recreating the classic Windows 7/Vista Game Explorer (`shell:Games`) inside File Explorer (`GameExplorerShell.dll`), paired with `GameExplorerConfig.exe` (integration configuration utility) and `GameExplorerManager.exe` (Game Explorer Manager GUI for managing games and adding local games).
- **`projects/theme-toolkit`**: Cross-platform desktop theme authoring and packaging studio for Windows, macOS, and Linux.
- **`projects/windhawk-themes`**: Windhawk theming suites for Windows 11 targeting 5 styler mods. Uses `WindhawkBlur` and vertical gradient rim borders. Releases use Semantic Versioning (`vMAJOR.MINOR.PATCH`) with zero attached assets.
- **`projects/depressurizer`**: Tauri v2 cross-platform Steam library categorizer and AutoCat manager (revival fork). Strictly retains its original GPL-3.0 license.
- **`projects/ffxiv-config`**: Information-dense HUD, hotbar, and macro configuration setup for Final Fantasy XIV.

---

## 4. Verification Before Declaring Done

| Subsystem / Area | Verification Command |
|---|---|
| Desktop App<br>(`nh-reader`) | `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n` |
| Windows Game Explorer<br>(`windows-game-explorer`) | `cmake -B build -S .`, `cmake --build build --config Release`, `ctest --test-dir build -C Release --output-on-failure` |
| Theme Toolkit<br>(`theme-toolkit`) | `cargo check`, `cargo test`, `npm run check`, `npm run build` |
| Depressurizer<br>(`depressurizer`) | `cargo check`, `cargo test`, `npm run check`, `npm run build` |
| Windhawk Theming<br>(`windhawk-themes`) | `pwsh -NoProfile -File projects/windhawk-themes/tools/Test-WindhawkStyles.ps1` |
