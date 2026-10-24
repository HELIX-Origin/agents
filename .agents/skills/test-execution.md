# Skill: Test Execution Without Blocking

> Run tests/builds in background with proper logging to avoid hanging the session.

## Core Principles

- **Non-blocking by default**: Any test/build that may run > 60s must go to background
- **Log everything**: Capture stdout+stderr to timestamped logs
- **Track execution**: Record PID and log path
- **Verify via logs**: Don't assume success; inspect log tail before proceeding
- **Use existing tooling**: Prefer repo's existing logged scripts or CMake/CTest harnesses (e.g. `projects/windows-game-explorer`)

## Workflow

1. **Identify command** - Determine the exact test/build command for the repo (per verification.md)
2. **Choose execution mode** - If quick (< 60s), run foreground. If long, run background with logging.
3. **Launch in background** - Redirect to log file with timestamp, run with `&` or Start-Process
4. **Record metadata** - Save: command, start time, cwd, log path, PID (if available)
5. **Continue work** - Do other independent steps while it runs
6. **Monitor/check** - Periodically check if complete; inspect log for results
7. **Verify completion** - Read last 30-100 lines of log; confirm exit code/success
8. **Proceed or fix** - Only move to dependent steps after confirming success

## PowerShell Patterns (Windows)

Foreground quick check:
```powershell
cmake -B "projects/windows-game-explorer/build" -S "projects/windows-game-explorer"
cmake --build "projects/windows-game-explorer/build" --config Release
```

Background build with logging:
```powershell
$ts = (Get-Date -Format "yyyyMMdd_HHmmss")
$log = "logs\build-$ts.log"
New-Item -Force -ItemType Directory logs | Out-Null
Start-Process -NoNewWindow powershell -ArgumentList "-Command", "cmake --build 'projects/windows-game-explorer/build' --config Release *>&1 | Tee-Object -FilePath '$log'"
# Note: record that it's running; check log later
```

Background tests:
```powershell
$ts = (Get-Date -Format "yyyyMMdd_HHmmss")
$log = "logs\test-$ts.log"
New-Item -Force -ItemType Directory logs -ErrorAction SilentlyContinue | Out-Null
Start-Process -NoNewWindow powershell -ArgumentList "-Command", "ctest --test-dir 'projects/windows-game-explorer/build' -C Release --output-on-failure *>&1 | Tee-Object -FilePath '$log'"
```

## Native CMake & CTest Verification in `windows-game-explorer`

`windows-game-explorer` uses CMake and CTest:
- `cmake -B build -S .` → configures the MSVC solution
- `cmake --build build --config Release` → builds `GameExplorerCore`, `GameExplorerShell`, `GameExplorerConfig`, `GameExplorerManager`, and `GameExplorerTests` with `/W4 /WX`
- `ctest --test-dir build -C Release --output-on-failure` → executes unit tests

## Log Inspection

After background task completes:
```powershell
Get-Content logs/build-20261014_123456.log -Tail 40
```

Look for: "success", "done", "finished", exit codes, errors, warnings. Compare against repo verification criteria.

## Best Practices

- Always create `logs/` dir if missing
- Include timestamps in log names
- Don't overwrite existing logs
- Keep logs until you consume results and update tracking
- If a background task seems stuck (> 2x expected time), check log for progress
- For very long suites, tail periodically to see progress
- Update TODO.md with "running in background: <cmd> -> <log>" when launching
