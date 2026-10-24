---
name: TypeScript ESM Scripting
description: TypeScript ESM scripting patterns for Node.js tooling across the org — tsx/ts-node, built-in SQLite, top-level await, path resolution, CLI guards, and the main:sub:option command hierarchy.
applies_to: [nh-reader, windows-game-explorer, theme-toolkit, depressurizer]
tags: [typescript, esm, nodejs, scripts, cli]
---

# Skill: TypeScript ESM Scripting

> Patterns for the org's TypeScript tooling layer — scripts that build, migrate, seed, or automate tasks for Tauri v2 projects.

---

## 1. Module System

All scripts use **ESM** (`"type": "module"` in `package.json`). Never use CommonJS (`require`, `module.exports`) in new scripts.

```jsonc
// package.json (script entry)
{
  "type": "module",
  "scripts": {
    "db:migrate": "tsx scripts/db/migrate.ts",
    "db:seed":    "tsx scripts/db/seed.ts"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 2. Node.js Built-in Imports

Always use the `node:` prefix for built-in modules — it disambiguates from npm packages and is required for ESM:

```ts
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync }       from 'node:fs';
import path, { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync, spawn }             from 'node:child_process';
import { createHash }                  from 'node:crypto';
import os                              from 'node:os';
```

---

## 3. Path Resolution in ESM

`__dirname` and `__filename` do not exist in ESM. Use `import.meta.url`:

```ts
import { fileURLToPath } from 'node:url';
import { dirname, join }  from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Resolve paths relative to the script's own location
const dataDir = join(__dirname, '..', 'data');
const schema  = join(__dirname, 'schema.sql');
```

---

## 4. CLI Entry Guard

Prevent a module from executing its `main()` when it is imported as a library:

```ts
import { fileURLToPath, pathToFileURL } from 'node:url';

async function main(): Promise<void> {
  // ... script logic
}

// Only run when this file is the direct entry point
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
```

This allows the same file to export utilities for other scripts while running as a standalone CLI.

---

## 5. Top-Level Await

ESM scripts support top-level `await` natively — no need to wrap in an async IIFE:

```ts
// scripts/db/migrate.ts
import { DatabaseSync } from 'node:sqlite';
import { readFile }     from 'node:fs/promises';
import { join }         from 'node:path';

const db = new DatabaseSync('./app.db');
const sql = await readFile(join(import.meta.dirname, 'schema.sql'), 'utf8');
db.exec(sql);
console.log('Migration complete.');
```

> [!NOTE] `import.meta.dirname` is available from Node.js 21.2+. For older targets, use the `fileURLToPath` + `dirname` pattern above.

---

## 6. Node.js Built-in SQLite (`DatabaseSync`)

Available from **Node.js 22.5+** (experimental flag removed in 22.13+). Prefer this over third-party SQLite wrappers for scripts:

```ts
import { DatabaseSync } from 'node:sqlite';

// Open (creates if missing)
const db = new DatabaseSync('path/to/app.db');

// Enable WAL for scripts that run alongside the app
db.exec('PRAGMA journal_mode=WAL;');
db.exec('PRAGMA foreign_keys=ON;');

// Prepared statements (synchronous API)
const insert = db.prepare(
  'INSERT OR REPLACE INTO games (id, title, cover_url) VALUES (?, ?, ?)'
);
insert.run(1, 'Portal 2', 'https://example.com/cover.jpg');

const all = db.prepare('SELECT * FROM games WHERE platform = ?');
const rows = all.all('steam');

// Close when done
db.close();
```

> [!IMPORTANT] `DatabaseSync` is synchronous — suitable for CLI scripts. Do **not** use it in Tauri's async Rust backend; see `sqlite-in-app.md` for `rusqlite`/`r2d2`.

---

## 7. `tsx` vs `ts-node`

| Tool | Use Case |
|---|---|
| `tsx` | Preferred — zero-config, ESM-native, fast (esbuild-backed) |
| `ts-node` | Legacy; requires `--esm` flag for ESM and is slower |

```bash
# Run directly
npx tsx scripts/migrate.ts

# Pass arguments
npx tsx scripts/db/seed.ts -- --env=dev

# Watch mode (for development scripts)
npx tsx watch scripts/watch-assets.ts
```

---

## 8. `main:sub:option` Command Hierarchy

Per `script-standards.md`, org scripts follow a colon-delimited hierarchy:

```
<domain>:<action>[:<option>]
```

Examples:
```
db:migrate              # run all pending migrations
db:migrate:rollback     # roll back the last migration
db:seed                 # seed development data
assets:optimize         # compress all assets
assets:optimize:icons   # compress only icons
release:build           # full release build
release:build:windows   # windows-only build
```

Map these to `package.json` scripts:
```jsonc
{
  "scripts": {
    "db:migrate":           "tsx scripts/db/migrate.ts",
    "db:migrate:rollback":  "tsx scripts/db/migrate.ts --rollback",
    "db:seed":              "tsx scripts/db/seed.ts",
    "assets:optimize":      "tsx scripts/assets/optimize.ts",
    "release:build":        "tsx scripts/release/build.ts"
  }
}
```

Inside the script, parse `process.argv` for sub-options:
```ts
const args = process.argv.slice(2);
const rollback = args.includes('--rollback');
```

---

## 9. TypeScript Configuration for Scripts

```jsonc
// tsconfig.scripts.json (separate from SvelteKit's tsconfig)
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "outDir": "dist/scripts",
    "rootDir": "scripts",
    "noEmit": true   // tsx transpiles at runtime; emit only for type-check
  },
  "include": ["scripts/**/*.ts"]
}
```

Type-check scripts without emitting:
```bash
tsc --project tsconfig.scripts.json --noEmit
# Must exit 0 — zero-warning invariant applies to TS too
```

---

## 10. Error Handling Pattern

```ts
async function main(): Promise<void> {
  // Use structured try/catch; never swallow errors silently
  try {
    await runMigrations();
  } catch (err) {
    console.error('[migrate] Failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
```

- Always `process.exit(1)` on unrecoverable errors so CI/shell callers detect failures.
- Log with a `[script-name]` prefix for clarity in CI output.
