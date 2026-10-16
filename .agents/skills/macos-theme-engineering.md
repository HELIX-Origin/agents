# Skill: macOS Desktop Theme Engineering & Packaging

> Domain knowledge and engineering runbook for macOS system customization, Dynamic Desktop HEIC wallpaper generation, soundpack bundling, and native macOS tooling integration for **Theme Toolkit**.

---

## 1. Overview of macOS Theming Capabilities

macOS supports system-level personalization through four primary surfaces:
1. **Dynamic Desktops:** Solar or time-based dynamic `.heic` wallpapers that adjust lighting and scenery across the day.
2. **System Sound Sets:** Audio bundles triggering on alert events, trash emptying, screenshots, and notification banners.
3. **Mouse Pointer & Cursors:** Custom pointer assets with high-DPI retina resolutions (1x, 2x) and accessibility scaling.
4. **System Appearance & Accent Colors:** System-wide dark/light mode switches, accent colors, and highlight colors.

---

## 2. Dynamic Desktop HEIC Architecture

A macOS dynamic desktop is a High Efficiency Image Container (`.heic`) containing multiple image frames paired with embedded Apple-specific metadata in the XMP header.

### Metadata Types

1. **Solar-Based (Sun Position):**
   - Renders frames based on the sun's solar altitude and azimuth at the user's geographic location.
   - Requires metadata keys: `si` (solar index), `a` (altitude angle), `z` (azimuth angle).
2. **Time-Based (Clock Interval):**
   - Renders frames based on the local time of day (24-hour cycle).
   - Requires metadata keys: `ti` (time index), `time` (normalized timestamp float `0.0` to `1.0`).

### Apple Desktop Metadata Schema (`apple_desktop:solar` / `apple_desktop:timed`)

Encoded as base64-packed plist or XMP XML embedded inside the primary HEIC image:

```xml
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:apple_desktop="http://ns.apple.com/namespace/1.0/">
      <apple_desktop:solar>
        <!-- Base64 encoded property list of solar angle frame tables -->
      </apple_desktop:solar>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
```

### Native Tooling & Assembly on macOS

In the Theme Toolkit Rust backend (`src-tauri/src/platforms/macos.rs`):
- Uses native `sips` (Scripting Image Processing System) and CoreGraphics/ImageIO APIs to write multi-image HEIC sequences.
- Injects `apple_desktop` metadata dictionary into the destination container.

---

## 3. macOS System Sound Sets (`.soundpack`)

macOS system sounds reside under `~/Library/Audio/Sounds/Alerts/` or inside self-contained soundpack bundles.

### Soundpack Bundle Structure

```
MyTheme.soundpack/
├── Contents/
│   ├── Info.plist
│   └── Resources/
│       ├── alert.wav
│       ├── trash_empty.wav
│       ├── screenshot.wav
│       ├── volume_change.wav
│       └── notification.wav
```

### `Info.plist` Audio Mapping Schema

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>org.helix-origin.soundpack.mytheme</string>
    <key>CFBundleName</key>
    <string>My Custom Soundpack</string>
    <key>SoundThemeVersion</key>
    <string>1.0</string>
    <key>Sounds</key>
    <dict>
        <key>SystemAlert</key>
        <string>alert.wav</string>
        <key>EmptyTrash</key>
        <string>trash_empty.wav</string>
        <key>GrabWindow</key>
        <string>screenshot.wav</string>
    </dict>
</dict>
</plist>
```

---

## 4. Accent & Highlight Colors

On macOS, system appearance and color accents are configured via the `NSGlobalDomain`:

- **Dark Mode / Light Mode:**
  ```bash
  osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'
  ```
- **Accent Color:**
  ```bash
  # Options: -1 (Graphite), 0 (Red), 1 (Orange), 2 (Yellow), 3 (Green), 4 (Blue), 5 (Purple), 6 (Pink)
  defaults write -g AppleAccentColor -int 5
  ```
- **Highlight Color (Hex RGBA floats):**
  ```bash
  defaults write -g AppleHighlightColor -string "0.57 0.42 1.0 1.0"
  ```
