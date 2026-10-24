---
description: Reproduce, fix and record a defect
---

1. Read the entry in `BUGS.md` (or the report) and the relevant project rules.
2. Reproduce with the smallest case; write a failing test first when a test harness exists.
3. Fix the root cause with the smallest diff. Do not mask warnings or add suppressions without a justifying comment.
4. Run `/verify`; the gate must be fully green.
5. Record the fix: move the bug to the archive per the ledger rules and add a `CHANGELOG.md` entry when user-visible.
