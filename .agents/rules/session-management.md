# Rule: Session & Context Management

> BINDING rules for managing long-running sessions without losing context or accumulating noise.

## Mandatory Practices

1. **Always resume from tracking docs** - At session start: read AGENTS.md, then ROADMAP.md → PLAN.md → TODO.md → BUGS.md. The first unchecked TODO item is the resume point.
2. **One step at a time** - Use the task-decomposition skill. Complete, verify, update tracking, then proceed.
3. **Update tracking continuously** - Update TODO.md on start/complete/block, BUGS.md on blockers, PLAN.md on scope changes, ROADMAP.md on milestone changes. Do this in lockstep with work.
4. **Verify after each step** - Run the repo's verification commands per step (see verification.md). Don't batch verification.
5. **Compress closed content only** - Use compress only when a section is genuinely closed and verified. Never compress in-progress work or raw code needed for next steps.
6. **Keep summaries high-fidelity** - Compressed summaries must capture file paths, decisions, constraints, acceptance criteria, outcomes, and key findings. Preserve user intent.
7. **Self-monitor context pressure - never wait for the user** - At every checkpoint silently check the scoreboard in `session-handoff.md` (token meter, compress count this session, DCP pressure reminders, ~40-turn / ≥3-workstream fallbacks). Threshold postures self-execute: refresh `HANDOFF.md`, update ledgers, stop opening new work. Needing the user to announce a limit breach is a protocol failure.

## Session Start Checklist

- [ ] Read AGENTS.md
- [ ] Read `HANDOFF.md` (permanent, git-tracked session-state ledger): read it right away, migrate its content into the tracking ledgers, reconcile (ledgers win), then **refresh it** — never delete it (see `session-handoff.md`)
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
- [ ] **Session splitting / context pressure**: fully rewrite the permanent `HANDOFF.md` (workspace root, git-tracked) from `.agents/templates/handoff-template.md` so the next session can resume — full rewrite, exact paths, no secrets (see `session-handoff.md`)

## Compression Guardrails

- **Compress when**: Research concluded, implementation verified and passing, exploration exhausted, dead-ends identified.
- **Do NOT compress if**: Work in progress, need exact code/errors next, verification pending, user context still needed.
- **Signal over noise**: Strip failed attempts that led nowhere. Keep decisions, constraints, findings.
- **User intent**: Quote user messages when short; preserve scope, priorities, constraints, acceptance criteria.
- **Handoff interplay**: DCP compress reminders count toward the `HANDOFF.md` scoreboard (2nd compress / any reminder = approaching soft target); compress summaries must preserve the handoff file's current state; compressing never substitutes for refreshing the handoff.

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
- Follow `session-handoff.md` — keep `HANDOFF.md` (permanent, git-tracked) current at all times; read + migrate + refresh it at session start
- Follow `verification.md` for all quality gates
- Respect `git-operations.md` — never mutate repo without explicit authorization
