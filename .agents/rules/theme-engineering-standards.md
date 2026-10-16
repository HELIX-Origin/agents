# Theme Engineering & Packaging Standards

> Authoritative rules for desktop theme authoring, multi-platform packaging (Windows, macOS, Linux), and the **Theme Toolkit** desktop application (`projects/Theme-Toolkit`).

---

## 1. Absolute Invariants — Multi-Platform Packaging

1. **Zero-Asset Loss & Structure Integrity:**
   - Every packaged theme archive must contain 100% of its referenced visual, audio, and cursor assets with verified archive integrity.
   - Relative paths within theme descriptors (`.theme`, `.plist`, `.theme` INI, XML manifests) must resolve strictly to files packaged inside the archive. Never bake absolute local machine paths (`C:\Users\<user>\...` or `/home/<user>/...`) into exported themes.

2. **Never Use Broken Native Exporters:**
   - **Windows:** Never use the Windows Settings GUI "Save theme for sharing" exporter, which silently drops sound schemes, strips cursor schemes, hardcodes user profile paths, and generates corrupted CAB headers. All Windows `.deskthemepack` archives must be compiled using Microsoft `makecab.exe` driven by a Diamond Directive File (`.ddf`) with MSZIP compression.
   - **macOS:** Never generate unstructured zip archives for dynamic wallpapers. Dynamic wallpapers must be compiled into standard Multi-Picture Object (MPO) or EXIF/XMP-annotated HEIC containers.
   - **Linux:** Never distribute ad-hoc shell script installers modifying system root directories. All Linux themes must conform strictly to FreeDesktop / XDG specifications for local user installation (`~/.local/share/`).

3. **Strict Adherence to Platform Specifications:**
   - **Windows:** Follow Microsoft Win32 Visual Styles and Desktop Themes API (`[Theme]`, `[Control Panel\Desktop]`, `[VisualStyles]`, `[MasterThemeSelector]`, `[Control Panel\Cursors]`, `[Sounds]`).
   - **macOS:** Follow Apple Dynamic Desktop solar/timed metadata specifications, System Sound Set bundle layouts, and macOS appearance preference keys.
   - **Linux:** Follow FreeDesktop Sound Theme Specification v0.8, XDG Cursor Theme Specification, and desktop environment background XML schema.

---

## 2. Asset Standards

### Sound Schemes
- **Windows / macOS:** Uncompressed PCM `.wav` format, 16-bit or 24-bit, 44.1 kHz or 48 kHz stereo.
- **Linux:** Uncompressed PCM `.wav` or Ogg Vorbis (`.ogg`), 44.1 kHz / 48 kHz.
- **Normalization:** All audio cues must be loudness-normalized to **-14 LUFS** (integrated) with a true peak ceiling of **-1.0 dBFS** to prevent clipping and ensure comfortable listening across headphones and speakers.
- **Duration:** System event cues should be punchy and brief (alert/error: 200–600 ms; logon/logoff: 1.5–3.5 s max).

### Cursor Schemes
- **Windows:** Standard 15 Win32 roles (`Arrow`, `Help`, `AppStarting`, `Wait`, `Crosshair`, `IBeam`, `NWPen`, `No`, `SizeNS`, `SizeWE`, `SizeNWSE`, `SizeNESW`, `SizeAll`, `UpArrow`, `Hand`). Static `.cur` pointers must include multiple resolutions (32x32, 48x48, 64x64) with verified hotspot coordinates; animated `.ani` pointers must feature valid RIFF/ACON chunk headers and sequence frame rates.
- **macOS:** Standard macOS pointer sets with high-DPI retina assets (1x, 2x) and correct hotspot anchor points.
- **Linux:** Standard XDG cursor themes with `index.theme` descriptor and cursor binaries compiled from PNG frame tables via `xcursorgen`.

### Wallpapers & Slideshows
- **Aspect Ratios & Resolutions:** Default wallpapers must be provided in at least 4K UHD (`3840x2160`, 16:9) and optionally Ultrawide (`3440x1440`, 21:9).
- **Windows Slideshows:** Transition intervals must be specified in milliseconds (default: 30 minutes = `1800000` ms) with `Shuffle` flag support.
- **macOS Dynamic Wallpapers:** Solar altitude/azimuth calculation matrices or 24-hour time arrays embedded in HEIC metadata.
- **Linux Timed Wallpapers:** Clean XML duration blocks (`<static><duration>1795.0</duration><file>...</file></static><transition><duration>5.0</duration>...`).

### Color Palette & Accessibility
- **Contrast Ratios:** Foreground UI elements and text against theme backgrounds must achieve at least **4.5:1** contrast ratio (WCAG AA standard).
- **Dual Mode Support:** All complete theme packages must define both Light Mode and Dark Mode color tokens.

---

## 3. Theme Toolkit Application Architecture Invariants

1. **Per-Platform Lib Isolation:**
   - In accordance with `.agents/skills/tauri-desktop-engineering.md`, the backend must strictly isolate platform-specific theme compilers:
     - `src-tauri/src/platforms/windows.rs` — `makecab.exe` orchestration, `.ddf` synthesis, Win32 registry mapping.
     - `src-tauri/src/platforms/macos.rs` — CoreGraphics/ImageIO HEIC dynamic wallpaper generation, soundset bundling.
     - `src-tauri/src/platforms/linux.rs` — `xcursorgen` execution, FreeDesktop sound theme index generator, XML manifest builder.
2. **Interactive Preview Fidelity:**
   - The Tauri v2 GUI must provide live, accurate previews before export:
     - Desktop wallpaper viewport with multi-monitor aspect ratio previews.
     - Waveform audio player for auditioning system sound events.
     - Animated cursor playback canvas displaying active hotspot coordinates.
     - Real-time colorization swatch selector.
