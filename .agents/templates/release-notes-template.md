# Workspace Release Notes Templates

This document provides ready-to-use release notes templates for all projects in ``, adapted from the `NH-Reader` canonical release notes standard.

---

## 1. Semantic Versioning Template (NH-Reader, Steam-Vault, helix-docs)

Use this format for software and themes adhering to Semantic Versioning (`v<major>.<minor>.<patch>`).

````markdown
# {{ project.name }} v{{ version }}

**Release date:** {{ YYYY-MM-DD }}
**Version Type:** Semantic Versioning (`v{{ version }}`)

## ✨ Highlights

{{ highlights.paragraph }}

## 🚀 Key Improvements & Features

- **{{ feature.title }}** — {{ feature.description }}
- **{{ feature.title }}** — {{ feature.description }}

## ✅ Changed

- Bumped project version to `{{ version }}` across project manifests and documentation.
- **{{ change.area }}** — {{ change.description }}

## 🐛 Fixed

- **{{ bug.summary }}** — {{ bug.fix_details }}

## 🔍 Platform / Compatibility Matrix

| Platform / Target | Minimum Version | Status |
|---|---|---|
| {{ target.name }} | {{ target.version }} | ✅ Supported |

## 🛠️ Build, Installation & Verification

{{ local.build.instructions }}

### Verification Results

- `{{ check.command }}` — {{ check.status }}

## 📄 Changes & Commits

- `{{ short.sha }}` {{ commit.message }}

Full commit history: `git log --oneline v{{ previous.version }}..v{{ version }}`
````

---

## 2. Milestone Release Template (Windhawk-Themes, Portal Milestones)

Use this format for projects that track progress and releases via **Milestones** (`M.<NN>`) with zero attached release assets.

````markdown
# {{ project.name }} Milestone {{ milestone.id }}: {{ milestone.title }}

**Release date:** {{ YYYY-MM-DD }}
**Release Tag:** `{{ milestone.id }}` (Zero attached assets)
**Version Type:** Milestone-Based Release

## ✨ Highlights

{{ milestone.highlights }}

## 🚀 Surface Enhancements & Features

- **{{ surface.name }}** — {{ surface.enhancement_description }}
- **{{ feature.title }}** — {{ feature.description }}

## ✅ Changed

- **{{ change.area }}** — {{ change.description }}

## 🐛 Fixed

- **{{ bug.summary }}** — {{ bug.fix_details }} (tracked in `BUGS.md`)

## 🔍 Per-Surface Compatibility Record

| Surface / Styler File | Windhawk Mod (ID) | External Mod Version | Windows 11 Build(s) | Status |
|---|---|---|---|---|
| `projects/<project>/windows-11-taskbar-styler.yml` | Taskbar Styler | 1.10+ | 23H2 / 24H2 | ✅ Supported |
| `projects/<project>/windows-11-start-menu-styler.yml` | Start Menu Styler | 1.7+ | 23H2 / 24H2 | ✅ Supported |
| `projects/<project>/windows-11-notification-center-styler.yml` | Notification Center Styler | 1.7+ | 23H2 / 24H2 | ✅ Supported |
| `projects/<project>/windows-11-settings-styler.yml` | Settings Styler | 1.0+ | 23H2 / 24H2 | ✅ Supported |

*Note: Mod versions reflect external Windhawk mod releases, not repository suite versions.*

## 🛠️ Validation & Verification Gate

There are zero attached compiled assets. Releases strictly verify repository source styles and YAML definitions.

### Verification Results

- [ ] **Static Validation Gate**: `pwsh -NoProfile -File tools/Test-WindhawkStyles.ps1` passed with 0 errors.
- [ ] **Live Surface Checklist**: Completed for all surfaces modified during this milestone.

## 📄 Changes & Commits

- `{{ short.sha }}` {{ commit.message }}

Full commit history: `git log --oneline {{ previous.milestone }}..{{ milestone.id }}`
````
