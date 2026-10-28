# Skill: Windows Game Explorer Architecture & Engineering

> Supplementary workspace reference for `projects/windows-game-explorer`. The project's own
> `AGENTS.md`, `.agents/rules/`, source tree, and tracking files are authoritative for current
> project work. Re-check them at the start of each task; do not rely on this summary for live
> Git state or unfinished work.

## Repository identity and boundaries

- Project ID: `windows-game-explorer`
- Registry path: `projects/windows-game-explorer`
- Kind: native Windows C++ project (`windows-cpp`)
- This is a separate Git repository inside the agents workspace's ignored `projects/` folder.
  Its branch, history, and dirty files are independent of the agents repository.
- Never enter or edit this repository for a workspace-only task. When project work is requested,
  confirm the selected session's actual path and Git root, then read its `AGENTS.md` and local rules.
- Keep the project's own instructions and ledgers self-contained. Never copy or link the private
  workspace `.agents/` ecosystem from the public project repository.

## Current product architecture

Windows Game Explorer is a native C++20 Win32 game library and Windows Shell Namespace Extension
for Windows 10 and 11. Its current shipped architecture (v2.5.0) has three runtime components:

- **`GameExplorerShell.dll`** — in-process virtual namespace extension for the installed game
  library, with provider/game categorization, artwork, properties, and context actions.
- **`GameExplorerStudio.exe`** — the single companion GUI with Library Manager, Game Catalogue,
  and Configuration tabs. The former standalone Config and Manager executables have been retired.
- **`GameExplorerService.exe`** — Windows background service with Task Scheduler bootstrap,
  named-pipe commands, storefront directory monitoring, and in-memory cache prewarming.

The catalogue is distinct from the shell library: the shell presents installed games, while the
Studio catalogue can include owned but uninstalled games. Catalogue acquisition is in-memory and
storefront-first: installed-game scanners plus the Steam Web API and read-only GOG Galaxy, itch Butler,
Xbox PC App AsyncCache, and Ubisoft Connect `ownership`/`configurations` caches, with an optional
authenticated legendary cache for Epic. A single Windows-only gate
(`FilterWindowsInstallableOwnedGames()`) drops console/mobile/macOS/Linux-only editions. SQLite is for
settings, achievements, and persistence/cache concerns, not the primary owned-game catalogue.
Multi-store ownership can be deduplicated into a single title with per-store install choices, and
install location always belongs to the storefront client. The catalogue is deliberately a single
list view with no per-title details pane; installing is delegated to the storefront and playing stays
in the File Explorer Games view.

The primary source areas are:

- `include/GameExplorerCore/` — public core models and interfaces.
- `src/core/` — discovery, metadata, catalogue, settings, and shared services.
- `src/shell/` — COM shell namespace extension.
- `src/studio/` — Studio window, tab navigation, and catalogue page.
- `src/manager/` and `src/config/` — Library Manager and Configuration page implementations hosted
  by Studio; not separate shipped applications.
- `src/service/` — background service executable.
- `src/view/` — shell-hosted library view.
- `tests/` — native unit and integration tests.
- `scripts/`, `installer/`, `resources/` — build, verification, packaging, and Windows integration.

Use the actual checked-out tree and project-local instructions for exact file names and behavior;
the list above is a navigation aid, not an exhaustive manifest.

## Non-negotiable project invariants

- Native C++20 and Win32; all C++ targets use MSVC `/W4 /WX` with zero warnings.
- Preserve the authentic game-library experience: two clear provider/game sections, game artwork,
  and rich properties. A generic shortcuts folder is not an acceptable fallback.
- Do not write to or modify proprietary storefront data. Read local client caches read-only and
  delegate installs/launches to official storefront clients or system mechanisms.
- Keep user-owned metadata and settings scoped to the user's Game Explorer data directory.
- Follow the project's local conventions and verify shell changes using the documented research and
  crash-diagnosis process; never guess repeatedly at in-process Explorer COM behavior.
- The minimum compatible Windows 10 build remains a research item; do not claim broader compatibility
  than project-local evidence supports.

## Verification

Read `projects/windows-game-explorer/.agents/rules/verification.md` and prefer its current commands.
The documented primary gates are:

```powershell
.\game-explorer.bat build Release
.\game-explorer.bat test Release
.\game-explorer.bat lint
```

`game-explorer.bat` is the single dispatcher for build, test, lint, package, release, register,
unregister, sign, art and setup-signing; the `scripts\*.ps1` runbooks remain directly invocable for
CI. `lint` runs PSScriptAnalyzer over `scripts\*.ps1` and is also part of `release` and CI. Run commands
from the Windows Game Explorer repository root. Do not run tests or builds for a project when the
user has asked only for agents-workspace work.
