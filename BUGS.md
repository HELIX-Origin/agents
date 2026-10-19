# BUGS.md — Agents Ecosystem Bug Tracker & Quirks

> 🐛 **Living Source of Truth**: Active tracking ledger for bugs, quirks, environment limitations, and resolutions for the **Agents Ecosystem** (`projects/agents`).
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (ecosystem direction), [`PLAN.md`](./PLAN.md) (sprint execution), and [`TODO.md`](./TODO.md) (task ledger).
> Historical post-mortems live in [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md).
> Per-project bugs and quirks are tracked exclusively within each repository under `projects/<repo>/BUGS.md`.
> Last updated: 2026-10-19

---

## 📜 Tracking Rules

- **Ecosystem Scope Only**: This document tracks issues, quirks, and toolchain behaviors of the generic AI agents framework, rules, skills, templates, and the headless CLI (`scripts/agents-kb/`). Project-scoped bugs belong strictly in each respective repository (`projects/<repo>/BUGS.md`).
- **100% Active Direction Accuracy**: Reflect the current, active state of the agents ecosystem with zero contradictions.
- **Bare Minimal Ledger**: Resolved bugs are recorded as concise single-line entries here. Detailed root-cause analyses and post-mortems live in [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md).
- **Active Items First**: Active bugs and quirks always precede resolved and closed entries.

---

## 📖 Legend

### 🚦 Status
- ⚠️ **open** — reproducible, needs fixing.
- 🚧 **investigating / fix applied** — repro, root cause, or initial code fix in progress (pending verification).
- 🚫 **wontfix** — accepted platform limitations or deliberate architectural trade-offs.
- ✅ **resolved** — verified and fixed.

### 🚨 Severity
- 🔴 **Critical**: Shell or runner crashes, data loss, environment corruption.
- 🟠 **High**: Significant functional, tooling, or state synchronization breakdown.
- 🟡 **Medium**: Non-breaking fallbacks, CLI argument quirks, plugin incompatibilities.
- 🟢 **Low**: Minor deprecation warnings, non-breaking formatting quirks.

---

## 🚫 Known Quirks & External Limitations (wontfix bucket)

### [Ecosystem] Tooling & Shell Quirks
- 🔧 **[Ecosystem] Compress / DCP Tooling:** The compress tool previously caused issues and was disabled; the `.opencode` dynamic-context-pruning (DCP) plugins were restored 2026-10-18 and `compress` is the sanctioned context-management tool again. If issues reappear, fall back to high-fidelity summaries and the permanent `HANDOFF.md` session-state ledger. Compress summaries must always preserve the handoff file's current state.
- 🖥️ **[Ecosystem] Non-Interactive Shell Policy:** The agent shell has no TTY — pagers/editors (`less`, `vim`, `man`) hang until timeout. Use file read/write tools and non-interactive command flags only.
- 🧪 **[Ecosystem] TypeScript ESM CLI Scripts:** `scripts/agents-kb/*.ts` run on Node with `node --experimental-strip-types` (ESM, `.ts` imports with explicit extension).
- 💬 **[Ecosystem] PowerShell Strips Quotes in Inline `node -e`:** PowerShell mangles quote nesting in `node -e '...'` / `node -e "..."` arguments, silently corrupting inline JavaScript. Never run inline `node -e` — write a CLI module/script file under `scripts/` and execute it instead.
- 🔌 **[Ecosystem] OpenCode V1-Only Plugins Removed (2026-10-18):** `@franlol/opencode-md-table-formatter`, `opencode-agent-skills`, and `opencode-websearch-cited` failed to load since the V2 plugin API (no valid V2 default export: `{ id, effect | setup }`). Removed from `.opencode/opencode.jsonc`; watched for V2-compatible releases under the curation policy in `TODO.md` W.61. Working V2 plugins: `@tarquinen/opencode-dcp`, `@plannotator/opencode`. Plugin load errors are visible in `~/.local/share/opencode/log/opencode.log`. A full OpenCode relaunch is the guaranteed way to make the running server's loaded plugin set match config.

---

## ⚠️ Active & Open Bugs

*(No critical open bugs currently blocking ecosystem operations. All quality gate suites pass: `npm run typecheck`, `npm run test`, `npm run validate` 100% green.)*

---

## ✅ Closed & Resolved Bugs (Bare-Minimal Ledger)

> 📖 **Full Archive Details**: For root-cause investigations, code diffs, and deep technical post-mortems, see [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md).

### [Ecosystem] (workspace root)
- **[Ecosystem] 2026-10-14 — CRLF Line-Ending Churn:** Machine system git config (`core.autocrlf=true`) rewrote line endings. Resolved by adding explicit `.gitattributes` to all repos and setting user-global `core.autocrlf=input`. See [`.github/BUGS-ARCHIVE.md`](./.github/BUGS-ARCHIVE.md#ecosystem--workspace).
- **[Ecosystem] 2026-10-18 — Handoff Limits Not Self-Enforced:** Resolved by a binding self-monitoring scoreboard in `.agents/rules/session-handoff.md` and promotion of `HANDOFF.md` to a permanent, git-tracked, always-current session-state ledger that coexists with DCP compression.
- **[Ecosystem] 2026-10-18 — Self-Monitoring Not Executed:** Agent failed to act on the 100k soft target autonomously. Recorded as a known limitation; proposed remedy is an internal V2-native OpenCode plugin (W.62) that injects the scoreboard at checkpoints and gates work at soft posture.
- **[Ecosystem] 2026-10-19 — Scaffold Templates Hardcoded Domain/Organization:** `kb-scaffold` emitted hardcoded comparison and portal links. Resolved by making docs/wiki/portal/repo/org links opt-in (`--docs-url`, `--wiki-url`, `--portal-url`, etc.), adding `{{#KEY}}`/`{{^KEY}}` conditional rendering with brace-order fix, and asserting domain-neutrality across templates.
