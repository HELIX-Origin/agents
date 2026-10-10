# TODO.md — running checklist

> Keep this current. Check items off as they complete. If credits run out, resume at the first
> unchecked item. See PLAN.md for full context.

Last updated: 2026-10-09

## Workspace scaffolding (2026-10-09 — done)
- [x] `AGENTS.md` at `` root — workspace-wide rules (covers ALL projects).
- [x] Session handoff docs `PLAN.md` / `TODO.md` / `BUGS.md`.
- [x] `.agents/rules/` — `git-operations.md` (BINDING: no unauthorized git ops),
      `workspace.md` (forbidden paths, scope, tracking contract),
      `release-notes.md` (unified standards adapted from NH-Reader; SemVer vs. Milestone tracking).
- [x] `.agents/templates/release-notes-template.md` — canonical dual templates for SemVer & Milestones.
- [x] `.agents/skills/` — `sass-compile.md`, `helix-theme.md`, `gfm-content.md` (incl.
      mermaid guidance), `jekyll-remote-theme.md`.
- [x] `.agents/agents/<primary>/<sub>/` nesting —
      `theme-engineer/` (scss-engineer, components-engineer, preview-builder),
      `docs-site-engineer/` (config-fixer, frontmatter-fixer, content-validator),
      `git-guard/` (git-auditor).
- [x] Mermaid convention: legible GFM ` ```mermaid ` diagrams in docs + agent docs,
      ≤ ~8 nodes, short labels, narrow ranks (never shrink-wrapped).

## Phase 1 — Theme SCSS restructure (mirror just-the-docs)
- [x] Move/reorganize `_sass/` into `support/`, `modules/`, `color_schemes/`, `vendor/`, `custom/`.
- [x] Split `_variables.scss` -> `support/_variables.scss` + `support/_mixins.scss` + `color_schemes/dark.scss`.
- [x] Add `support/_functions.scss`.
- [x] Split `_base.scss` -> `vendor/_normalize.scss` + `layout.scss` + `modules/aesthetics.scss`.
- [x] Split `_sidebar.scss` -> `modules/sidebar.scss` + `modules/navigation.scss`.
- [x] Move `.site-footer` -> `modules/footer.scss`; utilities -> `modules/utilities.scss`.
- [x] Rename `custom/_setup.scss` -> `custom/setup.scss`, `custom/_custom.scss` -> `custom/custom.scss`.
- [x] Create entrypoint `_sass/helix-docs.scss`.
- [x] **Install dart-sass** (`sass-embedded` gem 1.105.1 installed with `--force`).
- [x] **Regenerate `assets/css/site.css`** from `_sass/helix-docs.scss` (compressed) — 46,118 bytes.
- [x] **Verify parity**: 432/432 old rules present in new; exactly 5 new nested-nav rules.
- [ ] Delete the temporary `sassc` gem (not needed now dart-sass works) — optional.
- [ ] Delete temp compile script `%TEMP%\opencode\compile.rb` + `compare.rb` when done.
- [x] Commit-style note: `assets/css/site.css` is now dart-sass output (was formatted with
      spaced `rgba()`; serialization differs cosmetically, rules identical).

## Phase 2 — Theme includes/layouts (just-the-docs component structure)
- [x] Create `_includes/nav.html` (frontmatter tree, variant `docs`/`wiki`) — now
      `_includes/components/nav.html`.
- [x] Reorganize `_includes/` to mirror just-the-docs: `components/` with `header.html`,
      `sidebar.html`, `nav.html`, `breadcrumbs.html`, `children_nav.html`, `toc.html`,
      `footer.html`, `scripts.html`; `head.html` stays at `_includes/` root (jtd pattern).
- [x] Layouts are structure-only: `default.html` (portal + sidebar), `docs.html` and
      `wiki.html` call `components/header|breadcrumbs|toc|children_nav|footer|scripts`;
      catalogue/store/faq/changelog/item layouts share header/footer/scripts includes.
- [x] Zero `site.data.navigation` references anywhere in helix-docs (grep-verified).
- [x] `_data/navigation.yml` deleted (dead); `languages.yml` kept (translate control content).
- [x] `_config.yml` defaults converted to canonical `{path: "", type: ...}` scopes
      (Jekyll-documented form; also silences the IDE `path`-required false flag — BUG-10).
- [x] `nav_exclude` opt-out added to `nav.html` (jtd parity); set on `404.md`.
- [x] Nav sources use `site.html_pages` (excludes sitemap/robots/feed/css output pages — BUG-9).
- [x] **Site-wide navbar component**: Extracted `_includes/components/navbar.html` from `header.html`, `default.html`, and `wiki.html`. Dynamically resolves registered collection root indexes (`docs`, `wiki`, `catalogue`, `store`) from built pages.
- [x] **Catalogue showcase styling**: Expanded `.catalogue-grid` column min-width to 400px and recompiled `assets/css/site.css`.

## Phase 3 — Theme robustness
- [x] `translate-control.html`: hard-coded 18-language fallback; `site.data.languages` used only
      if present. Fallback list now mirrors `languages.yml` exactly (en,ja,zh-CN,zh-TW,ko,es,
      fr,de,ru,pt,it,th,vi,id,pl,nl,tr,ar) — verified end-to-end with `languages.yml` removed.
- [x] README.md rewritten for the frontmatter nav model (stale `_data/navigation.yml` section
      + stale Repository Structure tree both fixed).
- [x] Bug-fix pass on the preview build (details in BUGS.md): faraday-retry (BUG-5),
      titles-from-headings title override (BUG-6), where_exp `and`/`or` (BUG-7), Liquid
      subscript filter trap in the pager (BUG-8), Primer theme leak (BUG-9).
- [x] Confirm no remaining `site.data.navigation` references anywhere (grep-verified).
- [x] Build theme preview (`bundle exec jekyll build`) — succeeds, 0 warnings; verified nav
      trees, breadcrumbs (parent links), prev/next pager, translate fallback, all 9 layouts.
- [x] **Mermaid support** mirroring just-the-docs: `_includes/components/mermaid.html` +
      `mermaid_config.js` + `mermaid: true` config flag; content uses legible ` ```mermaid ` 
      fences (see `gfm-content` skill).
- [x] **Drop standalone single-column `docs.html`**: `_layouts/docs.html` delegates to `layout: wiki`;
      `_config.yml` defaults set `layout: wiki` for docs collections; removed empty client-side TOC.
      Documentation pages now render with the full sidebar navigation tree and breadcrumbs.
- [x] **Landing page section cards**: Preserved modular flush-left `<section class="doc-section">` card markup
      directly across index files (`helix-docs/index.md`, `Windhawk-Themes`, `NH-Reader`, `Hentai-Senpai`).
      Logged `BUG-13` and `BUG-14` in `BUGS.md`.
- [x] **YAML Issue Forms**: Created `.github/ISSUE_TEMPLATE/` (`config.yml`, `1_bug_report.yml`,
      `2_feature_proposal.yml`, `3_documentation.yml`) with zero GitHub Discussions references.
- [x] **Published Initial Release `v1.0.0`**: Created annotated tag `v1.0.0` and published GitHub Release on `HELIX-Origin/helix-docs` formatted with standard SemVer release notes.

## Phase 4 — Consuming projects
> Apply the canonical scope form everywhere: `{ path: "", type: docs }` (BUG-10 / helix-theme skill).

### helix-origin.github.io/docs (portal)
- [x] Add `jekyll-remote-theme` to `plugins` in `_config.yml`.
- [x] GFM-ify `index.md` (keep project-card HTML where Markdown can't express it).
- [x] Set `nav_order` on root/index pages.

### NH-Reader/docs
- [x] Fix `_config.yml` defaults scopes (`path: /docs/:path/` -> `{path: "", type: docs}`,
      same for wiki — see BUG-10; the old `:path` scopes were no-ops anyway).
- [x] `_docs/index.md`: add `permalink: /docs/`, `nav_order`.
- [x] `_wiki/index.md`: add `permalink: /wiki/`, `nav_order`, parent title.
- [x] Add `parent`/`grand_parent`/`nav_order`/`layout`/`summary` to all `_docs/*.md` + `_wiki/*.md`.
- [x] GFM-ify `index.md` HTML sections.

### Hentai-Senpai-Multi-DE-Theme/docs
- [x] Delete `docs/_data/navigation.yml`.
- [x] Add `permalink: /docs/` + `nav_order` to `_docs/index.md`; `/wiki/` to `_wiki/index.md`.
- [x] Add `parent`/`grand_parent`/`nav_order`/`layout`/`summary` to all docs/wiki pages.
- [x] GFM-ify `index.md`.

### Windhawk-Themes/docs (largest)
- [x] Fix `_config.yml` defaults scopes (canonical `{path: "", type: ...}` form).
- [x] Add `layout: docs` + `summary` + `parent` + `nav_order` to all 19 `_docs/*.md`.
- [x] `_wiki`: strip "Wiki: " prefixes; build 3-level tree via `parent`/`grand_parent`.
- [x] Fix wiki index links (`README.md` -> `overview.md`).
- [x] Fix duplicate `layout` frontmatter lines across companion doc pages (BUG-11).
- [x] Wrap XAML bindings in `{% raw %}` and clean stray divider lines in wiki docs (BUG-12).

### Ignore
- [x] Skip `ramensoftware` entirely.

## Phase 5 — Verification
- [x] Build each project `docs` locally (`bundle exec jekyll build`, temp Gemfile if needed).
- [x] Verify sidebar/tree/pagers/breadcrumbs render from frontmatter only.
- [x] Verify built HTML contains no `site.data.navigation` / `_data/navigation.yml` remnants.
- [ ] Optional: open previews with the browser tool.
