# Rule: Release Notes Standards

**Status:** BINDING.
**Scope:** All repositories under `` (except forbidden paths).
**Base Reference:** Adapted from `NH-Reader` release notes and announcement standards.

---

## Purpose

To establish a uniform, high-clarity release notes standard across all projects in the workspace. Each project presents human-friendly release notes that clearly communicate what changed, why it matters, how to verify it, and how to obtain or run it—while rigorously respecting each project's distinct version control system (Milestone-based vs. Semantic Versioning).

---

## 1. Project Versioning Taxonomy

Projects in this workspace do not all use Semantic Versioning (`vX.Y.Z`). Agents must determine and apply the exact versioning type designated for each project:

| Repository / Project | Versioning Type | Version / Tag Identifier Pattern | Prebuilt Release Assets Published? | Primary Tracking Docs |
|---|---|---|---|---|
| **NH-Reader** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v0.7.5`) | ✅ Yes (Windows, macOS, Linux desktop installers; unsigned) | `CHANGELOG.md`, `ROADMAP.md` |
| **Steam-Vault** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.0`) | ✅ Yes (Windows, macOS, Linux desktop installers) | `CHANGELOG.md`, `ROADMAP.md` |
| **Windhawk-Themes** | **Milestone-Based Releases** | `M.<NN>` or `M.<NN><suffix>` (e.g. `M.01`, `M.02b`) | ❌ No (Zero attached assets; git tag only) | `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md` |
| **Hentai-Senpai-Multi-DE-Theme** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.0.1`) | ❌ No (Source git repository + install script) | `CHANGELOG.md` |
| **helix-docs** | **Semantic Versioning (SemVer)** | `v<major>.<minor>.<patch>` (e.g. `v1.1.0`) | ❌ No (Remote Jekyll theme & Ruby gem) | `changelog.md` |
| **helix-origin.github.io** | **Milestone / Chronological** | Date-based or Portal Milestones (e.g. `2026-10-09` or `M.01`) | ❌ No (GitHub Pages portal root) | `docs/` commit log / index |

> [!IMPORTANT]
> **Never invent SemVer tags for milestone-based projects.** In `Windhawk-Themes`, releases are tagged strictly by Milestone identifier (`M.NN`), and external mod versions (e.g., Taskbar Styler `1.10+`) are compatibility markers, not repo versions.

---

## 2. Core Separation of Release Documents

Never conflate release notes with discussion announcements or changelog files:

1. **Release Notes** (`scratch/release-notes.md` or attached to GitHub Releases):
   - Concise technical and user-centric summary.
   - Designed for someone deciding whether to update or inspect changes.
   - Includes Highlights, Key Improvements, Changes, Fixes, Verification, and Local Build/Install instructions.
   - Never committed to remote if stored in `scratch/`.
2. **Changelog Entry** (`CHANGELOG.md` or `changelog.md`):
   - Persistent chronological record in git history.
   - Categorized under `Added`, `Changed`, `Fixed`, `Removed`, `Security`.
3. **Release Announcements** (e.g. GitHub Discussions announcements where enabled):
   - Editorial, long-form community narrative explaining the thematic impact of the release.
   - *Note*: Repositories that do not use GitHub Discussions (such as `helix-docs`) do not produce discussion announcements.

---

## 3. Standard Release Notes Structure

Every release notes document across the workspace must follow this uniform structure, adapted to the project's versioning type:

```markdown
# <Project Name> <Version-Or-Milestone-Tag>

**Release date:** YYYY-MM-DD
**Version Type:** <Semantic Versioning | Milestone Release>

## ✨ Highlights

<1–2 paragraphs: what this release represents in plain language, key themes, and what users get.>

## 🚀 Key Improvements & Features

- **<Feature name>** — <Description of feature, user benefits, and how it works>.
- **<Feature name>** — <Description of feature, user benefits, and how it works>.

## ✅ Changed

- **<Component / Area>** — <Behavioral, architectural, or documentation change>.

## 🐛 Fixed

- **<Bug summary>** — <What was broken and how it behaves now>.

## 🔍 Platform / Compatibility Matrix

<For SemVer apps: OS support matrix or target platforms>
<For Windhawk-Themes: Per-Surface Compatibility Record with external mod versions & Windows 11 builds>
<For Theme / Web projects: Jekyll / GitHub Pages / Browser compatibility>

## 🛠️ Build, Installation & Verification

<Explicit commands to build, sign, or install locally. Never claim prebuilt binaries exist if none are published.>

### Verification Results
- <Checks executed and passed (e.g., test suites, linters, static validators, schema checks)>.

## 📄 Changes & Commits

- `<short-sha>` `<commit message>`
- `<short-sha>` `<commit message>`

Full commit history: `git log --oneline <previous-tag>..<current-tag>`
```

---

## 4. Invariants & Rules

1. **Lead with what the user notices:** Write release notes for humans, not raw git logs.
2. **Honesty regarding assets:** If a project does not publish prebuilt signed binaries or release assets, explicitly document local build/run steps. Never claim downloadable installers exist when they do not.
3. **No credentials or personal data:** Never include signing keys, tokens, passwords, or personal local user paths in release notes.
4. **No unauthorized git operations:** Release notes may be prepared locally in `scratch/release-notes.md` or staged when requested, but git tagging or pushing requires explicit user approval for that exact operation on that exact repository, in the current conversation.
5. **Theme repo precedence:** When releasing theme changes that affect consuming projects, `helix-docs` must always be tagged/pushed first.
