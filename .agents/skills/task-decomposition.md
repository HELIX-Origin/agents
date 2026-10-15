# Skill: Task Decomposition & Incremental Execution

> Proper handling of large tasks by breaking them down into small, manageable steps.

## Core Principles

- **Break everything down**: Large tasks must be split into the smallest logical units of work (10-30 minute chunks max).
- **One step at a time**: Complete one step fully, verify it works, then move to the next. Never batch unrelated changes.
- **Track every step**: Update TODO.md immediately when starting, completing, or blocking a step. Checkboxes (`[ ]` → `[x]`) are non-negotiable.
- **Atomic commits conceptually**: Each completed step should leave the codebase in a coherent, testable state.
- **Vertical slices**: Prefer completing thin end-to-end slices over building massive infrastructure in isolation.

## Decomposition Workflow

1. **Understand the full scope** - Read requirements completely. Identify all affected files, dependencies, tests, and docs.
2. **Create a step breakdown** - List every concrete action needed as an ordered checklist. Be exhaustive.
3. **Identify dependencies** - Order steps so each builds on verified previous work.
4. **Define completion criteria** - For each step, write a clear "done" condition (tests pass, builds succeed, specific behavior verified).
5. **Execute incrementally** - Do step 1, verify against criteria, update tracking, then step 2.

## When Breaking Down Tasks

- If a task feels ambiguous, split until each step has unambiguous success criteria.
- If "verify" isn't obvious, add explicit verification commands to the step.
- If a step touches multiple unrelated files, it needs to be split further.
- If estimated time > 30 min, break it down more.

## Integration with Tracking

- Every step must be logged in TODO.md with project tag `[<project-name>] (<project-path>)`.
- When starting: mark in progress, note resume point.
- When done: check `[x]`, move to appropriate section if needed.
- When blocked: log in BUGS.md with reproduction and workaround.
- Keep PLAN.md updated if sprint scope changes.

## Verification Per Step

- Run the relevant verification commands for the affected repo after each step (see `.agents/rules/verification.md`).
- Never proceed to next step if verification fails.
- Fix failures before continuing — don't accumulate broken state.
