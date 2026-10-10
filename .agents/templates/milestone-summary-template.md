# Milestone Summary & Sprint Release Template

Use this template when a sprint or milestone checkpoint completes for projects operating under **Milestone-Based Releases** (such as `projects/Windhawk-Themes`).

---

# Milestone Summary — {{ milestone.id }}: {{ milestone.title }}

- **Date:** {{ YYYY-MM-DD }}
- **Release Tag:** `{{ milestone.id }}` (Zero attached assets)
- **Status:** {{ Planned | Active | Complete }}

---

## 1. Overview & Objectives

{{ milestone.summary_paragraph }}

---

## 2. Per-Surface Compatibility Record

| Surface / Styler File | Windhawk Mod (ID) | External Mod Version | Windows 11 Build(s) | Status |
|---|---|---|---|---|
| `projects/<project>/windows-11-taskbar-styler.yml` | Taskbar Styler | 1.10+ | 23H2 / 24H2 | {{ status }} |
| `projects/<project>/windows-11-start-menu-styler.yml` | Start Menu Styler | 1.7+ | 23H2 / 24H2 | {{ status }} |
| `projects/<project>/windows-11-notification-center-styler.yml` | Notification Center Styler | 1.7+ | 23H2 / 24H2 | {{ status }} |
| `projects/<project>/windows-11-settings-styler.yml` | Settings Styler | 1.0+ | 23H2 / 24H2 | {{ status }} |
| File Explorer | File Explorer Styler | 1.7+ | 23H2 / 24H2 | Deferred |

*External mod versions are Windhawk mod releases, not suite milestone versions.*

---

## 3. Work Completed

### ✨ Added
- **{{ item.title }}** — {{ item.description }}

### 🎨 Changed
- **{{ item.title }}** — {{ item.description }}

### 🐛 Fixed
- **{{ bug.title }}** — {{ bug.fix_details }} (closed in `BUGS.md`)

---

## 4. Verification Results

- [ ] **Static Validation Gate:** `pwsh -NoProfile -File tools/Test-WindhawkStyles.ps1` passed with **0 errors**.
- [ ] **Desktop Visual Inspection:** Confirmed backdrop acrylic/blur, borders, and margins on target Windows 11 desktop.

---

## 5. Known Issues & Next Milestone

- {{ open.issues }}
- Next milestone scope: `{{ next.milestone.id }}`
