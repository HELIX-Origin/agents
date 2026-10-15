# Skill: Tauri & Rust Desktop Client Engineering

> Domain knowledge and engineering runbook for cross-platform Tauri and Rust applications (`projects/NH-Reader`, `projects/Steam-Vault`).

---

## 1. Project Architecture

- **Frontend:** SvelteKit / TypeScript / Vite (`src/`).
- **Backend:** Rust / Tauri v1/v2 core (`src-tauri/`).
- **IPC Layer:** Strongly-typed invoke commands between TypeScript frontend and Rust backend handlers.
- **Data Stores:** Local encrypted SQLite / JSON storage on client device.

> **Project note — `Steam-Vault`:** a Tauri v2 Steam library organizer and launcher (`projects/Steam-Vault`).
> - **Backend (`src-tauri/src/`):**
>   - `steam/` data layer: reads/writes collections (`cloud-storage-namespace-1.json`), `shortcuts.vdf`, `libraryfolders.vdf`, and `appmanifest_*.acf`.
>   - `platforms/`: multi-platform owned & installed games detection (GOG Galaxy SQLite DB, Epic, WindowsApps/Xbox, itch, EA, Ubisoft, emulators).
>   - `metadata/`: transitioning solely to official storefront integrations (Steam Store API / ACF manifests, GOG Galaxy DB, Epic manifests, Xbox AppxManifest) + Community Game Catalogue (`index.json` / `catalog_seed.bin`), with planned local authenticated Steam installation extraction (`appinfo.vdf`, `packageinfo.vdf`, `localconfig.vdf`) to make even the Steam Web API key completely optional.
>   - `commands.rs`: game launching (`steam://run/{app_id}` / native fallbacks), installation (`steam://install/{app_id}`), uninstallation, and game directory opening.
>   - `storage.rs`: storage metrics and multi-drive library folder management.
> - **Frontend (`src/`):**
>   - `/library`: Primary **Grid view** launcher with vertical capsule covers, quick launch, right sidebar sort/filters, and extensive per-game management sub-page (10-image gallery with fullscreen lightbox, meta links, playtime tracking, launch/install controls, and management modal).
>   - `/storage`: Streamlined storage statistics dashboard and Steam library folder manager.
>   - `/organize`: Streamlined Depressurizer-style multi-select scope list and custom rule builder.
>   - `/settings`: Platform integration toggles and offline Community Game Catalogue synchronization.
> - **Verification:** `npm run build`, `cargo check`, `cargo test --manifest-path src-tauri/Cargo.toml`, `npm run check`.

---

## 2. Key Commands & Toolchain

### Prerequisites
- Node.js (v18+) and npm.
- Rust toolchain (`rustc`, `cargo` latest stable).

### Development & Checks

```powershell
# NH-Reader checks
npm run check --prefix projects/NH-Reader
cargo test --manifest-path projects/NH-Reader/src-tauri/Cargo.toml

# Steam-Vault checks
npm run check --prefix projects/Steam-Vault
cargo test --manifest-path projects/Steam-Vault/src-tauri/Cargo.toml
npm run build --prefix projects/Steam-Vault

# Local development server
npm run tauri:dev --prefix projects/Steam-Vault
```

---

## 3. Version Bump & Release Integrity

When version bumps occur in `NH-Reader`:
1. `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, and `Cargo.lock` **must move together** to the exact same version number.
2. Update `CHANGELOG.md` with human-readable entries under the new version header.
3. Prepare release notes following the SemVer template in [`.agents/templates/release-notes-template.md`](../templates/release-notes-template.md).
