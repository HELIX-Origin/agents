# Rule: No Unauthorized Git Operations

**Status:** BINDING. This is the most important rule in the workspace.

## Why

The user's projects are live or soon-to-be-live GitHub Pages sites backed by real
repositories. An agent pushing unverified, half-finished, or wrong code would damage a
user project. Git is a write-to-history action; once pushed it is hard to undo.

## Decision flow

```mermaid
flowchart LR
    cmd[git command] --> ro{read-only?}
    ro -- yes --> run[run it]
    ro -- no --> auth{explicitly authorized this\nexact operation on this\nexact repo, in this conversation?}
    auth -- yes --> run2[run + report]
    auth -- no --> ask[STOP - ask first]
```

## Allowed without asking (read-only)

- `git status`, `git log`, `git diff`, `git show`, `git ls-files`, `git rev-parse`,
  `git remote -v`, `git branch -a`, `git tag -l` (listing only).

## Never without explicit authorization

Forbidden unless the user explicitly authorizes **that exact operation on that exact
repository, in the current conversation**:

- `git add` / `git rm` / `git mv`
- `git commit` (any form, including `--amend`)
- `git push` (any remote/branch)
- `git pull` / `git fetch` (fetch is read-only-ish but changes refs; ask)
- `git merge` / `git rebase` / `git cherry-pick`
- `git reset` (any mode) / `git revert` / `git restore`
- `git stash` / `git stash pop`
- `git checkout` / `git switch` (changes working tree / HEAD)
- `git clean`
- `git tag` / `git branch` (creating or deleting)
- `git clone` of anything beyond what the task explicitly requires (ask first)

## Behavior when in doubt

1. **Ask** the user before performing any operation above.
2. If a tool or script would implicitly run git (e.g., `bundle` does not, but some
   scaffolding tools do), disable or avoid it.
3. Report planned git actions in your final message even when authorized, so there is an
   audit trail.

## Working with uncommitted changes

- Pre-existing uncommitted changes in a repo are the user's work — never stage, revert, or
  "clean up" them. Only add files that the current task explicitly creates/modifies, and
  only when commit authorization is given.
- Always run a fresh `git status` before acting. Never trust a dated snapshot of a repo's
  state: what looks like it predates your work may already be committed, and vice versa.

## Reminder for every git command

- Ask: *"Did the user explicitly authorize THIS exact operation on THIS exact repository,
  in the current conversation?"* Authorization never carries over from an earlier statement
  or an earlier session. If the answer is no, treat the repo as read-only and ask first.