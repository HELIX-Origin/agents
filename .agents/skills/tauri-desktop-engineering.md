# Skill: Tauri & Rust Desktop Client Engineering

> Domain knowledge and engineering runbook for cross-platform Tauri and Rust applications (`projects/NH-Reader`, `projects/Universal-Game-Launcher`, `projects/Theme-Toolkit`).

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
- `scripts/test.mjs`: Unified test suite runner (Rust, frontend, build).
- `scripts/run.mjs`: Execution and live logging.
- `scripts/sign.mjs`: Multi-platform code signing router.
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
    "test:all": "node scripts/test.mjs all",
    "sign:local": "node scripts/sign.mjs"
  }
}
```

---

## 3. Standard Windows NSIS Installer & UI Format

Across all HELIX-Origin Tauri v2 desktop applications, the **NH Reader NSIS installer configuration is the authoritative ecosystem standard**. This configuration guarantees flexible installation options and a cohesive, modern dark obsidian user interface.

### Canonical NSIS Configuration (`tauri.windows.conf.json`)

```json
{
  "bundle": {
    "windows": {
      "nsis": {
        "installMode": "both",
        "installerIcon": "icons/icon.ico",
        "sidebarImage": "windows/sidebar.bmp",
        "installerHooks": "windows/hooks.nsh",
        "languages": [
          "English",
          "Japanese",
          "SimpChinese",
          "TradChinese",
          "Korean",
          "Spanish",
          "French",
          "German",
          "Russian",
          "Portuguese"
        ],
        "displayLanguageSelector": true
      }
    }
  }
}
```

### Core Capabilities & UI Standards

1. **Dual Installation Mode (`installMode: "both"`):**
   - Gives the user explicit choice between installing for the current user (`%LOCALAPPDATA%\Programs\<app>`) without admin elevation, or installing for all users (`%PROGRAMFILES%\<app>`) with standard UAC elevation.
2. **Improved Dark Obsidian UI (`sidebarImage`):**
   - Custom 164x314 24-bit BMP graphic (`src-tauri/windows/sidebar.bmp`) placed on the Welcome and Finish wizard pages.
   - Header images (`headerImage`) are intentionally avoided because wide banners render as cramped top-bar icons in modern NSIS layouts.
3. **Update & Installation Lifecycle (`NSIS_HOOK_PREINSTALL` in `windows/hooks.nsh`):**
   - During updates or fresh installations, `NSIS_HOOK_PREINSTALL` terminates any active instances of the app before file extraction so running binaries do not lock destination files.
   - **Critical Invariant:** Pre-install hooks must **never** invoke `uninstall.exe`. Running `uninstall.exe` in pre-install is an anti-pattern patch method that deletes existing configurations, thrashes registry state, and breaks seamless application updates. Pre-install hooks are solely dedicated to updating and installing.
4. **Multi-Language Accessibility:**
   - 10 international languages with automatic system locale detection and an interactive language selector fallback (`displayLanguageSelector: true`).

### Windows Uninstall Registry & `uninstall.exe` Lifecycle

Windows Add/Remove Programs (Settings > Apps > Installed apps and `appwiz.cpl`) relies strictly on an executable uninstaller registered in the Windows Registry:
- **Registry Keys:** `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\<App>` (current-user) or `HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\<App>` (all-users).
- **Required Properties:**
  - `UninstallString`: `"$INSTDIR\uninstall.exe"` — the uninstaller invoked when the user requests uninstallation.
  - `QuietUninstallString`: `"$INSTDIR\uninstall.exe" /S` — silent uninstallation string used by WinGet and automated deployment tools.
  - `DisplayIcon`: `"$INSTDIR\<binary>.exe,0"` — icon rendered in the Windows Settings installed apps list.
  - `InstallLocation`: `"$INSTDIR"`
- **Uninstallation Process Termination (`NSIS_HOOK_PREUNINSTALL`):**
  - If the application, background services, WebView2 renderer instances, or companion tools (such as `legendary.exe`) are running when Windows executes `uninstall.exe`, the OS kernel holds open file handles and locks `$INSTDIR`.
  - Without a pre-uninstall hook, `uninstall.exe` fails with file access errors, leaving the application half-uninstalled and the Windows registry entry corrupted or orphaned.
  - Every Tauri desktop project must declare `NSIS_HOOK_PREUNINSTALL` in `src-tauri/windows/hooks.nsh`:
    ```nsis
    !macro NSIS_HOOK_PREUNINSTALL
      ; Terminate application and companion tools
      nsExec::Exec 'taskkill /F /IM "{{ APP_EXE_NAME }}.exe" /T'
      nsExec::Exec 'taskkill /F /IM "{{ APP_BINARY_NAME }}.exe" /T'
      nsExec::Exec 'taskkill /F /IM "legendary.exe" /T'
      ; Cooldown for handle release
      Sleep 1000
    !macroend
    ```
- **Post-Uninstall Residual Directory Cleanup (`NSIS_HOOK_POSTUNINSTALL`):**
  - Removes any dynamically created runtime subfolders (e.g. portable tools, local caches) in `$INSTDIR` that would otherwise prevent NSIS from deleting the application folder.
  - Canonical template maintained in [`.agents/templates/nsis-hooks-template.nsh`](../templates/nsis-hooks-template.nsh).

### Multi-Platform Uninstaller Standards (macOS & Linux)

Unlike Windows, macOS and Linux do not utilize a centralized uninstaller registry. To ensure uninstallation is never blocked by running processes on other platforms:
1. **macOS Uninstaller Architecture:**
   - Script template: [`.agents/templates/uninstall-macos-template.sh`](../templates/uninstall-macos-template.sh).
   - Terminates running instances via `pkill -f "<App Name>"` and `pkill -f "<Bundle ID>"`.
   - Waits for process teardown and handle release (`sleep 1`).
   - Removes `/Applications/<App Name>.app` or `~/Applications/<App Name>.app`.
   - Supports optional `--purge` parameter to remove `~/Library/Application Support/<App Name>`, `~/Library/Caches/<Bundle ID>`, and preferences plist.
2. **Linux Uninstaller Architecture:**
   - Script template: [`.agents/templates/uninstall-linux-template.sh`](../templates/uninstall-linux-template.sh).
   - Terminates running instances via `pkill -f "<binary_name>"`.
   - Cleans up desktop menu entries (`~/.local/share/applications/` and `/usr/share/applications/`).
   - Runs `update-desktop-database` to refresh system application menus.
   - Purges application icons from `~/.local/share/icons/hicolor/`.
   - In `.deb` packaging, maintainer script `prerm` must execute `pkill -f "<binary_name>" || true` before `dpkg` unlinks package files.

### Windows WebView2 Teardown & Chrome_WidgetWin_0 (Error 1412) Standard

On Windows, Chromium's internal Win32 window layer (`ui\gfx\win\window_impl.cc:172`) registers window classes such as `Chrome_WidgetWin_0` for webview windows.
When an application shuts down, Chromium invokes `UnregisterClassW(L"Chrome_WidgetWin_0", hInstance)`.
If any Win32 HWND belonging to that class is still open or hidden (e.g., when the main window was hidden instead of destroyed via a tray minimize pattern, or `app.exit(0)` was called before window handles were unhooked), the Windows API returns error `1412` (`ERROR_CLASS_HAS_WINDOWS: "The class still has open windows."`).

**Mandatory Implementation Rules for all HELIX-Origin Tauri Apps:**
1. **Explicit Window Destruction Before Process Exit**:
   When quitting the application (e.g. from the tray icon or exit menu), never call `app.exit(0)` while webview windows are hidden or open. Always set an atomic `IS_QUITTING` flag and explicitly destroy all webview windows first:
   ```rust
   use std::sync::atomic::{AtomicBool, Ordering};
   static IS_QUITTING: AtomicBool = AtomicBool::new(false);

   // In tray or quit action:
   "quit" => {
       IS_QUITTING.store(true, Ordering::SeqCst);
       for (_, window) in app.webview_windows() {
           let _ = window.destroy();
       }
       app.exit(0);
   }
   ```
2. **Prevent Close Guard on Window Teardown**:
   In `on_window_event`, guard `CloseRequested` so `api.prevent_close()` is bypassed when the application is actually quitting:
   ```rust
   .on_window_event(|window, event| {
       #[cfg(desktop)]
       if let tauri::WindowEvent::CloseRequested { api, .. } = event {
           if window.label() == "main" && !IS_QUITTING.load(Ordering::SeqCst) {
               api.prevent_close();
               let _ = window.hide();
           }
       }
   })
   ```
3. **Chromium / WebView2 Diagnostic Log Suppression**:
   At the very entry point of `pub fn run()`, configure `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` on Windows to silence internal Chromium stderr logs (`--disable-logging --log-level=3`):
   ```rust
   #[cfg(windows)]
   {
       if std::env::var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS").is_err() {
           std::env::set_var(
               "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
               "--disable-logging --log-level=3",
           );
       }
   }
   ```

---

## 4. Code Signing Architecture

Both local manual builds and release packaging support opt-in code signing (`scripts/sign.mjs`):
1. **Windows:**
   - Discovers Windows SDK `signtool.exe` automatically across `C:\Program Files (x86)\Windows Kits\10\bin\<version>\x64`.
   - Uses RFC 3161 timestamps via `http://timestamp.digicert.com`.
   - **Generic Certificate Naming & Defaults:** Standardized on `certificates/certificate.pfx` (with fallback to `certificate.p12` or `codesign.pfx`) and generic fallback password `youshallnotpass` (`$env:WINDOWS_CERTIFICATE_PASSWORD ?? 'youshallnotpass'`).
   - **Web-Downloaded Binaries & SmartScreen Caveat:** Uploading self-signed or development certificates to GitHub Secrets is pointless for files distributed over the web. Web-downloaded files receive the Mark-of-the-Web (MOTW) NTFS alternate data stream; Windows SmartScreen will still flag the binary unless signed by a publicly-trusted commercial Certificate Authority (EV/OV) with established reputation. Local signing is intended strictly for local packaging, testing, and enterprise trust environments.
   - **Environment Hygiene:** Uses generic temporary environment variables `CODESIGN_PFX_FILE` and `CODESIGN_PFX_PASS` during verification and signing. Self-signed developer certificates generate with `Subject: 'CN=HELIX Origin, O=HELIX Origin, OU=Code Signing'`.
   - **Git Hygiene:** Every repository must add `/certificates/`, `*.pfx`, and `*.p12` to `.gitignore` to prevent committing private key material.
2. **macOS:**
   - Apple Developer ID Application certificate signing via `codesign --deep --force --options runtime`.
   - Notarization submission via `xcrun notarytool submit --wait`.
3. **Linux:**
   - GPG detached signatures for `.deb` and `.AppImage` bundles via `gpg --batch --yes --detach-sign --armor`.

---

## 5. Desktop Application Packaging & Distribution

Desktop applications standardize on direct multi-platform artifact distribution:
- **Windows:** NSIS installer (`.exe`) with custom branding, per-user/machine install options, and silent uninstallation.
- **macOS:** Standard signed and notarized `.dmg` / `.app` bundles.
- **Linux:** Native `.AppImage` and Debian `.deb` packages.
- **Release Automation:** Multi-platform GitHub Actions matrix workflow attaching installer binaries directly to GitHub Releases.

---

## 6. Workflow Standards

All desktop repositories must maintain:
1. `.github/workflows/cleanup-failed-runs.yml`: Universal workflow from `.agents/templates/cleanup-failed-runs-workflow-template.yml` to automatically purge cancelled or failed workflow runs.
2. `.github/workflows/release.yml`: Multi-platform matrix build (`windows-latest`, `macos-latest`, `ubuntu-22.04`) passing platform configuration `--config src-tauri/tauri.<platform>.conf.json` and attaching artifacts to selected releases.

---

## 7. Universal Launcher Invariants & Native Integration

1. **Zero External Client File Tampering Invariant**:
   - Universal launchers operate completely non-invasively. Never write to, modify, or corrupt storefront client files (e.g. Steam's `shortcuts.vdf`, `cloud-storage-namespace-1.json`, `appmanifest.acf`, or GOG/Epic/EA manifests).
   - Never require storefront clients to be closed during operation.

2. **Universal Core Plugins & Global Helper Modules (`src/lib/plugins/`)**:
   - Platform providers, EmulationStation / ES-DE ROM support, metadata enrichment, title normalization, and media players are delivered via native in-app Universal Core Plugins (`platform-universal`, `metadata-universal`, `utility-title-normalizer`, `utility-gamerpower`, `utility-storage`, `media-universal`) paired with global helper modules.

3. **Native Launcher Integration & Zero Credential Invariant**:
   - Universal launchers should integrate with official platform launchers (Steam, Epic Games, GOG Galaxy, EA App, Ubisoft Connect, Battle.net, Xbox, Amazon Games, itch.io) to detect owned and installed games for the authenticated user on the host system.
   - **Zero Password Storage:** Applications must never handle, scrape, or store third-party user credentials or authentication tokens. All game installations, updates, uninstalls, and launches delegate to official launcher protocols (`steam://`, `com.epicgames.launcher://`, `goggalaxy://`, `uplay://`, etc.).
   - **Full Platform Feature Preservation:** Delegating to official launchers preserves official game overlays, cloud synchronization, community friend lists, playtime counters, and achievement unlocks.
   - **Metadata Architecture:** The Universal Metadata Engine (`metadata-universal`, backed by `src-tauri/src/metadata/universal.rs`) resolves missing metadata and high-resolution artwork across keyless and optional authenticated providers via native Rust `reqwest` with zero WebView CORS failures.

4. **Store & Order Delegation Invariant**:
   - If an in-app store or deals browser is provided, it is strictly mandatory that order placement, purchasing, and payment processing are never performed within the application.
   - Any purchase intent must pass directly to the official platform client or open the official store URL in the user's default browser.

5. **Generic SQLite Database Naming Scheme**:
   - Applications must never tie local SQLite database filenames to brittle branding or product names.
   - Use generic naming schemes such as `database.sqlite` (with fallback to `database.db`) to prevent file breakage across branding iterations.

6. **Tauri v2 NSIS Installer Artwork Specifications**:
   - **NSIS Sidebar Bitmap:** Dimensions must strictly match default Tauri v2 NSIS specifications: **164 × 314 pixels**, BMP3 (Windows Bitmap) format (`src-tauri/windows/sidebar.bmp`).
   - **Branding Artwork:** Vector SVGs follow `.agents/rules/project-artwork.md` standards (16:9 1920×1080 viewBox, dark theme background).

7. **Animated Splash Transitions**:
   - Desktop apps with heavyweight initializations (e.g. multi-store scan, SQLite index loading) should provide an animated splash screen at launch (`splashVisible` / `splashExiting`) with minimum display timing (e.g. 850ms) and smooth scale/fade transitions.
