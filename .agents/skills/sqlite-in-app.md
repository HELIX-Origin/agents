---
name: SQLite in Tauri v2 Apps
description: SQLite patterns for Tauri v2 desktop apps — rusqlite, WAL mode, r2d2 connection pooling, schema migrations, and the lean DB principle.
applies_to: [nh-reader, depressurizer]
tags: [sqlite, rust, database, rusqlite, r2d2]
---

# Skill: SQLite in Tauri v2 Apps

> SQLite is the embedded database of choice across HELIX-Origin Tauri apps. The DB stores hashes, indexes, and metadata — the filesystem remains canonical for actual content.

---

## 1. Lean DB Principle

> **The filesystem is canonical. The DB is an index.**

- Store **paths, hashes, metadata, and computed indexes** in the DB.
- Do **not** store file contents, raw binaries, or data that can be trivially re-derived by reading the filesystem.
- This keeps the DB small, portable, and trivially reconstructible via a full rescan.
- Schema changes are always additive — never destructive — using migrations (see §5).

---

## 2. Crate Setup

```toml
# src-tauri/Cargo.toml
[dependencies]
rusqlite  = { version = "0.31", features = ["bundled"] }
r2d2      = "0.8"
r2d2_sqlite = "0.24"
thiserror = "1"

[dev-dependencies]
tempfile = "3"
```

`features = ["bundled"]` compiles SQLite directly into the binary — no system SQLite dependency, consistent version across platforms.

---

## 3. Connection Pool Setup

```rust
// src-tauri/src/db/mod.rs
use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use std::path::Path;

pub type DbPool = Pool<SqliteConnectionManager>;

pub fn open_pool(db_path: &Path) -> Result<DbPool, r2d2::Error> {
    let manager = SqliteConnectionManager::file(db_path)
        .with_flags(rusqlite::OpenFlags::SQLITE_OPEN_READ_WRITE
                  | rusqlite::OpenFlags::SQLITE_OPEN_CREATE)
        .with_init(|conn| {
            // Applied to every new connection in the pool
            conn.execute_batch("
                PRAGMA journal_mode=WAL;
                PRAGMA foreign_keys=ON;
                PRAGMA synchronous=NORMAL;
                PRAGMA temp_store=MEMORY;
                PRAGMA mmap_size=134217728;
            ")?;
            Ok(())
        });

    Pool::builder()
        .max_size(4)          // 4 concurrent connections; tune per app
        .build(manager)
}
```

Store the pool in `AppState`:
```rust
// src-tauri/src/state.rs
pub struct AppState {
    pub db: DbPool,
    // other fields...
}
```

Acquire a connection per operation:
```rust
#[tauri::command]
pub fn get_games(state: tauri::State<'_, AppState>) -> Result<Vec<Game>, Error> {
    let conn = state.db.get().map_err(Error::Pool)?;
    // conn is a PooledConnection — returned to pool on drop
    query_all_games(&conn)
}
```

---

## 4. WAL Mode

Write-Ahead Logging (WAL) is mandatory for desktop apps:
- Allows concurrent readers while a write is in progress.
- Significantly reduces lock contention when the UI reads while a background scan writes.
- Set via `PRAGMA journal_mode=WAL;` on connection init (see §3).

```rust
// Verify WAL is active (useful in tests)
let mode: String = conn.query_row(
    "PRAGMA journal_mode",
    [],
    |row| row.get(0)
)?;
assert_eq!(mode, "wal");
```

---

## 5. Schema Migrations

Use embedded, sequential SQL migration files — no external migration framework needed.

```
src-tauri/src/db/
├── mod.rs
├── migrations.rs
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_add_cover_url.sql
    └── 003_add_last_played.sql
```

```rust
// src-tauri/src/db/migrations.rs
use rusqlite::Connection;
use crate::Error;

/// Run all pending migrations in order.
/// Migrations are idempotent — safe to call on every startup.
pub fn run_migrations(conn: &Connection) -> Result<(), Error> {
    conn.execute_batch("
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version   INTEGER PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    ")?;

    let migrations: &[(&str, &str)] = &[
        ("001", include_str!("migrations/001_initial_schema.sql")),
        ("002", include_str!("migrations/002_add_cover_url.sql")),
        ("003", include_str!("migrations/003_add_last_played.sql")),
    ];

    for (version, sql) in migrations {
        let version_num: i64 = version.parse().unwrap();
        let already_applied: bool = conn.query_row(
            "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = ?)",
            [version_num],
            |row| row.get(0),
        )?;

        if !already_applied {
            conn.execute_batch(sql)?;
            conn.execute(
                "INSERT INTO schema_migrations (version) VALUES (?)",
                [version_num],
            )?;
        }
    }
    Ok(())
}
```

**Migration rules:**
- Each `.sql` file is fully self-contained.
- Never modify a migration that has already been applied — always add a new one.
- Migrations are always additive: `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN`.
- Never `DROP TABLE` or `ALTER TABLE ... DROP COLUMN` in a migration (SQLite has limited ALTER support).

---

## 6. Query Patterns

### Insert / upsert
```rust
pub fn upsert_game(conn: &Connection, game: &Game) -> Result<(), Error> {
    conn.execute(
        "INSERT INTO games (id, title, platform, cover_url, file_hash)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
             title     = excluded.title,
             cover_url = excluded.cover_url,
             file_hash = excluded.file_hash",
        rusqlite::params![
            game.id, game.title, game.platform, game.cover_url, game.file_hash
        ],
    )?;
    Ok(())
}
```

### Batch insert (transaction)
```rust
pub fn insert_many(conn: &Connection, games: &[Game]) -> Result<(), Error> {
    let tx = conn.unchecked_transaction()?;
    {
        let mut stmt = tx.prepare_cached(
            "INSERT OR REPLACE INTO games (id, title, platform) VALUES (?1, ?2, ?3)"
        )?;
        for g in games {
            stmt.execute(rusqlite::params![g.id, g.title, g.platform])?;
        }
    }
    tx.commit()?;
    Ok(())
}
```

### Query rows into structs
```rust
pub fn get_all_games(conn: &Connection) -> Result<Vec<Game>, Error> {
    let mut stmt = conn.prepare(
        "SELECT id, title, platform, cover_url FROM games ORDER BY title ASC"
    )?;
    let games = stmt.query_map([], |row| {
        Ok(Game {
            id:        row.get(0)?,
            title:     row.get(1)?,
            platform:  row.get(2)?,
            cover_url: row.get(3)?,
        })
    })?
    .collect::<Result<Vec<_>, _>>()?;
    Ok(games)
}
```

---

## 7. Metadata-Only DB Design

For apps that index files (games, books, configs):

| Column | Purpose |
|---|---|
| `id` | Stable unique identifier (Steam App ID, UUID, etc.) |
| `path` | Absolute path on disk (filesystem canonical) |
| `file_hash` | SHA-256 / CRC32 of file — detect changes without re-reading |
| `size_bytes` | Quick staleness check |
| `last_modified` | OS mtime for change detection |
| `title`, `cover_url`, `description` | Metadata fetched from external sources |
| `indexed_at` | Timestamp of last DB update |

Never store: file contents, embedded images as BLOBs, logs, or telemetry.

---

## 8. Testing DB Code

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::Connection;

    fn in_memory_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch("PRAGMA foreign_keys=ON;").unwrap();
        run_migrations(&conn).unwrap();
        conn
    }

    #[test]
    fn test_upsert_game() {
        let conn = in_memory_db();
        let game = Game { id: 1, title: "Portal".into(), platform: "steam".into(), cover_url: None };
        upsert_game(&conn, &game).unwrap();
        let found = get_all_games(&conn).unwrap();
        assert_eq!(found.len(), 1);
        assert_eq!(found[0].title, "Portal");
    }
}
```

- Always test against an in-memory DB — fast, isolated, no temp file cleanup needed.
- Call `run_migrations` in test setup to ensure schema is current.
