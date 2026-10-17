# Workspace Release Notes Template

This template provides the authoritative, detailed, human-readable, and universal release notes blueprint for all repositories in the **HELIX Origin** organization (`projects/`).

Every repository uses Semantic Versioning (`vMAJOR.MINOR.PATCH`). Use this template for drafting GitHub Releases, adapting the packaging section depending on whether the project distributes prebuilt binaries or zero-asset source trees.

---

```markdown
# {{ project.name }} v{{ version }}

> {{ release.tagline }}

| Attribute | Value |
|---|---|
| **Release Version** | `v{{ version }}` |
| **Release Date** | {{ YYYY-MM-DD }} |
| **Release Classification** | {{ Packaged Application Release | Zero-Asset Source Release }} |
| **License** | [BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause) |
| **Release Channel** | {{ Stable / Production | Preview / Alpha }} |

---

## 📖 Overview

{{ overview.paragraphs }}

---

## ✨ Highlights

- **{{ highlight.title }}** — {{ highlight.description }}
- **{{ highlight.title }}** — {{ highlight.description }}
- **{{ highlight.title }}** — {{ highlight.description }}

---

## 📦 Distribution & Packaging

{% if project.is_packaged %}
### Prebuilt Installation Packages
| Artifact Name | Platform / Target | Architecture | Format | Checksum (SHA256) |
|---|---|---|---|---|
| `{{ artifact.filename }}` | {{ artifact.platform }} | {{ artifact.arch }} | {{ artifact.format }} | `{{ artifact.sha256 }}` |
{% else %}
> [!NOTE]
> **Zero-Asset Source Release:** In accordance with organization release policy, this repository does not publish prebuilt binary assets. All changes are tagged directly in git and consumed via {{ package.manager / remote_theme / git clone / API gateway }}.
>
> **Consumption / Installation:**
> ```bash
> {{ consumption.instructions }}
> ```
{% endif %}

---

## 🚀 What's Changed

### 🌟 Added
- **{{ feature.area }}** — {{ feature.description }}

### 🔄 Changed
- **{{ change.area }}** — {{ change.description }}

### 🐛 Fixed
- **{{ bug.summary }}** — {{ bug.fix_details }}

### 🗑️ Removed & Deprecated
- **{{ deprecation.summary }}** — {{ deprecation.details }}

### 🛡️ Security, Hygiene & Compliance
- **{{ compliance.summary }}** — {{ compliance.details }}

---

## 🔍 Compatibility & Environment Matrix

| Surface / Dependency | Target Requirement | Status / Notes |
|---|---|---|
| {{ target.name }} | {{ target.version_range }} | ✅ Verified |
| {{ runtime.name }} | {{ runtime.version_range }} | ✅ Supported |

---

## 🧪 Quality Gates & Verification

All changes in this release satisfied repository quality gates before publication:

- [x] **Test Suites**: `{{ verification.test_command }}` passed with **0 errors, 0 warnings**.
- [x] **Schema Validation**: Verified against canonical schemas.
- [x] **License Compliance**: Canonical BSD-3-Clause headers and license files verified.
- [x] **Clean Tree**: Tagged on clean branch `main`.

---

## 📄 Commit History

Full commit comparison: [`https://github.com/HELIX-Origin/{{ repo.name }}/compare/{{ previous.tag }}...v{{ version }}`](https://github.com/HELIX-Origin/{{ repo.name }}/compare/{{ previous.tag }}...v{{ version }})
```
