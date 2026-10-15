# Rule: Large Task Handling

> BINDING. All non-trivial work must follow incremental decomposition.

## Requirement

Any task that involves:
- Modifying > 3 files
- Touching multiple subsystems
- Requiring multiple verification steps
- Taking estimated > 15 minutes of work
- Having ambiguous scope

MUST be decomposed into small, verifiable steps using the `task-decomposition` skill.

## Mandatory Behaviors

1. **Decompose first** - Before editing, break into ordered steps with clear completion criteria.
2. **One step at a time** - Execute a single step, verify it fully, update tracking, then move on.
3. **Verify per step** - Run relevant verification commands for affected repo after each step. Never defer all verification to the end.
4. **Track continuously** - Update TODO.md (start/complete), BUGS.md (blockers), PLAN.md (scope) immediately.
5. **Keep working tree clean state per step** - Each step ends with passing verification and coherent codebase state.
6. **No scope creep** - Stick to current step. If new work emerges, log it as a new TODO item.

## Step Size Guidelines

- **Ideal**: 10-20 minutes, 1-2 files, single logical change
- **Acceptable**: Up to 30 minutes if tightly scoped
- **Too big**: Touching 3+ unrelated concerns in one go

## Integration

- Load `task-decomposition` skill at start of any large task
- Combine with `large-session-management` skill for long sessions
- Follow `verification.md` for repo-specific gates
- Follow `session-management.md` for context handling
- Respect `workspace.md` invariants and `git-operations.md` constraints
