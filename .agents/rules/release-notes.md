# Rule: Release Notes Standards

**Status:** BINDING.
**Scope:** All repositories under `projects/` belonging to the `HELIX-Origin` organization.
**Base Reference:** Adapted from `NH-Reader` and `Universal-Game-Launcher` canonical release standards.

---

## Purpose

To establish a uniform, detailed, human-readable, and universal release notes standard across all projects in the workspace. Every project publishes human-friendly release notes that clearly communicate what changed, why it matters, how to verify it, and how to obtain or run it—while strictly adhering to organization-wide Semantic Versioning and the release asset attachment policy.

---

## 1. Universal Semantic Versioning & Release Asset Invariants (MANDATORY)

### Universal Semantic Versioning (SemVer)
> [!IMPORTANT]
> **Every repository in the `HELIX-Origin` organization strictly adheres to Semantic Versioning (`vMAJOR.MINOR.PATCH`).**
> - Milestone-based releases (e.g. `M.01`, `M.02b`) and milestone git tags are **strictly prohibited** organization-wide.
> - Git tags, GitHub Release titles, version manifests, and changelog headers must consistently use SemVer (e.g. `v1.0.0`, `v0.1.0`).
> - Milestone and sprint identifiers are internal project management constructs only within `ROADMAP.md` and `PLAN.md` and must never serve as release versions.

### Release Asset Attachment Invariant
> [!IMPORTANT]
> **Assets must ONLY be uploaded to repositories that distribute a packaged application or resource.**
> - **Packaged Repositories (Assets Allowed):** `universal-game-launcher`, `nh-reader`, `theme-toolkit`, `depressurizer` (desktop installers/binaries) and `ffxiv-config` (packaged configuration archive).
> - **Zero-Asset Repositories (No Uploaded Assets):** `docs`, `wiki`, `helix-origin.github.io`, `helix-jekyll-theme`, `windhawk-themes`, `ugl-db-00` through `03`, `agents`, and `.github`. These repositories publish GitHub Releases with comprehensive release notes, changelog highlights, and git tags, but **never attach binary or zip assets**.

### Repository Versioning & Asset Matrix

| Repository / Project | Versioning Standard | Tag Identifier Pattern | Prebuilt Release Assets Uploaded? | Primary Tracking Docs |
|---|---|---|---|---|
| **universal-game-launcher** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.3.3`) | ✅ Yes (Windows, macOS, Linux desktop installers & packages) | `CHANGELOG.md`, `ROADMAP.md` |
| **nh-reader** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v0.7.5`) | ✅ Yes (Windows, macOS, Linux installers, Android APK) | `CHANGELOG.md`, `ROADMAP.md` |
| **theme-toolkit** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v0.1.0`) | ✅ Yes (Windows, macOS, Linux desktop installers & packages) | `CHANGELOG.md`, `ROADMAP.md` |
| **depressurizer** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ✅ Yes (Windows desktop binaries & packages) | `CHANGELOG.md`, `ROADMAP.md` |
| **ffxiv-config** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v0.1.0`) | ✅ Yes (Packaged configuration archive `ffxiv-config.zip`) | `README.md` |
| **windhawk-themes** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v0.1.0`) | ❌ No (Zero attached assets; git tag only) | `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md` |
| **helix-jekyll-theme** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.1.0`) | ❌ No (Zero attached assets; git remote theme & gem) | `changelog.md` |
| **helix-origin.github.io** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; portal site checkpoint) | `index.md` |
| **docs** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; documentation hub) | `README.md` |
| **wiki** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; technical wiki hub) | `README.md` |
| **ugl-db-00** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v2.0.0`) | ❌ No (Zero attached assets; REST metadata database) | `api/manifest.json` |
| **ugl-db-01** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; REST metadata database) | `api/manifest.json` |
| **ugl-db-02** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; REST metadata database) | `api/manifest.json` |
| **ugl-db-03** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; REST metadata database) | `api/manifest.json` |
| **agents** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ❌ No (Zero attached assets; AI governance ecosystem) | `ROADMAP.md`, `PLAN.md` |

---

## 2. Core Separation of Release Documents

Never conflate release notes with discussion announcements or changelog files:

1. **Release Notes** (Attached directly to GitHub Releases or drafted in `scratch/release-notes.md`):
   - Detailed, human-readable, and universal structure designed for humans deciding whether to update, adopt, or inspect changes.
   - Includes Overview, Highlights, Distribution & Assets, Detailed Changes, Compatibility Matrix, Verification, and Commit History.
   - Never committed to remote if stored in `scratch/`.
2. **Changelog Entry** (`CHANGELOG.md` or `changelog.md`):
   - Persistent chronological record in git history.
   - Grouped by release version and categorized under `Added`, `Changed`, `Fixed`, `Removed`, `Security`.
3. **Release Announcements** (e.g. GitHub Discussions announcements where enabled):
   - Editorial, community narrative explaining the broader theme and ecosystem impact of the release.
   - *Note*: Repositories that do not use GitHub Discussions (such as `helix-jekyll-theme`) do not produce discussion announcements.

---

## 3. Universal Release Notes Specification

Every release notes document published to GitHub Releases across the organization must follow this uniform, detailed, and human-readable format. Use the EXACT emoji prefixes shown below — do not substitute or omit them.

```markdown
# <Project Name> v<MAJOR.MINOR.PATCH>

> <High-impact one-sentence subtitle summarizing the primary theme or breakthrough of this release.>

| Attribute | Value |
|---|---|
| **Release Version** | `v<MAJOR.MINOR.PATCH>` |
| **Release Date** | YYYY-MM-DD |
| **Release Classification** | <Packaged Application Release \| Zero-Asset Source Release> |
| **License** | [<License Name>](<license-url>) |
| **Release Channel** | <Stable / Production \| Preview / Alpha> |

---

## 📋 Overview

<1–2 clear, well-structured paragraphs written for human readers explaining what this release represents, why it matters, core themes, and key benefits to end-users or integrators.>

---

## ✨ Highlights

- **<Key Feature / Milestone>** — <Concise description of the breakthrough, functional improvement, or architectural upgrade>.
- **<Key Feature / Milestone>** — <Concise description of the breakthrough, functional improvement, or architectural upgrade>.
- **<Key Feature / Milestone>** — <Concise description of the breakthrough, functional improvement, or architectural upgrade>.

---

## 📦 Distribution & Packaging

### For Packaged Application / Resource Repositories:
| Artifact Name | Platform / Target | Architecture | Format | Checksum (SHA256) |
|---|---|---|---|---|
| `<app>-<version>-setup.exe` | Windows 10/11 | x64 | NSIS Installer | `<sha256-hash>` |
| `<app>-<version>.dmg` | macOS | Universal / Apple Silicon | Apple Disk Image | `<sha256-hash>` |
| `<app>-<version>.AppImage` | Linux | x86_64 | AppImage | `<sha256-hash>` |
| `<app>-<version>.deb` | Linux (Debian/Ubuntu) | amd64 | Debian Package | `<sha256-hash>` |

### For Zero-Asset Repositories:
> **Zero-Asset Source Release:** In accordance with organization release policy, this repository does not publish prebuilt binary assets. All changes are tagged directly in git and consumed via <package manager / git clone / GitHub Pages remote theme / REST API gateway>.

**Consumption / Installation:**
```bash
<commands to clone, bundle, npm install, or consume the repository>
```

---

## 🔍 What's Changed

### 🆕 Added
- **<Feature / Component>** — <Detailed, user-facing explanation of the addition>.

### 🔄 Changed
- **<Feature / Component>** — <Behavioral, architectural, or design modification>.

### 🐛 Fixed
- **<Issue / Bug>** — <What was broken, edge conditions, and how it behaves now>.

### 🗑️ Removed & Deprecated
- **<Feature / Component>** — <Explanation of what was removed or scheduled for deprecation and alternative recommendations>.

### 🔐 Security, Hygiene & Compliance
- **<Compliance / Security Item>** — <License harmonization, secret hygiene, dependency audits, or permission lockdowns>.

---

## 🔗 Compatibility & Environment Matrix

| Surface / Dependency | Target Requirement | Status / Notes |
|---|---|---|
| <Target Platform / OS> | <e.g. Windows 11 (23H2 / 24H2), macOS 14+, Linux> | ✅ Verified |
| <Runtime / Framework> | <e.g. Node.js 20+, Rust 1.80+, Ruby 3.2+> | ✅ Supported |
| <Ecosystem Component> | <e.g. helix-jekyll-theme v1.1.0, Cloudflare Gateway v2.0> | ✅ Compatible |

---

## 🛡️ Quality Gates & Verification

All changes in this release satisfied repository quality gates before publication:

- [x] **Test Suites**: `<e.g. npm test / cargo test / static linters>` passed with **0 errors, 0 warnings**.
- [x] **Schema Validation**: All JSON / YAML definitions validated against Draft 2020-12 specifications.
- [x] **License Compliance**: Confirmed canonical MIT licensing across all manifests and source headers.
- [x] **Clean Tree**: Staged, verified, and tagged on clean branch `main`.

---

## 📝 Commit History

Full commit comparison: [`https://github.com/HELIX-Origin/<repo>/compare/<previous-tag>...v<current-tag>`](https://github.com/HELIX-Origin/<repo>/compare/<previous-tag>...v<current-tag>)
```

---

## 4. Mandatory Release Verification Checklist

Before publishing any release, the agent must verify:

- [ ] **SemVer compliance**: Tag and release title use `vMAJOR.MINOR.PATCH` (no milestones).
- [ ] **Asset policy compliance**: Zero-asset repos have NO attached files; packaged repos have all required installers/archives.
- [ ] **Release notes format**: Follows Section 3 template EXACTLY, including all emoji prefixes (📋, ✨, 📦, 🔍, 🆕, 🔄, 🐛, 🗑️, 🔐, 🔗, 🛡️, 📝) and all sections (Overview, Highlights, Distribution & Packaging, What's Changed with all five subsections, Compatibility Matrix, Quality Gates, Commit History).
- [ ] **License consistency**: Release notes state the repository's actual license (MIT for helix-jekyll-theme; BSD-3-Clause only where applicable).
- [ ] **No mojibake**: Release notes contain only valid UTF-8 characters with correct emoji — no corrupted `dY...` sequences.
- [ ] **Zero-asset note present** (for zero-asset repos): The Distribution & Packaging section includes the Zero-Asset Source Release callout and consumption instructions.
- [ ] **Commit comparison link**: Points to the correct previous-tag → current-tag comparison URL.

---

## 5. Enforcement

Any release that does not follow this standard must be edited via `gh release edit` to conform before the task is considered complete. Agents must never consider a release "done" until the release notes match this specification byte-for-byte in structure.