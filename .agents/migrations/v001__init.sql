-- v001__init.sql: Initial schema for agents ecosystem metadata KB (metadata-only)
-- Stores structured metadata/config used by rules/skills/templates/agents; canonical files remain on filesystem.

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;

CREATE TABLE IF NOT EXISTS organizations (
  org_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  homepage_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS artifacts (
  artifact_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL REFERENCES organizations(org_slug) ON UPDATE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN ('template','document','fragment')),
  key TEXT NOT NULL,
  path_rel TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT,
  scope TEXT,
  applies_to TEXT,
  tags TEXT,
  frontmatter TEXT,
  content_md TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  checksum_fs TEXT,
  source TEXT NOT NULL CHECK(source IN ('fs','db','import')),
  priority INTEGER DEFAULT 0,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(org_slug, kind, key),
  UNIQUE(org_slug, path_rel)
);

CREATE INDEX IF NOT EXISTS idx_artifacts_org_kind ON artifacts(org_slug, kind);
CREATE INDEX IF NOT EXISTS idx_artifacts_path ON artifacts(org_slug, path_rel);
CREATE INDEX IF NOT EXISTS idx_artifacts_key ON artifacts(org_slug, key);
CREATE INDEX IF NOT EXISTS idx_artifacts_hash ON artifacts(content_hash);
CREATE INDEX IF NOT EXISTS idx_artifacts_updated ON artifacts(updated_at);

CREATE TABLE IF NOT EXISTS artifact_references (
  ref_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL,
  from_artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  to_artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  rel_type TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(from_artifact_id, to_artifact_id, rel_type)
);

CREATE INDEX IF NOT EXISTS idx_refs_from ON artifact_references(from_artifact_id);
CREATE INDEX IF NOT EXISTS idx_refs_to ON artifact_references(to_artifact_id);

CREATE TABLE IF NOT EXISTS artifact_aliases (
  alias_id INTEGER PRIMARY KEY,
  org_slug TEXT NOT NULL,
  artifact_id INTEGER NOT NULL REFERENCES artifacts(artifact_id) ON DELETE CASCADE,
  alias_key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(org_slug, alias_key)
);

CREATE INDEX IF NOT EXISTS idx_aliases_org ON artifact_aliases(org_slug, alias_key);

CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT PRIMARY KEY,
  meta_value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
