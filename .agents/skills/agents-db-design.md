# Skill: Agents Ecosystem Knowledge Base Design

**Status:** REFERENCE — EXPERIMENTAL
**Scope:** Agents ecosystem (`.agents/`, workspace root tracking docs) — database-backed knowledge store design.
**Applies to:** `scripts/agents-kb/data/knowledge.db`, `scripts/agents-kb/data/secure.db`, `.agents/migrations/`, export/import scripts.

---

## Purpose

The SQLite databases are **helpers that store only metadata** used by agents, rules, skills,
templates, etc. (e.g., necessary URLs, cross-references, tags, scoping, labels, defaults,
path/hash registries) to reduce clutter in canonical files. They **never store rules, agents,
skills, or templates themselves** — putting that content in the DB would break the agent tools'
ability to see those at runtime, since the tools load them from the filesystem. The filesystem
remains the sole home of rules/skills/agents/templates content and the canonical source the DB
indexes; the DB works **with** them to provide structured lookups. It must remain
**fork-friendly** (usable by anyone who forks the agents repo for their own organization/group),
**org/repo-agnostic**, and **local-only**:
the databases live in `scripts/agents-kb/data/` — next to the headless CLI that manages them,
like the logs directory — and are **created by initial setup after
cloning** the agents ecosystem — they are gitignored, never tracked, and never pushed, so
clones/forks always start with a clean DB containing only the projects/repositories actually
present locally.

**Local-only database lifecycle (locked directive, 2026-10-18):**
- `scripts/agents-kb/data/knowledge.db` and `scripts/agents-kb/data/secure.db` are **not** part
  of the repository content —
  both are gitignored (with their WAL sidecars) and must never be committed or pushed.
- They are **created as part of the initial setup** after cloning the agents ecosystem
  (`node scripts/agents-kb/setup.ts` — idempotent: creates directories, runs migrations, seeds
  the organization row).
- Per-repo tracking is therefore **solely per repo, locally**: the DB records only the
  repositories present in that workspace, and repo-scoped information never reaches other
  people's clones or forks of the agents ecosystem repo.
- The binaries are regenerated per clone by setup; the **schema** (`.agents/migrations/*.sql`)
  remains the tracked, reviewable source of truth.

---

## Design principles

1. **Markdown remains canonical (human-editable)**. The filesystem (`.agents/templates/*`, and any
   other files chosen to remain there) is the source of truth for human authors and PR reviews. The
   SQLite databases are a **derived, read-optimized metadata index** — never a content store —
   for the structured information that benefits from querying (paths, hashes, tags, cross-refs,
   defaults). Rules, agents, skills, and templates remain direct filesystem files, always;
   their content is never migrated into the DB.
2. **Fork-friendly & universal**. Support arbitrary `organization_slug` (default `HELIX-Origin`) and
   per-repo/project scoping so forks can adapt to their own orgs/groups without modifying core
   schemas.
3. **Git-friendly diffs**. Never rely on opaque binary-only edits as the primary workflow. All
   write paths must be able to regenerate Markdown and produce reviewable diffs. Treat DB changes as
   build artifacts of canonical sources (or require export-after-write).
4. **Read-first, controlled writes**. If the DB contains cached entries for a canonical artifact,
   agents may read from the DB when present; otherwise they fall back to filesystem. Writes to DB
   happen only via a controlled, invariant-validating pipeline (never ad-hoc). The primary editing
   surface remains the canonical Markdown files.
5. **Ecosystem isolation & local-only DBs**. The DB lives only at `scripts/agents-kb/data/knowledge.db` in the
   agents workspace root (never inside project repositories). Both `knowledge.db` and
   `secure.db` are **local-only: created by initial setup after cloning, gitignored, never
   tracked or pushed** — so clones/forks start clean and per-repo data stays in the local
   workspace that recorded it. The DB contains only helper **metadata** used by agents, rules,
   skills, templates, etc. (registries, cross-refs, defaults) — never their content. Nothing
   from it is referenced or emitted into
   project repositories. Rules, agents, skills, and templates themselves are **never stored in
   the DB under any circumstances** — only metadata *about* them (path, hash, tags) — because
   agent tools must see that content on the filesystem at runtime. The separate, private DB
   (`scripts/agents-kb/data/secure.db`) may be used for sensitive data (replacing .env patterns) and must
   never be tracked.
6. **Modular, extensive CLI tooling**. A `scripts/` directory houses a modular CLI suite for
   managing the knowledge base (export, import, sync, validate, migrate, query). The CLI is the
   authoritative interface for controlled writes and for maintaining deterministic round-trips
   between filesystem Markdown and the SQLite DB.
7. **Deterministic & merge-safe**. Exports must be deterministic (stable IDs, ordering, formatting) so
   round-trips don't create noise.
8. **Fail-safe fallback**. If `knowledge.db` is missing, unreadable, or schema-mismatched, the system
   falls back to reading `.agents/*` files with no behavior change.
9. **Schema versioned & migratable**. Track `schema_version` with forward-only migrations in
   `.agents/migrations/`.
9. **No secrets or paths**. The DB must never store credentials, tokens, personal machine paths, or
   any project code.

---

## Core entities

All tables include `org_slug` (TEXT NOT NULL, default `'HELIX-Origin'`) to support universal
multi-org usage. Soft deletion via `deleted_at` (INTEGER, Unix ms) to preserve history if needed.

### `organizations`
```sql
CREATE TABLE organizations (
  org_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL UNIQUE,        -- e.g. "HELIX-Origin", "acme-corp"
  display_name TEXT NOT NULL,
  homepage_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### `artifacts` (metadata registry — one row per filesystem file)
A **metadata registry** row *about* an ecosystem artifact (rule/skill/agent/template/document) —
never its content. Single table to allow relations/tags across types. Content stays on the
filesystem; the row stores the canonical path, hash, and descriptive metadata (matches the
delivered `v002__metadata_only.sql` schema).

```sql
CREATE TABLE artifacts (
  artifact_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL REFERENCES organizations(org_slug) ON UPDATE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN ('rule','skill','agent','template','document','fragment')),
  key TEXT NOT NULL,                    -- stable logical key (e.g. "contributing-template")
  path_rel TEXT NOT NULL,               -- canonical fs path relative to workspace root
  title TEXT,
  status TEXT,
  scope TEXT,
  applies_to TEXT,                      -- JSON array
  tags TEXT,                            -- JSON array
  content_hash TEXT NOT NULL,           -- SHA-256 of the canonical filesystem file (change detection)
  source TEXT NOT NULL CHECK(source IN ('fs','db','import')),
  priority INTEGER DEFAULT 0,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(org_slug, kind, key),
  UNIQUE(org_slug, path_rel)
);
```

Notes:
- **No content columns** (no `content_md`, `frontmatter`, or file bodies) — the DB must never
  hold rules/agents/skills/templates content.
- `path_rel` preserves the existing filesystem layout (critical for fallback parity).
- `content_hash` enables cheap change detection during sync/export.
- `applies_to`/`tags` as JSON for flexible filtering without extra join tables (small N).

### `artifact_references` (relations)
Cross-links between artifacts (e.g., rule references a template/skill).

```sql
CREATE TABLE artifact_references (
  ref_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL,
  from_artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  to_artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  rel_type TEXT NOT NULL,              -- "references","extends","see_also","implements","uses_template"
  created_at INTEGER NOT NULL,
  UNIQUE(from_artifact_id, to_artifact_id, rel_type)
);
```

### `artifact_aliases`
Alternative keys (e.g., old filename, slug variants) for stable lookups.

```sql
CREATE TABLE artifact_aliases (
  alias_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL,
  artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  alias_key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(org_slug, alias_key)
);
```

### `metadata_entries` (generic key/value metadata)
Attached to a registered artifact; holds the actual helper metadata (URLs, defaults,
cross-refs, scoping) that keeps canonical Markdown files uncluttered. Values are
JSON-encoded; this table **never** stores rules/agents/skills/templates content.

```sql
CREATE TABLE metadata_entries (
  entry_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL REFERENCES organizations(org_slug) ON UPDATE CASCADE,
  artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  meta_key TEXT NOT NULL,
  meta_value TEXT NOT NULL,             -- JSON-encoded value
  value_type TEXT NOT NULL CHECK(value_type IN ('string','number','boolean','url','array','object')),
  source TEXT NOT NULL CHECK(source IN ('fs','db','import')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(org_slug, artifact_id, meta_key)
);
```

### `schema_meta`
Schema versioning and metadata.

```sql
CREATE TABLE schema_meta (
  meta_key TEXT PRIMARY KEY,
  meta_value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
INSERT INTO schema_meta(meta_key,meta_value,updated_at) VALUES
  ('schema_version','2.0.0', <now>),
  ('created_by','agents-ecosystem'),
  ('org_default','HELIX-Origin');
```

---

## Indexes

```sql
CREATE INDEX idx_artifacts_org_kind ON artifacts(org_slug, kind);
CREATE INDEX idx_artifacts_path ON artifacts(org_slug, path_rel);
CREATE INDEX idx_artifacts_key ON artifacts(org_slug, key);
CREATE INDEX idx_artifacts_hash ON artifacts(content_hash);
CREATE INDEX idx_artifacts_updated ON artifacts(updated_at);
CREATE INDEX idx_refs_from ON artifact_references(from_artifact_id);
CREATE INDEX idx_refs_to ON artifact_references(to_artifact_id);
CREATE INDEX idx_aliases_org ON artifact_aliases(org_slug, alias_key);
```

---

## Sync & lifecycle

### 1. Filesystem → DB (build/load)
- On startup/read: if `scripts/agents-kb/data/knowledge.db` exists and schema matches, load into memory cache (read-only). Else or if checksum mismatch detected for specific paths, rebuild/reload affected artifact **metadata rows**.
- **Rebuild**: scan `.agents/rules/*.md`, `.agents/skills/*.md`, `.agents/templates/*` (recursively), parse minimal frontmatter if present (status/scope/applies_to/tags), extract title, compute hashes, upsert **metadata-only** rows into `artifacts` (content never copied). Orphaned DB rows with `path_rel` no longer present become soft-deleted (or removed on full rebuild).
- Deterministic ordering by `path_rel`.

### 2. DB → metadata export (report, not regeneration)
- The DB **never regenerates filesystem content** (it holds no content to write back). Exports
  produce deterministic **metadata documents** (Markdown/JSON reports of the registry, tags,
  cross-references) for review, diffing, and sharing — see W.57d (`export-kb-md`).
- Export is **idempotent** and deterministic.
- Run export after any controlled DB write so the metadata report stays reviewable.

### 3. Round-trip safety
- Filesystem is canonical. Any manual edit to `.md` files takes precedence on next sync (updates the DB row's metadata for that path).
- DB writes happen only via the controlled pipeline; ad-hoc DB edits are discouraged. Prefer editing Markdown.

---

## Query API (agent-facing)

Agents should access via a small abstraction layer (internal to agents runtime), not raw SQL in prompts:

| Operation | Behavior |
| --- | --- |
| `kb.get_by_key(kind,key,org_slug?)` | Lookup by logical key (with alias fallback). |
| `kb.get_by_path(path_rel,org_slug?)` | Exact path lookup (critical for fallback parity). |
| `kb.list(kind?, tags?, applies_to?, org_slug?)` | Filtered listing with priority ordering. |
| `kb.find_refs(artifact_id, rel_type?)` | Traverse relations. |
| `kb.search(query, fields?, limit?)` | Simple full-text (title, path, tags) with ranking. |

Fallback: if DB unavailable, read from filesystem using existing glob/read patterns.

**Implementation (W.57c):** `scripts/agents-kb/kb-read.ts` — DB-first (`tryOpenDb()`, never creates the DB; v1 schema → fs) with filesystem merge for parity; DB rows win on `path_rel`. Verified by `scripts/agents-kb/tests/kb-read.test.ts`.

---

## Fork/customization (universal org support)

- Default `org_slug = 'HELIX-Origin'`. Forks set their own `org_default` and can bulk-update `org_slug` on first import (or keep HELIX-Origin as-is if they want to track upstream).
- `applies_to` allows per-repo scoping without hardcoding org names in content.
- Templates remain generic (`{{PROJECT_NAME}}`, `{{REPO_NAME}}`, `{{ORGANIZATION}}`, etc.) so forks can instantiate per their own repos.
- The DB schema contains **no** agents-ecosystem implementation details that assume HELIX-Origin; all org-specific values are data.

---

## Migrations

`.agents/migrations/` contains forward-only SQL migrations, named `vNNN__description.sql` (e.g.,
`v001__init.sql`, `v002__add_fragments.sql`). `schema_meta.schema_version` is bumped on each
migration. On load, apply pending migrations in order (forward-only; no downgrades).

---

## Implementation path (phased, per recommendation)

| Phase | Deliverable | Status |
| --- | --- | --- |
| **W.57a** | Design doc (`.agents/skills/agents-db-design.md`) — this document | ✅ Delivered |
| **W.57b** | Schema prototype + `v001__init.sql` / `v002__metadata_only.sql` migrations | ✅ Delivered 2026-10-18 |
| **W.57c** | Read-only integration (filesystem fallback preserved) — `scripts/agents-kb/kb-read.ts` implements `getByKey`/`getByPath`/`list`/`findRefs`/`search` (DB-first with filesystem merge/fallback, alias fallback, both-direction refs, scored search) | ✅ Delivered 2026-10-18 |
| **W.57d** | Export/import scripts (`scripts/agents-kb/kb-export.ts`, `scripts/agents-kb/kb-sync.ts`) with deterministic round-trips — delivered 2026-10-18 (`kb-sync` fs→DB upsert + soft-delete; `kb-export` DB→deterministic Markdown report; both idempotent) | ✅ |
| **W.57e** | Controlled write path + invariant validation (metadata-only, hash match, path roots, value types) | ✅ Delivered 2026-10-18 |
| **W.57f** | Docs update (`workspace.md`, `AGENTS.md` quick ref) + fork customization guide | ✅ Delivered 2026-10-18 |

---

## Tradeoffs & rationale

- **Filesystem canonical** avoids git merge pain on binary DB and preserves existing review workflows.
  DB is treated as a metadata index, not the edit surface.
- **JSON columns** (`applies_to`, `tags`) keep schema simple and fork-extensible
  without premature normalization.
- **Single `artifacts` table** enables cross-type relations and global metadata search without union queries.
- **content_hash** (hash of the canonical filesystem file) enables incremental sync and cheap invalidation.
- **Explicit `path_rel`** guarantees round-trips and preserves the established `.agents/` layout.
- **Org namespacing** directly addresses "support for universal organization/repo support".

---

## Acceptance criteria

1. Metadata export: DB→document exports are deterministic and reviewable; the DB never writes
   filesystem content (rules/agents/skills/templates content is never stored in the DB at all).
2. Fallback works: with `knowledge.db` deleted/missing/corrupt, behavior is unchanged vs current
   filesystem reads.
3. Fork portability: changing `org_default` + re-importing HELIX-Origin artifacts produces a valid
   DB scoped to the new org; no HELIX-Origin-specific assumptions remain.
4. No ecosystem leakage: DB contents never appear in project repo files or public project-facing
   outputs.
5. Schema is forward-migratable; migrations are idempotent where practical.
6. No secrets/paths stored; validation enforced on controlled writes.
