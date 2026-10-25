# Changelog

All notable changes to the **HELIX Origin AI Agents Ecosystem & Workspace Governance** repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Windows Game Explorer Scope & Architectural Invariants**: Codified strict architecture boundaries in `.agents/rules/windows-shell-extension.md`: Windows Game Explorer is an Explorer shell integration and library organizer for local PC games that delegates through official platform clients; cloud gaming and handheld big picture overlays are unsupported; OneDrive is exclusively a write-only backup and disaster recovery destination; cache reset completely purges existing cache and rebuilds fresh metadata from installed games.
- **Windows Game Explorer v2.2.0 Release**: Packaged official `v2.2.0` release assets (`windows-game-explorer-v2.2.0-setup.exe`, `windows-game-explorer-v2.2.0-win64.zip`, `windows-game-explorer-v2.2.0-ROMs-template.zip`) with VNDB Kana API visual novel/adult metadata provider, itch.io storefront scraping, loose aspect ratio validation (0.25f–2.50f covers, 0.80f–4.50f heroes), strict candidate title verification in SteamGridDB/IGDB, cache reset and repopulation engine (`Reset Cache`), and module-anchored portable companion launching.

### Changed
- Removed dropped "all owned games" milestone planning across all workspace and project tracking ledgers.
- Transitioned root ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`) to serve strictly as entry-point indexes linking to per-project tracking files.
- Retired legacy `.github/*-ARCHIVE.md` files; completed work is maintained as bare-minimal one-line ledger entries, with `CHANGELOG.md` serving as the persistent historical record.
- Dropped `.opencode/` configurations across workspace root and all projects; unified tool-agnostic runbooks under `.agents/commands/`.
- Scaffolding and cataloging expanded with new language and runtime skills (`svelte5-runes.md`, `rust-patterns.md`, `typescript-esm-scripts.md`, `sqlite-in-app.md`, `sveltekit-frontend.md`, `github-actions-ci.md`).
- Dropped references to retired/dropped repositories (`ugl-db-00` through `03`, `ugl-db-ingest`, `docs`, `wiki`, `helix-origin.github.io`, and `helix-jekyll-theme`).
