# Subagent Management Rule

> Binding, workspace-wide. Replaces the retired visible-work protocol (W.57, retired
> 2026-10-20 by user decision: live narration over-cluttered the session and destabilized
> long runs).

## Core model

The main (parent) agent is an **orchestrator**. Heavy work runs in subagents; the parent
keeps its context lean and its own turns short.

1. **Delegate all substantive multi-step work** — exploration, refactors, fixes, doc
   sweeps, ledger batches — to `explore` or `general` subagents.
2. **Parent turns stay short**: one-line intent → tool call → concise result summary.
   No essay narration; never re-dump tool output the parent already holds.
3. **One task, one self-contained subagent prompt**: working directory, exact goals,
   file-ownership boundaries, verification gates, report format.

## Subagent prompt checklist

- [ ] Working directory and repo; explicit git-mutation ban unless the user authorized it
- [ ] Goals stated as verifiable outcomes (files, behaviors, gates)
- [ ] Files the subagent owns; files it must not touch
- [ ] Verification commands and required results (e.g. `bundle exec jekyll build` →
      0 errors / 0 warnings)
- [ ] Report format: what changed, gate results, open questions — nothing else

## Parallelism & isolation

- Launch subagents in parallel only when their file-ownership sets are disjoint.
- Never let two subagents edit the same file; assign a single owner per file.
- Progress narration inside subagents is not requested — only final state.

## Parent duties after a subagent returns

1. Spot-verify claims (one shell read or build) before recording completion in ledgers.
2. Update ledgers (`TODO.md`, `PLAN.md`, `BUGS.md`) with the verified outcome only.
3. If a subagent was interrupted mid-flight, re-establish ground truth (`git status`,
   fresh file reads) before continuing or re-delegating.

## Failure handling

- Interrupted or untrusted subagent output → treat affected files as dirty: verify with
  an independent read before building on them.
- Contradictory tool results → resolve with a second independent method before acting.

## Context-exhaustion guardrails

- The parent MUST proactively use the `compress` tool on closed-out ranges at every natural
  checkpoint; never wait for the user to flag context pressure.
- Never re-dump tool output the parent already holds — cite paths and results only.
- Subagent prompts must demand a compact report (changed files, gate results, open questions)
  and explicitly forbid transcript dumps.
- Never launch more than 2 heavy subagents concurrently — a parallel batch was previously
  cancelled wholesale by a provider rate limit, destroying all in-flight work.
- An interrupted or missing subagent result is UNTRUSTED: re-establish ground truth
  (`git status` + fresh shell reads) before continuing — partially-written work may already
  be on disk.
- Keep parent turns to a few lines; analysis belongs in subagents and ledgers, not the chat.
