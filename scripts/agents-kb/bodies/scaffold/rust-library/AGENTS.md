# {PROJECT_NAME}

Rust library crate.

## Project-local agents

This repository ships its own self-contained agents ecosystem (`AGENTS.md`, `.agents/`) and
tracking files (`ROADMAP.md`, `PLAN.md`, `TODO.md`, `BUGS.md`). Keep them accurate as work progresses.

## Build & test

- `cargo build` / `cargo test`
- `cargo clippy -- -D warnings`
- `cargo doc --no-deps`

## Conventions

- Zero warnings (`RUSTFLAGS="-D warnings"`).
- Public API documented with rustdoc.
- See `.agents/rules/local-conventions.md`.

## Invariants

{LICENSE} license, SemVer releases, zero-warning builds, community-health files.
See `CONTRIBUTING.md` for the full contributor guidelines.