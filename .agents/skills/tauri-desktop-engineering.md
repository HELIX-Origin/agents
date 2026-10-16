# Skill: Tauri & Rust Desktop Client Engineering

> Domain knowledge and engineering runbook for cross-platform Tauri and Rust applications (`projects/NH-Reader`, `projects/Steam-Vault`).

---

## 1. Project Architecture

- **Frontend:** SvelteKit / TypeScript / Vite (`src/`).
- **Backend:** Rust / Tauri v2 core (`src-tauri/`).
- **IPC Layer:** Strongly-typed invoke commands between TypeScript frontend and Rust backend handlers.
- **Data Stores:** Local encrypted SQLite / JSON storage on client device.

### Per-Platform Rust Lib Architecture (Standard)
Every Tauri project supporting multiple operating systems must split OS-specific implementations into dedicated platform modules under `src-tauri/src/platforms/`:
- `windows.rs`: Windows-specific APIs (WinReg, AppxManifest, KnownFolders, Win32 shortcuts, WindowsApps).
- `macos.rs`: macOS-specific APIs (NSWorkspace, `~/Library/Application Support`, AppleScript, DMG helpers).
- `linux.rs`: Linux-specific APIs (XDG desktop entries, Flatpak manifests, AppImage mounts, Steam Proton).
- `mod.rs`: Shared traits, types (`PlatformGame`, `Platform`), scan orchestrator, and uniform exports.

Each platform module must implement fallback stubs for other targets (`#[cfg(target_os = "...")]` vs `#[cfg(not(target_os = "..."))]`) so cross-platform compilation and cargo checks never fail.

### Per-Platform Tauri Configuration Standard (`tauri.conf.json`)
Tauri v2 allows splitting configuration across platform files:
- `src-tauri/tauri.conf.json`: Common root configuration (app name, base bundle settings, permissions, window defaults).
- `src-tauri/tauri.windows.conf.json`: Windows-specific packaging (NSIS installer settings, WiX msi, Windows-specific icons, WebView2 runtime modes).
- `src-tauri/tauri.macos.conf.json`: macOS-specific packaging (DMG window layout, background artwork, entitlements, minimum macOS version, universal binary flags).
- `src-tauri/tauri.linux.conf.json`: Linux-specific packaging (deb dependencies, AppImage desktop file categories, icons).

> **JSON vs. TOML Invariant:**
> Tauri v2 supports both JSON and TOML configuration files. Across HELIX-Origin projects, **JSON (`tauri.conf.json` / `tauri.<platform>.conf.json`) is the authoritative standard**.
> JSON allows instant `$schema` validation (`https://schema.tauri.app/config/2`) providing full IDE autocomplete, type validation, and inline docs without needing specialized language plugins.

---

## 2. Scripts & Command Standard (`main:sub:option`)

Tauri v2 projects standardize on **native `.mjs` scripts** under `scripts/`:
- `scripts/lib/runner.mjs`: Shared process spawner, ANSI-colored output, timing metrics, and signal trapping.
- `scripts/dev.mjs`: Dev environment orchestrator.
- `scripts/build.mjs`: Production builds passing `--config src-tauri/tauri.<platform>.conf.json`.
- `scripts/test.mjs`: Unified test suite runner (Rust, frontend, i18n).
- `scripts/run.mjs`: Execution and live logging.
- `scripts/sign.mjs`: Multi-platform code signing router.
- `scripts/generate-winget-manifest.mjs`: Automated WinGet manifest generator (for non-NSFW apps).
- `scripts/setup-signing-secrets.ps1`: Local-to-GitHub secret export helper.

### Command Standard
Commands in `package.json` must adhere strictly to **`main:sub:option`**:
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "tauri:dev": "node scripts/dev.mjs",
    "tauri:dev:raw": "tauri dev",
    "tauri:build": "node scripts/build.mjs",
    "tauri:build:release": "node scripts/build.mjs release",
    "tauri:build:debug": "node scripts/build.mjs debug",
    "tauri:build:raw": "tauri build",
    "test:rust": "node scripts/test.mjs rust",
    "test:frontend": "node scripts/test.mjs frontend",
    "test:i18n": "node scripts/test.mjs i18n",
    "test:all": "node scripts/test.mjs all",
    "sign:local": "node scripts/sign.mjs",
    "winget:manifest": "node scripts/generate-winget-manifest.mjs"
  }
}
```

---

## 3. Code Signing Architecture

Both local manual builds and CI releases support opt-in code signing:
1. **Windows:**
   - Discovers Windows SDK `signtool.exe` automatically across `C:\Program Files (x86)\Windows Kits\10\bin\<version>\x64`.
   - Uses RFC 3161 timestamps via `http://timestamp.digicert.com`.
   - Supports production `.pfx` certificates or generates a temporary self-signed development certificate for testing.
2. **macOS:**
   - Apple Developer ID Application certificate signing via `codesign --deep --force --options runtime`.
   - Notarization submission via `xcrun notarytool submit --wait`.
3. **Linux:**
   - GPG detached signatures for `.deb` and `.AppImage` bundles via `gpg --batch --yes --detach-sign --armor`.

---

## 4. WinGet Package Repository Registration

For non-NSFW desktop applications (`Steam-Vault`), automated release and distribution through the official Windows Package Manager repository (`microsoft/winget-pkgs`) is standard:
- **Package Identifier:** `HELIXOrigin.<AppName>` (e.g. `HELIXOrigin.SteamVault`).
- **Installer Type:** `nullsoft` (NSIS).
- **Release Automation:** Release workflows (`.github/workflows/release.yml`) include a `publish-winget` job leveraging `vedantmgoyal9/winget-releaser@v2` targeting the GitHub Release NSIS installer asset.
- **Local Manifests:** Maintained or generated via `node scripts/generate-winget-manifest.mjs`.

---

## 5. Workflow Standards

All desktop repositories must maintain:
1. `.github/workflows/cleanup-failed-runs.yml`: Universal workflow from `.agents/templates/cleanup-failed-runs-workflow-template.yml` to automatically purge cancelled or failed workflow runs.
2. `.github/workflows/release.yml`: Multi-platform matrix build (`windows-latest`, `macos-latest`, `ubuntu-22.04`) passing platform configuration `--config src-tauri/tauri.<platform>.conf.json` and attaching artifacts to selected releases.

---

## 6. Verification Checklist

Before committing any desktop changes:
1. `npm run check --prefix projects/<project>` — Type check passed with 0 errors.
2. `cargo check --manifest-path projects/<project>/src-tauri/Cargo.toml` — Rust compilation passed with 0 errors.
3. `cargo test --manifest-path projects/<project>/src-tauri/Cargo.toml` — All backend unit & integration tests passed.
4. Line endings: Enforce LF across all files.
