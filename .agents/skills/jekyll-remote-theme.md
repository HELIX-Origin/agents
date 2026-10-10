# Skill: Jekyll remote theme + GitHub Pages configuration

> How any `*` site must be configured to consume `helix-docs` as a remote
> theme, and how to build/verify it locally. Workspace-wide.

## GitHub Pages (production)

- `_config.yml`:
  ```yaml
  remote_theme: HELIX-Origin/helix-docs
  ```
- GitHub Pages provides the `jekyll-remote-theme` gem automatically; still list it in
  `plugins` so local builds match production:
  ```yaml
  plugins:
    - jekyll-remote-theme
  ```

## Local builds (Windows, Ruby 3.3.12)

- PATH quirk first: `$env:PATH = "<ruby-bin-dir>;$env:PATH"`
- The repo may lack a Gemfile (docs-only folders). Use a scratch Gemfile at the repo root
  (do not commit unless asked):
  ```ruby
  source "https://rubygems.org"
  gem "github-pages", group: :jekyll_plugins
  gem "jekyll-remote-theme"
  ```
- Build with `workdir:` set: `bundle install` once, then `bundle exec jekyll build`
  (add `--serve` for a live preview in the browser tool).

## Config pitfalls (most common breakages)

1. **Defaults scopes must use `type:`, NOT `path:`.** `scope: { path: /docs/:path/ }`
   matches the wrong set of files or nothing. Use `scope: { type: docs }` / `{ type: wiki }`.
2. **Collections** need `output: true`:
   ```yaml
   collections:
     docs: { output: true }
     wiki: { output: true }
   ```
3. **Index permalinks**: `_docs/index.md` → `permalink: /docs/`, `_wiki/index.md` →
   `permalink: /wiki/`, portal root → `/`.
4. **No `_data/navigation.yml`** — the theme computes nav from frontmatter
   (`parent` / `grand_parent` / `nav_order`). Delete the file if present.
5. **Parent titles must match index-page titles exactly** (see `helix-theme` skill table).

## Verification

- `bundle exec jekyll build` exits 0.
- Grep `_site/` for `site.data.navigation` and `_data/` — must be absent.
- Spot-check rendered pages: sidebar tree shows all levels, breadcrumbs correct,
  translate control present.