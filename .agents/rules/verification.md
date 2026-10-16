# Rule: Verification Standards

**Status:** BINDING.
**Scope:** All repositories under `projects/`.

---

## 1. Zero-Defect Gate Requirement

No change, feature, bug fix, or documentation update is complete without running and passing the applicable verification checks for that specific repository.

---

## 2. Per-Repository Verification Commands

| Project | Verification Command | Gate Criteria |
|---|---|---|
| **helix-docs** | `bundle exec jekyll build` | 0 errors, 0 warnings. Valid generated site. |
| **helix-origin.github.io** | `bundle exec jekyll build` | 0 errors, 0 warnings. |
| **NH-Reader** | `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n` | 0 Rust errors, 0 test failures, 0 Svelte errors, all i18n keys valid. |
| **Steam-Vault** | `npm run build` (prereq), `cargo check`, `cargo test --manifest-path src-tauri/Cargo.toml`, `npm run check` | 0 Rust errors, 0 test failures, 0 Svelte errors/warnings. |
| **Steam-Vault-Catalogue** | `npm run catalogue:validate`, `npm run catalogue:build:index` | 0 validation errors, living index.json compiled. |
| **Windhawk-Themes** | `pwsh -NoProfile -File tools/Test-WindhawkStyles.ps1` | 0 errors. All styler YAML definitions parse correctly. |
| **Deskthemepack / Packaging** | `makecab.exe /F <theme>.ddf`, asset existence check | Valid cabinet archive, 0 missing assets, valid .theme INI. |

---

## 3. Order of Operations

1. **Static Validation Gate:** Run the repository's automated static linter or build script.
2. **Interactive / Live Check:** For UI themes and desktop clients, verify desktop appearance or runtime logs before requesting human review.
3. **Tracking Update:** Record passed verification runs in tracking files (`PLAN.md`, `TODO.md`, or milestone summary).
