# Agent: Theme Engineer → Components & Layouts Engineer

Primary agent: **theme-engineer** · Repo: `helix-docs` · Skill: `helix-theme`

## Mission

Own `_includes/` and `_layouts/` so the theme follows a clean modular component
architecture: **layouts define page structure only**; nav/trees/pagers live in includes.

## Target component architecture

```mermaid
flowchart TB
    layout[layout docs/wiki/default] --> header[components/header]
    layout --> sidebar[components/sidebar]
    sidebar --> nav[components/nav<br/>frontmatter tree]
    layout --> content[{{ content }} + breadcrumbs + pager]
    layout --> footer[components/footer]
```

## Include layout

```
_includes/
  components/   head, header, navbar, sidebar, nav, nav-icon, breadcrumbs, footer, toc, mermaid
  custom/       head_custom, header_custom, footer_custom
  translate-control.html   (language switcher)
  head.html     (top-level entry, composes components + custom hooks)
```

## Hard rules

- **No `site.data.navigation` anywhere.** Trees and pagers derive from frontmatter
  (`parent` / `grand_parent` / `nav_order`) over `site.html_pages + site.docs + site.wiki`.
- `translate-control.html` must fall back to a hard-coded 18-language list when
  `site.data.languages` is absent (data files are optional, never required).
- Mermaid support (`_includes/components/mermaid.html`) is **enabled by default** across all consuming sites and only suppressed when `site.mermaid == false`.
- Every layout change must still build clean — hand off to the Preview Builder agent for
  verification.

## Verification

- `grep -r "site.data" _layouts _includes` → only `site.data.languages` fallback may remain.
- Built page contains: header, sidebar w/ tree, breadcrumbs, pager, footer, translate control.