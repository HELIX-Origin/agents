# Rule: Shell Command Usage
**Status:** BINDING.

> Full playbook: **`.agents/skills/shell-command-management.md`** (Windows/PowerShell command
> construction, path quoting, Unix→PowerShell translation, background execution, retry budget).
> For file modifications use **`.agents/skills/file-editing.md`** — never edit files via the shell.

## PowerShell quirks
- PowerShell does NOT have `head`/`tail` (Linux). Use `Select-Object -First n` / `Select-Object -Last n`;
  `Get-Content <file> -Tail n` to read a log tail.
- **No `&&` on Windows PowerShell 5.1** — use `;` or `if ($?) { ... }`.
- Avoid `cd` inside commands when setting `workdir:`. For `bundle exec jekyll build`, set `workdir` to the directory containing `Gemfile`.
- Always pass absolute or fully qualified paths for source/destination.
- **Quote every path containing a space** — the workspace root is `D:\Projects\GitHub\HELIX Origin`.
- Prefer `-LiteralPath` for cmdlet paths; prefer the dedicated `read`/`edit`/`write`/`glob`/`grep` tools over shell equivalents.

## Building
- Ensure Ruby is available in the shell PATH when running bundle/jekyll:
  `$env:PATH = "<ruby-bin-dir>;$env:PATH"; ...`
- For Jekyll: `bundle exec jekyll build --source "<site-source-dir>" --destination "<site-dest-dir>"`
- Set `workdir: projects/helix-docs` when building the theme.

## Long-running commands
- Use `background: true` on the `shell` tool for builds, tests, and dev servers (do NOT append `&`).
- Capture transcripts to `logs/<task>-<YYYY-MM-DD_HH-MM-SS>.log`; never overwrite. See `.agents/rules/background-tasks.md` and `.agents/skills/test-execution.md`.
- Do not poll or sleep; continue other work and react to the completion notification.

## Git
- Use `git -C <repo> <cmd>` when operating inside individual project repositories under `projects/`.
- Read-only by default; no mutating ops without explicit authorization for that exact operation on that exact repository, in the current conversation.

## Output & failure handling
- Display progress concisely; avoid dumping huge logs. Grep for specific errors first
  (`... 2>&1 | Select-String -Pattern 'error|warning|failed'`).
- No `echo "===="` / `printf '---'` separators.
- **Retry budget: 2.** After two failures at the same command shape, change approach (absolute paths,
  `-LiteralPath`, a dedicated tool) — never loop the identical failing invocation.
- **Tool output can be corrupted** (lines shuffled, duplicated, dropped, or fabricated — including
  fake filenames and SHAs). When a result looks suspicious, re-route it through a temp file
  (`Set-Content "$env:TEMP\x.txt" ...; Get-Content "$env:TEMP\x.txt"`) for a clean render, or confirm
  with an independent command. Never act on an unverified value.

## Line endings / format
- **All text files are LF** across the workspace: every repo carries a `.gitattributes`
  (`* text=auto eol=lf`) and the effective `core.autocrlf` is `input`. Write LF for all text files.
  `*.bat`/`*.cmd` are the deliberate CRLF exception (`text eol=crlf`).
- The `edit`/`write` tools preserve a file's existing EOL, so a stale CRLF file stays CRLF. Never
  hand-edit bytes to fix EOL — normalise through git (see `.agents/rules/git-operations.md`).
