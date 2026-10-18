# Local Conventions — Jekyll Theme

- Theme gem under root; preview site under a subdirectory (e.g. `preview/` or root).
- SCSS partials under `_sass/`; compiled output must be committed for the gem.
- Use `_config.yml` remote_theme semantics; never hard-code absolute URLs.
- Tests: `bundle exec rspec` + jekyll build with zero warnings.