# Skill: Windows Deskthemepack Engineering & Packaging

> Domain knowledge and engineering runbook for Windows 10 & 11 theme architectures, `.deskthemepack` cabinet packaging using `makecab.exe` and Diamond Directive Files (`.ddf`), and specifications for the unified TypeScript ESM deskthemepack toolkit.

---

## 1. Overview & The "Broken Microsoft Exporter" Problem

A Windows theme pack (`.deskthemepack`) is a Microsoft Cabinet (`.cab`) archive containing:
1. A master `.theme` configuration file (Windows INI format).
2. Wallpaper asset(s) and slideshow directories.
3. Optional sound schemes (`.wav` audio assets).
4. Optional cursor schemes (`.cur` / `.ani` pointer assets).
5. Optional screensaver files (`.scr`).

### Why Microsoft's Built-in GUI Exporter Fails

Exporting a theme via the Windows Settings GUI ("Save theme for sharing") is notoriously unreliable:
- **Hardcoded Profile Paths:** Frequently bakes absolute local paths (`C:\Users\<username>\AppData\Local\Microsoft\Windows\Themes\...`) into the exported `.theme` file instead of valid relative CAB paths, causing theme application to fail or silently revert to default Windows assets on another machine.
- **Asset Stripping:** Silently drops custom cursor schemes, sound schemes, or screensaver references during export.
- **Corrupted Cabinet Headers:** Often generates malformed CAB headers that trigger installation errors on target systems or fail integrity verification.
- **No Dark Mode / Modern Fluent Controls:** Lacks granular control over Windows 10 vs 11 dark mode flags, colorization accents, or multi-monitor wallpaper alignments.

---

## 2. Proper Packaging with `makecab.exe` and `.ddf` Directives

The correct, standard-compliant method for packaging a `.deskthemepack` is using the Windows native Diamond Cabinet tool (`makecab.exe`) driven by a Diamond Directive File (`.ddf`).

### Diamond Directive File (`theme.ddf`) Syntax

A valid `.ddf` specifies cabinet compression, target archive naming, and explicit relative file placements:

```ini
; Diamond Directive File for Windows Deskthemepack
.Set CabinetNameTemplate="MyTheme.deskthemepack"
.Set DiskDirectoryTemplate="dist"
.Set CompressionType=MSZIP
.Set CompressionLevel=7
.Set CompressionMemory=21
.Set Cabinet=on
.Set Compress=on
.Set UniqueFiles=Off
.Set MaxDiskSize=CDROM

; Root Theme Descriptor
"src/theme/MyTheme.theme" "MyTheme.theme"

; Wallpapers / Slideshow
"src/wallpapers/01-nord-light.jpg" "DesktopBackground/01-nord-light.jpg"
"src/wallpapers/02-nord-dark.jpg" "DesktopBackground/02-nord-dark.jpg"

; Cursors (optional)
"src/cursors/arrow.cur" "Cursors/arrow.cur"
"src/cursors/busy.ani" "Cursors/busy.ani"

; Sounds (optional)
"src/sounds/logon.wav" "Sounds/logon.wav"
"src/sounds/error.wav" "Sounds/error.wav"
```

### Execution Procedure

Execute `makecab.exe` directly via PowerShell:

```powershell
makecab.exe /F theme.ddf
```

The resulting `dist/MyTheme.deskthemepack` is a clean, standard-compliant cabinet file ready for deployment or double-click installation across any Windows 10 or 11 system.

---

## 3. Structure of the Master `.theme` File

The root `.theme` file inside the archive is an INI-structured configuration file:

```ini
[Theme]
DisplayName=My Custom Theme
ThemeId={12345678-ABCD-1234-ABCD-123456789ABC}

[Control Panel\Desktop]
Wallpaper=DesktopBackground\01-nord-light.jpg
TileWallpaper=0
WallpaperStyle=10
Pattern=

[Slideshow]
Interval=1800000
Shuffle=1
ImagesRootPath=DesktopBackground

[VisualStyles]
Path=%ResourceDir%\Themes\Aero\Aero.msstyles
ColorStyle=NormalColor
Size=NormalSize
AutoColorization=0
ColorizationColor=0XC448D8F2
SystemMode=Dark
AppMode=Dark

[MasterThemeSelector]
MTSM=DABShapes

[Control Panel\Cursors]
Arrow=Cursors\arrow.cur
Wait=Cursors\busy.ani

[Sounds]
; Sound scheme GUID or name
SchemeName=CustomNord
```

---

## 4. Planned Project: Theme Toolkit (Tauri v2 Desktop App)

To completely eliminate manual DDF authoring and Microsoft GUI export bugs, HELIX-Origin plans a dedicated future desktop application named **Theme Toolkit** (`projects/Theme-Toolkit`). The app will utilize a modern **Tauri v2 GUI as its primary interface** to serve as a robust replacement for Microsoft's broken settings export integration.

### Comprehensive Feature Scope

1. **Sound Schemes:**
   - Full `.wav` audio asset packaging.
   - Comprehensive system event mapping (Windows Logon, Logoff, Asterisk, Exclamation, Notification, Device Connect/Disconnect, Trash, etc.).
   - Standard registry-compatible scheme definitions (`[Sounds]`, `SchemeName`).

2. **Wallpapers & Slideshows:**
   - Single static background configuration or dynamic slideshow support.
   - Granular slideshow controls: transition intervals (in milliseconds), shuffle mode (`Shuffle=1`), and multi-monitor alignment options (`WallpaperStyle` values: Fill, Fit, Stretch, Tile, Center, Span).
   - Asset validation: ensures images exist, formats are valid (`.jpg`, `.png`), and aspect ratios match target resolutions.

3. **Cursor Schemes:**
   - Custom pointer set packaging for all standard roles (Normal `Arrow`, Help, Working in Background `AppStarting`, Busy `Wait`, Precision `Crosshair`, Text Select `IBeam`, Unavailable `No`, Resize pointers, Link Select `Hand`).
   - Supports both static (`.cur`) and animated (`.ani`) cursor assets.

4. **Color Editing & System Appearance:**
   - Precise Windows accent color controls (`ColorizationColor` ARGB hex values).
   - Windows 10 and 11 Dark Mode and Light Mode toggles (`SystemMode`, `AppMode`).
   - Custom palette overrides for Control Panel colors (`[Control Panel\Colors]`).

5. **Multi-Platform Native Tooling Architecture (Tauri v2):**
   - **Frontend (SvelteKit / TypeScript ESM):**
     - Modern glassmorphism UI with live desktop wallpaper preview frame.
     - Interactive audio player for previewing system sound schemes before packaging.
     - Animated cursor preview canvases for inspecting `.ani` and `.cur` frames.
     - Real-time color pickers for accent colors and system dark/light mode toggles.
   - **Backend (Rust Per-Platform Lib Architecture):**
     - Employs the Per-Platform Lib Architecture (`windows.rs`, `macos.rs`, `linux.rs`) to interface cleanly with host system utilities:
     - **Windows (`windows.rs`):** Orchestrates Microsoft `makecab.exe` Diamond Directive Files (`.ddf`) with MSZIP compression, producing standard-compliant `.deskthemepack` archives with zero asset loss.
     - **macOS (`macos.rs`):** Utilizes native macOS tools to package Dynamic Desktop HEIC timed wallpapers, system sound sets (`.soundpack`), cursor bundles, and macOS system appearance preferences.
     - **Linux (`linux.rs`):** Utilizes native Linux packaging tools and FreeDesktop specifications (FreeDesktop Sound Theme Spec, XDG cursor/icon theme structures, and desktop environment background XML manifests).
     - Headless CLI interface (`theme-toolkit pack:theme:release`) alongside the primary GUI.



---

## 5. Strict Adherence to Microsoft Win32 Theming Documentation

The toolkit strictly adheres to Microsoft Win32 theming specifications (Win32 Visual Styles and Desktop Themes API):

1. **Theme Identifier & Display Metadata (`[Theme]`):**
   - `DisplayName`: Unicode/string localized or literal theme display name.
   - `ThemeId`: Standard RFC 4122 GUID `{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}` ensuring Windows uniquely tracks the theme.

2. **Wallpaper Alignment & Positioning Metrics (`[Control Panel\Desktop]`):**
   - Standard Win32 `WallpaperStyle` values:
     - `0`: Center (`TileWallpaper=0`) or Tile (`TileWallpaper=1`)
     - `2`: Stretch
     - `6`: Fit
     - `10`: Fill (aspect-preserving crop)
     - `22`: Span (seamless spanning across multi-monitor setups)

3. **Sound Events & Registry Alignment (`[Sounds]`):**
   - Direct mapping to Windows Sound Event Registry keys (`HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default`).
   - Ensures sound events fire reliably without registry corruption.

4. **Cursor Scheme Standard Roles (`[Control Panel\Cursors]`):**
   - Strictly enforces the standard 15 Win32 cursor pointer identifiers:
     `Arrow`, `Help`, `AppStarting`, `Wait`, `Crosshair`, `IBeam`, `NWPen`, `No`, `SizeNS`, `SizeWE`, `SizeNWSE`, `SizeNESW`, `SizeAll`, `UpArrow`, `Hand`.
   - Validates that animated cursors (`.ani`) contain valid RIFF/ACON headers and static cursors (`.cur`) contain valid icon directories and hotspot coordinates.

5. **Visual Styles & Modern Colorization (`[VisualStyles]`):**
   - `Path`: `%ResourceDir%\Themes\Aero\Aero.msstyles` (or custom unsigned visual styles when patched).
   - `ColorizationColor`: 32-bit ARGB hex value (`0XAARRGGBB`) for DWM window frames and taskbar accent lighting.
   - `SystemMode` and `AppMode`: Modern Windows 10/11 flags (`Dark` or `Light`).


