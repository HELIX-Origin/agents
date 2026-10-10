# BUGS.md — issues, quirks, and workarounds

> Track anything that breaks or surprises us, with status and workaround.
> Last updated: 2026-10-09

## Open

### BUG-4 — `_functions.scss` legacy division triggers dart-sass deprecation
- **GitHub Issue:** [#3](https://github.com/HELIX-Origin/helix-docs/issues/3)
- **Symptom:** dart-sass warns about `/` division (`($px / 16px)`).
- **Impact:** Cosmetic only; function is currently unused. Compiles fine.
- **Status:** OPEN / KNOWN — replace with `math.div` or `calc()`.

### BUG-13 — Default layout home page section cards vs index markup
- **GitHub Issue:** [#1](https://github.com/HELIX-Origin/helix-docs/issues/1)
- **Symptom:** Inability to have `_layouts/default.html` automatically partition arbitrary markdown into modular `.doc-section` card panels without manual HTML structure in index files. Wrapping `{{ content }}` in `.landing-content` caused plain markdown headings to render as bare text without card styling (missing gradient panels, borders, and section headers), while wrapping `{{ content }}` in a single `.doc-section` collapsed the entire landing page into one monolith card.
- **Impact:** Previous attempts broke the intended vCard landing layout. Home/landing pages currently must author their modular card sections directly in the index files (`<section class="doc-section">` with flush-left indentation to avoid Kramdown 4-space code block conversion).
- **Status:** OPEN / OUTSTANDING — Index files handle their own section cards within `.landing-content`, while `default.html` provides the hero header, navbar, and vCard profile sidebar.

### BUG-14 — Broken / empty in-page Table of Contents in standalone docs layout
- **GitHub Issue:** [#2](https://github.com/HELIX-Origin/helix-docs/issues/2)
- **Symptom:** `_layouts/docs.html` attempted to replace the left sidebar navigation tree with an in-page Table of Contents card (`components/toc.html`). The TOC card repeatedly rendered empty or displayed unrelated heading artifacts, failed to generate a functioning table of contents for documentation pages, and completely removed the left-hand navigation sidebar from guides.
- **Root Cause & Impact:** Dynamic client-side DOM TOC generation was fragile and broke the user's intended navigation model, leaving documentation pages without accessible section navigation or site hierarchy.
- **Status:** OPEN / DEFERRED — Standalone single-column `docs.html` layout dropped. `_layouts/docs.html` delegates to `layout: wiki` and `_config.yml` defaults set `layout: wiki` for `type: docs`, using the proven dual sticky sidebar layout with full frontmatter tree navigation, breadcrumbs, and pagers across all documentation collections.

## Environment quirks

### ENV-1 — Ruby not on PATH in the agent shell
- Ruby installed to `C:\Ruby33-x64` but the running shell's PATH is stale.
- **Workaround:** prepend every command: `$env:PATH = "C:\Ruby33-x64\bin;$env:PATH"`.

### ENV-2 — Theme ships precompiled CSS, not a live SCSS entrypoint
- `assets/css/site.css` is committed on purpose so remote-theme consumers on GitHub Pages get
  styled output without compiling SCSS.
- **Consequence:** after editing `_sass/`, you **must** regenerate `assets/css/site.css`
  (dart-sass, `--style=compressed`) and commit the result. Do NOT add a committed
  `assets/css/site.scss` entrypoint (breaks GitHub Pages builds).

### ENV-3 — helm-docs references a source map that is not committed
- `assets/css/site.css` ends with `/*# sourceMappingURL=site.css.map */` but `site.css.map`
  is not in the repo. Cosmetic; browsers ignore the missing map. Leave as-is unless regenerating.

### ENV-4 — Always pass explicit paths in shell commands
- The IDE shell does not reliably honor implicit working directories. Use `jekyll build
  --source <abs> --destination <abs>`, `git -C <repo>`, `-Path <file>`. `bundle` itself must run
  with `workdir:` set to the Gemfile's directory (it locates `Gemfile` from cwd, not from args).

## Resolved

### BUG-1 / BUG-2 — Sass compiler cannot compile the theme
- **Symptoms:** Ruby sass 3.7.4 fails on CSS Color 4 syntax (`rgb(72 216 242 / 10%)`);
  liblibsass/`sassc` fails on `min()/max()` CSS math (`minmax(min(100%, 250px), 1fr)`).
- **Fix:** installed **dart-sass** via `gem install sass-embedded --no-document --force`
  (version 1.105.1-x64-mingw-ucrt). Compiles `_sass/helix-docs.scss` correctly.
- **Verification:** rule-level parity check vs the old precompiled CSS — 432 old rules all
  present, 5 intentional additions (nested nav indent), 0 losses.
- `assets/css/site.css` regenerated (46,118 bytes). Resolved.

### BUG-3 — `sass-embedded` executable conflict with `sass` gem
- **Fix:** `gem install sass-embedded --no-document --force` overwrote the binstub as expected.
- Resolved. Note: compile with the **Ruby API** (`Sass.compile_string`) rather than the CLI to
  avoid binstub ambiguity.

### BUG-5 — Missing `faraday-retry`: octokit silently skipped retry middleware
- **Symptom:** `bundle exec jekyll build` printed `To use retry middleware with Faraday v2.0+,
  install 'faraday-retry' gem` at startup.
- **Cause:** octokit 4.25.1 (via `jekyll-github-metadata`, bundled with `github-pages`) does
  `require 'faraday/retry'` at load time; under Faraday 2.x that lives in the separate
  `faraday-retry` gem. On LoadError it warns **and** its `MIDDLEWARE` builder skips registering
  retry — a real resilience gap, not cosmetic. The user was right to flag it.
- **Fix:** `gem "faraday-retry"` added to `helix-docs/Gemfile`, deliberately **outside** the
  `:jekyll_plugins` group (Jekyll auto-requires group gems by name as plugins). Warning gone.

### BUG-6 — `jekyll-titles-from-headings` overrides collection-document titles
- **Symptom:** `_docs/index.md` (`title: Theme Documentation Directory`) rendered
  `<h1>User Guides</h1>` (its first heading); breadcrumb parent showed a dead `<span>` instead
  of a link (parent resolution matches by exact `title`).
- **Cause:** the plugin's `inferred_title?` returns `true` for every `Jekyll::Document`, so
  `title?` is always false for collection docs → it always overwrites `title` from the first
  heading and (with `strip_title`) deletes that heading from the body. Plain pages keep their
  frontmatter titles, which is why only `_docs/`/`_wiki/` broke.
- **Fix:** plugin removed from `plugins` + `titles_from_headings` config dropped. Nav,
  breadcrumbs and pagers are frontmatter-driven, so canonical `title` is mandatory. Safe here:
  every collection page starts with an `##` (H2) heading, so no H1 duplicates — verified all 11.

### BUG-7 — Jekyll 3.x `where_exp` accepts only ONE condition (no `and`/`or`)
- **Symptom:** `Liquid syntax error (... children_nav.html line 18): Expected end_of_string
  but found id`.
- **Cause:** Jekyll's `where_exp` parses a single `Liquid::Condition`; multi-condition
  `and`/`or` support is Jekyll 4.3+ and GitHub Pages pins 3.9. Every `{% if %}` supports
  `and`/`or` — only `where_exp` doesn't.
- **Fix:** filter with `for` + `if` and `push` instead of chained `where_exp`.
  **Guard:** grep for `where_exp:.*(and|or)` must stay empty.

### BUG-8 — Liquid binds filters to the whole lookup, not an array subscript
- **Symptom:** prev/next pager cards rendered with empty `href` and empty title (instead of
  hidden spacers at the ends of the list).
- **Cause:** `ordered[current_index | minus: 1]` parses as `(ordered[current_index]) |
  minus: 1` → a Document `| minus: 1` coerces to `0`, and **`0` is truthy in Liquid** — so
  `prev_entry`/`next_entry` were the integer `0`. Confirmed with a minimal Liquid repro.
- **Fix:** precompute the index first (`{% assign prev_index = current_index | minus: 1 %}`)
  then index with a plain variable (`ordered[prev_index]`). Same for the end bound
  (`last_index`), because `current_index < ordered.size | minus: 1` has the same trap.

### BUG-9 — github-pages gem injects `jekyll-theme-primer` by default
- **Symptom:** `_site/assets/css/style.css` (76 KB of Primer CSS) appeared although the source
  only contains `site.css`; it also showed up as an untitled entry in the nav tree.
- **Cause:** `GitHubPages::Configuration::DEFAULTS["theme"] = "jekyll-theme-primer"` activates
  whenever no theme is set (the Gemfile's `github-pages` group loads this locally, and GitHub
  Pages applies it online too). The theme's static assets are copied into `_site`.
- **Fix:** `theme: null` in the preview `_config.yml` — the gem explicitly honors it
  (`config["theme"] = user_config["theme"] if user_config.key?("theme")`). Consuming sites that
  set `remote_theme:` are unaffected. Nav pollution itself was fixed separately by using
  `site.html_pages` instead of `site.pages` as the nav source (excludes xml/txt/css outputs).

### BUG-10 — IDE YAML linter flags type-only `defaults` scopes (false positive)
- **Symptom:** every `- scope: { type: docs }` entry flagged as missing required `path`.
- **Cause:** the IDE's schema expects Jekyll's documented scope shape. Jekyll itself fully
  supports type-only scopes (match by collection label) — the flag is wrong for our case, but
  ignoring it per-project is noisy and unportable.
- **Fix (semantics preserved):** write Jekyll's canonical documented form instead —
  `scope: { path: "", type: docs }`. An empty `path` matches everything (`File.fnmatch ""`),
  so `{path: "", type: docs}` is exactly equivalent to `{type: docs}` — no behavior change,
  linter satisfied. **Use this form in the theme AND all consuming-site configs** (Phase 4).

### BUG-11 — Duplicate frontmatter keys (`layout`) cause parse errors
- **Symptom:** pages fail to parse front matter.
- **Cause:** duplicate `layout: docs` entries in `Windhawk-Themes/docs/_docs/Companion-*.md` frontmatter.
- **Fix:** removed redundant `layout: docs` lines; added missing `parent: Documentation Directory` to `UWPSpy.md`. Verified all frontmatter keys are unique across all projects.

### BUG-12 — Unescaped XAML `{{...}}` expressions trigger Liquid syntax errors
- **Symptom:** `Liquid syntax error: Expected end_of_string but found dash in "{{224 - pinnedListHeight}}"`.
- **Cause:** XAML binding expressions in markdown are interpreted as unescaped Liquid tags. In addition, automated replacements previously injected stray `parent:` and `grand_parent:` lines into wiki markdown body dividers.
- **Fix:** wrapped all XAML `{{...}}` bindings in `{% raw %}...{% endraw %}` in `start-menu-styler/configurations/schema.md` and `targets/elements.md`. Stripped stray frontmatter artifacts from body text across 12 wiki documents. All 5 project doc builds now complete cleanly.

### BUG-13 — `default.html` missing vCard landing structure for home pages
- **Symptom:** Landing pages using `layout: default` rendered as ordinary documentation pages (docs navigation tree dumped into the sidebar; body wrapped in `.documentation-content`).
- **Cause:** `default.html` and `sidebar.html` lacked proper home-page branching for the vCard landing experience.
- **Fix:** Updated `_layouts/default.html` and `_includes/components/sidebar.html` to detect `is_home`, preserve the clean vCard profile sidebar without the docs tree, render the hero header with custom navbar/brand options, wrap home body in `<div class="landing-content">`, and added `_layouts/home.html`. Pushed to `helix-docs` origin/main.

## Notes for future runs
- Compile command (from `D:\Projects\helix-docs`, with `C:\Ruby33-x64\bin` prepended to PATH):
  `ruby %TEMP%\opencode\compile.rb` (reads `_sass/helix-docs.scss`, writes `%TEMP%\opencode\site.css.new`,
  then copy over `assets\site.css`).
- Build/verify command: `bundle exec jekyll build --source "D:\Projects\helix-docs"
  --destination "D:\Projects\helix-docs\_site"` with `workdir: D:\Projects\helix-docs`.
  Expected: `done in ~1–3 s`, zero `faraday`/`Liquid Exception`/`warning` matches.
- dart-sass prints `@import` deprecation warnings — ignore; github-pages still uses `@import`.
- PowerShell shows UTF-8 emoji as mojibake in console output — files are fine; verify with the
  built HTML, not the console.
