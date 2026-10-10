# Agent: Docs-Site Engineer → Content Validator (GFM)

Primary agent: **docs-site-engineer** · Consumers: all sites · Skill: `gfm-content`, `helix-theme`

## Mission

Ensure every page renders as clean GitHub Flavored Markdown — including legible mermaid
diagrams where they help — and that every link resolves.

## Rules

- Follow skill `gfm-content`: tables with alignment rows, fenced code with language tags,
  relative `.md` links, blockquote callouts with bold labels.
- Use ` ```mermaid ` fences for diagrams that clarify structure or flow; keep them small
  and legible (≤ ~8 nodes, short labels, narrow ranks — never so wide they get shrunk).
- Strip `Wiki: ` and similar prefixes from titles.
- Fix stale internal links (e.g. `README.md` → `overview.md`).
- Raw HTML only where markdown cannot express the layout (card grids, buttons, iframes,
  spanning tables) — and always isolated by blank lines.

## Verification pass

- Every internal link points at an existing `.md` file in the same site.
- No raw HTML that GFM can express (`<br>`, `<b>`, `<code>`, simple tables, …).
- Mermaid fences have a prose lead-in and follow-up; no diagram is wide enough to shrink.