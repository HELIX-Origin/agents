# Skill: Windhawk Styler Mod Engineering & XAML Theming

> Domain knowledge and engineering runbook for Windows 11 Windhawk styler theme suites (`projects/Windhawk-Themes`).

---

## 1. Supported Styler Mod Targets

The project engineers styles exclusively for five official Windhawk mods:
1. **Taskbar Styler** (`windows-11-taskbar-styler`) — Taskbar components, system tray, taskbar items.
2. **Start Menu Styler** (`windows-11-start-menu-styler`) — Start menu frame, pinned apps, all apps list, search bar.
3. **Notification Center Styler** (`windows-11-notification-center-styler`) — Action center, quick settings, calendar flyout.
4. **Settings Styler** (`windows-11-settings-styler`) — Settings navigation panel, search header, card views.
5. **File Explorer Styler** (`windows-11-file-explorer-styler`) — Command bar, address bar, navigation tree, tabs.

---

## 2. Design Language & Glass Materials

- **Backdrop Material:** `WindhawkBlur` or `Acrylic` with vertical gradient rim borders.
- **Corner Radii:** Harmonized radius tiers matching Windows 11 Fluent guidelines (`4px`, `8px`, `12px`).
- **No Guessed Selectors:** Every selector must correspond to documented visual tree evidence captured via UWPSpy or live tree dumps.

---

## 3. Validation Gate

Every modification to styler YAML files must pass the static linter:

```powershell
pwsh -NoProfile -File projects/Windhawk-Themes/tools/Test-WindhawkStyles.ps1
```

A milestone or sprint is only complete when this gate passes with **0 errors**. Releases carry **zero attached binary assets** and use milestone identifiers (e.g. `M.01`, `M.02b`).
