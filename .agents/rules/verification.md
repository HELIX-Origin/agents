# Rule: Verification Standards

**Status:** BINDING.
**Scope:** All repositories under `projects/`.

---

## 1. Zero-Defect Gate Requirement & Warnings Treated as Errors

> [!CAUTION]
> **Mandatory Research Before Any Edit (Zero Guessing — Applies to ALL Work):**
> Never edit files based on guesses or unverified assumptions in any domain. Before modifying any file across any task, perform online documentation research (`search_web` on official primary documentation and specifications) and empirical inspection first. See `.agents/rules/mandatory-research.md`.

No change, feature, bug fix, or documentation update is complete without running and passing the applicable verification checks for that specific repository.

> [!IMPORTANT]
> **Warnings are treated as errors organization-wide.**
> Warnings flagged as "harmless" often end up being breaking issues that directly cause uncaught errors and runtime instability. All compilers, typecheckers, linters, and test runners must run with **0 errors and 0 warnings**.
> - In Rust: Always verify with `RUSTFLAGS="-D warnings" cargo check` and `cargo test`.
> - In Svelte / TypeScript: `svelte-check` must report **0 errors and 0 warnings**.
> - In builds: Bundlers and transpilers (`vite build`, `rollup`, `esbuild`) must compile cleanly with 0 warnings.

---

## 2. Per-Repository Verification Commands

| Project | Verification Command | Gate Criteria |
|---|---|---|
| **helix-jekyll-theme** _(retired — future rebuild)_ | `bundle exec jekyll build` | 0 errors, 0 warnings. Valid generated site. |
| **depressurizer** | `cargo check` (`-D warnings`), `cargo test --lib`, `npm run check`, `npm run build` | 0 Rust errors, 0 warnings, 0 test failures, 0 Svelte errors/warnings, clean build. |
| **nh-reader** | `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n` (current Tauri line) | 0 Rust errors/warnings, 0 test failures, 0 Svelte errors/warnings, all i18n keys valid. From the v1.0.0 rewrite: CMake build `/W4 /WX` + `ctest`, 0 warnings, all tests pass. |
| **windows-game-explorer** | `cmake -B build -S .` & `cmake --build build --config Release` & `ctest --test-dir build -C Release --output-on-failure` | 0 C++ compiler/linker errors or warnings (`/W4 /WX`), all tests pass. |
| **theme-toolkit** | `node scripts/test.mjs check rust frontend build` | 0 Rust errors/warnings, 0 test failures, 0 Svelte errors/warnings. |
| **windhawk-themes** | `pwsh -NoProfile -File tools/Test-WindhawkStyles.ps1` | 0 errors. All styler YAML definitions parse correctly. |
| **Deskthemepack / Packaging** | `makecab.exe /F <theme>.ddf`, asset existence check | Valid cabinet archive, 0 missing assets, valid .theme INI. |

---

## 3. Order of Operations

1. **Static Validation Gate:** Run the repository's automated static linter or build script.
2. **Interactive / Live Check:** For UI themes and desktop clients, verify desktop appearance or runtime logs before requesting human review.
3. **Tracking Update:** Record passed verification runs in tracking files (`PLAN.md`, `TODO.md`, or milestone summary).

---

## 4. Native GUI Visual Verification (Evidence, Not Guesswork)

GUI claims ("label clipped", "mojibake after resize", "text behind a card", "text not centred") are
never accepted from source inspection alone. Capture the running window and inspect it:

1. Screenshot the real window at the reported size(s) with the PowerShell `CopyFromScreen` capture
   pattern; keep every artifact in the session temp directory, never in a repository.
2. Read it back without vision: Windows OCR (`Windows.Media.Ocr`) for text + coordinates, and
   ImageMagick (`magick`) crops, ASCII luminance maps, pixel probes and `compare -metric AE` diffs.
3. State the measurable symptom, fix it, then re-run the identical capture to prove the change.

Full working scripts and gotchas: `.agents/skills/native-gui-visual-verification.md`.
