---
description: Run the zero-warning verification gate
---

1. Identify the repository in scope and find its row in `.agents/rules/verification.md` (or its own `.agents/rules/verification.md`).
2. Run each command with warnings as errors (`RUSTFLAGS="-D warnings"` for Rust; `svelte-check` must report 0 errors and 0 warnings; bundlers must emit 0 warnings).
3. For long runs follow `.agents/rules/background-tasks.md` and `.agents/skills/test-execution.md`: capture output to a log and read it, never block.
4. Report each command with its result. Any error or warning is a failure; fix and rerun.
5. For the workspace tooling itself run `npm --prefix scripts run check:agents`.
