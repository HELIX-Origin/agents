# Commands

Tool-agnostic, reusable workflow runbooks. Each file is a short, imperative procedure an agent follows
exactly when a user invokes it (for example `/fix-bug`). They are universal: any agent or harness can read
and follow them, and any tool-specific wrapper should only point here.

| Command | Purpose |
|---|---|
| `onboard.md` | Get oriented in the workspace or a project |
| `verify.md` | Run the zero-warning verification gate |
| `fix-bug.md` | Reproduce, fix and record a defect |
| `implement-feature.md` | Plan, build and verify a feature |
| `review-change.md` | Review the current change against the gates |
| `update-docs.md` | Bring docs and tracking ledgers in line with reality |
| `cut-release.md` | Prepare a release (never tag or push without explicit authorization) |

Conventions:

- One procedure per file, numbered steps, no tutorials.
- Reference rules and skills by path; never duplicate their content.
- Never weaken an invariant (git safety, zero warnings, SemVer, licensing).
- Per-project ecosystems may ship their own `.agents/commands/` that override a workspace command of the same name.
