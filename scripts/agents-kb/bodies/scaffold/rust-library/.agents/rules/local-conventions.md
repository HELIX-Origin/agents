# Local Conventions — Rust Library

- Crate root `src/lib.rs`; modules under `src/`.
- Edition 2021+, MSRV documented in `Cargo.toml`.
- Tests in `tests/` (integration) and `#[cfg(test)]` (unit).
- Clippy clean with `-D warnings`.