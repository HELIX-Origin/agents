# `.opencode` — OpenCode workspace configuration

This folder configures OpenCode for the whole workspace (and every repository under `projects/`,
because OpenCode merges `.opencode` config from ancestor directories).

| Path | Purpose |
| --- | --- |
| `opencode.jsonc` | Model pin + provider policies, context/compaction limits, tool-output and media caps, git-ask permissions, instruction globs. |
| `plugins/big-pickle-only.ts` | Removes every non-`opencode` provider and every non-Big-Pickle model from the catalog, then pins the default selection. |
| `plugins/context-budget.ts` | Appends an escalating context-economy hint to system instructions once assembled history grows large; never rewrites messages. |
| `types/opencode-plugin.d.ts` | Local type shim for the runtime-provided `@opencode/plugin` module (the runtime is not a local dependency, so editors would otherwise report a missing module and implicit `any`). |
| `tsconfig.json` | Standalone type-check project for `plugins/` + `types/`; keeps editor diagnostics real without touching any repository build. |
| `instructions/opencode-protocols.md` | OpenCode-specific operating protocols (model rule, context discipline, tool hygiene, git safety, verification). |

## Rules

- **Only Big Pickle is permitted.** The declarative policy and the plugin enforce it in two
  independent layers. Do not add providers, models, or model overrides to any project config.
- **Do not weaken `policies`.** The provider deny/allow pair is what makes the single-model rule
  hold across nested project configuration.
- **No secrets here.** Configuration is committed; credentials belong in the OS keyring or
  environment variables.
- **Plugins are additive and defensive.** They only append to system instructions or transform
  the model/provider catalog. They must never rewrite persisted history or tool payloads.
- Keep per-repository `.opencode` folders self-contained: a standalone clone of any project
  repository must get the same model policy without depending on this workspace.
- **Type-check the plugins.** `types/opencode-plugin.d.ts` is a local shim: `@opencode/plugin`
  is supplied by the runtime and is not a local dependency, so the shim keeps editor diagnostics
  honest instead of showing "cannot find module" and implicit `any`. After editing a plugin run
  `tsc -p .opencode/tsconfig.json` and require zero diagnostics. Do not delete the shim.
