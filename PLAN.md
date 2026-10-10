# PLAN.md — helix-docs theme + consuming projects

> Master plan. If credits run out, resume from **Current Status** and work down **TODO.md**.
> Last updated: 2026-10-09

## Goal

1. **helix-docs** is the shared Jekyll theme, consumed by other repos as a **remote theme**
   (`remote_theme: HELIX-Origin/helix-docs`).
2. Make the theme's **repo structure mirror `just-the-docs`** (proven, fully-featured theme):
   `_includes/components/*`, minimal `_layouts/*`, layered `_sass/{support,modules,color_schemes,vendor,custom}`,
   `assets`, `_config.yml`, Gemfile — while keeping our **own HELIX style and palette**.
3. Navigation must be **frontmatter-driven** (`parent`, `grand_parent`, `nav_order`, `published`,
   `nav_exclude`, `permalink`) — consuming sites must **not** need a `_data/navigation.yml`.
4. Layouts depend on dedicated **navigation include HTML files** (just-the-docs component style).
5. Fix every consuming project so it renders correctly with the remote theme, and GFM-ify content.

## Environment

- Windows 11. Ruby **3.3.12** installed via winget to `C:\Ruby33-x64` (DevKit/MSYS2 included).
- PATH is NOT refreshed in the agent shell — **prepend** it per command:
  `$env:PATH = "C:\Ruby33-x64\bin;$env:PATH"`
- bundler 4.0.22. `bundle install` completed in `D:\Projects\helix-docs` (Gemfile now also
  declares `faraday-retry` — see BUG-5).
- **Original `assets/css/site.css` was compiled with dart-sass** (Ruby Sass 3.7.4 and liblibsass
  both fail on the CSS in this theme — see BUGS.md). Use dart-sass to regenerate.
- `site.css` is **precompiled and committed** on purpose: remote themes serve it directly and
  GitHub Pages must not try to compile the theme SCSS. Keep `_sass` as the source of truth and
  regenerate `assets/css/site.css` after SCSS edits.
- Local preview build: `bundle exec jekyll build --source "D:\Projects\helix-docs"
  --destination "D:\Projects\helix-docs\_site"` with `workdir: D:\Projects\helix-docs`.
  Expect ~1–3 s, zero warnings (see BUGS.md Notes for the exact verification greps).

## Projects in scope
- `D:\Projects\projects\helix-docs` (the theme itself + its preview site)
- `D:\Projects\projects\helix-origin.github.io\docs` (portal)
- `D:\Projects\projects\NH-Reader\docs`
- `D:\Projects\projects\Windhawk-Themes\docs` (largest repair)
- `D:\Projects\projects\Hentai-Senpai-Multi-DE-Theme\docs`

**Ignore** `D:\Projects\ramensoftware` entirely.

## Phases

### Phase 1 — Theme SCSS restructure (mirror just-the-docs) — DONE
- [x] Move `_sass/*` into `support/`, `modules/`, `color_schemes/`, `vendor/`, `custom/`.
- [x] Split: `_variables` → `support/_variables` + `support/_mixins` + `color_schemes/dark`
      (+ new `support/_functions`); `_base` → `vendor/_normalize` + `layout` + `modules/aesthetics`.
- [x] Split `_sidebar` → `modules/sidebar` + `modules/navigation`; `_components` → `+modules/footer`;
      `_header` → `+modules/utilities`.
- [x] Create entrypoint `_sass/helix-docs.scss` (mirrors `just-the-docs.scss`).
- [x] Regenerate `assets/css/site.css` with dart-sass and verify parity (432/432 rules
      preserved, +5 nested-nav rules; file is 46,118 bytes).
- [x] Nested-tree indent rules live in `modules/navigation.scss` and are in the compiled CSS.

### Phase 2 — Theme includes/layouts (mirror just-the-docs components) — DONE
- [x] `_includes/components/nav.html` — frontmatter-driven 3-level tree, variant docs/wiki,
      with `published`/`nav_exclude` filtering and `site.html_pages` base set.
- [x] `components/` created: `header.html`, `sidebar.html`, `breadcrumbs.html`,
      `children_nav.html`, `toc.html`, `footer.html`, `scripts.html` (head.html stays at
      `_includes/` root, just-the-docs pattern).
- [x] `default.html`, `docs.html`, `wiki.html` are structure-only; catalogue/store/faq/changelog/
      item layouts share `components/header|footer|scripts`.
- [x] Zero `site.data.navigation` anywhere; `_data/navigation.yml` deleted (`languages.yml` kept).
- [x] Pagers computed from `parent`/`nav_order` only (frontmatter), verified prev/next targets.
- [x] `_config.yml` defaults converted to canonical `{path: "", type: ...}` scopes + global
      `nav_order: 9999` fallback (BUG-10: also silences the IDE `path`-required false flag).
- [x] README.md rewritten (frontmatter nav model + accurate Repository Structure tree).

### Phase 3 — Theme robustness — IN PROGRESS
- [x] `translate-control.html`: hard-coded 18-language fallback mirroring `languages.yml`
      exactly; `site.data.languages` used only if present (verified end-to-end).
- [x] Bug-fix pass on the preview build — faraday-retry (BUG-5), titles-from-headings title
      override (BUG-6), `where_exp` `and`/`or` (BUG-7), Liquid subscript filter trap in the
      pager (BUG-8), github-pages → Primer theme leak (BUG-9).
- [x] Verify all 9 layouts + 4 collections (docs, wiki, catalogue, store) build — done;
      nav trees, breadcrumb parent links, pagers and translate fallback all spot-checked.
- [x] **Remaining:** Mermaid support mirroring just-the-docs (`components/mermaid.html` +
      `mermaid_config.js` + `mermaid: true`); docs use legible ` ```mermaid ` fences.

### Phase 4 — Consuming projects — DONE
- [x] Portal config + GFM content.
- [x] NH-Reader config/frontmatter/GFM.
- [x] Hentai-Senpai: delete `_data/navigation.yml`, add permalinks/frontmatter, GFM.
- [x] Windhawk: config defaults, `layout: docs`, titles, 3-level wiki tree, fix links.
- [x] Resolved duplicate frontmatter keys (`layout`) and wrapped XAML bindings in `{% raw %}`.
- All config fixes use the canonical `{path: "", type: docs}` scope form (BUG-10).

### Phase 5 — Verification — DONE
- [x] Build theme preview locally (`bundle exec jekyll build`) — passes, 0 warnings.
- [x] Build each consuming project's `docs` locally (`Windhawk-Themes`, `NH-Reader`, `Hentai-Senpai`, `helix-origin.github.io`).
- [x] Validate frontmatter across all 87 Markdown files (all YAML valid, no duplicate keys).
- [ ] Optional: preview in the browser tool.

## Key decisions

- Nav is computed in Liquid from frontmatter — jekyll-remote-theme ships only
  `_includes`, `_layouts`, `_sass`, `assets` (no `_data`).
- Parent anchor titles:
  - NH-Reader: "Documentation Home" / "NH Reader Technical Wiki"
  - Hentai-Senpai: "Documentation Directory" / "Technical Wiki & Reference"
  - Windhawk: "Documentation Directory" / "Target & Configuration Wiki"
- `defaults` scopes always written as `{path: "", type: <collection>}` — semantically
  type-only (empty path = match-all) but satisfies YAML schema linters requiring `path`.
- Never ship/enable `jekyll-titles-from-headings` — it overrides collection-document titles
  and breaks `parent` matching (BUG-6).
- `published: false` hides from all nav; `nav_exclude: true` hides from the nav tree only.
- Keep precompiled `site.css`; do NOT commit a live `assets/css/site.scss` entrypoint to the theme.
- Do **not** modify `ramensoftware`. Do not commit/push unless asked.
- helix-docs has pre-existing uncommitted changes (`D LICENSE`, `?? LICENSE.md`) — leave untouched.
  (`M _config.yml` is now also our intentional change set.)
- **Workspace governance:** `AGENTS.md` + `.agents/` at the `D:\Projects` root govern ALL
  projects. Conventions: rules in `.agents/rules/`, skills in `.agents/skills/`, agents
  nested `.agents/agents/<primary>/<sub>/`.
- **Mermaid:** prefer legible GFM ` ```mermaid ` diagrams (flowcharts, ≤ ~8 nodes, short
  labels) in documentation and agent docs wherever they clarify; never over-complex ones
  that shrink.

## Current Status (resume point)

- **Phases 1–5 complete & pushed to remote repositories.**
- Theme repository (`helix-docs`) updated with wiki layout delegation for docs, modular landing section cards, YAML Issue Forms (`.github/ISSUE_TEMPLATE/`), and pushed first (commit `90c608b`).
- Open/deferred bugs tracked as official GitHub issues on `helix-docs`: #1 (landing card layout), #2 (in-page TOC in docs layout), #3 (Dart Sass slash division).
- All consuming project sites (`Windhawk-Themes`, `NH-Reader`, `Hentai-Senpai-Multi-DE-Theme`, `helix-origin.github.io`) updated with:
  - `_config.yml` defaults setting `layout: wiki` for docs collections.
  - Flush-left modular `<section class="doc-section">` card markup on landing index pages (0 Kramdown code block bugs).
  - Unrooted `.gitignore` patterns for `_site/`, `.sass-cache/`, `.jekyll-cache/`, and `.jekyll-metadata`.
- All local changes committed and pushed to `origin/main` across all repositories. Working trees 100% clean.
- Added workspace-wide release notes standards to `.agents/rules/release-notes.md` and `.agents/templates/release-notes-template.md` adapted from NH-Reader, accounting for SemVer vs. Milestone version control types across all projects.
- Initial release `v1.0.0` published to `HELIX-Origin/helix-docs` with annotated tag and standardized SemVer release notes.
