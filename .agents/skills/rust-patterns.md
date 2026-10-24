---
name: Rust Patterns for Tauri v2
description: Rust patterns specific to Tauri v2 desktop apps — command handlers, state management, async, error handling, serde, plugins, and per-platform branching.
applies_to: [nh-reader, theme-toolkit, depressurizer]
tags: [rust, tauri, backend, error-handling, serde]
---

# Skill: Rust Patterns for Tauri v2

> Patterns for writing correct, ergonomic Rust in Tauri v2 backends — structured for the zero-warning invariant (`RUSTFLAGS="-D warnings"`).

---

## 1. Command Handlers

```rust
// src-tauri/src/commands/mod.rs

use tauri::State;
use crate::{AppState, Error};

/// All commands must be annotated and registered in lib.rs / main.rs.
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

/// Async command — use when the work is I/O-bound or calls async APIs.
#[tauri::command]
pub async fn load_library(state: State<'_, AppState>) -> Result<Vec<Item>, Error> {
    let db = state.db.lock().await;
    db.get_all_items().await.map_err(Error::from)
}
```

**Registration (Tauri v2)**:
```rust
// src-tauri/src/lib.rs
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
        commands::greet,
        commands::load_library,
    ])
    .run(tauri::generate_context!())
    .expect("error running app");
```

---

## 2. State Management

```rust
// src-tauri/src/state.rs
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct AppState {
    pub db: Arc<Mutex<DatabaseConnection>>,
    pub config: Arc<Mutex<AppConfig>>,
}

// Register in lib.rs:
tauri::Builder::default()
    .manage(AppState {
        db: Arc::new(Mutex::new(db_conn)),
        config: Arc::new(Mutex::new(cfg)),
    })
```

- Use `Arc<Mutex<T>>` (`tokio::sync::Mutex` for async, `std::sync::Mutex` for sync-only).
- Avoid holding a lock across `.await` — clone/extract the data first.
- Prefer fine-grained state structs over one mega-state monolith.

---

## 3. Error Handling with `thiserror`

```rust
// src-tauri/src/error.rs
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("not found: {0}")]
    NotFound(String),

    #[error("serialization error: {0}")]
    Serde(#[from] serde_json::Error),
}

/// Required for Tauri commands to serialize errors to the frontend.
impl serde::Serialize for Error {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(self.to_string().as_str())
    }
}
```

- All command return types are `Result<T, Error>` — never `unwrap()` or `expect()` in command handlers.
- `#[from]` auto-implements `From<SourceError> for Error`.
- The `Serialize` impl sends the error message string to the frontend via `invoke()`.

---

## 4. Serde JSON Serialization

```rust
use serde::{Deserialize, Serialize};

/// Data crossing the Tauri command boundary must implement both.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameEntry {
    pub id: i64,
    pub title: String,
    pub cover_url: Option<String>,
    #[serde(rename = "appId")]          // camelCase for JS interop
    pub app_id: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

/// Enums serialize as strings by default with serde
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum LaunchStatus {
    Running,
    Stopped,
    Error,
}
```

- Use `#[serde(rename_all = "camelCase")]` on structs that map directly to TypeScript objects.
- Use `#[serde(skip_serializing_if = "Option::is_none")]` for optional frontend fields.
- Keep DTOs (data transfer objects) separate from internal domain types where complexity warrants it.

---

## 5. Async Patterns

```rust
use tokio::fs;

#[tauri::command]
pub async fn read_config(path: String) -> Result<AppConfig, Error> {
    let contents = fs::read_to_string(&path).await?;
    let config: AppConfig = serde_json::from_str(&contents)?;
    Ok(config)
}

/// Spawning background work — avoid blocking the command thread.
#[tauri::command]
pub async fn start_scan(
    state: State<'_, AppState>,
    app_handle: tauri::AppHandle,
) -> Result<(), Error> {
    let state = Arc::clone(&state.inner().db);
    tokio::spawn(async move {
        // Long-running background scan
        // Emit events back to frontend:
        app_handle.emit("scan:progress", payload).ok();
    });
    Ok(()) // return immediately; scan runs in background
}
```

---

## 6. Emitting Events to the Frontend

```rust
// Emit from command handler
app_handle.emit("event-name", &payload)?;

// Emit to a specific window
app_handle.get_webview_window("main")
    .ok_or(Error::NotFound("main window".into()))?
    .emit("event-name", &payload)?;
```

Frontend listens with:
```ts
import { listen } from '@tauri-apps/api/event';
const unlisten = await listen<PayloadType>('event-name', (event) => { ... });
```

---

## 7. Per-Platform Branching

```rust
// Conditional compilation for platform-specific logic
#[cfg(target_os = "windows")]
pub fn get_default_data_dir() -> PathBuf {
    dirs::data_local_dir().unwrap().join("MyApp")
}

#[cfg(target_os = "macos")]
pub fn get_default_data_dir() -> PathBuf {
    dirs::home_dir().unwrap().join("Library/Application Support/MyApp")
}

#[cfg(target_os = "linux")]
pub fn get_default_data_dir() -> PathBuf {
    dirs::data_dir().unwrap().join("myapp")
}

// Platform blocks inside a function
pub fn platform_name() -> &'static str {
    if cfg!(target_os = "windows") { "windows" }
    else if cfg!(target_os = "macos") { "macos" }
    else { "linux" }
}
```

---

## 8. Plugin Architecture

```rust
// Define a Tauri plugin (src-tauri/src/plugins/myplugin.rs)
use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("myplugin")
        .invoke_handler(tauri::generate_handler![
            plugin_commands::do_thing,
        ])
        .setup(|app, _api| {
            // Plugin initialization logic
            Ok(())
        })
        .build()
}

// Register in lib.rs:
tauri::Builder::default()
    .plugin(plugins::myplugin::init())
```

---

## 9. Zero-Warning Invariant

All Rust compilation runs with:
```bash
RUSTFLAGS="-D warnings" cargo check
RUSTFLAGS="-D warnings" cargo test
RUSTFLAGS="-D warnings" cargo clippy -- -D warnings
```

**Common warning sources to fix proactively:**
- `dead_code` — remove unused functions/structs or annotate with `#[allow(dead_code)]` only if intentionally kept.
- `unused_variables` — prefix with `_` or remove.
- `clippy::unwrap_used` — replace with `?` or proper error handling.
- `clippy::expect_used` — same; only allowed in tests.
- Missing `#[derive(Debug)]` — add to all public types.
- `clippy::wildcard_imports` — use explicit imports.

---

## 10. Project Structure Convention

```
src-tauri/src/
├── lib.rs          # Builder setup, plugin registration, state init
├── main.rs         # Thin entry point (calls lib::run())
├── error.rs        # Unified Error enum + Serialize impl
├── state.rs        # AppState struct
├── commands/       # One module per feature domain
│   ├── mod.rs
│   ├── library.rs
│   └── settings.rs
├── db/             # Database layer (see sqlite-in-app.md)
│   ├── mod.rs
│   └── migrations.rs
└── models/         # Serde DTOs shared between commands and DB
    └── mod.rs
```
