<div align="center">

# {PROJECT_NAME}

<p align="center">
{{#REPO_SLUG}}
  <a href="{{REPO_URL}}/releases"><img src="https://img.shields.io/github/v/release/{{REPO_SLUG}}?include_prereleases&label=Release&color=blue" alt="Release" height="20" /></a>
{{/REPO_SLUG}}
{{#DOCS_URL}}
  <a href="{{DOCS_URL}}"><img src="https://img.shields.io/badge/Docs-Documentation-brightgreen" alt="Documentation" height="20" /></a>
{{/DOCS_URL}}
{{#WIKI_URL}}
  <a href="{{WIKI_URL}}"><img src="https://img.shields.io/badge/Wiki-Technical_Wiki-brightgreen" alt="Technical Wiki" height="20" /></a>
{{/WIKI_URL}}
{{#HAS_DISCORD}}
  <a href="{{DISCORD_URL}}"><img src="https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white" alt="Discord" height="20" /></a>
{{/HAS_DISCORD}}
  <a href="https://opensource.org/licenses/{LICENSE}"><img src="https://img.shields.io/badge/License-{LICENSE}-blue.svg" alt="License: {LICENSE}" height="20" /></a>
</p>

**{ABSTRACT}**

</div>

---
{{#HAS_GATEWAYS}}

## 📖 Documentation

{{#DOCS_URL}}
- 📖 **Documentation**: [{{DOCS_URL}}]({{DOCS_URL}}) — User manuals, feature walkthroughs, and configuration.
{{/DOCS_URL}}
{{#WIKI_URL}}
- 🧠 **Technical Wiki**: [{{WIKI_URL}}]({{WIKI_URL}}) — Architecture, schema topologies, and technical specifications.
{{/WIKI_URL}}
{{#PORTAL_URL}}
- 🌐 **Portal**: [{{PORTAL_URL}}]({{PORTAL_URL}}) — Organization hub.
{{/PORTAL_URL}}

---
{{/HAS_GATEWAYS}}

## ⚡ Quick Start

### Prerequisites
- {PREREQUISITES}

### Running Locally
```bash
{DEV_COMMAND}
```

### Verification & Quality Gate
```bash
{QUALITY_GATE}
```

---

## 🤝 Community

- [Contributing](./CONTRIBUTING.md) · [Code of Conduct](./CODE_OF_CONDUCT.md) · [Support](./SUPPORT.md)
- [Security Policy](./SECURITY.md) · [Privacy Policy](./PRIVACY.md) · [Terms of Service](./TOS.md)
- [Changelog](./CHANGELOG.md) · [Governance](./GOVERNANCE.md) · [Citation](./CITATION.cff) · [License](./LICENSE)

---

## 📄 License

This project is licensed under the [{LICENSE} License](./LICENSE).

---

<sub>_Scaffolded with the [HELIX-Origin agent ecosystem](https://github.com/HELIX-Origin/agents)._</sub>

