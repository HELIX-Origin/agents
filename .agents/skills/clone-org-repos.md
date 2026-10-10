# Skill: Cloning Organization Repositories

> Procedure for cloning and managing official `HELIX-Origin` repositories into the local `projects/` directory.

---

## 1. Scope & Invariants

- **Organization Repositories Only:** All active engineering and documentation projects belong to the `HELIX-Origin` organization on GitHub (`https://github.com/HELIX-Origin/<repo>`).
- **Clone Destination:** Every organization repository must be cloned inside `projects/<repo>` (e.g., `projects/helix-docs/`). The `projects/` directory is untracked in the root repository.
- **Never Touch Non-Organization Repositories:** Any directory outside the `HELIX-Origin` organization (such as `ramensoftware`) is strictly off-limits and must never be explored, tracked, or modified.
- **Git Authorization:** Cloning new repositories or checking out branches requires explicit user authorization for that exact operation, in the current conversation. Task scope alone is never authorization.

---

## 2. Organization Repositories Overview

| Repository | GitHub URL | Description | Local Directory |
|---|---|---|---|
| **helix-docs** | `https://github.com/HELIX-Origin/helix-docs.git` | Shared Jekyll theme & preview site | `projects/helix-docs` |
| **helix-origin.github.io** | `https://github.com/HELIX-Origin/helix-origin.github.io.git` | Organization portal | `projects/helix-origin.github.io` |
| **NH-Reader** | `https://github.com/HELIX-Origin/NH-Reader.git` | Desktop client for nhentai | `projects/NH-Reader` |
| **Windhawk-Themes** | `https://github.com/HELIX-Origin/Windhawk-Themes.git` | Windows 11 Windhawk styler mod suites | `projects/Windhawk-Themes` |
| **Hentai-Senpai-Multi-DE-Theme** | `https://github.com/HELIX-Origin/Hentai-Senpai-Multi-DE-Theme.git` | Multi-DE GTK & GNOME theme | `projects/Hentai-Senpai-Multi-DE-Theme` |

---

## 3. Cloning Procedure

### Method 1: Using GitHub CLI (Recommended)

Ensure you are authenticated (`gh auth status`). To clone an organization repository into `projects/`:

```powershell
# Create projects folder if it does not already exist
if (-not (Test-Path "projects")) { New-Item -ItemType Directory -Path "projects" }

# Clone using gh CLI
gh repo clone HELIX-Origin/<repo> "projects/<repo>"
```

### Method 2: Using Standard Git

```powershell
git clone "https://github.com/HELIX-Origin/<repo>.git" "projects/<repo>"
```

### Bulk Clone All Organization Repositories

If setting up a fresh environment or recovering the workspace:

```powershell
$repos = @(
    "helix-docs",
    "helix-origin.github.io",
    "NH-Reader",
    "Windhawk-Themes",
    "Hentai-Senpai-Multi-DE-Theme"
)

if (-not (Test-Path "projects")) { New-Item -ItemType Directory -Path "projects" }

foreach ($r in $repos) {
    $target = "projects/$r"
    if (-not (Test-Path $target)) {
        Write-Host "Cloning $r..."
        gh repo clone "HELIX-Origin/$r" $target
    } else {
        Write-Host "$r already exists at $target."
    }
}
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
