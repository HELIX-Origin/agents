# Skill: Linux Desktop Theme Engineering & Standards

> Domain knowledge and engineering runbook for standards-compliant Linux desktop theming (FreeDesktop & XDG specifications), native cursor compilation, sound themes, timed wallpapers, and native tooling integration for **Theme Toolkit**.

---

## 1. Scope & Standards-First Principles

Unlike ad-hoc shell script installers, the **Theme Toolkit** compiles Linux themes adhering strictly to official **FreeDesktop.org** and **XDG** specifications:
- **FreeDesktop Sound Theme Specification v0.8**
- **XDG Cursor Theme Specification**
- **Desktop Background Metadata XML Specification**
- **KDE Plasma & GTK Standardized Color Palette Schemes**

All themes are packaged for user-space installation under `~/.local/share/` (or system-wide `/usr/share/`) without touching root or modifying core OS files.

---

## 2. FreeDesktop Sound Themes

Linux desktop environments (GNOME, KDE Plasma, XFCE, Cinnamon, MATE) resolve sound events according to the FreeDesktop Sound Theme Specification.

### Directory Hierarchy

```
~/.local/share/sounds/MyTheme/
├── index.theme
└── stereo/
    ├── desktop-login.oga (or .wav)
    ├── desktop-logout.oga
    ├── dialog-information.oga
    ├── dialog-warning.oga
    ├── dialog-error.oga
    ├── bell-window-system.oga
    ├── trash-empty.oga
    ├── device-added.oga
    └── device-removed.oga
```

### `index.theme` Schema

```ini
[Sound Theme]
Name=My Custom Sound Theme
Comment=Modern dark obsidian sound scheme by HELIX Origin
Directories=stereo

[stereo]
OutputProfile=stereo
```

---

## 3. XDG Cursor Themes & `xcursorgen`

Linux cursors (X11 and Wayland) are compiled into binary format using the native tool `xcursorgen`.

### Cursor Configuration (`arrow.cursor`)

```
# size xhot yhot file delay
32 4 4 frames/arrow-32.png 50
48 6 6 frames/arrow-48.png 50
64 8 8 frames/arrow-64.png 50
```

### Compilation Command

```bash
xcursorgen arrow.cursor ~/.local/share/icons/MyCursorTheme/cursors/default
```

### Standard Symlink Hierarchy

To support diverse applications and desktop toolkits, canonical cursor names are symlinked:
- `pointer` -> `hand2` -> `link`
- `wait` -> `watch`
- `progress` -> `left_ptr_watch`
- `text` -> `xterm` -> `ibeam`
- `crosshair` -> `cross`

---

## 4. Timed Background XML Schema

Dynamic or timed wallpapers (cycling across dawn, day, dusk, night) are specified via standard background XML:

```xml
<background>
  <starttime>
    <year>2026</year>
    <month>01</month>
    <day>01</day>
    <hour>07</hour>
    <minute>00</minute>
    <second>00</second>
  </starttime>
  <!-- Static display for 30 minutes (1795.0s static + 5.0s transition) -->
  <static>
    <duration>1795.0</duration>
    <file>/home/user/.local/share/backgrounds/MyTheme/01-dawn.png</file>
  </static>
  <transition>
    <duration>5.0</duration>
    <from>/home/user/.local/share/backgrounds/MyTheme/01-dawn.png</from>
    <to>/home/user/.local/share/backgrounds/MyTheme/02-day.png</to>
  </transition>
</background>
```

---

## 5. Color Scheme Definitions

### KDE Plasma `.colors` Schema

```ini
[General]
Name=HELIX Obsidian
ColorScheme=HELIX Obsidian

[Colors:Window]
BackgroundNormal=14,20,27
ForegroundNormal=240,246,252

[Colors:Selection]
BackgroundNormal=26,159,255
ForegroundNormal=255,255,255
```

### Standard GTK / Libadwaita Tokens

```css
@define-color accent_color #1a9fff;
@define-color accent_bg_color #1a9fff;
@define-color window_bg_color #0e141b;
@define-color window_fg_color #f0f6fc;
```
