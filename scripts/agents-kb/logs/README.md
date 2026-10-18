# logs/ — agents-kb CLI Run Logs (local-only)

Per-run structured logs written by `kb-log.ts` (`logs/<command>-<slug>.log`). One file per
CLI invocation with ISO timestamps, mirrored to the console.

- **Gitignored**: only this README is tracked; logs never leave the local clone.
- **Auto-pruned**: only the newest 50 runs per command are kept.
- **Non-fatal**: if log files cannot be written, CLIs degrade to console-only output.

Do not store anything durable here — logs are ephemeral diagnostics.
