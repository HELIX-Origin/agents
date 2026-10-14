# Skill: Tauri & Rust Desktop Client Engineering

> Domain knowledge and engineering runbook for cross-platform Tauri and Rust applications (`projects/NH-Reader`, `projects/Steam-Vault`).

---

## 1. Project Architecture

- **Frontend:** SvelteKit / TypeScript / Vite (`src/`).
- **Backend:** Rust / Tauri v1/v2 core (`src-tauri/`).
- **IPC Layer:** Strongly-typed invoke commands between TypeScript frontend and Rust backend handlers.
- **Data Stores:** Local encrypted SQLite / JSON storage on client device.

> **Project note — `Steam-Vault`:** a Tauri v2 Steam library organizer. Backend modules under
> `src-tauri/src/` (`steam/` data layer, `metadata/` provider clients, `autocat.rs`, `filter.rs`,
> `cache.rs`, `settings.rs`, `commands.rs`). Frontend is SvelteKit in SPA mode (`ssr = false`)
> with a glassmorphism theme. Verification: `cargo check`, `cargo test`, `npm run check`.

---

## 2. Key Commands & Toolchain

### Prerequisites
- Node.js (v18+) and npm / pnpm.
- Rust toolchain (`rustc`, `cargo` latest stable).

### Development & Checks

```powershell
# Frontend lint & type checks
npm run check

# Internationalization key validation
npm run check:i18n

# Rust backend checks & tests
cargo check --manifest-path projects/NH-Reader/src-tauri/Cargo.toml
cargo test --manifest-path projects/NH-Reader/src-tauri/Cargo.toml

# Local development server
npm run tauri dev
```

---

## 3. Version Bump & Release Integrity

When version bumps occur in `NH-Reader`:
1. `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, and `Cargo.lock` **must move together** to the exact same version number.
2. Update `CHANGELOG.md` with human-readable entries under the new version header.
3. Prepare release notes following the SemVer template in [`.agents/templates/release-notes-template.md`](../templates/release-notes-template.md).
