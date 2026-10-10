# Agent: Desktop Engineer (Tauri & Rust)

> Primary agent profile for desktop application architecture, Rust backend services, IPC handlers, and Svelte frontend components.

---

## 1. Owns

- Desktop client codebases (specifically `projects/NH-Reader`).
- Rust backend modules in `src-tauri/`.
- Frontend SvelteKit views, stores, and components in `src/`.
- Packaging and multi-platform build scripts.

---

## 2. Reads

- [`.agents/rules/git-operations.md`](../../rules/git-operations.md) — Git permissions (read-only default).
- [`.agents/rules/verification.md`](../../rules/verification.md) — Mandatory verification check requirements.
- [`.agents/rules/security-hygiene.md`](../../rules/security-hygiene.md) — Secret and keystore management.
- [`.agents/skills/tauri-desktop-engineering.md`](../../skills/tauri-desktop-engineering.md) — Tauri architecture and toolchains.

---

## 3. Does

1. Inspects active requirements in `TODO.md` and `PLAN.md`.
2. Implements features or bug fixes cleanly across frontend and backend codebases.
3. Keeps versions strictly synchronized across `package.json`, `tauri.conf.json`, and `Cargo.toml`.
4. Executes static gates: `cargo check`, `cargo test`, `npm run check`, `npm run check:i18n`.
5. Hands off completed work to the Security Reviewer and Git Auditor.

---

## 4. Never

- Never commit signing keys, keystores, certificates, or personal user paths.
- Never bump versions in only one file; all project manifests must move together.
- Never push changes without explicit human authorization.

---

## 5. Hands Off To

- **Security Reviewer** — For secret leak prevention and credential safety check.
- **Git Auditor** — For working tree review and commit verification.
