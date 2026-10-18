-- v002__metadata_only.sql: Convert `artifacts` to a true metadata-only registry and add the
-- generic `metadata_entries` key/value table. Full rule/skill/agent/template content remains
-- on the filesystem (canonical); the DB stores only metadata, hashes, and cross-references.

PRAGMA foreign_keys = ON;

-- 1) Rebuild `artifacts` without content columns (drops content_md, frontmatter, checksum_fs)
--    and widen `kind` to cover rules, skills, and agents alongside templates/documents.
CREATE TABLE artifacts_v2 (
  artifact_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL REFERENCES organizations(org_slug) ON UPDATE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN ('rule','skill','agent','template','document','fragment')),
  key TEXT NOT NULL,
  path_rel TEXT NOT NULL,
  title TEXT,
  status TEXT,
  scope TEXT,
  applies_to TEXT,                       -- JSON array
  tags TEXT,                             -- JSON array
  content_hash TEXT NOT NULL,            -- SHA-256 of the canonical filesystem file
  source TEXT NOT NULL CHECK(source IN ('fs','db','import')),
  priority INTEGER DEFAULT 0,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(org_slug, kind, key),
  UNIQUE(org_slug, path_rel)
);

INSERT INTO artifacts_v2 (
  artifact_id, org_slug, kind, key, path_rel, title, status, scope, applies_to, tags,
  content_hash, source, priority, deleted_at, created_at, updated_at
)
SELECT
  artifact_id, org_slug, kind, key, path_rel, title, status, scope, applies_to, tags,
  content_hash, source, priority, deleted_at, created_at, updated_at
FROM artifacts;

DROP TABLE artifacts;
ALTER TABLE artifacts_v2 RENAME TO artifacts;

CREATE INDEX IF NOT EXISTS idx_artifacts_org_kind ON artifacts(org_slug, kind);
CREATE INDEX IF NOT EXISTS idx_artifacts_path ON artifacts(org_slug, path_rel);
CREATE INDEX IF NOT EXISTS idx_artifacts_key ON artifacts(org_slug, key);
CREATE INDEX IF NOT EXISTS idx_artifacts_hash ON artifacts(content_hash);
CREATE INDEX IF NOT EXISTS idx_artifacts_updated ON artifacts(updated_at);

-- 2) Generic metadata entries: key/value metadata (URLs, defaults, cross-refs, scoping)
--    attached to a registered artifact (which is keyed to its filesystem path).
CREATE TABLE IF NOT EXISTS metadata_entries (
  entry_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL REFERENCES organizations(org_slug) ON UPDATE CASCADE,
  artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  meta_key TEXT NOT NULL,
  meta_value TEXT NOT NULL,              -- JSON-encoded value
  value_type TEXT NOT NULL CHECK(value_type IN ('string','number','boolean','url','array','object')),
  source TEXT NOT NULL CHECK(source IN ('fs','db','import')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(org_slug, artifact_id, meta_key)
);

CREATE INDEX IF NOT EXISTS idx_metadata_key ON metadata_entries(org_slug, meta_key);
CREATE INDEX IF NOT EXISTS idx_metadata_artifact ON metadata_entries(artifact_id);
