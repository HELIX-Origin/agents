# Skill: Modern SCSS Architecture & Design Systems

> Best practices for architecting scalable, token-driven SCSS stylesheets across HELIX Origin applications.

---

## 1. When to Use SCSS over Plain CSS

Always use SCSS when any of the following apply:
1. **Theming & Multi-Variant Logic**: Generating dynamic styles for platforms (Steam, itch.io, GOG, Epic, etc.) using maps and `@each` loops.
2. **Deep Component Hierarchies**: Card containers, hover overlays, action bars, and modal sub-views benefiting from clean nesting (`&`, `&:hover`, `&.active`).
3. **Glassmorphism & Obsidian Design**: Centralizing backdrop-filters, surface highlights, elevations, and glows into reusable mixins.
4. **Token Integrity**: Mapping design tokens to CSS custom properties in a single authoritative source (`_tokens.scss`).

---

## 2. Core Partials Architecture

### `_tokens.scss`
Defines Sass variables, theme maps, and exports CSS custom properties to `:root`.
```scss
$platforms: (
  steam: (bg1: #10253f, bg2: #07101c, accent: #38bdf8),
  itch:  (bg1: #2b1118, bg2: #0d0608, accent: #fa5c5c),
  gog:   (bg1: #261238, bg2: #0e0716, accent: #a855f7),
  // ...
);

:root {
  --radius: 14px;
  --blur: 18px;
  // Dynamic generation
  @each $name, $props in $platforms {
    --platform-#{$name}-gradient: linear-gradient(160deg, #{map-get($props, bg1)} 0%, #{map-get($props, bg2)} 100%);
    --platform-#{$name}-accent: #{map-get($props, accent)};
  }
}
```

### `_mixins.scss`
Reusable styling functions for glass panels, responsive grids, line-clamping, and custom scrollbars:
```scss
@mixin glass($bg: var(--panel), $blur: var(--blur), $border: var(--border)) {
  background: $bg;
  backdrop-filter: blur($blur);
  -webkit-backdrop-filter: blur($blur);
  border: 1px solid $border;
  border-radius: var(--radius);
  box-shadow: var(--glass-highlight), var(--shadow-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
```

### `_platforms.scss`
Automates theme applications across cards, fallbacks, and badges.

---

## 3. SvelteKit & Vite Integration

1. **Installation**:
   ```powershell
   npm install -D sass
   ```
2. **Path Alias in `svelte.config.js`**:
   ```javascript
   kit: {
     alias: {
       $styles: "src/styles",
     },
   }
   ```
3. **Usage in Components**:
   ```svelte
   <script lang="ts">
     import "$styles/library.scss";
   </script>
   ```
   - Do not write inline `<style>` tags with hundreds of lines.
   - Do not use inline `style="..."` attributes for layout rules like `gap` or `padding`. Use utility classes or semantic component classes.

---

## 4. Checklist for SCSS Conversions

- [ ] `sass` installed in `devDependencies`.
- [ ] `src/styles/` directory established with `_tokens.scss`, `_mixins.scss`, `_platforms.scss`, and `app.scss`.
- [ ] View-specific styles separated into `<view>.scss` (e.g. `library.scss`).
- [ ] Embedded `<style>` blocks in `.svelte` files removed and replaced with SCSS imports.
- [ ] Hardcoded hex/rgba colors and dimensions converted to design tokens.
- [ ] `npm run check` and `npm run build` pass cleanly.
