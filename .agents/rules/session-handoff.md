# Rule: Session Handoff (HANDOFF.md)

> BINDING. The workspace-root file `HANDOFF.md` is the **permanent, git-tracked session-state
> ledger**. It carries live in-flight progress, decisions, and next steps across session
> boundaries. Every session reads it at the very start, keeps it current while working, and
> refreshes it before ending. It is **never deleted** and **never gitignored**.

## What HANDOFF.md is

- A **permanent session-state ledger** at the workspace root — the bridge between consecutive
  sessions. Unlike `ROADMAP.md` / `PLAN.md` / `TODO.md` / `BUGS.md` (which hold normalized,
  durable truth), `HANDOFF.md` holds **live session state**: exact in-flight next steps, freshly
  gathered file/environment facts, and current workstream posture — the things a fresh session
  would otherwise have to re-derive from scratch.
- **Git-tracked**: `HANDOFF.md` lives and is committed at the workspace root like any other
  ecosystem file. (Git mutations still require explicit user authorization per
  `git-operations.md`.)
- **Always current**: maintained **incrementally** — created at the first worth-carrying
  milestone, refreshed at every workstream state change, fully rewritten at session end and at
  soft-target postures. A `HANDOFF.md` more than one session stale is a protocol failure.
- **Never deleted**: consuming a handoff migrates its content into the ledgers and then
  **refreshes** the file (migrated-only state collapses to one-line delivered notes, open state
  stays) — the file itself is never removed.

## Relationship to the ledgers (canonical targets)

The root tracking files remain the single pane of glass for durable truth. On consumption,
handoff content maps to:

| Handoff content | Migrates into |
| --- | --- |
| New/changed scope, milestone, strategic direction | `ROADMAP.md` |
| Sprint-level execution steps, design decisions, acceptance criteria | `PLAN.md` |
| Concrete open tasks & checklists (with project tags) | `TODO.md` |
| Blockers, quirks, environment/tooling notes | `BUGS.md` |
| Session-environment quirks (shell/tooling policy, disabled tools, experimental flags) | `.agents/rules/session-management.md` / `AGENTS.md` environment section, if durable |

`HANDOFF.md` **never contradicts** the ledgers; on any conflict the ledgers win and the stale
handoff text is corrected or dropped during migration.

## Active self-monitoring (binding — never wait for the user)

The agent MUST track its own context pressure continuously and act on the thresholds below
**autonomously**. The user must never have to point out that a limit was exceeded — needing that
notification is a protocol failure. At every natural checkpoint (step completed, verification
done, before starting a new step) run this silent scoreboard check:

| Signal | How to read it |
| --- | --- |
| Token meter (if the harness exposes one) | Compare directly against soft 100k / hard 120k (or 60% of window) |
| Compress operations performed this session (DCP `compress`) | 1st = normal hygiene; 2nd = approaching soft target; 3rd+ = soft target reached |
| DCP / context-pressure reminders received | Any reminder = approaching soft target, regardless of compress count |
| Substantive turns since session start | ~40 = soft target |
| Open workstreams live in context | ≥ 3 = soft target |

Postures (self-executing, no user prompt required):

| Posture | Trigger | Required action |
| --- | --- | --- |
| Normal | below soft-target signals | Continue; refresh `HANDOFF.md` at each workstream state change; re-check the scoreboard at every checkpoint |
| Approaching soft target | 2nd compress **or** any DCP pressure reminder | Refresh `HANDOFF.md` on disk now with exact current state; after the current step verifies, update ledgers; do not open large new workstreams |
| Soft target reached | 3rd compress, meter ≥ soft target, ~40 turns, or ≥ 3 open workstreams | Finish + verify the current step, update ledgers, fully rewrite `HANDOFF.md`; only then decide: end session or continue |
| Hard ceiling | meter ≥ hard ceiling, harness warns of imminent overflow/truncation, or window headroom clearly < ~40% | Start nothing new; compress once only if needed to free headroom for writing; rewrite `HANDOFF.md` **immediately**; tell the user the session is ready to split |

If a threshold is crossed and `HANDOFF.md` was not refreshed before the next user message, treat
it as a protocol failure: note it in `BUGS.md` and correct the cadence.

## Max session size (fixed — never re-calculate)

Use these constant thresholds every session; the decision is pre-computed, not re-derived:

| Signal | Threshold | Action |
| --- | --- | --- |
| **Hard ceiling** | **120k tokens** of accumulated session context | Start no new work; rewrite the handoff **immediately** |
| **Soft target** | **100k tokens** | Finish + verify the current step, update ledgers, then rewrite the handoff |
| **Smaller windows** | context window < 160k tokens | Ceiling = **60% of window** (e.g. 128k window → 76k ceiling / 64k soft) |
| **Fallback (no token meter)** | ~**40** substantive turns, **or** ≥ **3** workstreams open in context, **or** harness suggests compaction | Treat as soft target → hand off after the current step |

Rationale: 120k on a 200k window leaves ~40% headroom — large enough for multi-repo,
multi-file workstreams, safe enough that compaction/overflow never destroys active state.

## Write triggers

Refresh or rewrite `HANDOFF.md` whenever any applies:

1. A scoreboard posture above demands it (self-executing — never wait for the user).
2. A large task (see `large-task-handling.md`) is only partially complete.
3. The session ends while meaningful work remains open in `TODO.md`.
4. Any workstream state change: delivered, blocked, new decision, new environment quirk.

Requirements:

- **Full rewrite** at session end and at soft-target postures — stale and completed content is
  collapsed to one-line "delivered" notes, never appended indefinitely.
- Incremental refreshes between rewrites may update sections in place; the file must always
  reflect current truth.
- Use `.agents/templates/handoff-template.md` as the structural baseline.
- Include: header (last updated, status, root path), one section per open workstream with
  delivered state + explicit **Next tasks** checklist (exact file paths), shell/tooling notes,
  and a **Quick Resume Checklist** for the new session.
- Capture exact paths, decisions, constraints, and acceptance criteria — enough to resume
  without re-reading the old conversation. Distinguish **delivered / in progress / pending**.
- Project-tag every workstream (`[<project-name>] (<project-path>)`) like the ledgers require.
- **No secrets**: never write tokens, keys, credentials, or personal machine paths.
- The handoff must also be reflected in the ledgers: open workstreams belong in `TODO.md`
  regardless of the handoff's existence.

## Consuming a handoff (start of a new session)

Order of operations, at the very start:

1. Read `AGENTS.md`.
2. Read `HANDOFF.md` **immediately** — it is the bridge from the previous session. In a
   maintained workspace it always exists; treat absence as a protocol gap and recreate it.
3. Read `ROADMAP.md` → `PLAN.md` → `TODO.md` → `BUGS.md`.
4. **Migrate**: fold every open task, decision, and note from the handoff into the correct
   tracking files (table above), normalizing into categorized, project-tagged checklist items —
   never paste raw handoff blocks into the ledgers.
5. **Reconcile**: ledgers win on conflicts; drop superseded handoff statements.
6. **Refresh** `HANDOFF.md`: collapse migrated-only content to one-line delivered notes, keep
   live open state, update the header (date, current session status). **Never delete the file.**
7. If migration was interrupted (session died mid-consume), leave `HANDOFF.md` in place and
   finish migrating before starting new work.

## Coexistence with context compression (DCP / `compress`)

Compression is lossy by design; the handoff protocol must run **alongside** it without either
degrading the other:

1. **`HANDOFF.md` is the durable store, the conversation is not.** Never reconstruct handoff
   state from memory that compression may have collapsed — source it from the file on disk, the
   ledgers, and the working tree.
2. **Maintain incrementally.** Because the file is refreshed at every workstream state change,
   context compression can never erase the only record of open state — the end-of-session
   rewrite refreshes an already-faithful file instead of reconstructing from memory.
3. **Compress summaries must carry handoff state.** Any compressed range that includes handoff
   events (created / refreshed / migrated / rewritten) must state that in the summary, so the
   live session never loses track of what the file currently holds.
4. **A compress reminder is not a handoff substitute.** Compressing closed sections frees
   in-session context but transfers nothing across sessions; a DCP pressure reminder is evidence
   of approaching the soft target (scoreboard above).
5. **Consumption is compression-proof.** The new session reads `HANDOFF.md` from disk right after
   `AGENTS.md`; nothing from the producing session's conversation is required.

## Invariants

1. Exactly one handoff file, always at the workspace root — never per-project, never inside
   `projects/`.
2. Ecosystem isolation: `HANDOFF.md` is private to the agents ecosystem; never reference it from
   any project repository's files, README, or documentation. It is git-tracked in the
   **workspace root** repo only.
3. Permanent means permanent: `HANDOFF.md` is git-tracked and **never deleted**; consumption
   migrates and refreshes it.
4. Always current: refreshed at session start, session end, and every workstream state change —
   staleness beyond one session is a protocol failure.
5. Self-enforcement: thresholds execute on the agent's own scoreboard signals; user notification
   is never a precondition for refreshing the handoff.
6. Tracking accuracy (`AGENTS.md` invariant 3) applies to ledgers — the handoff must be migrated
   into them so no direction lives only in `HANDOFF.md`.

## Integration

- Skill: `session-handoff` (write & migrate procedures).
- Agent: `.agents/agents/session-keeper/handoff-writer.md`.
- Session-end step in `session-management.md`; lifecycle guidance in `large-session-management`.
- Template: `.agents/templates/handoff-template.md`.
