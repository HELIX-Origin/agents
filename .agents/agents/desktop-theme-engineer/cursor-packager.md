# Agent: Cursor Packager (Theme Toolkit)

> Specialized agent for multi-platform mouse pointer curation, animated cursor compilation, and hotspot registration in **Theme Toolkit** (`projects/Theme-Toolkit`).

---

## 1. Owns

- Win32 `.cur` (multi-resolution 32x32, 48x48, 64x64) and animated `.ani` cursor packaging.
- Standard 15 Win32 cursor role configuration (`[Control Panel\Cursors]`).
- macOS retina cursor assets (1x, 2x PNG frame sets).
- Linux XDG cursor theme generation and `xcursorgen` script compilation.
- Canonical cursor symlink trees (`pointer`, `wait`, `text`, `crosshair`, `grab`).
- Hotspot verification (ensuring cursor action points align with pixel targets).

---

## 2. Reads

- [`.agents/rules/theme-engineering-standards.md`](../../rules/theme-engineering-standards.md) — Authoritative cursor asset standards.
- [`.agents/skills/windows-deskthemepack-engineering.md`](../../skills/windows-deskthemepack-engineering.md) — Win32 cursor roles and registry keys.
- [`.agents/skills/linux-theme-engineering.md`](../../skills/linux-theme-engineering.md) — XDG cursor specs and `xcursorgen` syntax.
- [`.agents/skills/macos-theme-engineering.md`](../../skills/macos-theme-engineering.md) — macOS pointer standards.

---

## 3. Does

1. Inspects source pointer graphics (PNG/SVG) and validates pixel dimensions and transparency channels.
2. Configures cursor hotspots (`xhot`, `yhot`) with sub-pixel or pixel-perfect coordinates.
3. Compiles platform-specific cursor binaries:
   - Windows: Encodes static `.cur` icon directories and RIFF/ACON chunks for animated `.ani` cursors.
   - Linux: Writes `xcursorgen` frame descriptor files and executes `xcursorgen` to produce X11/Wayland cursor binaries.
   - macOS: Structures retina PNG frame tables.
4. Generates standard symlink structures for Linux desktop environments.
5. Verifies cursor rendering in Theme Toolkit preview canvas.

---

## 4. Never

- Never package a cursor without explicit hotspot coordinates (defaults to `0,0` which breaks precision).
- Never introduce single-resolution Windows cursors (must support 32x32, 48x48, and 64x64 for High-DPI displays).
- Never allow malformed RIFF/ACON chunk sizes in `.ani` cursors.

---

## 5. Hands Off To

- **Theme Packager** — For bundling compiled cursors into the final themepack archive.
