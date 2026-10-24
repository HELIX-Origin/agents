# Skill: Compiling helix-jekyll-theme SCSS

> **Active direction (W.03, canonical architecture):** the theme compiles SCSS **at build
> time** through the GitHub Pages pipeline — front-matter SCSS entrypoints under `assets/css/`
> → Liquid barrel `_includes/css/*.scss.liquid` → exact-name `_sass/color_schemes/{{scheme}}.scss`
> barrels. See `projects/helix-jekyll-theme/.agents/rules/local-conventions.md` for the
> architecture and `TODO.md` W.03 for the phase plan.

## Interim state (until W.03 Phase 2 lands)

The preview site still serves the **precompiled** `assets/css/site.css`; `_sass/helix-jekyll-theme.scss`
is the source of truth. Until entrypoint compilation lands, after ANY `_sass` edit regenerate
`site.css` with dart-sass and commit the result (only with explicit git authorization).
Do NOT add a committed `assets/css/site.scss` entrypoint — it breaks the GitHub Pages build
(see `BUGS.md`).

Retirement of `site.css` is gated on Phase 0 Spike B (consumer reachability).

## Why dart-sass for the interim precompile

- The `github-pages` bundle resolves `jekyll-sass-converter 1.5.2` → Ruby `sass 3.7.4`,
  which **cannot parse** modern CSS color syntax (`rgb(72 216 242 / 10%)`).
- libsass (`sassc`) fails on CSS math passthrough (`minmax(min(100%, 250px), 1fr)`).
- **dart-sass** handles both. It is installed as the `sass-embedded` gem (1.105.1).

W.03 Phase 1 removes this blocker: the full SCSS-variable conversion eliminates every
modern-CSS construct from `_sass/` (tokens become SCSS variables; alphas become
`rgba($color, a)`), so Ruby Sass 3.7.4 compiles the tree natively. After Phase 2,
dart-sass precompilation is no longer part of the workflow.

## Interim compile procedure

Prereq: `$env:PATH = "<ruby-bin-dir>;$env:PATH"` if `ruby`/`gem` are not on PATH.

1. Edit files under `projects/helix-jekyll-theme\_sass\` (main entry = `helix-jekyll-theme.scss`).
2. Compile (from `projects/helix-jekyll-theme`):

   ```
   ruby %TEMP%\helix-scratch\compile.rb
   Copy-Item %TEMP%\helix-scratch\site.css.new assets\css\site.css -Force
   ```

   `compile.rb` uses `Sass.compile_string(src, syntax: :scss, style: :compressed,
   load_paths: ['_sass'])` and writes `%TEMP%\helix-scratch\site.css.new`.
   If `compile.rb` is missing, recreate it from the appendix below.

3. **Verify parity** before publishing: compare the new CSS against the previous one at the
   rule level — expect **0 lost rules**; only intended additions.
4. Confirm the file is valid compressed CSS (single line, no Liquid artifacts).

## Target state (after W.03 Phase 2)

- No precompiled CSS is committed; `bundle exec jekyll build` compiles the
  `assets/css/helix-jekyll-theme-{{scheme}}.scss` entrypoints.
- Verification = zero-warning build + flag proof (see `PLAN.md` Sprint 1).
- dart-sass and this interim procedure are retired.

## `_sass/` structure (current → target under W.03)

```
_sass/
  helix-jekyll-theme.scss      main entry (legacy → replaced by Liquid barrel, Phase 2)
  layout.scss                  site shell grid
  color_schemes/
    helix-jekyll-theme-{{scheme}}.scss   legacy :root[data-color-scheme] blocks
                                         (→ exact-name {{scheme}}.scss barrels + {{scheme}}/ dirs)
  custom/setup.scss            user setup overrides (imported early)
  custom/custom.scss           user style overrides (imported last)
  modules/                     aesthetics, sidebar, navigation, header, typography,
                               tables, code, components, footer, utilities,
                               landing, catalogue, store, changelog, faq, cards
  support/_functions.scss _mixins.scss _variables.scss
  vendor/_normalize.scss
```

## Appendix — compile.rb (interim only)

```ruby
require 'sass-embedded'
src = File.read('_sass/helix-jekyll-theme.scss', encoding: 'UTF-8')
res = Sass.compile_string(src, syntax: :scss, style: :compressed,
                               load_paths: [File.expand_path('_sass')])
out = res.respond_to?(:css) ? res.css : res.to_s
File.write(File.join(ENV['TEMP'], 'helix-scratch', 'site.css.new'), out)
puts "compiled OK, #{out.bytesize} bytes"
```
