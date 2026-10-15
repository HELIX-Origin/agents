# Skill: Safe File Editing (paths, EOL, exact match)

> **Why this skill exists:** edits repeatedly fail on **format and path issues** — exact-string
> mismatches, CRLF/LF churn, tabs-vs-spaces, line-number prefixes accidentally copied into the
> match, and Windows paths. Use the dedicated tools correctly and **stop looping** on a failing
> edit. Never edit files through the shell.

## Tool selection

| Need | Tool |
| --- | --- |
| See current contents (exactly) | **`read`** |
| Replace a specific chunk | **`edit`** |
| Create a file / replace all contents | **`write`** |
| Find files by name/pattern | **`glob`** |
| Find text across files | **`grep`** |

**Never** use `sed`, `Set-Content`, `Add-Content`, `>>`, or here-strings in the shell to modify
files. The dedicated tools preserve encoding and line endings; shell redirection usually does not.

## Golden rules

1. **Read before you edit.** Always `read` the region so `oldString` is copied verbatim.
2. **Never include the `1: ` line-number prefix** the `read` tool shows — it is not part of the file.
3. **Make `oldString` unique.** If it appears more than once, add surrounding context, or set
   `replaceAll: true` when every occurrence should change.
4. **Preserve line endings.** The tools match and keep the file's existing CRLF/LF automatically.
   Only change EOLs deliberately (by making `oldString`/`newString` differ **only** in `\r`).
5. **Preserve indentation** exactly — tabs vs spaces matter.
6. **Encoding is UTF-8.** Do not introduce a BOM unless the file already has one.
7. **Paths are not shell paths here.** Pass workspace-relative (`AGENTS.md`) or absolute
   (`D:\Projects\GitHub\HELIX Origin\AGENTS.md`) paths. Spaces are fine; the tools are not a shell.
8. **Verify after editing** — re-`read` or `grep` for the new/removed symbol.

## Exact-match strategy

- **"oldString not found":** re-`read` the exact lines and copy them again. Common causes:
  - a line-number prefix crept in,
  - trailing/leading whitespace differs,
  - tabs where you typed spaces (or vice versa),
  - smart quotes/en-dashes (`edit` retries with normalization, but do not rely on it),
  - the text spans an EOL boundary you did not reproduce.
- **"multiple matches":** include more unique surrounding context, or use `replaceAll: true`.
- **Huge/structural change:** read the whole file and use **`write`** rather than one giant fragile
  `oldString`.

## When an edit fails — do not get hung up

1. **After the first failure**, re-`read` the exact region and retry with a *smaller, unique* anchor.
2. **After the second failure**, switch strategy:
   - narrow to a minimal unique anchor (a single distinctive line), **or**
   - `grep` for a hidden-character / duplicate, **or**
   - read the full file and `write` it.
3. **Never** re-issue the same failing `edit` unchanged. Never loop more than twice.
4. If a needed string genuinely is not present, the file differs from your mental model — re-read it
   before continuing.

## Multi-file edits

- Editing **independent** files: issue the `edit` calls in parallel.
- Keep each change minimal and match the surrounding style, naming, and formatting.
- One logical change per edit; do not reformat unrelated lines (it creates review noise and can
  churn EOLs).

## Windows / EOL notes

- Repos here use **LF**. Git may warn *"LF will be replaced by CRLF the next time Git touches it"* —
  that is a checkout `autocrlf` artifact, **not** a change you introduced. Do not "fix" it.
- Never run a formatter or a line-ending converter to silence that warning unless the task is
  explicitly about line endings.
- `write` creates missing parent directories automatically.

## Failure → fix quick table

| Symptom | Fix |
| --- | --- |
| edit "not found" | re-`read`, copy verbatim, strip `N: ` prefixes, check tabs/whitespace |
| edit "multiple matches" | add context or set `replaceAll: true` |
| file appears unchanged | confirm you edited the right path (`glob`/`read`) |
| EOL warning from git | ignore — checkout artifact, not your edit |
| change is large/structural | read all → `write` |

## Verification

- `grep` the new symbol / `read` the changed region.
- Run the repo's gate (`.agents/rules/verification.md`).
- Confirm no unrelated lines changed.
