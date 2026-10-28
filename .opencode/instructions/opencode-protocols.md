# OpenCode Operating Protocols (Workspace Root)

> Loaded by OpenCode for every session in this workspace, on top of `AGENTS.md`.
> `AGENTS.md` and `.agents/rules/` remain authoritative; this file covers OpenCode-specific
> operation only and never relaxes a workspace invariant.

## Model

- The only permitted model is **Big Pickle** (`opencode/big-pickle`).
- `opencode.jsonc` pins `model`, blocks every other provider via `policies`, and
  `.opencode/plugins/big-pickle-only.ts` removes every other model from the catalog.
- Never add another provider, model, or `small_model` override to any project config.

## Research-first mandate (all work)

- Guesswork and trial-and-error edits are strictly banned across **all work** (every domain,
  language, tool, script, configuration, asset, or documentation task — never limited to specific
  fields).
- Always research official primary documentation online (`search_web`) and empirically inspect the
  live state before editing any file.

## Context discipline

- The session budget is finite. Prefer one larger, targeted read over many small slices, and
  `grep`/`glob` over full-file dumps once a file has been summarised.
- Batch independent tool calls in one block instead of serialising them.
- Never repeat a command whose result is already in context.
- Record durable findings, decisions and next steps in the tracking ledgers
  (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`, `HANDOFF.md`) rather than restating them.
- When a phase completes, write a short checkpoint (state, decisions, next move) instead of a
  long narrative. `HANDOFF.md` is the permanent session-state ledger.
- If a command can emit unbounded output, filter it (`Select-Object -Last N`, `| rg ...`) so the
  result stays useful.

## Tool hygiene

- Edit files with the edit/write tools, never through the shell, to preserve encoding and LF
  line endings.
- Quote Windows paths containing spaces; pass `workdir` rather than changing directories.
- Long builds/tests run in the foreground with an explicit timeout in this workspace unless a
  genuinely independent task can run in the background.
- Subagents start with fresh context: pass every needed fact explicitly and ask for a compact
  result.

## Git

- Read-only git (`status`, `log`, `diff`, `show`, `ls-files`, `remote -v`) is always fine.
- Every repository-mutating git command is configured to prompt (`permissions` in
  `opencode.jsonc`). A prompt is **not** authorization: only the user's explicit instruction in
  the current conversation authorises a mutation, for that exact repository.

## Verification

- Zero errors and zero warnings are required. Re-run the repository's build, test, lint and
  typecheck commands after edits and report the real result.
- Plugin sources type-check with `tsc -p .opencode/tsconfig.json` (zero diagnostics).
  `types/opencode-plugin.d.ts` is the local shim for the runtime-provided `@opencode/plugin`
  module — keep it and keep it in sync with the documented plugin API.
- Never claim a check passed without running it; never silence a warning to make a gate pass.

## Scope

- Touch only the project the task names. `projects/` contains independent repositories; do not
  modify unrelated ones.
- Honour each repository's own `AGENTS.md`, `.opencode/`, and contributor docs.
