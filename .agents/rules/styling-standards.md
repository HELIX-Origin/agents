# Rule: Styling Standards & SCSS-First Architecture

> Authoritative styling rules for all projects across the HELIX-Origin workspace.
> Read before creating or modifying any styles, components, or UI layouts.

---

## 1. Absolute Invariants

1. **SCSS-First whenever beneficial**:
   Whenever a project or view requires nested selectors, design tokens, theme maps, platform variants, or shared mixins, **SCSS (`.scss`) must be used in favor of flat CSS**. Plain CSS is only appropriate for trivial micro-utilities with no nesting, tokens, or variants.

2. **No Monolithic Embedded Styles in Templates**:
   Svelte files, HTML views, and templates must **not** contain massive embedded `<style>` blocks (e.g. hundreds of lines of component styling). Component and page styles must reside in dedicated, modular `.scss` stylesheets and be imported into the component (e.g., `import "$styles/library.scss";`).

3. **Zero Hardcoded CSS Values Outside Token Files**:
   - Never scatter hardcoded magic colors (`#1a1a24`, `rgba(56, 189, 248, 0.16)`), ad-hoc shadows, or arbitrary dimensions throughout leaf rules or template `style="..."` attributes.
   - All visual values (brand colors, platform themes, gradients, glow radii, aspect ratios, surface blurs) must be defined in `_tokens.scss` and exposed through CSS custom properties (`var(--platform-itch-gradient)`, `var(--card-cover-aspect)`).

4. **Modular Partials & Automated Generation**:
   Stylesheets must be cleanly partitioned into reusable partials:
   - `_tokens.scss`: Color variables, dimension scales, platform maps.
   - `_mixins.scss`: Glassmorphism, glows, elevations, scrollbars, flex/grid helpers.
   - `_components.scss`: Shared buttons, badges, pills, inputs, cards.
   - `_platforms.scss`: Automated loops (`@each`) generating platform-specific themes without boilerplate duplication.

---

## 2. Directory Layout Convention

### Desktop & Web Clients (SvelteKit / Vite / Tauri)

```text
src/
└── styles/
    ├── _tokens.scss       <- Variables, platform maps, design tokens
    ├── _mixins.scss       <- Glassmorphism, animations, layout mixins
    ├── _platforms.scss    <- Dynamic theme generator for platforms
    ├── _components.scss   <- Shared buttons, inputs, pills, cards
    ├── app.scss           <- Global entrypoint, base typography & resets
    └── <view>.scss        <- View-specific stylesheets (e.g., library.scss)
```

In `.svelte` views:
```svelte
<script lang="ts">
  import "$styles/library.scss";
  // ...
</script>
<!-- Clean markup without monolithic <style> blocks -->
```

---

## 3. Platform Theming & Loop Invariant

For applications handling multiple gaming or distribution platforms (Steam, itch.io, GOG, Epic, Xbox, Ubisoft, EA, Battle.net, etc.), platform-specific styles **must be generated via SCSS loops**:

```scss
@use "tokens" as *;

@each $name, $props in $platforms {
  .platform-#{$name} {
    background: var(--platform-#{$name}-gradient);

    .fallback-glow {
      background: var(--platform-#{$name}-glow);
    }
  }
}
```

Never manually copy-paste identical CSS rule sets for each platform.

---

## 4. Verification

After introducing or refactoring SCSS:
1. `npm run check` (or framework type-checker) must pass with **0 errors**.
2. Build verification: `npm run build` must compile successfully without Sass deprecation warnings.
3. No visual regression: inspect high-DPI scaling, dark mode obsidian contrast, and glassmorphism backdrop blurs.
