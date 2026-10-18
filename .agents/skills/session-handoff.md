# Skill: Session Handoff (HANDOFF.md)

> Keep the permanent, git-tracked root file `HANDOFF.md` current at all times; read it at every
> session start and migrate its content into the ledgers. Binding rule:
> `.agents/rules/session-handoff.md`.

## Purpose

`HANDOFF.md` is the **permanent session-state ledger** at the workspace root — the bridge
between consecutive sessions. The ledgers (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`) hold
normalized durable truth; the handoff holds **live session state**: exact in-flight next steps,
freshly gathered file/environment facts, current workstream posture. It is git-tracked, never
deleted, and kept current incrementally — so context compression (`compress` / DCP) can never
erase the only record of open work.

## Continuous self-monitoring (binding — never wait for the user)

Run this silent scoreboard check at **every natural checkpoint** (step done, verification done,
before a new step). The user must never have to point out that a limit was exceeded.

| Signal | Reading |
| --- | --- |
| Token meter (if exposed) | ≥ 100k soft / ≥ 120k hard (60% of window when < 160k) |
| Compress operations this session | 1st = hygiene; 2nd = approaching soft target; 3rd+ = soft target |
| DCP / context-pressure reminders | any = approaching soft target |
| Substantive turns | ~40 = soft target |
| Open workstreams in context | ≥ 3 = soft target |

Self-executing postures:

- **Normal** — continue; refresh `HANDOFF.md` at each workstream state change.
- **Approaching soft target** (2nd compress or any DCP reminder) — refresh `HANDOFF.md` now with
  exact current state; after the current step verifies, update ledgers; no large new workstreams.
- **Soft target reached** (3rd compress / meter / turns / workstreams) — finish + verify the
  current step, update ledgers, fully rewrite `HANDOFF.md`; then end or continue.
- **Hard ceiling** (meter / overflow warning / headroom < ~40%) — start nothing new; compress
  once only if needed to free writing headroom; rewrite `HANDOFF.md` immediately; tell the user
  the session is ready to split.

A crossed threshold without a refreshed handoff = protocol failure → log in `BUGS.md`, fix cadence.

## Phase A — Maintaining the handoff (current session)

1. **Create early**: at the first milestone, decision, or blocked note worth carrying over, write
   `HANDOFF.md` from `.agents/templates/handoff-template.md`.
2. **Refresh at every workstream state change**: delivered / blocked / new decision / new
   environment quirk → update the file on disk immediately. Incremental section updates are fine
   between full rewrites.
3. **Full rewrite** at soft-target posture and at session end:
   - Header: `# HANDOFF.md — <topic>`, **Last updated** (date), **Current session status**,
     **Root** (workspace path).
   - One numbered section per open workstream: state line, delivered bullets (exact paths),
     `**Next tasks:**` checklist `- [ ]` with exact file paths and acceptance criteria,
     `**Ledgers:**` references.
   - Shell/tooling notes NOT discoverable from the repo.
   - `## Quick Resume Checklist` for the new session (ordered reads).
   - Stale/completed sections collapse to one-line "delivered" notes — never append forever.
4. **Cross-check fidelity**:
   - Every open handoff item also exists in `TODO.md` (add missing ledger entries now).
   - No secrets, no machine-specific absolute paths beyond the workspace root.
   - Source the rewrite from the **on-disk file, the ledgers, and the working tree** — never from
     conversation memory that compression may have collapsed.
5. **Announce** in your reply when a full rewrite happened (session safe to split).

## Phase B — Consuming the handoff (new session, very start)

1. `AGENTS.md` → then read `HANDOFF.md` **immediately** (it always exists in a maintained
   workspace; absence = protocol gap → recreate it).
2. Read `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`.
3. **Migrate** each handoff section into the right ledger using the mapping below; normalize into
   categorized, project-tagged checklist items (no raw handoff blocks pasted into ledgers).
4. **Reconcile**: ledgers win conflicts; discard superseded statements.
5. **Refresh `HANDOFF.md`** — collapse migrated-only content to one-line delivered notes, keep
   live open state, update the header. **Never delete the file.**
6. Resume at the first unchecked `TODO.md` item.

## Migration mapping (quick reference)

| From the handoff | Into |
| --- | --- |
| Scope / milestone / direction change | `ROADMAP.md` |
| Sprint tasks, design decisions, acceptance criteria | `PLAN.md` |
| Open checklists, concrete next steps | `TODO.md` |
| Blockers, quirks, tooling gotchas worth keeping | `BUGS.md` (or rules if durable policy) |

## Coexistence with compression (`compress` / DCP)

- The handoff file is the durable store; the conversation is not. Always source state from disk.
- Compress summaries covering handoff events must state the file's current state
  (created / refreshed / migrated / rewritten).
- A compress reminder counts as an "approaching soft target" signal — it is not a substitute for
  refreshing the handoff.
- Consumption is compression-proof: the new session needs only the file, not the old conversation.

## Anti-patterns

- **Waiting for the user to point out a context-limit breach** — thresholds self-execute.
- **Deleting `HANDOFF.md`** after migration — it is permanent; migrate + refresh, never remove.
- **Gitignoring / untracking it** — it is a tracked workspace-root file.
- **Reconstructing the handoff from compressed conversation memory** instead of the on-disk file.
- **Writing it only at session end** — staleness beyond a state change loses work; maintain
  incrementally.
- Treating the handoff as a ledger substitute — durable truth still belongs in `TODO.md` etc.;
  the handoff is never the only home of a task.
- Pasting raw handoff prose into tracking files (must be normalized + project-tagged).
- Referencing `HANDOFF.md` inside `projects/` (ecosystem isolation) or writing secrets into it.
