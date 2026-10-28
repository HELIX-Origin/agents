# Skill: Cloning Organization Repositories

> Procedure for cloning and managing official `HELIX-Origin` repositories into the local `projects/` directory.

---

## 1. Scope & Invariants

- **Organization Repositories Only:** All active engineering projects belong to the `HELIX-Origin` organization on GitHub (`https://github.com/HELIX-Origin/<repo>`).
- **Clone Destination:** Every organization repository must be cloned inside `projects/<repo>` (e.g., `projects/windows-game-explorer/`). The `projects/` directory is untracked in the root repository.
- **Never Touch Non-Organization Repositories:** Any directory or repository outside the `HELIX-Origin` organization is strictly off-limits and must never be explored, tracked, modified, or mentioned.
- **Git Authorization:** Cloning new repositories or checking out branches requires explicit user authorization for that exact operation, in the current conversation. Task scope alone is never authorization.

---

## 2. Registered Project Inventory

`.agents/registry/projects.json` is the canonical inventory of project checkouts and their current
IDs, paths, kinds, and descriptions. Consult it instead of maintaining a duplicate repository table
in this skill. A registered entry may be planned and not cloned; verify the target path exists.

The agents workspace itself is the current repository root; it must never be nested or cloned
inside its own `projects/` directory. Organization-level repositories that are not project checkouts
in the registry are not project targets merely because a bulk-clone utility can discover them.

---

## 3. Cloning Procedure

### Bulk clone every repository (cross-platform scripts)

Three helper scripts at the workspace root clone **every** `HELIX-Origin` repository
into `projects/`:

| Platform | Script | Shell |
|---|---|---|
| Windows | `clone-org-repos-windows.ps1` | PowerShell 5.1+ |
| Linux | `clone-org-repos-linux.sh` | Bash |
| macOS | `clone-org-repos-macos.sh` | Bash (system 3.2+) |

Behaviour:

- Enumerates the organization live with `gh repo list` — the repository list never goes stale.
- Idempotent: repositories already present in `projects/` are skipped.
- Skips the `agents` repository by default so the workspace is never nested inside its
  own `projects/` folder (override with `-IncludeSelf` / `--include-self`).
- Requires `gh` to be installed and authenticated (`gh auth login`).

Options:

| Windows | Linux / macOS | Meaning |
|---|---|---|
| `-Org <name>` | `--org <name>` | Organization (default `HELIX-Origin`) |
| `-Destination <path>` | `--dest <path>` | Destination (default `<root>/projects`) |
| `-Exclude a,b` | `--exclude a,b` | Skip repositories (comma-separated, repeatable) |
| `-IncludeSelf` | `--include-self` | Also clone the `agents` repository |
| `-Update` | `--update` | Fast-forward existing clones instead of skipping |
| `-Shallow` | `--shallow` | Shallow clone (`--depth 1`) |
| `-DryRun` | `--dry-run` | Preview actions without changing anything |

```powershell
# Windows
./clone-org-repos-windows.ps1
./clone-org-repos-windows.ps1 -DryRun
./clone-org-repos-windows.ps1 -Update -Exclude Theme-Toolkit
```

```bash
# Linux
bash clone-org-repos-linux.sh
bash clone-org-repos-linux.sh --dry-run --exclude Theme-Toolkit,NH-Reader

# macOS  (chmod +x once, then ./clone-org-repos-macos.sh)
bash clone-org-repos-macos.sh --update
```

> Running these scripts clones repositories and therefore requires the same explicit
> user authorization as any clone operation (see §1).

### Method 1: Using GitHub CLI (single repository)

Ensure you are authenticated (`gh auth status`). To clone one organization repository into `projects/`:

```powershell
# Create projects folder if it does not already exist
if (-not (Test-Path "projects")) { New-Item -ItemType Directory -Path "projects" }

# Clone using gh CLI
gh repo clone HELIX-Origin/<repo> "projects/<repo>"
```

### Method 2: Using Standard Git (single repository)

```powershell
git clone "https://github.com/HELIX-Origin/<repo>.git" "projects/<repo>"
```

---

## 4. Post-Clone Verification

After cloning into `projects/<repo>`:
1. Verify remote origin points to `HELIX-Origin/<repo>`:
   ```powershell
   git -C "projects/<repo>" remote -v
   ```
2. Verify clean working tree:
   ```powershell
   git -C "projects/<repo>" status
   ```
3. Never stage or commit anything to the root workspace from `projects/` (governed by `.gitignore`).
