# Local Conventions — Node.js TypeScript CLI

- Standard Node.js project: `package.json`, `tsconfig.json`, `src/`, `tests/`.
- ESM with explicit `.ts`/`.js` extensions in imports.
- Typecheck with `tsc --noEmit`; tests with the project's runner.
- Never commit `node_modules/`.