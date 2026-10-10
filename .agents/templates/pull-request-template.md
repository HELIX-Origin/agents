# Pull Request Template

## Description

Provide a clear and concise summary of what this change achieves, the motivation behind it, and the problems it solves.

---

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style / refactor / performance improvement
- [ ] 🔧 Toolchain, build, or CI configuration

---

## Target Project & Subsystem

- **Repository:** `projects/<repo-name>`
- **Subsystem:** e.g., Theme SCSS / Rust Backend / Styler Mod / Svelte Views / Docs

---

## Verification & Quality Gates

Detail the exact steps and automated checks taken to verify the change:

- [ ] Static validation passed: `<command>` (0 errors, 0 warnings)
- [ ] Unit tests / test suites passed: `<command>`
- [ ] Manual desktop / browser visual inspection verified
- [ ] Tracking files updated (`TODO.md`, `PLAN.md`, `BUGS.md`, `CHANGELOG.md`)

---

## Security & Path Hygiene Checklist

- [ ] Zero secrets, private tokens, or credentials committed
- [ ] Zero hardcoded local machine paths or personal identifiers
- [ ] Code follows repository conventions and licensing terms
