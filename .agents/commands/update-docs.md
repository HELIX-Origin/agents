---
description: Bring docs and tracking ledgers in line with reality
---

1. Consult `.agents/rules/documentation-standards.md`: documentation stays self-contained, theme-neutral and mod-agnostic.
2. Update the affected ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, archives). Replace superseded statements in place; never leave contradictions.
3. Root ledgers stay entry points: a short title plus a link per project. Per-project detail lives only in the project's own files.
4. Regenerate the index blocks: `npm --prefix scripts run index`.
5. Run `npm --prefix scripts run check:agents`.
