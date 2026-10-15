# Rule: Background Task Execution

> BINDING. Long-running commands must not block the session.

## Core Principles

1. **Never block on long-running processes** - If a command may take > 60 seconds (builds, tests, dev servers, linters with watch mode), run it in background when possible.
2. **Use shell background execution** - Append `&` to shell commands to run in background, or use tools that support background mode.
3. **Capture output to logs** - Redirect stdout/stderr to log files for later inspection. Use timestamped log names to avoid overwriting.
4. **Check results asynchronously** - Don't wait synchronously; poll/check log files periodically or when convenient.
5. **Preserve logs** - Keep background task logs until results are consumed and verified.

## When to Use Background

Use background for:
- `npm run dev`, `npm run tauri:dev` (dev servers)
- `npm run build`, `cargo build`, `bundle exec jekyll build` (long builds)
- `cargo test`, `npm test`, test suites
- Any watch mode or long-running process
- Processes that produce incremental output

Do NOT use background for:
- Quick checks (`cargo check`, `npm run check` that finish fast)
- Interactive commands requiring immediate input
- Commands where you need output to decide next step immediately
- Git operations (respect git-operations.md)

## Logging Requirements

- All background commands must write to a log file
- Log path pattern: `logs/<task>-<YYYY-MM-DD_HH-MM-SS>.log` or repo-appropriate location
- Include both stdout and stderr: `> logs/task-20261014_123456.log 2>&1`
- Add a header in the log noting command, start time, cwd

## Pattern Examples

PowerShell (Windows):
```powershell
$ts = (Get-Date -Format "yyyyMMdd_HHmmss")
$log = "logs\build-$ts.log"
Start-Process -NoNewWindow powershell -ArgumentList "-Command", "npm run build 2>&1 | Tee-Object -FilePath $log"
# or use & with redirection + job control as appropriate
```

Bash-like (if available):
```bash
LOG="logs/build-$(date +%Y%m%d_%H%M%S).log"
npm run build >"$LOG" 2>&1 &
echo "PID:$! LOG:$LOG"
```

## Monitoring & Verification

1. Record PID and log path when launching
2. Check periodically: is process still running? (Get-Process, ps)
3. When done, read tail of log to confirm success/failure
4. Run verification gates based on log results
5. Don't assume success — always inspect logs

## Integration with Project Logging

- Steam-Vault already has `scripts/lib/logger.mjs`, `scripts/run.mjs`, `scripts/build.mjs`, `scripts/dev.mjs` — use these when available
- For other projects, add simple timestamped logging when introducing long-running workflows
- Follow existing repo conventions
- Never delete logs from successful runs until user confirms
