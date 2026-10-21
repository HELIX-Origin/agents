# Skill: Subagent Management

> Playbook for `.agents/rules/subagent-management.md` (binding). How the parent agent
> splits work into subagents, keeps its own turns short, and verifies results.

## Task-splitting procedure

1. List the units of work (explore / implement / verify / ledger-sync).
2. Group units by **file ownership** — each file gets exactly one owner subagent.
3. Independent groups → launch in parallel; dependent groups → sequence and hand off
   the predecessor's report as the successor's input.
4. Anything the parent can finish in one tool call stays with the parent; everything
   else gets delegated.

## Prompt template (copy, then specialize)

```
Work in <absolute repo path>. Read <project AGENTS.md / local rules> first.
Git: read-only unless the user explicitly authorized mutations.
Goal: <verifiable outcome, one paragraph>.
Own these files: <list>. Do not touch: <list>.
Gates: <commands + required results>.
Report: changed files, gate results, open questions. Nothing else.
```

## Parallel ownership rules

- Disjoint file sets only; same file = same subagent (merge the tasks instead).
- Build/verification commands that share output dirs (`_site/`, `target/`) are
  serialized or given distinct destinations.
- Subagents do not edit ledgers unless the ledger files are assigned to them.

## Parent conduct

- Short turns: intent → tool call → one-line summary.
- On subagent return: spot-verify (one read or build), then update ledgers.
- On interruption/uncertainty: `git status` + fresh reads before any continuation.
- Never paste full tool outputs into prose; reference paths and results only.

## Anti-patterns

- Narrating reasoning at length instead of delegating (the retired visible-work
  failure mode).
- Two parallel subagents owning overlapping files.
- Trusting a subagent's "done" without a spot-check.
- Giant single prompts mixing unrelated goals — split them.
