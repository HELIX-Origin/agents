# Skill: Recompiling helix-docs CSS with dart-sass

> Helm-docs serves a **precompiled** `assets/css/site.css`. `_sass/` is the source of truth.
> After ANY `_sass` edit, regenerate `site.css` and commit the result (only with git
> authorization). Do NOT add a committed `assets/css/site.scss` entrypoint — it breaks the
> GitHub Pages build (see BUGS.md).

## Why dart-sass and not the bundled Sass

- The `github-pages` bundle resolves `jekyll-sass-converter 1.5.2` → Ruby `sass 3.7.4`,
  which **cannot parse** modern CSS color syntax (`rgb(72 216 242 / 10%)`).
- libsass (`sassc`) fails on CSS math passthrough (`minmax(min(100%, 250px), 1fr)`).
- **dart-sass** handles both. It is installed as the `sass-embedded` gem (1.105.1).

## Compile procedure

Prereq: `$env:PATH = "<ruby-bin-dir>;$env:PATH"` if `ruby`/`gem` are not on PATH.

1. Edit files under `projects/helix-docs\_sass\` (entrypoint = `helix-docs.scss`,
   mirroring just-the-docs' `just-the-docs.scss`).
2. Compile (from `projects/helix-docs`):

   ```
   ruby %TEMP%\opencode\compile.rb
   Copy-Item %TEMP%\opencode\site.css.new assets\css\site.css -Force
   ```

   `compile.rb` uses `Sass.compile_string(src, syntax: :scss, style: :compressed,
   load_paths: ['_sass'])` and writes `%TEMP%\opencode\site.css.new`.
   If `compile.rb` is missing, recreate it from the snippet in this rule's appendix.

3. **Verify parity** before publishing: compare the new CSS against the previous one at the
   rule level (see `compare.rb`) — expect **0 lost rules**; only intended additions.
4. Confirm the file is valid compressed CSS (single line, no Liquid artifacts).

## `_sass/` structure (mirrors just-the-docs)

```
_sass/
  helix-docs.scss        entrypoint (mirrors just-the-docs.scss)
  layout.scss            site shell grid
  color_schemes/dark.scss  HELIX palette tokens (:root)
  custom/setup.scss      user setup overrides (imported early)
  custom/custom.scss     user style overrides (imported last)
  modules/               aesthetics, sidebar, navigation, header, typography,
                         tables, code, components, footer, utilities,
                         landing, catalogue, store, changelog, faq
  support/_functions.scss _mixins.scss (mobile/mobile-sm/desktop) _variables.scss
  vendor/_normalize.scss
```

## Appendix — compile.rb

```ruby
require 'sass-embedded'
src = File.read('_sass/helix-docs.scss', encoding: 'UTF-8')
res = Sass.compile_string(src, syntax: :scss, style: :compressed,
                               load_paths: [File.expand_path('_sass')])
out = res.respond_to?(:css) ? res.css : res.to_s
File.write(File.join(ENV['TEMP'], 'opencode', 'site.css.new'), out)
puts "compiled OK, #{out.bytesize} bytes"
```