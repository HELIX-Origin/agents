# data/ — Local-Only SQLite Databases

This folder holds the **local-only** SQLite databases of the agents ecosystem
(`knowledge.db`, `secure.db`, and their WAL sidecars). It lives next to the headless CLI
(`scripts/agents-kb/`) that creates and manages the databases, mirroring `../logs/`.

## Lifecycle (locked)

- **Created by initial setup** after cloning the agents ecosystem:
  `node scripts/agents-kb/setup.ts` (idempotent — creates this folder, runs migrations,
  seeds the organization row).
- **Never tracked, never committed, never pushed.** Everything in this folder except this
  `README.md` is gitignored, so clones/forks always start with a clean database containing
  only the projects/repositories actually present in that local workspace. Per-repo
  information stays solely per repo, in the local workspace that recorded it.
- The tracked, reviewable source of truth is the **schema**: `.agents/migrations/*.sql`.

## Files

| File | Purpose |
| --- | --- |
| `knowledge.db` | Metadata **helper** DB (organizations, artifact path/hash registry, metadata entries, schema_meta) — never stores rules, agents, skills, or templates content; see `.agents/skills/agents-db-design.md` |
| `secure.db` | Private/sensitive local data (replaces `.env` patterns) — must never be tracked |
| `*.db-wal`, `*.db-shm` | SQLite WAL journal sidecars (transient) |

Do not edit these files directly — use the headless CLI under `scripts/agents-kb/`.
