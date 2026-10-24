# Rule: Documentation & Content Standards

**Status:** BINDING — GLOBAL.
**Scope:** Every agent, every project under `projects/`, and the workspace tracking docs.
**Applies to:** Project `README.md` entry points, each project's own documentation files, and workspace root Markdown.

---

## Purpose

To establish authoritative documentation standards across the **HELIX Origin** organization. The organization's centralized documentation and technical-wiki hub sites are **retired**; rebuilds are planned for later (unscheduled). Until they exist, each project keeps its documentation self-contained in its own repository, and nothing links to retired hub addresses.

---

## 1. Documentation Surfaces

| Surface | Status | Responsibility |
|---|---|---|
| **Project `README.md`** | Active | Minimal entry point (see §3). |
| **Project documentation files** | Active (interim) | Each project's own manuals and technical notes, kept in that repository (for example a `docs/` folder or Markdown files at the root). No GitHub Pages site is required. |
| **Centralized documentation hub** | Retired — rebuild planned | Product documentation and a catalogue/store section. When rebuilt, it follows §2. |
| **Centralized technical wiki hub** | Retired — rebuild planned | Deep technical and architectural references. When rebuilt, it follows §2. |
| **Organization portal** | Retired — rebuild planned | Discovery gateway linking to the hubs. |

> Never create, link to, or describe the retired hubs as live. Planning a rebuild is tracked as an unscheduled backlog item in the workspace ledgers, not as documentation.

---

## 2. Theme-Neutrality & Mod-Agnostic Rule (MANDATORY for all documentation)

Any documentation (project docs now, hub content later) explains *how to work with the software and mods*. It never promotes or encodes an individual author's theme.

1. **Theme-neutral & mod-agnostic:** Documentation describes valid visual targets, mod schemas, engine mechanisms, and *how to use or build for the software*. It stays general, reusable, and free of author-specific theme branding.
2. **Catalogue isolation:** An author's specific theme/suite (its exact color palette, token names, radius scales, glass recipes, and geometries) lives **strictly in a catalogue/store section**, never in general guides.
3. **Hard prohibitions:**
   - Never make a catalogue theme or suite the source of truth for general documentation.
   - Never copy a specific catalogue theme's token names or recipes into general guides.
   - A catalogue may link to general documentation; general documentation must never depend on the catalogue.

---

## 3. Repository README Minimal Entry Point Standard (MANDATORY)

Every project repository under `projects/` must maintain a concise, minimal entry point `README.md` (~30–50 lines).

### Invariant Rules:
1. **README stays minimal:** exhaustive specifications, schemas, and manuals live in the repository's own documentation files, not in the README.
2. **No retired-hub links:** READMEs and badges must not link to retired hub addresses. When hubs are rebuilt, READMEs link to them instead of duplicating detail.
3. **Structure of a minimal entry point README:**
   - **Header & Tagline**: project name, vector banner (if available), one-sentence mission.
   - **Compliant HTML badges**: version/release, license (the repository's own license identifier), CI/status.
   - **Overview**: 1–2 paragraphs on purpose and core capabilities.
   - **Quick Start / Installation**: minimal 2–5 line snippet to clone, build, or run locally.
   - **Verification & Quality Gate**: standard test command (`npm test`, `cargo test`, `pwsh ...`).
   - **Community-health links**: contributing, code of conduct, security, support, changelog, and the other required documents.
   - **License**: canonical link to `LICENSE`, stating the repository's chosen license.
4. **Domain-neutral scaffold templates:** The scaffold templates under `.agents/templates/` and the `kb-scaffold` CLI must **never hardcode** an organization's domain or slug. Treat the custom domain and any GitHub Pages fallback path as leak surfaces. Docs, wiki, portal, Discord, and Discussions links are **opt-in** and rendered only when the user supplies them (`--docs-url`, `--wiki-url`, `--portal-url`, `--discord-url`, `--with-discussions`, …), so generated files stay correct for any user. The only always-on attribution is the `README.md` footer linking the agents ecosystem repository.

---

## 4. HTML Badge Standards (MANDATORY)

All badges across all Markdown files (`README.md`, documentation files, and root tracking files) **must** use raw HTML `<a>` and `<img>` tags rather than Markdown syntax (`[![alt](src)](url)`).

- **Explicit dimensions:** Badges must declare `height="20"` on their `<img>` tag to guarantee size consistency across high-DPI displays and eliminate layout shifts:
  ```html
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" height="20" /></a>
  ```
- **Centered alignment:** Group top-level badges inside `<p align="center">` or `<div align="center">`.

---

## 5. Flow-Oriented Documents Use Mermaid

Documents describing a flow (contribution path, disclosure path, decision path, lifecycle, session cycle) use GitHub-flavored `mermaid` diagrams. Supported types: flowchart, sequence, state, class, entity-relationship, and XY chart. Quote labels containing special characters.

---

## 6. Universal Semantic Versioning in Documentation

All documentation, release references, and badges must consistently use **Semantic Versioning** (`vMAJOR.MINOR.PATCH`, e.g. `v1.0.0`, `v0.1.0`). Milestone-based versioning (`M.01`, etc.) is strictly prohibited across all documentation surfaces.

---

## 7. Enforcement

Any documentation change that violates theme neutrality, links to a retired hub, introduces Markdown badge syntax, or creates a bloated `README.md` must be rejected and corrected immediately before committing.
