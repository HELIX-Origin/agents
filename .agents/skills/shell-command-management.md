# Skill: Shell Command Management (Windows / PowerShell)

> **Why this skill exists:** this workspace runs on **Windows 11 through PowerShell**, and the
> workspace root path contains a **space** (`D:\Projects\GitHub\HELIX Origin`). Ad-hoc command
> construction is the single biggest source of avoidable failures — unquoted paths, Unix-only
> tools, `&&`, wrong working directories, and logs written to the wrong place. Read this before
> running shell commands; do not rediscover these traps every session.

## The shell contract

- Platform is **win32**. The `shell` tool runs **Windows PowerShell** (5.1 unless `pwsh` is invoked).
- **Never assume a POSIX shell.** `&&`, `||`, `2>/dev/null`, `head`, `tail`, `grep` etc. are not
  available on PowerShell 5.1.
- Default foreground timeout is **120000 ms**. Long jobs must use `background: true` or an explicit
  `timeout`.
- The `shell` tool has three parameters that solve most problems: **`workdir`**, **`timeout`**,
  **`background`**. Use them instead of fighting the shell.

## Golden rules

1. **Quote every path that contains a space.** The workspace root does. Examples:
   - `git -C "D:\Projects\GitHub\HELIX Origin" status`
   - `Read`/`edit`/`write` do **not** need quoting (they are not shell), but shell commands do.
   - For cmdlets that accept a path, prefer **`-LiteralPath`** (no wildcard interpretation).
2. **Do not `cd`.** Set the tool's **`workdir`** parameter instead. Chain-free, reliable, no state
   leaking between calls.
3. **No `&&` on Windows PowerShell 5.1.** Use `;` or `if ($?) { ... }`, or just make separate calls.
   (`pwsh` 7 supports `&&` — confirm the shell first if you truly need it.)
4. **Use PowerShell-native tools**, never Unix binaries. See the translation table below.
5. **`git -C "<absolute repo>"`** for every repository under `projects/`.
6. **Background long-running commands with `background: true`**, not `&` or `Start-Process`.
7. **Bound your output.** Let the tool truncate; pipe through `Select-String`/`Select-Object`
   before dumping thousands of lines.
8. **Check the exit code**: `$LASTEXITCODE` (external tools) / `$?` (cmdlets).

## Unix → PowerShell translation

| Unix / bash | PowerShell |
| --- | --- |
| `head -n 20 file` | `Get-Content file -TotalCount 20` |
| `tail -n 20 file` | `Get-Content file -Tail 20` |
| `cat file` | `Get-Content file` |
| `grep pattern path` | `Select-String -Path path -Pattern pattern` |
| `ls -la` | `Get-ChildItem -Force` |
| `rm -rf dir` | `Remove-Item -Recurse -Force dir` |
| `cp a b` | `Copy-Item a b` |
| `mv a b` | `Move-Item a b` |
| `mkdir -p dir` | `New-Item -ItemType Directory -Force dir` |
| `touch file` | `New-Item -ItemType File -Force file` |
| `which node` | `Get-Command node` |
| `pwd` | `Get-Location` |
| `echo hi` | `Write-Output hi` |
| `/dev/null` | `$null` |
| `$VAR` | `$env:VAR` (env) / `$VAR` (script) |
| `cmd1 && cmd2` | `cmd1; if ($?) { cmd2 }` |
| `find . -name '*.ts'` | `Get-ChildItem -Recurse -Filter *.ts` |

> For **searching file contents**, prefer the dedicated **`grep`** tool over `Select-String`.
> For **finding files**, prefer the dedicated **`glob`** tool over `Get-ChildItem -Recurse`.

## Path & quoting cookbook

- The workspace root is `D:\Projects\GitHub\HELIX Origin` — **quote it, always**, in shell text.
- A trailing backslash inside a double-quoted string escapes the closing quote. Avoid
  `"C:\dir\"`; use `"C:\dir"` or `"C:\dir\\"`.
- Build programmatic paths with `Join-Path`.
- `%TEMP%` is easy to mis-quote; use **`$env:TEMP\helix-scratch`** (the approved scratch dir).
- Both `/` and `\` work for most Windows tools; when in doubt keep native `\`.
- Prefer **`-LiteralPath`** for any path derived from a variable.

## Invoking project tooling

| Tool | How |
| --- | --- |
| npm scripts | `npm run <script>` (set `workdir` to the repo). |
| Node | `node <file>` |
| Rust / Tauri | `cargo check` / `cargo test` / `cargo build` with `workdir` on the crate (`src-tauri`) |
| Ruby / Jekyll / Sass | prepend PATH first: `$env:PATH = "C:\Ruby33-x64\bin;$env:PATH"`, then `bundle exec jekyll build --source <abs> --destination <abs>` |
| ImageMagick | `magick <args>` |

Always confirm installs with `Get-Command <tool> -ErrorAction SilentlyContinue` before assuming a
tool is missing.

## Background execution

- Use your harness's background-execution option for long commands so the call returns immediately and
  you are notified on completion. **Do not** append `&` — that is a bash idiom and is not needed.
- **Do not poll or sleep.** Continue independent work and react to the completion notification.
- For durable transcripts, redirect to `logs/<task>-<YYYY-MM-DD_HH-MM-SS>.log` (see
  `.agents/rules/background-tasks.md` and the `test-execution` skill).
- Keep quick checks (`cargo check`, `npm run check`) in the **foreground** so you can branch on the
  result immediately.

## Output discipline

- One command per call by default. For **independent** commands, batch them as separate calls
  (in `execute`, `Promise.allSettled`).
- **No `echo "===="` / `printf '---'` separators** — they make output noisy. The harness renders
  each result separately.
- Filter before dumping: `... 2>&1 | Select-String -Pattern 'error|warning|failed'`.
- Never dump a 10k-line build log; read the tail or grep for the failure line.

## Failure triage — and **do not get hung up**

When a command fails:

1. Read the **actual error line** before changing anything.
2. Check the three usual suspects in order: **quoting** → **workdir** → **wrong repo/tool**.
3. **Retry budget: 2.** After two failures with the same command shape, change the *approach*
   (absolute paths, `-LiteralPath`, dedicated `read`/`edit`/`glob`/`grep` tool, or ask the user) —
   never re-run the identical failing invocation in a loop.
4. If it is really a **file operation** (read/edit/write/find), stop using the shell and use the
   dedicated tools instead (see the `file-editing` skill).

## Pre-flight checklist

- [ ] Every path with a space quoted?
- [ ] `workdir` set instead of `cd`?
- [ ] PowerShell-native tools only (no `head`/`tail`/`grep`/`&&`)?
- [ ] Long-running → `background: true`?
- [ ] Output bounded or filtered?
- [ ] Correct repo via `git -C` / `workdir`?
- [ ] Git operation read-only (or explicitly authorized for *this* repo, *this* operation)?
