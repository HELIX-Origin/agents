# Rule: Documentation & Content Standards

**Status:** BINDING — GLOBAL.
**Scope:** Every agent, every project under `projects/`, and the workspace tracking docs.
**Applies to:** `docs/` sites, `docs/_docs/`, `docs/_wiki/`, `docs/_catalogue/`, `docs/_store/`,
project `README.md` files, and root Markdown.

---

## Purpose

Documentation must explain **how to work with the mods/software**, in a deliberately generic,
theme-neutral way. An author's own theme/suite — its token names, values, radius scales, colours,
and geometry — lives **only** in the catalogue/store. This separation is intentional and
non-negotiable: users must be free to build their own themes from the docs without the docs
prescribing one author's styling.

---

## 1. Theme-Neutrality Invariant (CORE — NEVER VIOLATE)

Three surfaces with strictly separated responsibilities:

| Surface | Responsibility |
|---|---|
| `docs/` — documentation site (`docs/_docs/`, `docs/_wiki/`, root guides) | **Theme-neutral & mod-agnostic.** Describe valid visual-tree targets, official settings/schema, and *how to work with the mod*. General and reusable. |
| `docs/_catalogue/` + `docs/_store/` | **Theme-specific.** The *only* place an author's own theme/suite, its token names, values, geometries, and palettes may be described. This is where users share their themes. |
| Project `README.md` + `CHANGELOG.md` / `ROADMAP.md` | **Project-canonical.** Describe the project's own current behaviour and state. Neither a theme-neutral surface nor a catalogue surface. |

### Hard prohibitions

1. **Never treat a catalogue theme/suite (e.g. the Command Center suite) as the source of truth for the `docs/`.** The docs are intentionally ambiguous so users can build *their own* themes.
2. **Never copy a catalogue theme's token names, token values, radius scales, colours, or geometry into `docs/` or `docs/_wiki/`.** If a doc needs an example, use the mod's own documented settings plus generic/illustrative placeholders — never a specific shared theme's vocabulary.
3. **Never rewrite `docs/` to "match" the current state of an author's theme.** The direction is backwards: a suite may change freely, but the docs' general contract does not track it.
4. **Never present a catalogue theme as "the" way to style the mod.** Docs describe the mechanism; the catalogue illustrates one possible result.
5. **The catalogue may reference the docs; the docs must never reference the catalogue.**

### Correct direction of information flow

```
mod schema / visual targets  ──▶  docs/    ──▶  generic, reusable guidance for all users
author theme / suite configs ──▶  catalogue/  (self-contained; never leaks into docs/)
```

---

## 2. Decision Test (run before every doc edit)

Ask, in order:

- Am I describing **how the mod works** (targets, settings, mechanism)? → `docs/`.
- Am I describing **a specific theme/suite an author made**? → `catalogue/`.
- Am I stating **the project's own current state/behaviour**? → project `README.md` / `CHANGELOG.md`.

If an edit would make a `docs/` page resemble a particular catalogue entry — **STOP and revert it.**
When genuinely unsure whether content is "docs" or "catalogue", **ask the user**; do not guess.

---

## 3. General Content Standards

- Root Markdown files and per-project `README.md` files are the canonical indexes; the `docs/` site is the published documentation; the `catalogue/`/`store/` are the community showcase.
- Use GitHub-Flavored Markdown (see `.agents/skills/gfm-content.md`) and valid frontmatter/layouts (see `.agents/skills/helix-theme.md`).
- Never hardcode absolute machine paths, secrets, tokens, or credentials (see `.agents/rules/security-hygiene.md`).
- Keep internal links and frontmatter valid; pass the repository's verification gate before declaring done (see `.agents/rules/verification.md`).

---

## 4. Enforcement

Any documentation change that violates Section 1 must be rejected or reverted before commit,
regardless of how "accurate to the current theme" it appears. Accuracy to a theme is **not** a
goal of `docs/`.
