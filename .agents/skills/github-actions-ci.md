---
name: GitHub Actions CI
description: GitHub Actions CI patterns for the org — Tauri v2 cross-platform build matrix, Rust cache, cleanup-failed-runs workflow, release asset uploads, GITHUB_TOKEN permissions, and zero-warning gate enforcement.
applies_to: [nh-reader, windows-game-explorer, theme-toolkit, depressurizer, windhawk-themes, ffxiv-config]
tags: [ci, github-actions, tauri, rust, release]
---

# Skill: GitHub Actions CI

> CI workflows across HELIX-Origin enforce the zero-warning invariant, build Tauri v2 apps for Windows/macOS/Linux, and automate release asset uploads.

---

## 1. Tauri v2 Cross-Platform Build Matrix

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: ubuntu-22.04
            args: ''
          - platform: macos-latest
            args: '--target aarch64-apple-darwin'
          - platform: windows-latest
            args: ''

    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v4

      - name: Install system dependencies (Linux)
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y \
            libwebkit2gtk-4.1-dev \
            libappindicator3-dev \
            librsvg2-dev \
            patchelf

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install Rust stable
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.platform == 'macos-latest' && 'aarch64-apple-darwin,x86_64-apple-darwin' || '' }}

      - name: Rust cache
        uses: Swatinem/rust-cache@v2
        with:
          workspaces: './src-tauri -> target'

      - name: Install frontend dependencies
        run: npm ci

      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          RUSTFLAGS: '-D warnings'
        with:
          args: ${{ matrix.args }}
```

---

## 2. Rust Zero-Warning Gate

The `RUSTFLAGS: '-D warnings'` environment variable is **mandatory** in every CI job that compiles Rust. It promotes all warnings to errors, enforcing the org's zero-warning invariant.

Add an explicit check step for PRs:
```yaml
      - name: Rust check (zero warnings)
        env:
          RUSTFLAGS: '-D warnings'
        run: |
          cd src-tauri
          cargo check --all-targets
          cargo clippy --all-targets -- -D warnings
```

---

## 3. Frontend Zero-Warning Gate

```yaml
      - name: Frontend type-check (zero warnings)
        run: npx svelte-check --threshold warning

      - name: Lint (zero warnings)
        run: npx eslint src --max-warnings 0
```

Both must pass before the Tauri build step runs. Gate order:
1. Frontend lint + type-check
2. Rust check + clippy
3. Tauri build
4. (Release only) Upload assets

---

## 4. Rust Cache (`Swatinem/rust-cache`)

```yaml
      - name: Rust cache
        uses: Swatinem/rust-cache@v2
        with:
          workspaces: './src-tauri -> target'
          # Optional: share cache across branches
          shared-key: 'tauri-${{ matrix.platform }}'
          # Save cache even on failure (speeds up fixing broken builds)
          save-if: ${{ github.ref == 'refs/heads/main' }}
```

- Always specify `workspaces` so the action finds the correct `Cargo.lock`.
- The cache key includes `Cargo.lock` hash automatically — no manual cache-key management needed.

---

## 5. Release Workflow with Asset Upload

Only repos that distribute packaged applications attach assets to releases (org invariant).

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'   # Semantic version tags only

jobs:
  publish:
    permissions:
      contents: write    # Required to create releases and upload assets

    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: ubuntu-22.04
            args: ''
          - platform: macos-latest
            args: '--target aarch64-apple-darwin'
          - platform: windows-latest
            args: ''

    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v4

      # ... (same setup steps as CI workflow above) ...

      - name: Build and publish release
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          RUSTFLAGS: '-D warnings'
        with:
          tagName: ${{ github.ref_name }}
          releaseName: '${{ github.ref_name }}'
          releaseBody: 'See CHANGELOG.md for details.'
          releaseDraft: true      # Always draft first; publish manually after review
          prerelease: false
          args: ${{ matrix.args }}
```

**Release asset rules:**
- Repos distributing packaged apps: `windows-game-explorer`, `nh-reader`, `theme-toolkit`, `depressurizer` — attach `.exe`, `.dmg`, `.AppImage`, `.deb` bundles.
- Repos without packaged output: `windhawk-themes`, `ffxiv-config` — zero-asset releases (notes + tag only).

---

## 6. `GITHUB_TOKEN` Permissions

Always declare the minimum required permissions at the job level:

```yaml
jobs:
  build:
    permissions:
      contents: read      # Default for CI builds
  
  publish:
    permissions:
      contents: write     # Required for release creation and asset upload
```

Never use repository-wide `permissions: write-all`. Scope to the job that needs it.

---

## 7. Cleanup Failed Runs Workflow

Every repository carries a workflow to clean up orphaned failed runs (see template at `.agents/templates/cleanup-failed-runs-workflow-template.yml`):

```yaml
# .github/workflows/cleanup-failed-runs.yml
name: Cleanup Failed Runs

on:
  workflow_run:
    workflows: ['CI', 'Release']
    types: [completed]

jobs:
  cleanup:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    permissions:
      actions: write
    steps:
      - name: Delete failed run artifacts
        uses: actions/github-script@v7
        with:
          script: |
            const { data: artifacts } = await github.rest.actions.listWorkflowRunArtifacts({
              owner: context.repo.owner,
              repo: context.repo.repo,
              run_id: context.payload.workflow_run.id,
            });
            for (const artifact of artifacts.data) {
              await github.rest.actions.deleteArtifact({
                owner: context.repo.owner,
                repo: context.repo.repo,
                artifact_id: artifact.id,
              });
            }
```

---

## 8. Secrets and Environment Variables

| Secret / Env | Where | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | Auto-provided | Release creation, asset upload |
| `TAURI_SIGNING_PRIVATE_KEY` | Repo secret | Tauri updater signature |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Repo secret | Signing key passphrase |
| `RUSTFLAGS` | Workflow env | Zero-warning invariant (`-D warnings`) |

Never store signing keys in workflow files. Always reference via `secrets.*`.

---

## 9. Caching npm Dependencies

```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'    # Caches ~/.npm automatically

      - name: Install dependencies
        run: npm ci       # Always use ci (not install) in CI — uses package-lock.json
```

---

## 10. Branch Protection Recommendations

Required status checks (configure in repo Settings → Branches):
- `build (ubuntu-22.04)`
- `build (macos-latest)`
- `build (windows-latest)`
- Frontend type-check / lint jobs (if separated)

Enforce these on `main` so the branch always builds clean on all platforms.
