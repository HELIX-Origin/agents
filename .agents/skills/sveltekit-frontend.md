---
name: SvelteKit Frontend for Tauri v2
description: SvelteKit patterns for Tauri v2 frontends — routing, $lib alias, Tauri invoke calls, @tauri-apps/api usage, i18n with i18next, and vite.config.ts setup.
applies_to: [nh-reader, theme-toolkit, depressurizer]
tags: [sveltekit, svelte, tauri, frontend, i18n, vite]
---

# Skill: SvelteKit Frontend for Tauri v2

> SvelteKit runs as the frontend shell of all HELIX-Origin Tauri v2 apps. It is used in **static adapter** mode — no SSR, no server routes — compiled to static files served by Tauri's WebView.

---

## 1. Project Structure

```
src/
├── app.html              # HTML entry shell
├── app.css               # Global reset + CSS custom properties
├── lib/
│   ├── index.ts          # $lib barrel exports
│   ├── components/       # Reusable UI components (.svelte)
│   ├── stores/           # Shared state (.svelte.ts for runes, .ts for stores)
│   ├── tauri/            # Tauri invoke wrappers (typed API layer)
│   │   ├── library.ts
│   │   └── settings.ts
│   └── i18n/             # i18next setup and locale files
│       ├── index.ts
│       └── locales/
│           ├── en.json
│           └── ja.json
└── routes/
    ├── +layout.svelte    # Root layout (nav, global init)
    ├── +page.svelte      # Home / dashboard
    ├── library/
    │   └── +page.svelte
    └── settings/
        └── +page.svelte
```

---

## 2. `vite.config.ts` for Tauri

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit }   from '@sveltejs/kit/vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [sveltekit()],

  // Tauri dev server config
  server: {
    host: host || false,
    port: 1420,
    strictPort: true,
    hmr: host
      ? { protocol: 'ws', host, port: 1421 }
      : undefined,
    watch: {
      // Tell Vite to ignore Rust sources
      ignored: ['**/src-tauri/**'],
    },
  },

  // Required so Tauri can inline assets
  build: {
    target: 'esnext',
  },
});
```

---

## 3. `svelte.config.js`

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: 'index.html',   // SPA fallback for Tauri
    }),
    alias: {
      $lib: 'src/lib',
    },
  },
};

export default config;
```

---

## 4. Tauri `invoke()` — Typed API Layer

Never call `invoke()` raw in components. Create a typed wrapper in `src/lib/tauri/`:

```ts
// src/lib/tauri/library.ts
import { invoke } from '@tauri-apps/api/core';

export interface GameEntry {
  id: number;
  title: string;
  coverUrl?: string;
  platform: string;
}

export async function loadLibrary(): Promise<GameEntry[]> {
  return invoke<GameEntry[]>('load_library');
}

export async function launchGame(id: number): Promise<void> {
  return invoke<void>('launch_game', { id });
}
```

Usage in a component:
```svelte
<script lang="ts">
  import { loadLibrary, type GameEntry } from '$lib/tauri/library';

  let games = $state<GameEntry[]>([]);

  $effect(() => {
    loadLibrary().then((result) => (games = result));
  });
</script>
```

---

## 5. Listening to Tauri Events

```ts
// src/lib/tauri/events.ts
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export interface ScanProgress {
  current: number;
  total: number;
  current_title: string;
}

export function onScanProgress(
  handler: (progress: ScanProgress) => void
): Promise<UnlistenFn> {
  return listen<ScanProgress>('scan:progress', (event) => handler(event.payload));
}
```

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { onScanProgress, type ScanProgress } from '$lib/tauri/events';

  let progress = $state<ScanProgress | null>(null);
  let unlistenFn: (() => void) | null = null;

  onMount(async () => {
    unlistenFn = await onScanProgress((p) => (progress = p));
  });

  onDestroy(() => unlistenFn?.());
</script>
```

---

## 6. Route Organization

SvelteKit routes map directly to app sections. Keep routes thin — logic lives in `$lib`:

```
routes/
├── +layout.svelte      # Global nav, i18n init, theme provider
├── +page.svelte        # Dashboard / home screen
├── library/
│   ├── +page.svelte    # Main library view
│   └── [id]/
│       └── +page.svelte  # Game detail page
└── settings/
    └── +page.svelte    # Settings panel
```

Use `$page` from `$app/state` (Svelte 5) or `$app/stores` (legacy):
```svelte
<script lang="ts">
  import { page } from '$app/state'; // Svelte 5 / SvelteKit 2.x
  const gameId = $derived(page.params.id);
</script>
```

---

## 7. i18n with `i18next`

```ts
// src/lib/i18n/index.ts
import i18next from 'i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

export async function initI18n(locale: string = 'en'): Promise<void> {
  await i18next.init({
    lng: locale,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    interpolation: { escapeValue: false },
  });
}

export const t = (key: string, opts?: object) => i18next.t(key, opts);
```

Initialize in the root layout:
```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { initI18n } from '$lib/i18n';

  let ready = $state(false);

  onMount(async () => {
    await initI18n();
    ready = true;
  });
</script>

{#if ready}
  {@render children()}
{/if}
```

Use in components:
```svelte
<script lang="ts">
  import { t } from '$lib/i18n';
</script>
<h1>{t('library.title')}</h1>
<button>{t('actions.launch')}</button>
```

---

## 8. Global CSS Architecture

Use CSS custom properties (design tokens) at `:root` — no inline styles, no hardcoded colors:

```css
/* src/app.css */
:root {
  --color-bg:        #1a1a2e;
  --color-surface:   #16213e;
  --color-accent:    #e94560;
  --color-text:      #eaeaea;
  --radius-md:       8px;
  --spacing-md:      1rem;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  background: var(--color-bg);
  color:      var(--color-text);
  font-family: system-ui, sans-serif;
}
```

- All SCSS follows `.agents/skills/scss-architecture.md`.
- Design tokens are centralized — components never hardcode color values.

---

## 9. Zero-Warning Checklist

```bash
# Type-check the SvelteKit frontend
npx svelte-check --threshold warning
# Must exit 0 — 0 errors, 0 warnings

# Lint
npx eslint src --max-warnings 0
```

- Fix all `a11y-*` warnings from `svelte-check`.
- No `any` types — use proper TypeScript interfaces for all Tauri payloads.
- No unused imports or variables.
