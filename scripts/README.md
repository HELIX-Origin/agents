# scripts/ — Workspace Headless CLI

Reusable headless CLI extensions for the agents ecosystem. **No temporary scripts** — every
tool here is a permanent, modular extension (see `.agents/rules/script-standards.md`).

This is a standard Node.js project: dependencies install with npm, TypeScript is typechecked
strictly, and `node_modules/` stays gitignored.

## Layout

```
scripts/
├── README.md            <- this file (tracked)
├── package.json         <- standard Node.js project manifest (private, ESM, npm scripts, engines)
├── tsconfig.json        <- strict ESM typecheck config (npm run typecheck)
├── node_modules/        <- npm-installed dev dependencies (gitignored)
└── agents-kb/           <- agents knowledge-base CLI (TypeScript ESM, Node 22+ native TS)
    ├── kb-config.ts     <- shared paths + lazy kbPath() (AGENTS_KB_PATH env override)
    ├── kb-db.ts         <- small shared helpers (now, ensureDir, sha256, orgDefault)
    ├── kb-log.ts        <- structured per-run logger (createLogger -> logs/<cmd>-<slug>.log)
    ├── kb-body.ts       <- runtime unit loader (loadUnits: test suite + content bodies)
    ├── kb-read.ts       <- read-only KB query API with filesystem fallback
    ├── kb-scaffold.ts   <- per-project agents ecosystem scaffolder (dry-run, never-clobber)
    ├── kb-write.ts      <- controlled write path + invariant validation + CLI (validate)
    ├── kb-sync.ts       <- filesystem -> DB sync (upsert + soft-delete, idempotent)
    ├── kb-export.ts     <- DB -> deterministic metadata report (kb-export.md)
    ├── migrate.ts       <- forward-only migration runner (exported runMigrations)
    ├── setup.ts         <- idempotent initial setup (data/ + logs/, migrations, org seed)
    ├── test.ts          <- built-in reusable test suite runner
    ├── tests/           <- permanent test suite (*.test.ts — never throw-away)
    ├── bodies/          <- pluggable throw-away content units (text/JSON/MD)
    │   └── scaffold/    <- per-project-type template suites (future)
    ├── data/            <- LOCAL-ONLY SQLite DBs (gitignored; tracked README only)
    └── logs/            <- per-run CLI logs (gitignored; tracked README only)
```

## Commands

Run from the workspace root (`node scripts/agents-kb/<cmd>.ts`) or from `scripts/` via npm
(`npm run <script>`):

| Command | npm script | Purpose |
| :--- | :--- | :--- |
| `node scripts/agents-kb/setup.ts` | `npm run setup` | Post-clone bootstrap: `data/` + `logs/`, migrations, org seed |
| `node scripts/agents-kb/migrate.ts` | `npm run migrate` | Apply pending migrations (forward-only, idempotent) |
| `node scripts/agents-kb/kb-scaffold.ts --list` | (CLI) | List available scaffold types |
| `node scripts/agents-kb/kb-scaffold.ts --type <t> --path <p> [--dry-run]` | (CLI) | Scaffold a project-local agents ecosystem (never clobbers) |
| `node scripts/agents-kb/kb-sync.ts` | `npm run sync` | Sync filesystem metadata into the local KB (upsert + soft-delete orphans) |
| `node scripts/agents-kb/kb-export.ts` | `npm run export` | Export KB metadata to a deterministic report (`kb-export.md`) |
| `node scripts/agents-kb/test.ts` | `npm test` | Run the built-in reusable test suite (`tests/*.test.ts`) |
| `npx tsc --noEmit` (in `scripts/`) | `npm run typecheck` | Strict ESM typecheck of all CLI modules |

## Extension mechanism

- **Body files** (pluggable content): throw-away text/JSON/MD units under `bodies/` — e.g. a
  scaffold suite into `bodies/scaffold/<type>/`, or string payloads consumed by update
  commands — so content is never hard-coded in TS modules.
- **First-class modules** (permanent code): add a `.ts` ESM module under `agents-kb/` and
  import it from the CLI (e.g. `kb-read.ts`, exporters).
- **Test suite** (permanent code): add a `tests/*.test.ts` file exporting a `run` function —
  the runner (`test.ts`) discovers it automatically. Tests are never body files.

## Environment

- `AGENTS_KB_PATH` — override the knowledge DB path (used by tests for throwaway DBs).
- `AGENTS_KB_ORG` / `AGENTS_KB_ORG_SLUG` — override the organization slug (fork customization).
- `AGENTS_KB_EXPORT_PATH` — override the export report path (used by tests).
- `AGENTS_KB_SECURE_PATH` — override the secure DB path.
- Requires Node.js 22.18+ (native TypeScript type stripping); run from the workspace root.
