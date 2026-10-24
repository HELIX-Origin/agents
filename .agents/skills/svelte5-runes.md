---
name: Svelte 5 Runes
description: Svelte 5 runes API, snippet syntax, event handling, component patterns, and migration guidance for Tauri v2 + SvelteKit frontends across the org.
applies_to: [nh-reader, theme-toolkit, depressurizer]
tags: [svelte, sveltekit, frontend, typescript, runes]
---

# Skill: Svelte 5 Runes

> Svelte 5 introduces a signal-based reactivity model via runes — compiler-special `$` functions that replace `let`, `$:`, `export let`, and event directives.

---

## 1. Core Runes Reference

### `$state` — reactive state
```svelte
<script lang="ts">
  let count = $state(0);
  let user = $state<{ name: string; age: number } | null>(null);

  // Deep reactivity — mutations on objects/arrays are tracked
  let items = $state<string[]>([]);
  items.push('hello'); // reactive
</script>
```

### `$derived` — computed values
```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);

  // Multi-line derivations use $derived.by
  let summary = $derived.by(() => {
    if (count === 0) return 'none';
    return `${count} item${count === 1 ? '' : 's'}`;
  });
</script>
```

### `$effect` — side effects
```svelte
<script lang="ts">
  let query = $state('');

  $effect(() => {
    // Runs after DOM update; re-runs when `query` changes
    console.log('query changed:', query);
    return () => {
      // Optional cleanup — runs before next execution or on destroy
    };
  });

  // $effect.pre — runs before DOM update (replaces beforeUpdate)
  $effect.pre(() => {
    // e.g. capture scroll position
  });
</script>
```

### `$props` — component props (replaces `export let`)
```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onClose?: () => void;
  }

  let { title, count = 0, onClose }: Props = $props();
</script>
```

### `$bindable` — two-way bindable props
```svelte
<!-- Child.svelte -->
<script lang="ts">
  let { value = $bindable('') }: { value?: string } = $props();
</script>
<input bind:value />

<!-- Parent.svelte -->
<Child bind:value={myVar} />
```

### `$inspect` — development debugging (dev-only)
```svelte
<script lang="ts">
  let count = $state(0);
  $inspect(count); // logs to console on every change in dev mode
  $inspect(count).with(console.trace); // custom callback
</script>
```

---

## 2. Snippet Syntax (replaces slots)

```svelte
<!-- Parent passes a snippet -->
<Card>
  {#snippet header()}
    <h2>My Card</h2>
  {/snippet}
  <p>Body content</p>
</Card>

<!-- Card.svelte receives it -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { header, children }: { header?: Snippet; children: Snippet } = $props();
</script>
<div class="card">
  {#if header}{@render header()}{/if}
  {@render children()}
</div>
```

Snippets replace named slots. Pass data into snippets:
```svelte
{#snippet item(entry: { label: string; value: number })}
  <li>{entry.label}: {entry.value}</li>
{/snippet}
{@render item({ label: 'Score', value: 42 })}
```

---

## 3. Event Handling

Svelte 5 uses standard DOM event attributes — no `on:` directive:
```svelte
<!-- Svelte 5 -->
<button onclick={() => count++}>Click</button>
<input oninput={(e) => (value = e.currentTarget.value)} />

<!-- Spreading handlers -->
<button {...{ onclick: handleClick, onkeydown: handleKey }}>Go</button>
```

Component events are replaced by callback props:
```svelte
<!-- Child.svelte -->
<script lang="ts">
  let { onSelect }: { onSelect: (id: string) => void } = $props();
</script>
<button onclick={() => onSelect('item-1')}>Select</button>

<!-- Parent.svelte -->
<Child onSelect={(id) => console.log(id)} />
```

---

## 4. Component Patterns

### Stores vs. Runes
- Prefer `$state` / `$derived` over writable/derived stores for local and module-level state.
- Svelte stores still work and are appropriate for shared global state accessed outside `.svelte` files.
- To share reactive state across components, export from a `.svelte.ts` file:
  ```ts
  // store.svelte.ts
  export const appState = $state({ theme: 'dark', loading: false });
  ```

### Lifecycle (replaces `onMount` / `onDestroy`)
```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'; // still valid in Svelte 5

  // Or use $effect for equivalent behavior:
  $effect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id); // cleanup = onDestroy equivalent
  });
</script>
```

### Class bindings
```svelte
<!-- Svelte 5 preferred -->
<div class={['base', isActive && 'active', variant].filter(Boolean).join(' ')}></div>

<!-- or use clsx/classnames utility -->
<div class={clsx('base', { active: isActive })}></div>
```

---

## 5. Migration from Svelte 4

| Svelte 4 | Svelte 5 |
|---|---|
| `let x = 0` (reactive) | `let x = $state(0)` |
| `$: doubled = x * 2` | `let doubled = $derived(x * 2)` |
| `$: { console.log(x) }` | `$effect(() => { console.log(x) })` |
| `export let prop` | `let { prop } = $props()` |
| `<slot name="header">` | `{#snippet header()}` / `{@render header()}` |
| `on:click={handler}` | `onclick={handler}` |
| `createEventDispatcher` | callback props via `$props()` |
| `<svelte:component this={C}>` | `{@const C = comp}` + `<C />` or dynamic import |

Run `npx sv migrate svelte-5` to auto-migrate a project. Always review output — the migration is not perfect for complex components.

---

## 6. TypeScript Integration

- All component scripts use `lang="ts"`.
- Prop types go in the same file via `interface Props { ... }`.
- Import component types with `import type { ComponentType } from 'svelte'`.
- Use `$bindable()` with explicit TypeScript generics where needed.
- `svelte-check` must report **0 errors and 0 warnings** before any commit (org zero-warning invariant).

---

## 7. Zero-Warning Checklist

```bash
# From project root
npx svelte-check --threshold warning
# Must exit 0 with 0 errors / 0 warnings
```

Common Svelte 5 warnings to resolve:
- `a11y-*` — add `aria-label`, keyboard handlers, role attributes as needed.
- Unused `$effect` dependencies — restructure derivation into `$derived`.
- `snippet_parameter_shadowing` — rename snippet parameters that clash with outer scope.
