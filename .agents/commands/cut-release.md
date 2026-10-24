---
description: Prepare a release (never tag or push without explicit authorization)
---

Never tag, push or publish unless the user explicitly authorizes that exact operation on that exact repository in the current conversation.

1. Confirm the workstream items for the release are complete in the project's `TODO.md`.
2. Choose the next SemVer version (`vMAJOR.MINOR.PATCH`); milestone tags are prohibited.
3. Update `CHANGELOG.md` and keep every version manifest in agreement.
4. Run `/verify`.
5. Draft release notes per `.agents/rules/release-notes.md`. Attach assets only for repositories that distribute a packaged application or resource.
6. Stop and ask for authorization before any `git tag`, `git push` or `gh release create`.
