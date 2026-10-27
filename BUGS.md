# BUGS.md — Agents Ecosystem Bug Tracker & Quirks

> 🐛 **Living Source of Truth**: Active tracking ledger for bugs, quirks, environment limitations, and resolutions for the **Agents Ecosystem** (`projects/agents`).
>
> Pair with [`ROADMAP.md`](./ROADMAP.md) (ecosystem direction), [`PLAN.md`](./PLAN.md) (sprint execution), and [`TODO.md`](./TODO.md) (task ledger).
> Historical release and change notes live in [`CHANGELOG.md`](./CHANGELOG.md).
> Per-project bugs and quirks are tracked exclusively within each repository under `projects/<repo>/BUGS.md`.
> Last updated: 2026-10-20

---

## 📜 Tracking Rules

- **Ecosystem Scope Only**: This document tracks issues, quirks, and toolchain behaviors of the generic AI agents framework, rules, skills, templates, and the headless CLI (`scripts/agents-kb/`). Project-scoped bugs belong strictly in each respective repository (`projects/<repo>/BUGS.md`).
- **100% Active Direction Accuracy**: Reflect the current, active state of the agents ecosystem with zero contradictions.
- **Bare Minimal Ledger**: Resolved bugs are recorded as concise single-line entries here, with changes documented in [`CHANGELOG.md`](./CHANGELOG.md).
- **Active Items First**: Active bugs and quirks always precede resolved and closed entries.

---

## 🧭 Project Tracking Index

> Entry point to per-project **BUGS** tracking: one line per project (short title + link). Detail lives only in each repository. Regenerate with `npm --prefix scripts run index`; do not edit between the markers.

<!-- project-index:start -->
- **[nh-reader]** — [No open bugs](./projects/nh-reader/BUGS.md) · _Native C++ Windows desktop reader_
- **[windows-game-explorer]** — [No open bugs](./projects/windows-game-explorer/BUGS.md) · _Native C++ Windows Game Explorer (File Explorer shell extension & game library)_
- **[theme-toolkit]** — [1 open — 2026-10-19 — : {{BUG_TITLE}}](./projects/theme-toolkit/BUGS.md) · _Native C++ Windows theme studio & applicator for Windows 2000 to 11+ (Theme Studio)_
- **[depressurizer]** — [No open bugs](./projects/depressurizer/BUGS.md) · _Native C++ Windows Steam categorizer & AutoCat manager (revival fork)_
- **[windhawk-themes]** — [1 open — 2026-10-19 — : {{BUG_TITLE}}](./projects/windhawk-themes/BUGS.md) · _Windhawk styler mod themes_
- **[ffxiv-config]** — [No open bugs](./projects/ffxiv-config/BUGS.md) · _FFXIV HUD, hotbar and macro configuration_
- **[ffxiv-dat-toolkit]** — [BUGS.md](./projects/ffxiv-dat-toolkit/BUGS.md) _(repository not cloned locally)_ · _FFXIV DAT toolkit (decode, transform and repack character/config .DAT files)_
<!-- project-index:end -->

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
- 🖥️ **[Ecosystem] Non-Interactive Shell Policy:** The agent shell has no TTY — pagers/editors (`less`, `vim`, `man`) hang until timeout. Use file read/write tools and non-interactive command flags only.
- 🧪 **[Ecosystem] TypeScript ESM CLI Scripts:** `scripts/agents-kb/*.ts` run on Node with `node --experimental-strip-types` (ESM, `.ts` imports with explicit extension).
- 💬 **[Ecosystem] PowerShell Strips Quotes in Inline `node -e`:** PowerShell mangles quote nesting in `node -e '...'` / `node -e "..."` arguments, silently corrupting inline JavaScript. Never run inline `node -e` — write a CLI module/script file under `scripts/` and execute it instead.

### [ffxiv-dat-toolkit] (projects/ffxiv-dat-toolkit) Domain Constraints
- 🧨 **[ffxiv-dat-toolkit] Client verification is brittle by design:** a block rewritten without recalculated length offsets and trailing checksums causes character-selection failure or runtime memory errors. Accepted as a hard constraint — byte-parity round-trip CI gates every write path, and staged writes are never swapped in unverified.
- 🔄 **[ffxiv-dat-toolkit] Expansion-era schema volatility:** layout files change shape across major updates (for example the 8.x Command Panel array growth). Schema mapping must stay data-driven so a patch cannot strand the pipelines.
- 🔤 **[ffxiv-dat-toolkit] Multibyte payloads:** non-ASCII macro and layout strings break if processed as byte strings. All string handling is explicit UTF-8 with length validation, never implicit locale conversion.

---

## ⚠️ Active & Open Bugs

### 2026-10-20 — [Ecosystem] (projects/agents): Compression session markers persisted into handoff block new-session continuation
- **Project Identifier:** `[Ecosystem]`
- **Repository Path:** `projects/agents`
- **Severity**: 🟠 High (state synchronization breakdown — new sessions cannot resume)
- **Status**: ⚠️ open
- **Scope / Affected Component**: `compress` tool (context management), `HANDOFF.md` session-state ledger, `.agents/rules/session-handoff.md`
- **Reported Issue**: A fresh session could not continue prior work — the handoff content carried **session-locked compression markers** from the previous session (compressed-block IDs and raw message IDs). Those identifiers are scoped to the conversation that produced them and do not exist in a new session, so the new session repeatedly tried to resolve them and failed.
- **Root Cause**: The `compress` tool's boundary IDs (compressed-block placeholders and raw message IDs) are session-scoped tokens with meaning only inside their originating conversation. Any handoff, ledger, or checkpoint text that records or references them becomes permanently unresolvable after a context reset or in a new session.
- **Proposed / Applied Fix**: (1) Binding rule in `.agents/rules/session-handoff.md` — handoff and ledger content must be **marker-free**: translate state into durable references only (file paths, issue numbers, section headings), never conversation-scoped IDs. (2) Pre-publish validation: grep handoff/ledger output for the session-marker pattern before refreshing `HANDOFF.md`. (3) If a new session encounters stale markers, ignore them and resume from the ledgers (ledgers win).
- **Verification**: workspace-wide grep for session-marker patterns in `*.md` returns zero matches (verified 2026-10-20 after sanitizing the theme handoff).

---

## ✅ Closed & Resolved Bugs (Bare-Minimal Ledger)

### [Ecosystem] (workspace root)
- **[Ecosystem] 2026-10-14 — CRLF Line-Ending Churn:** Machine system git config (`core.autocrlf=true`) rewrote line endings. Resolved by adding explicit `.gitattributes` to all repos and setting user-global `core.autocrlf=input`.
- **[Ecosystem] 2026-10-18 — Handoff Limits Not Self-Enforced:** Resolved by a binding self-monitoring scoreboard in `.agents/rules/session-handoff.md` and promotion of `HANDOFF.md` to a permanent, git-tracked, always-current session-state ledger.
- **[Ecosystem] 2026-10-18 — Self-Monitoring Not Executed:** Agent failed to act on the 100k soft target autonomously. Recorded as a known limitation; resolved by strict checkpoint handoff protocols.
- **[Ecosystem] 2026-10-19 — Scaffold Templates Hardcoded Domain/Organization:** `kb-scaffold` emitted hardcoded comparison and portal links. Resolved by making docs/wiki/portal/repo/org links opt-in (`--docs-url`, `--wiki-url`, `--portal-url`, etc.), adding `{{#KEY}}`/`{{^KEY}}` conditional rendering with brace-order fix, and asserting domain-neutrality across templates.
- **[windows-game-explorer] 2026-10-24 — Catalog Duplication & Storefront Launcher Helpers in Games View:** Resolved via drive root normalization (`X:\`), launcher helper binary blacklisting (`battlenet.overlay.runtime.exe`, `agent.exe`), case-insensitive launcher folder exclusions across storefront scanners, and automatic database synchronization/pruning in `StorefrontScanner::ScanAll()` with 11/11 unit tests passing.
- **[windows-game-explorer] 2026-10-24 — Web Search Application, In-App Target Override, NSFW Auto-Enrichment Mismatch & Windows 11 Tabbed Explorer Navigation:** Resolved by fixing Bing query delimiter parsing (`&quot;`/`"` and `&amp;` unescaping), enforcing `forceOverwrite = true` on downloads, mutating `GameItem` fields directly, persisting to `Database::UpsertGame` and `StorefrontScanner::SavePerGameMetadata`, broadcasting view refresh, adding mature content cookies and adult filters for SteamGridDB/Steam Store, preserving native itch.io covers, stripping legacy ribbon `FolderTypeID`, restoring modern tabbed `shell:Games` and Start Menu `Games.lnk`, and adding `--register`/`--unregister` CLI flags to `GameExplorerConfig.exe` with 20/20 unit tests passing.
- **[windows-game-explorer] 2026-10-24 — Itch.io Storefront Artwork & Obscure/Indie/Adult Metadata Accuracy (BUG-10, BUG-11, BUG-12, BUG-13):** Resolved by adding dedicated VNDB Kana API provider (`api.vndb.org/kana/vn`), authentic itch.io storefront scraping (`EnrichFromItchStorePage`), strict title candidate verification (`AreTitlesMatching`) in SteamGridDB/IGDB, loose aspect ratio validation in `ImageValidator` (0.25f–2.50f covers, 0.80f–4.50f heroes), complete cache reset and repopulation engine (`Reset Cache` button / `--reset-cache` CLI), and module address-anchored companion launching in `LibraryViewHost.cpp` with 21/21 unit tests passing under `/W4 /WX`. All owned games backlog dropped per user directive.
