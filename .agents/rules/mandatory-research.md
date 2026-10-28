# Rule: Mandatory Research-First & Zero-Guessing Invariant

**Status:** BINDING.
**Scope:** ALL work across the entire workspace and all repositories (`.`, `projects/*`), with zero exceptions and never limited to any specific field, language, or subsystem.

---

## 1. Universal Research-First Mandate & Absolute Ban on Guessing

> [!CAUTION]
> **Guesswork is Strictly Prohibited Across All Work.**
> Research-first rules apply universally to **ALL work** — every domain, codebase, language, tool, build script, configuration, UI/UX layout, asset, or documentation task. Agents must **NEVER** make speculative edits, guess at parameters/behaviors, or run trial-and-error loops in any area of work.

Before making **any** modification or taking action on any task:

1. **Online Documentation & Primary Source Research First (`search_web` Mandatory)**:
   - Agents **MUST** first research official primary documentation, specifications, and authoritative references online (`search_web`) before making changes.
   - Never rely on memory, hunches, or unverified assumptions for any API, framework, file format, tool, protocol, or platform behavior when authoritative documentation can be queried.
2. **Empirical Inspection & Measurement Before Editing**:
   - Inspect and measure the actual state of the system, files, runtime environment, logs, or outputs first, and verify how they align with the researched documentation before formulating a change.
3. **Verified Root Cause & Design Before Any Edit**:
   - Establish the verified root cause or exact specification first. Every edit must be backed by completed online research and empirical evidence — never "try this and see if it works."
4. **Zero Trial-and-Error Loops**:
   - Never use `edit -> build -> run -> ask user to test` as a guessing loop. All research and verification must happen *before* presenting or applying a solution.
