# Changelog

All notable changes to the **HELIX Origin AI Agents Ecosystem & Workspace Governance** repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- Transitioned root ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`) to serve strictly as entry-point indexes linking to per-project tracking files.
- Retired legacy `.github/*-ARCHIVE.md` files; completed work is maintained as bare-minimal one-line ledger entries, with `CHANGELOG.md` serving as the persistent historical record.
- Dropped `.opencode/` configurations across workspace root and all projects; unified tool-agnostic runbooks under `.agents/commands/`.
- Scaffolding and cataloging expanded with new language and runtime skills (`svelte5-runes.md`, `rust-patterns.md`, `typescript-esm-scripts.md`, `sqlite-in-app.md`, `sveltekit-frontend.md`, `github-actions-ci.md`).
- Dropped references to retired/dropped repositories (`ugl-db-00` through `03`, `ugl-db-ingest`, `docs`, `wiki`, `helix-origin.github.io`, and `helix-jekyll-theme`).
