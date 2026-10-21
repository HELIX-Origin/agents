# Rule: Documentation & Content Standards

**Status:** BINDING — GLOBAL.
**Scope:** Every agent, every project under `projects/`, and the workspace tracking docs.
**Applies to:** The centralized `docs` repository (`projects/docs`), the centralized `wiki` repository (`projects/wiki`), project `README.md` entry points, and workspace root Markdown.

---

## Purpose

To establish authoritative documentation standards across the **HELIX Origin** organization following our centralized documentation and wiki architecture. All detailed documentation, user manuals, and technical wikis live in dedicated organization hubs (`docs.helix-origin.club` and `wiki.helix-origin.club`), while project repositories remain clean, minimal codebases with concise entry-point READMEs.

---

## 1. Centralized Documentation Hub Architecture

The organization enforces a strict separation of documentation surfaces across dedicated repositories:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           HELIX Origin Web Ecosystem                              │
├──────────────────────────┬──────────────────────────┬─────────────────────────────┤
│   Organization Portal    │    Documentation Hub     │     Technical Wiki Hub      │
│ (helix-origin.github.io) │          (docs)          │           (wiki)            │
│ www.helix-origin.club    │ docs.helix-origin.club   │ wiki.helix-origin.club      │
├──────────────────────────┼──────────────────────────┼─────────────────────────────┤
│ Central landing portal   │ User manuals, getting    │ Technical architecture,     │
│ and central gateway      │ started guides, feature  │ API specs, visual trees,    │
│ links to Docs & Wiki.    │ walkthroughs & catalogue │ schemas & dev references    │
│                          │ organized by project.    │ organized by project.       │
└──────────────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Surface Responsibilities

| Surface / Repository | Path & Scope | Primary Responsibility |
|---|---|---|
| **Documentation Hub (`docs`)** | `projects/docs/` (`_docs/<project>/`, `_catalogue/`) | **User-Centric & Theme-Neutral.** Product documentation, installation guides, user manuals, and the theme showcase catalogue (`_catalogue/`). |
| **Technical Wiki Hub (`wiki`)** | `projects/wiki/` (`_wiki/<project>/`) | **Deep Technical & Architectural.** In-depth technical specifications, developer APIs, schema definitions, visual tree topologies, and curation guidelines. |
| **Organization Portal (`helix-origin.github.io`)** | `projects/helix-origin.github.io/` (`index.md`) | **Central Discovery Gateway.** Links directly to Docs Hub and Wiki Hub; never hosts project-specific docs or raw JSON API endpoints. |
| **Project Code Repositories** | `projects/<project>/` (`README.md`) | **Minimal Entry Points.** Standalone open-source codebases; contain **NO** embedded `docs/` folders and **NO** GitHub Pages sites. Root `README.md` links directly to `docs` and `wiki`. |

> **Single-site repositories publish from the repository root.** When a repository *is* the published
> site (the portal, `docs`, `wiki`), its Jekyll root is the **repository root** — never a nested
> `docs/` folder. Non-site Markdown (`README.md`, `CONTRIBUTING.md`, `SECURITY.md`, etc.) must carry
> `published: false` front matter so it is never emitted as a site page, and non-Markdown legal files
> (`LICENSE`) must be listed in `_config.yml` `exclude`.

---

## 2. Documentation Theme-Neutrality Invariant (CORE)

Within the centralized `docs` and `wiki` repositories:
1. **Theme-neutral & mod-agnostic:** Documentation in `docs/_docs/` and `wiki/_wiki/` describes valid visual targets, mod schemas, engine mechanisms, and *how to use or build for the software*. It must remain general, reusable, and free of author-specific theme branding.
2. **Catalogue isolation:** An author's specific theme/suite (its exact color palette, token names, radius scales, glass recipes, and specific geometries) lives **strictly in `docs/_catalogue/`**.
3. **Hard Prohibitions:**
   - Never make a catalogue theme or suite the source of truth for general documentation.
   - Never copy a specific catalogue theme's token names or recipes into general `docs/_docs/` or `wiki/_wiki/` guides.
   - The catalogue may link to docs/wiki; docs/wiki must never depend on the catalogue.

---

## 3. Repository README Minimal Entry Point Standard (MANDATORY)

Every project repository under `projects/` must maintain a concise, minimal entry point `README.md` (~30–50 lines).

### Invariant Rules:
1. **Zero Embedded Docs Folders:** Project repositories (`universal-game-launcher`, `nh-reader`, `theme-toolkit`, `windhawk-themes`, `ffxiv-config`, `ugl-db-00`–`03`) must **NEVER** contain local `docs/` or `wiki/` documentation folders, Jekyll site configs, or GitHub Pages deployments.
2. **Direct Gateway Links:** Project `README.md` files must link directly to the centralized hubs:
   - 📖 **Documentation**: `https://docs.helix-origin.club/<project>/`
   - 🧠 **Technical Wiki**: `https://wiki.helix-origin.club/<project>/`
   - 🌐 **Organization Portal**: `https://www.helix-origin.club/`
3. **Structure of a Minimal Entry Point README:**
   - **Header & Tagline**: Project name, vector banner (if available), and one-sentence mission.
   - **Compliant HTML Badges**: Version/Release, License (`BSD-3-Clause`), Docs badge, Wiki badge, CI/Status.
   - **Overview**: 1–2 paragraphs introducing the project's purpose and core capabilities.
   - **Primary Gateways**: Direct links to documentation and wiki hubs.
   - **Quick Start / Installation**: Minimal 2–5 line command snippet to clone, build, or run locally.
   - **Verification & Quality Gate**: Standard test command (`npm test`, `cargo test`, `pwsh ...`).
   - **License**: Canonical link to `LICENSE` (`BSD-3-Clause`).
4. **Domain-Neutral Scaffold Templates:** The scaffold templates under `.agents/templates/` and the
   `kb-scaffold` CLI must **never hardcode** an organization's domain or slug. Treat **both**
   organization base URLs as leak surfaces: the custom domain (`*.helix-origin.club`) **and** the
   GitHub Pages fallback paths (`helix-origin.github.io/<repo>`), so generated output stays portable even if the
   custom domain is retired. Docs, wiki, portal, Discord, and Discussions links are **opt-in** and
   rendered only when the user supplies them (`--docs-url`, `--wiki-url`, `--portal-url`,
   `--discord-url`, `--with-discussions`, …), so generated files stay correct for any user — not just
   `HELIX-Origin`. The only always-on attribution is the `README.md` footer linking the agents
   ecosystem repository.

---

## 4. HTML Badge Standards (MANDATORY)

All badges across all Markdown files (`README.md`, `docs/`, `wiki/`, and root tracking files) **must** use raw HTML `<a>` and `<img>` tags rather than Markdown syntax (`[![alt](src)](url)`).

- **Explicit Dimensions:** Badges must declare `height="20"` on their `<img>` tag to guarantee size consistency across high-DPI displays and eliminate layout shifts:
  ```html
  <a href="https://docs.helix-origin.club/universal-game-launcher/"><img src="https://img.shields.io/badge/Docs-docs.helix--origin.club-brightgreen" alt="Documentation" height="20" /></a>
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD--3--Clause-blue.svg" alt="License: BSD-3-Clause" height="20" /></a>
  ```
- **Centered Alignment:** Group top-level badges inside `<p align="center">` or `<div align="center">`.

---

## 5. Universal Semantic Versioning in Documentation

All documentation, wiki pages, release references, and badges must consistently use **Semantic Versioning** (`vMAJOR.MINOR.PATCH`, e.g. `v1.0.0`, `v0.1.0`). Milestone-based versioning (`M.01`, etc.) is strictly prohibited across all documentation surfaces.

---

## 6. Enforcement

Any documentation change that creates embedded `docs/` folders in project repositories, violates theme neutrality, introduces Markdown badge syntax, or creates bloated `README.md` files must be rejected and corrected immediately before committing.
