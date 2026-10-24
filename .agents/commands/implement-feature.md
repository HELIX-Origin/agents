---
description: Plan, build and verify a feature
---

1. Confirm the feature is in `TODO.md`/`PLAN.md`; if not, add it with the project tag first.
2. For anything larger than a few files, follow `.agents/skills/task-decomposition.md` and `.agents/rules/large-task-handling.md`.
3. Load the relevant domain skills from `.agents/skills/` (Tauri, Rust, Svelte, SQLite, packaging, etc.).
4. Implement in small verified steps; keep Rust as the owner of business logic and the frontend as a renderer.
5. Run `/verify` after each step.
6. Update `TODO.md`, `PLAN.md` and `CHANGELOG.md`, then report changed files and gate results.
