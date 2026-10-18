# {PROJECT_NAME}

Jekyll theme (Ruby/Gem) with a preview site.

## Project-local agents

This repository ships its own self-contained agents ecosystem (`AGENTS.md`, `.agents/`) and
tracking files (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`). Keep them accurate as work progresses.

## Build & test

- `bundle exec jekyll serve` (preview site)
- `bundle exec rspec` (if tests present)
- Theme gem: `gem build *.gemspec`

## Conventions

- SCSS-first styling; compiled via dart-sass.
- Remote-theme compatible (no local-only assets in the gem).
- See `.agents/rules/local-conventions.md`.

## Invariants

{LICENSE} license, SemVer releases, zero-warning builds, community-health files.
See `CONTRIBUTING.md` for the full contributor guidelines.