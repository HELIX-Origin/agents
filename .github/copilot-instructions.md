# Copilot Instructions — HELIX-Origin AI Agents Ecosystem

> Auto-loaded by GitHub Copilot. `AGENTS.md` at the workspace root is the authoritative authority; this file provides high-level guidance for GitHub Copilot in this workspace.

---

## 1. Workspace Identity & Scope

- **Organization Focus:** All software and theme engineering belongs exclusively to the **HELIX Origin** organization (`https://github.com/HELIX-Origin`).
- **Organization Repositories:** All active projects reside under the gitignored `projects/` directory (`projects/helix-docs`, `projects/helix-origin.github.io`, `projects/docs`, `projects/wiki`, `projects/nh-reader`, `projects/universal-game-launcher`, `projects/theme-toolkit`, `projects/windhawk-themes`, `projects/ugl-db-00`, `projects/ugl-db-01`, `projects/ugl-db-02`, `projects/ugl-db-03`, `projects/ffxiv-config`).
- **Zero Non-Org Mentions:** Never explore, modify, or directly mention by name any projects or repositories not belonging to the `HELIX-Origin` GitHub organization.

---

## 2. Hard Invariants

1. **No Unauthorized Git Operations:** Always treat git as read-only (`status`, `log`, `diff`, `show`, `ls-files`). Never execute mutating commands (`commit`, `push`, `tag`, `checkout`, `merge`, `reset`) unless explicitly instructed by the user in the current conversation.
2. **No Hardcoded Machine Paths:** Never expose absolute system paths (e.g. `C:\Users\...` or machine drives). Always use clean relative paths (`projects/<repo>`, `./`).
3. **No Secrets or Tokens:** Never write, commit, or log credentials, private keys, certificates, or tokens.
4. **Tracking & Archive Document Discipline:** Keep `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and `.github/*-ARCHIVE.md` 100% accurate with the active direction of all projects, with normalized, domain-categorized directives and zero non-org or deleted repo mentions.
5. **Theme Release Precedence:** The shared Jekyll theme repository (`projects/helix-jekyll-theme`) must always be verified and released before consuming projects.
6. **Documentation Theme-Neutrality & Centralized Hubs:** All documentation and technical wikis live centrally in dedicated `docs` (`docs.helix-origin.club`) and `wiki` (`wiki.helix-origin.club`) repositories. Project repositories contain NO local `docs/` folders. Content must remain theme-neutral and mod-agnostic. Specific themes/suites belong only in `docs/_catalogue/`. See `.agents/rules/documentation-standards.md`.
7. **HTML Badge Standard:** Always use raw HTML `<a><img src="..." alt="..." height="20" /></a>` for badges across all Markdown files (`README.md`, `docs/`, `wiki/`). Explicit `height="20"` ensures consistent sizing and prevents layout shifts. Never use Markdown badge syntax (`[![alt](src)](url)`). See `.agents/rules/documentation-standards.md`.
8. **Organization License Invariant:** All repositories, packages, manifests (`package.json`, `Cargo.toml`, `.gemspec`), and documents across the `HELIX-Origin` organization are strictly licensed under the **BSD 3-Clause License** (`BSD-3-Clause`). Never use MIT or other licenses. All license badges must link to the BSD-3-Clause license. See `.agents/rules/workspace.md`.
9. **Release & Asset Attachment Invariant:** All repositories across the organization must publish GitHub Releases. However, release assets must ONLY be uploaded to repositories distributing a packaged application or resource (`universal-game-launcher`, `nh-reader`, `theme-toolkit`, `ffxiv-config`). All other repositories (`docs`, `wiki`, `helix-origin.github.io`, `helix-jekyll-theme`, `windhawk-themes`, `ugl-db-00` through `03`, `agents`) are zero-asset releases. See `.agents/rules/release-notes.md`.
10. **Universal Semantic Versioning Invariant:** Every repository across the organization strictly adheres to Semantic Versioning (`vMAJOR.MINOR.PATCH`). Milestone-based releases and milestone git tags are prohibited across all repositories.
11. **Repository README Minimal Entry Point Invariant:** Project root `README.md` files must be concise, minimal entry points (~30–50 lines) that direct visitors to the dedicated Documentation Hub (`docs.helix-origin.club/<project>/`) and Technical Wiki (`wiki.helix-origin.club/<project>/`) rather than duplicating exhaustive documentation locally. See `.agents/rules/documentation-standards.md`.

---

## 3. Subsystem Architecture

- **`projects/helix-jekyll-theme`**: Shared Jekyll theme with modular component partials (`_includes/components/`), frontmatter-driven navigation, precompiled Dart Sass (`assets/css/site.css`), and 18-language Google Translate switcher.
- **`projects/helix-origin.github.io`**: Organization portal site hosted at `https://www.helix-origin.club` powered by GitHub Pages and `helix-jekyll-theme` remote theme.
- **`projects/docs`**: Dedicated organization-wide documentation hub hosted at `https://docs.helix-origin.club` powered by `helix-jekyll-theme`.
- **`projects/wiki`**: Dedicated organization-wide technical wiki and curation guide hub hosted at `https://wiki.helix-origin.club` powered by `helix-jekyll-theme`.
- **`projects/nh-reader`**: Cross-platform desktop client built with Tauri (Rust) and SvelteKit (Svelte 5 runes). Version manifests (`package.json`, `tauri.conf.json`, `Cargo.toml`) must move together.
- **`projects/universal-game-launcher`**: Tauri v2 Universal Game Launcher with Universal Core Plugins + Global Helpers (`platform-universal`, `metadata-universal`, `utility-title-normalizer`, `media-universal`), authentic vector SVG platform icons, automatic metadata enhancement, per-game customization modal (`⚙ Manage`), and multi-drive storage analyzer.
- **`projects/theme-toolkit`**: Cross-platform desktop theme authoring and packaging studio for Windows, macOS, and Linux.
- **`projects/windhawk-themes`**: Windows 11 styling suites for 5 target styler mods. Uses `WindhawkBlur` and vertical gradient rim borders. Releases use Semantic Versioning (`vMAJOR.MINOR.PATCH`) with zero attached assets.
- **`projects/ugl-db-00` through `03`**: Symmetrical volume-sharded REST metadata API and gaming database, each supporting all platforms with identical schemas, validation tools, `i18next` localized taxonomies, and GitHub Actions workflows.
- **`projects/ffxiv-config`**: Information-dense HUD, hotbar, and macro configuration setup for Final Fantasy XIV.

---

## 4. Verification Before Declaring Done

| Subsystem / Area | Verification Command |
|---|---|
| Theme (`helix-jekyll-theme` & portal) | `bundle exec jekyll build` (0 errors, 0 warnings) |
| Desktop App (`nh-reader`) | `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n` |
| Universal Game Launcher (`universal-game-launcher`) | `cargo check`, `cargo test`, `npm run check`, `npm run build` |
| Windows 11 Mods (`windhawk-themes`) | `pwsh -NoProfile -File projects/windhawk-themes/tools/Test-WindhawkStyles.ps1` |
| Gaming DB (`ugl-db-00` through `03`) | `npm test` (schema, deduplication & PR verification) |
