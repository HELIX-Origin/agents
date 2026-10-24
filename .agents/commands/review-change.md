---
description: Review the current change against the gates
---

1. List the change with read-only git (`git status`, `git diff`); never stage or commit.
2. Check scope: only files relevant to the task were touched; no project code changes during ecosystem-only work.
3. Check invariants: no secrets, no machine-specific absolute paths, LF endings, SemVer, correct license, no references from project repos to the workspace-level ecosystem.
4. Run `/verify`.
5. Report findings as: blocking, should-fix, nit.
