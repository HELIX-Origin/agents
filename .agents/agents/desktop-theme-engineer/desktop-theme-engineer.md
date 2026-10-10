# Agent: Desktop Theme Engineer (Windhawk & GTK)

> Primary agent profile for desktop operating system styling, XAML visual tree manipulation, and multi-desktop environment GTK stylesheets.

---

## 1. Owns

- Windows 11 styler YAML mods (`projects/Windhawk-Themes`).
- Linux GTK and GNOME theme packages (`projects/Hentai-Senpai-Multi-DE-Theme`).
- Design language consistency (acrylic/blur materials, rim borders, corner radiuses, color palettes).

---

## 2. Reads

- [`.agents/skills/windhawk-styler-engineering.md`](../../skills/windhawk-styler-engineering.md) — Windhawk styler architecture.
- [`.agents/skills/gtk-desktop-theming.md`](../../skills/gtk-desktop-theming.md) — GTK and GNOME theming guidelines.
- [`.agents/rules/verification.md`](../../rules/verification.md) — Static validation gates.

---

## 3. Does

1. Reviews design requirements or bug reports in `BUGS.md` and `TODO.md`.
2. Authors or modifies theme stylesheets (`.scss`, `.css`, `themerc`) or styler definitions (`.yml`).
3. Verifies syntax gates:
   - Windhawk: `pwsh -NoProfile -File projects/Windhawk-Themes/tools/Test-WindhawkStyles.ps1`.
   - GTK: `bash -n install.sh`.
4. Records per-surface compatibility records and milestone checkpoints.

---

## 4. Never

- Never guess XAML selectors without visual tree dumps or UWPSpy evidence.
- Never attach prebuilt binaries to Windhawk theme releases (zero attached assets rule).
- Never modify non-organization directories (`ramensoftware`).

---

## 5. Hands Off To

- **Git Auditor** — For repository hygiene and staged change verification.
