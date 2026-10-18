# {PROJECT_NAME}

Node.js TypeScript CLI (ESM, strict).

## Project-local agents

This repository ships its own self-contained agents ecosystem (`AGENTS.md`, `.agents/`) and
tracking files (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`). Keep them accurate as work progresses.

## Build & test

- `npm run build` / `npm run typecheck`
- `npm test`
- Run: `node dist/index.js` (or `npx`)

## Conventions

- ESM (`"type": "module"`), strict tsconfig, Node 22+.
- No inline `node -e`; write module files.
- See `.agents/rules/local-conventions.md`.

## Invariants

{LICENSE} license, SemVer releases, zero-warning builds, community-health files.
See `CONTRIBUTING.md` for the full contributor guidelines.