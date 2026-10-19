# Rule: Project Artwork Standards

**Status:** BINDING.

## Purpose

Enforces visual consistency, technical compliance, and branding integrity for all project showcase artwork, cards, and banner images across the HELIX Origin organization.

---

## 1. Format & Canvas Geometry

- **Primary Source of Truth:** Scalable Vector Graphics (`.svg`). Vector assets scale infinitely and render crisply across high-DPI displays.
- **Canvas Aspect Ratio:** Strict **16:9** widescreen (`viewBox="0 0 1920 1080"`).
- **Self-Contained Requirement:** All artwork must be self-contained vector geometry. External bitmap hotlinks, un-embedded remote URLs, or raster dependencies inside `<image>` tags are prohibited.

---

## 2. Visual Architecture & Layout Invariants

Every project banner/thumbnail must strictly conform to the 1920×1080 layout grid:

```
+-----------------------------------------------------------------------------------+
| (0, 0)                                                      [Radial Glow 1700,150]|
|                                                                                   |
|     +-------------------------+   |  Title: HELIX Project                         |
|     |                         |   |                                               |
|     |   Icon Plate (450x450)  |   |  Subtitle: Descriptive Subtitle               |
|     |   (218, 315)  rx=72     |   |                                               |
|     |                         |   |  CATEGORY TAG TRACKING                        |
|     +-------------------------+   |                                               |
|                                   ^ Accent Divider (820, 376, w=10, h=328)        |
| [Diagonal Light Streak]           |                         [Radial Glow 1400,900]|
+-----------------------------------------------------------------------------------+
```

### Exact Coordinates

| Element | Position / Geometry | Notes |
|---|---|---|
| **Background Rect** | `x=0, y=0, width=1920, height=1080` | Gradient fill (`#07111f` → `#040a14` or project dark base) |
| **Diagonal Streak** | `d="M0 930 750 180h360L360 1080H0z"` | `fill="#fff" opacity=".025"` |
| **Outer Icon Glow** | `x=198, y=295, width=490, height=490, rx=92` | `fill="#fff" opacity=".08"` |
| **Icon Container** | `x=218, y=315, width=450, height=450, rx=72` | Defines `<clipPath id="icon">` |
| **Accent Divider** | `x=820, y=376, width=10, height=328, rx=5` | Gradient fill matching project accent |
| **Primary Title** | `x=880, y=485` (or `y=510` for single line) | `font-size="82-96"`, `font-weight="700"` |
| **Secondary Title**| `x=880, y=585` | `font-size="56"`, `font-weight="600"` |
| **Category Pill** | `x=885, y=660` | `font-size="32-34"`, `letter-spacing="8"` |

---

## 3. Brand Color Palettes

Artwork must honor the specific project's visual identity while staying grounded in the dark obsidian HELIX design system:

| Project | Base Dark | Primary Accent | Secondary Accent |
|---|---|---|---|
| **helix-docs** | `#07111f` / `#040a14` | `#48d8f2` (Cyan) | `#b06cff` (Purple) |
| **Windhawk-Themes** | `#081426` / `#050c18` | `#48d8f2` (Specular Glass) | `#b06cff` (Windhawk Accent) |
| **NH-Reader** | `#171424` / `#101820` | `#9275ff` (Violet) | `#65d6df` (Teal) |
| **Universal-Game-Launcher** | `#120e24` / `#0a0814` | `#9d4edd` (Neon Purple) | `#38bdf8` (Cyan Blue) |
| **Theme-Toolkit** | `#0a121e` / `#050911` | `#38bdf8` (Sky Cyan) | `#a855f7` (Orchid Purple) |

---

## 4. Verification & ImageMagick Protocol

1. **Syntax Integrity:** SVG must be valid XML with proper closing tags and namespace declarations (`xmlns="http://www.w3.org/2000/svg"`).
2. **ImageMagick Verification:** Before committing any project artwork, run ImageMagick to verify vector parsing and test raster export:
   ```powershell
   magick "<path-to-svg>" "$env:TEMP/verify-output.png"
   ```
3. **Zero Errors:** ImageMagick must render the file without RSVG parser errors, clipped geometries, or unclosed paths.

---

## 5. Portal Consumption Rules

In `helix-origin.github.io/index.md`:
- Every project card must point to a local relative SVG asset:
  ```html
  <img src="{{ '/assets/images/<project-slug>.svg' | relative_url }}" alt="<Project Name> icon and project name" loading="lazy" decoding="async">
  ```
- Never use hotlinked GitHub avatar URLs (`https://github.com/...png`) for project cards on the portal.
