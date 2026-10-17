# Copilot Instructions — HELIX-Origin AI Agents Ecosystem

> Auto-loaded by GitHub Copilot. `AGENTS.md` at the workspace root is the authoritative authority; this file provides high-level guidance for GitHub Copilot in this workspace.

---

## 1. Workspace Identity & Scope

- **Organization Focus:** All software and theme engineering belongs exclusively to the **HELIX Origin** organization (`https://github.com/HELIX-Origin`).
- **Organization Repositories:** All active projects reside under the gitignored `projects/` directory (`projects/helix-docs`, `projects/helix-origin.github.io`, `projects/NH-Reader`, `projects/Universal-Game-Launcher`, `projects/Theme-Toolkit`, `projects/Windhawk-Themes`).
- **Zero Non-Org Mentions:** Never explore, modify, or directly mention by name any projects or repositories not belonging to the `HELIX-Origin` GitHub organization.

---

## 2. Hard Invariants

1. **No Unauthorized Git Operations:** Always treat git as read-only (`status`, `log`, `diff`, `show`, `ls-files`). Never execute mutating commands (`commit`, `push`, `tag`, `checkout`, `merge`, `reset`) unless explicitly instructed by the user in the current conversation.
2. **No Hardcoded Machine Paths:** Never expose absolute system paths (e.g. `C:\Users\...` or machine drives). Always use clean relative paths (`projects/<repo>`, `./`).
3. **No Secrets or Tokens:** Never write, commit, or log credentials, private keys, certificates, or tokens.
4. **Tracking & Archive Document Discipline:** Keep `ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, and `.github/*-ARCHIVE.md` 100% accurate with the active direction of all projects, with normalized, domain-categorized directives and zero non-org or deleted repo mentions.
5. **Theme Release Precedence:** The shared Jekyll theme repository (`projects/helix-docs`) must always be verified and released before consuming projects.
6. **Documentation Theme-Neutrality:** Documentation (`docs/`, including `docs/wiki/`) must stay theme-neutral and mod-agnostic — it explains *how to work with the mods*, not any author's theme. Author-specific themes/suites (token names, values, radius scales, geometry) belong **only** in `docs/_catalogue/` and `docs/_store/`. Never make a catalogue theme the source of truth for the docs, and never copy its style references into the docs. See `.agents/rules/documentation-standards.md`.

---

## 3. Subsystem Architecture

- **`projects/helix-docs`**: Shared Jekyll theme with modular component partials (`_includes/components/`), frontmatter-driven navigation, precompiled Dart Sass (`assets/css/site.css`), and 18-language Google Translate switcher.
- **`projects/NH-Reader`**: Cross-platform desktop client built with Tauri (Rust) and SvelteKit (Svelte 5 runes). Version manifests (`package.json`, `tauri.conf.json`, `Cargo.toml`) must move together.
- **`projects/Universal-Game-Launcher`**: Tauri v2 Universal Game Launcher with Universal Core Plugins + Global Helpers (`platform-universal`, `metadata-universal`, `utility-title-normalizer`, `media-universal`), authentic vector SVG platform icons, automatic metadata enhancement, per-game customization modal (`⚙ Manage`), and multi-drive storage analyzer.
- **`projects/Theme-Toolkit`**: Cross-platform desktop theme authoring and packaging studio for Windows, macOS, and Linux.
- **`projects/Windhawk-Themes`**: Windows 11 styling suites for 5 target styler mods. Uses `WindhawkBlur` and vertical gradient rim borders. Releases use milestone tags (`M.NN`) with zero attached assets.
- **`projects/helix-origin.github.io`**: Organization portal site powered by GitHub Pages and `helix-docs` remote theme.

---

## 4. Verification Before Declaring Done

| Subsystem / Area | Verification Command |
|---|---|
| Theme (`helix-docs` & portal) | `bundle exec jekyll build` (0 errors, 0 warnings) |
| Desktop App (`NH-Reader`) | `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n` |
| Universal Game Launcher (`Universal-Game-Launcher`) | `cargo check`, `cargo test`, `npm run check`, `npm run build` |
| Windows 11 Mods (`Windhawk-Themes`) | `pwsh -NoProfile -File projects/Windhawk-Themes/tools/Test-WindhawkStyles.ps1` |
