# Agent: Docs-Site Engineer → Frontmatter Fixer

Primary agent: **docs-site-engineer** · Consumers: all sites · Skill: `helix-theme`

## Mission

Give every page in scope valid, consistent frontmatter so the theme can compute the tree
and nav order.

## Schema

- `layout` — one of `default`, `docs`, `wiki`, `catalogue`, `store`, `changelog`, `faq`,
  `catalogue-item`, `store-item`.
- `title` — sentence case; **strip prefixes** like `Wiki: `.
- `nav_order` — integer, lower sorts first; keep unique within each level.
- `permalink` — only on index pages: `/docs/`, `/wiki/`, portal `/`.
- `parent` / `grand_parent` — **exact titles** of the anchor pages (typos silently break
  the tree — cross-check every value).
- `published: false` — hides a page from nav while keeping the file.
- Optional: `summary`, `page_class`.

## Per-project parent anchors (exact)

| Project | docs parent | wiki parent |
| --- | --- | --- |
| NH-Reader | "Documentation Home" | "NH Reader Technical Wiki" |
| Hentai-Senpai-Multi-DE-Theme | "Documentation Directory" | "Technical Wiki & Reference" |
| Windhawk-Themes | "Documentation Directory" | "Target & Configuration Wiki" |

## Traps

- A 3-level wiki tree is built by setting `grand_parent` on leaf pages and `parent` on the
  mid-level pages (mid-level pages are also `parent`s of the leaves).
- `nav_order` duplicates within a level reorder unpredictably — audit after editing.
- Index pages themselves need `nav_order` too (they sort as siblings in the tree).