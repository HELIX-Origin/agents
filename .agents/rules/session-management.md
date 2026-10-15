# Rule: Session & Context Management

> BINDING rules for managing long-running sessions without losing context or accumulating noise.

## Mandatory Practices

1. **Always resume from tracking docs** - At session start: read AGENTS.md, then ROADMAP.md → PLAN.md → TODO.md → BUGS.md. The first unchecked TODO item is the resume point.
2. **One step at a time** - Use the task-decomposition skill. Complete, verify, update tracking, then proceed.
3. **Update tracking continuously** - Update TODO.md on start/complete/block, BUGS.md on blockers, PLAN.md on scope changes, ROADMAP.md on milestone changes. Do this in lockstep with work.
4. **Verify after each step** - Run the repo's verification commands per step (see verification.md). Don't batch verification.
5. **Compress closed content only** - Use compress only when a section is genuinely closed and verified. Never compress in-progress work or raw code needed for next steps.
6. **Keep summaries high-fidelity** - Compressed summaries must capture file paths, decisions, constraints, acceptance criteria, outcomes, and key findings. Preserve user intent.

## Session Start Checklist

- [ ] Read AGENTS.md
- [ ] Read ROADMAP.md → PLAN.md → TODO.md → BUGS.md
- [ ] Identify first unchecked TODO item (resume point)
- [ ] Confirm authorized git operations (if any needed)
- [ ] Identify affected repo(s) and their verification commands

## Session End / Handoff Checklist

- [ ] All completed steps checked off in TODO.md
- [ ] Any blockers logged in BUGS.md with reproduction
- [ ] PLAN.md reflects current state if scope changed
- [ ] Verification passed for all changes
- [ ] Next action clearly identified in TODO.md (first unchecked)
- [ ] No uncommitted changes left in unclear state (or documented)

## Compression Guardrails

- **Compress when**: Research concluded, implementation verified and passing, exploration exhausted, dead-ends identified.
- **Do NOT compress if**: Work in progress, need exact code/errors next, verification pending, user context still needed.
- **Signal over noise**: Strip failed attempts that led nowhere. Keep decisions, constraints, findings.
- **User intent**: Quote user messages when short; preserve scope, priorities, constraints, acceptance criteria.

## Context Recovery

If context feels lost:
1. Check TODO.md first (next action)
2. Check PLAN.md (sprint decisions)
3. Check BUGS.md (blockers)
4. Check files referenced in tracking
5. Stop and ask user rather than guessing

## Integration

- Load `task-decomposition` skill for large/multi-step work
- Load `large-session-management` skill for long sessions or when context grows
- Follow `verification.md` for all quality gates
- Respect `git-operations.md` — never mutate repo without explicit authorization
