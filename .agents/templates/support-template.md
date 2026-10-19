# Support

Looking for help with **{{PROJECT_NAME}}**? Here is where to go.

{{#HAS_GATEWAYS}}
## 📖 Start with the docs

{{#DOCS_URL}}
- 📖 **Documentation**: [{{DOCS_URL}}]({{DOCS_URL}})
  — installation, setup, feature guides, and usage.
{{/DOCS_URL}}
{{#WIKI_URL}}
- 🧠 **Technical Wiki**: [{{WIKI_URL}}]({{WIKI_URL}})
  — architecture, internals, and developer references.
{{/WIKI_URL}}

{{/HAS_GATEWAYS}}
{{#HAS_COMMUNITY}}
## 💬 Community

{{#HAS_DISCUSSIONS}}
- [GitHub Discussions]({{REPO_URL}}/discussions) — questions, ideas, and show-and-tell.
{{/HAS_DISCUSSIONS}}
{{#HAS_DISCORD}}
- [Discord]({{DISCORD_URL}}) — live chat and community support.
{{/HAS_DISCORD}}
{{#HAS_REPO}}
- [GitHub Issues]({{REPO_URL}}/issues) — bug reports and feature requests (please use the provided forms).
{{/HAS_REPO}}

{{/HAS_COMMUNITY}}
## 🔒 Security

For security vulnerabilities, **do not** open a public issue — follow [SECURITY.md](./SECURITY.md).

{{#PORTAL_URL}}
## 🌐 Organization

- 🌐 **Portal**: [{{PORTAL_URL}}]({{PORTAL_URL}})

{{/PORTAL_URL}}
{{#HAS_DISCUSSIONS}}
Before opening an issue, please search existing issues and discussions — your question may already
be answered.
{{/HAS_DISCUSSIONS}}
{{^HAS_DISCUSSIONS}}
Before opening an issue, please search existing issues — your question may already be answered.
{{/HAS_DISCUSSIONS}}
