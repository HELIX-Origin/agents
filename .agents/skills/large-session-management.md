# Skill: Large Session & Context Management

> Prevent context rot and maintain coherent state across long sessions.

## Core Principles

- **Context is finite**: Treat context window as a constrained resource. Signal-to-noise ratio is everything.
- **Compress deliberately**: Use `compress` only for sections that are genuinely closed (research done, implementation verified, dead-ends abandoned).
- **Preserve active work**: Never compress raw code, errors, or in-progress edits. Keep exact references accessible.
- **Summaries must be exhaustive**: When compressing, capture file paths, decisions, constraints, key findings — everything needed to resume without re-reading the original.
- **Update tracking continuously**: ROADMAP.md, PLAN.md, TODO.md, BUGS.md are your external memory. Keep them current.

## Session Lifecycle

1. **Session start** (every new session):
   - Read AGENTS.md first
   - Read ROADMAP.md → PLAN.md → TODO.md → BUGS.md
   - Find first unchecked TODO item; that's your resume point
   - Review recent decisions in tracking docs

2. **During execution**:
   - Update TODO.md immediately on state changes
   - Update BUGS.md when hitting blockers
   - Update PLAN.md if scope/re-scope happens
   - Run verification per step (see task-decomposition skill)
   - Keep edits small and targeted

3. **Before context pressure**:
   - Identify closed sections (completed steps fully verified)
   - Write high-fidelity compress summaries with all paths, signatures, rationale
   - Compress only stale, closed content
   - Never compress the active workstream

## When to Compress

Compress WHEN:
- Research concluded and findings are clear
- Implementation finished and verified (tests/builds pass)
- Exploration exhausted and patterns understood
- Dead-end noise can be discarded without losing essential context

Do NOT compress IF:
- Raw context is still relevant for upcoming edits
- The target content is still actively in progress
- You may need exact code, error messages, or file contents next
- Verification for that work isn't complete yet

## Compression Best Practices

- Include every required compressed block placeholder exactly once if referencing prior compressed blocks
- Preserve user intent faithfully — quote exact user messages when short
- Treat placeholders as stand-ins for full segments; transitions must remain coherent after expansion
- Strip failed attempts that led nowhere; keep golden nuggets
- Focus on decisions made, constraints discovered, acceptance criteria, and outcomes

## Anti-Patterns to Avoid

- **Context hoarding**: Keeping every failed attempt "just in case" — compress dead-ends
- **Premature compression**: Compressing mid-implementation
- **Forgetting tracking**: Letting TODO/BUGS/PLAN drift from actual state
- **Batching verification**: Verifying only at the very end of a huge change
- **Scope creep**: Touching unrelated repos without explicit authorization
- **Git mutation**: Running add/commit/push without explicit user authorization per repo

## Recovery from Lost Context

If you suspect context loss (can't recall key paths, constraints, or next step):
1. Re-read TODO.md first — it should show exact next action
2. Re-read PLAN.md for sprint context and decisions
3. Re-read BUGS.md for known blockers
4. Re-read the relevant files mentioned in tracking
5. If still unclear, stop and ask the user — don't guess
