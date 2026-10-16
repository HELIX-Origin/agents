# Skill: Linux Desktop & GTK Theme Engineering

> [!WARNING]
> **DISCONTINUED & ARCHIVED**
> `projects/Hentai-Senpai-Multi-DE-Theme` has been discontinued and archived. This skill is preserved strictly as an unmaintained historical reference. Do not perform active development on Linux/GTK theming.

> Domain knowledge and engineering runbook for GTK2/3/4 and desktop environment theming (`projects/Hentai-Senpai-Multi-DE-Theme`).

---

## 1. Supported Desktop Environments & Toolkits

- **GTK Toolkits:**
  - `gtk-2.0`: Classical widget styling and pixmap assets (`gtkrc`).
  - `gtk-3.0`: CSS-based theming with Nord color palette variables (`gtk.css`).
  - `gtk-4.0`: Modern GTK4 CSS specifications and libadwaita styling.
- **Window Managers & Shells:**
  - GNOME Shell (40+) (`gnome-shell/gnome-shell.css`).
  - Cinnamon (`cinnamon/cinnamon.css`).
  - XFCE / xfwm4 (`xfwm4/themerc`).
  - Metacity (`metacity-1/metacity-theme-*.xml`).
  - Plank Dock (`plank/dock.theme`).

---

## 2. Installation & Verification

Themes are deployed using POSIX shell scripts:

```bash
# Verify shell syntax without executing
bash -n install.sh
bash -n scripts/apply.sh
bash -n scripts/core.sh

# Test installation with destination override
./install.sh --dest "$HOME/.themes"
```

---

## 3. Versioning & Changelog Guidelines

Follow Semantic Versioning (`v1.0.1`, `v1.1.0`). Any visual, asset, or compatibility update must be recorded in `CHANGELOG.md` under standard `Added`, `Changed`, and `Fixed` sections.
