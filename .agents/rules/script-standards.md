# Rule: Project Scripts & Command Hierarchy Standards

> Authoritative rules for project automation scripts and package commands across all HELIX-Origin repositories.
> Read before creating, updating, or running project scripts.

---

## 1. Absolute Invariants

1. **Tauri v2 Desktop Applications — Native `.mjs` Scripts**:
   - All scripting and task automation in Tauri v2 applications (`projects/Steam-Vault`, `projects/NH-Reader`, etc.) **must be implemented in native ES Modules (`.mjs`)** run via Node.js.
   - Do not use ad-hoc shell scripts, batch files, or un-modular `.js` files for internal project orchestration.
   - Scripts live under `scripts/` with a modular architecture:
     - `scripts/lib/runner.mjs`: Shared runner utility providing formatted logging (`[title]`, `[error]`, `[timing]`), cross-platform child process execution (`spawn`), exit code propagation, and signal handling (`SIGINT`, `SIGTERM`).
     - Modular domain runners: `scripts/build.mjs`, `scripts/dev.mjs`, `scripts/test.mjs`, `scripts/run.mjs`, `scripts/sign.mjs`, `scripts/generate-winget-manifest.mjs`.

2. **Non-Tauri Applications — Modular TypeScript ESM Scripts**:
   - Non-Tauri applications and tools that use automation scripts (e.g., crawlers, catalogues, backend tools like `projects/Steam-Vault-Catalogue`) **must be implemented in TypeScript ESM (`.ts`)**.
   - Executed using modern TypeScript ESM loaders (`tsx`, `ts-node/esm`, or native Node 22+ `--experimental-strip-types`).
   - Must mirror the exact same modular runner architecture with shared utilities (`scripts/lib/runner.ts` or `scripts/modules/*`) and unified domain handlers.
   - **Reusable Modular Extension Invariant**: Whenever a new script or utility is needed (such as migrations, schema transformers, data cleaners, or formatters), **always build it as a reusable extension module** (e.g., under `scripts/modules/`) rather than a temporary disposable script. Expose it through the unified management CLI (`scripts/manage-catalogue.ts`) via sub-options and register canonical `main:sub:option` commands in `package.json` (`catalogue:migrate:providers`, `catalogue:migrate:dry`). This guarantees proper migration and data maintenance support whenever changes occur.

3. **Universal Command Standard — `main:sub:option`**:
   - All `package.json` scripts across ALL projects must strictly adhere to the hierarchical **`main:sub:option`** format (or `main:sub` where no sub-option exists).
   - This prevents chaotic and conflicting script names across repos.
   - Examples of canonical commands:
     - Tauri builds: `tauri:build:release`, `tauri:build:debug`, `tauri:build:raw`
     - Tauri development: `tauri:dev`, `tauri:dev:watch`, `tauri:dev:raw`
     - Testing suites: `test:rust`, `test:frontend`, `test:i18n`, `test:all`
     - Type checks & linters: `check:types`, `check:watch`, `check:all`
     - Signing & release: `sign:local`, `sign:windows`, `sign:macos`, `sign:linux`
     - Package repositories: `winget:manifest:generate`, `winget:manifest:verify`
     - Crawlers & data: `crawler:run:all`, `crawler:sync:steam`, `db:migrate:up`, `db:seed:full`
   - Top-level single-word aliases (e.g. `dev`, `build`, `test`, `check`, `preview`) are permitted solely as ergonomic forwarders to their canonical `main:sub:option` counterparts for compatibility with CI and Vite tooling.

4. **Ecosystem-Wide Reusable Modular Extension Invariant**:
   - Across **ALL repositories** in the organization (both Tauri `.mjs` suites and non-Tauri TypeScript `.ts` suites), whenever a new script, tool, or utility is needed (such as migrations, schema transformers, asset compilers, formatters, diagnostic helpers, or data cleaners), **never create disposable, one-off, or throwaway scripts**.
   - **Always build them as reusable modular extensions** integrated directly into the repository's modular script architecture (e.g. `scripts/modules/*` or `scripts/lib/*`).
   - Wire them into the repository's central CLI or runner with sub-options and expose them as standard `main:sub:option` commands in `package.json`.
   - Rationale: Any task worth writing a script for is almost certain to be needed again during future updates, migrations, or data audits. Making them permanent, reusable modular commands preserves organizational capabilities and prevents technical debt.

5. **Cross-Platform Path & Environment Invariant**:
   - Scripts must never hardcode OS-specific path separators (`\\` or `/`). Always use `node:path` (`path.join`, `path.resolve`) or forward slashes.
   - Always quote arguments passed to child processes.
   - Never write CRLF line endings; enforce LF (`\n`) for all generated script outputs and manifests.

---

## 2. Directory Layout Convention

### Tauri v2 Applications (`.mjs`)
```text
<project-root>/
├── scripts/
│   ├── lib/
│   │   └── runner.mjs                <- Shared CLI runner, process spawner & logger
│   ├── dev.mjs                       <- Vite + Tauri dev orchestrator
│   ├── build.mjs                     <- Tauri build orchestrator with per-platform config
│   ├── test.mjs                      <- Unified test runner (rust, frontend, i18n)
│   ├── run.mjs                       <- Development log & run utility
│   ├── sign.mjs                      <- Local & CI code signing router
│   ├── generate-winget-manifest.mjs  <- Automated WinGet manifest generator
│   └── setup-signing-secrets.ps1     <- Optional local-to-GitHub secret export helper
├── src-tauri/
│   ├── tauri.conf.json               <- Base shared Tauri v2 configuration
│   ├── tauri.windows.conf.json       <- Windows-specific config (NSIS, WiX, icons)
│   ├── tauri.macos.conf.json         <- macOS-specific config (DMG, bundles)
│   └── tauri.linux.conf.json         <- Linux-specific config (deb, AppImage)
└── package.json                      <- Hierarchical main:sub:option scripts
```

### Non-Tauri Applications (`.ts` ESM)
```text
<project-root>/
├── scripts/
│   ├── lib/
│   │   └── runner.ts                 <- Shared TypeScript runner & spawner
│   ├── crawler.ts                    <- Domain task runners (TypeScript ESM)
│   ├── build.ts                      <- Build orchestration
│   └── test.ts                       <- Test suites
├── tsconfig.json                     <- Configured for NodeNext / Bundler ESM
└── package.json                      <- Hierarchical main:sub:option scripts
```

---

## 3. Package.json Command Matrix

| Canonical Format | Purpose | Example |
| :--- | :--- | :--- |
| `tauri:dev` | Start desktop dev server | `node scripts/dev.mjs` |
| `tauri:build:release` | Build production release package | `node scripts/build.mjs release` |
| `tauri:build:debug` | Build unoptimized debug package | `node scripts/build.mjs debug` |
| `test:rust` | Run Cargo tests | `node scripts/test.mjs rust` |
| `test:frontend` | Run frontend unit & component tests | `node scripts/test.mjs frontend` |
| `test:i18n` | Verify translation key completeness | `node scripts/test.mjs i18n` |
| `test:all` | Run all test suites in sequence | `node scripts/test.mjs all` |
| `check:types` | Run Svelte & TypeScript check | `svelte-kit sync && svelte-check` |
| `sign:local` | Manually sign local build binaries | `node scripts/sign.mjs` |
| `winget:manifest` | Generate WinGet package manifests | `node scripts/generate-winget-manifest.mjs` |
