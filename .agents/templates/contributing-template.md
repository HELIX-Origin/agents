# Contributing to {{PROJECT_NAME}}

Thanks for your interest in improving **{{PROJECT_NAME}}**! This guide covers development setup,
conventions, the quality gate, and how to submit changes.

> By participating you agree to our [Code of Conduct](./CODE_OF_CONDUCT.md). For security issues,
> follow [SECURITY.md](./SECURITY.md) — **do not** open a public issue.

## Ways to contribute

- 🐛 **Report bugs** via [GitHub Issues](https://github.com/HELIX-Origin/{{REPO_NAME}}/issues) (bug form).
- ✨ **Propose features** via [GitHub Issues](https://github.com/HELIX-Origin/{{REPO_NAME}}/issues) (feature form).
- 📝 **Improve documentation** in the centralized docs/wiki hubs.
- 🔧 **Submit code** via pull request.
- 👀 **Review pull requests** from other contributors.

Open an issue or comment on an existing one before starting significant work, so the approach can be
discussed first.

## Development setup

{{PREREQUISITES}}

```bash
npm install
{{DEV_COMMAND}}
```

{{DEV_NOTES}}

## Quality gate

Everything below must pass with **zero errors and zero warnings** before a pull request is merged:

```bash
{{QUALITY_GATE}}
```

## Conventions

- {{CONVENTIONS}}
- Keep changes minimal and focused; match the surrounding style.
- Update `CHANGELOG.md` when behavior changes.

## Commit style

We use [Conventional Commits](https://www.conventionalcommits.org/) with concise, imperative
subjects:

```
<type>(<scope>): <short summary in imperative mood>
```

Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `security`, `build`.

## Pull request process

1. **Open an issue first** for non-trivial changes.
2. **Create a branch** from the default branch.
3. **Make focused commits** following the commit style above.
4. **Run the quality gate** (zero errors, zero warnings).
5. **Update docs/changelog** if behavior changed.
6. **Open a PR** and complete the template.
7. **Respond to review feedback** and keep the branch up to date.

Do not push directly to the default branch. Releases are cut by maintainers (see
[GOVERNANCE.md](./GOVERNANCE.md)).

## Getting help

See [SUPPORT.md](./SUPPORT.md).
