# Skill: Windows Game Explorer Architecture & Engineering System

> Authoritative architectural specification, UI navigation model, native C++20 Win32 design, and Windows Shell Extension engineering standard for **Windows Game Explorer** (`projects/windows-game-explorer`).

---

## 0. Architecture Direction — v2.0.0 Windows Game Explorer (W.54)

**Product Goal:** Recreate and modernize the classic Windows Game Explorer directly inside the Windows 11 File Explorer ecosystem as a native, hardware-accelerated Virtual Shell Namespace Extension paired with a lightweight configuration utility (`GameExplorerConfig.exe`) and a dedicated Game Explorer Manager GUI app (`GameExplorerManager.exe`).

**Core Architectural Principles:**
1. **Completely Native to Windows (Windows 11 Focus):** Built entirely in native C++20 Win32 without webviews, electron, or runtime interpreters. Target platform is focused on Windows 11 (Build 22000–26100+), utilizing modern Win32 and DWM APIs.
2. **Triple-Component Architecture:**
   - **Primary Surface (In-Shell File Explorer Extension — `GameExplorerShell.dll`):**
     Lives directly inside the Windows 11 File Explorer navigation hierarchy under a top-level **"Games"** tab positioned alongside **Home** and **Gallery**. Uses canonical `FOLDERTYPEID_Games` (`{b689b0d0-76d3-4cbb-87f7-585d0e0ce070}`), `ICategoryProvider` / `ICategorizer` separating items into two collapsible sections (`▾ Game Providers (N)` and `▾ Games (N)`), `IThumbnailProvider` / `IShellItemImageFactory` for vertical ~2:3 box art and provider logos, and `IPropertyStore` for rich metadata.
   - **Integration Configuration Utility (`GameExplorerConfig.exe`):**
     A sleek, standalone native Win32 dialog styled with Fluent card containers, custom titlebar pill controls, and system accent colorization. Dedicated strictly to configuring the shell integration (Enable/Disable Explorer registration, layout mode preferences, storefront integration toggles, and OneDrive cloud sync preferences).
   - **Game Explorer Manager GUI Application (`GameExplorerManager.exe`):**
     A separate, dedicated native Win32 GUI application alongside `GameExplorerConfig.exe`, reviving the classic Game Explorer Manager (GEM) utility. Dedicated to managing the games in the library, adding custom/local games (`.exe`, `.lnk`, `.bat`, ROMs), selecting box art (~2:3 case style) and icons, and editing game metadata (`title`, `developer`, `publisher`, `releaseDate`, `rating`, `synopsis`, `launchArguments`, `workingDirectory`).
3. **Storefront-First Metadata & Multi-Platform Launcher Ecosystem (No External Scrapers):**
   External third-party scrapers requiring API keys (IGDB, SteamGridDB, VNDB) are removed. Installed storefront providers and dedicated game launchers (**Steam**, **Epic Games**, **GOG GALAXY**, **Xbox / Microsoft Store**, **EA App**, **Ubisoft Connect**, **Battle.net**, **itch.io**, **Amazon Games**, **Legacy Games**, **Jagex Launcher**, **XIVLauncher**, **Square Enix**, **Guild Wars 2**, **Rockstar Games Launcher**, **Riot Client**, **HoYoPlay**, **Paradox Launcher**, **ES-DE / RetroArch**) are discovered dynamically via Windows Registry (`AppModel\Repository\Packages`, `GamingServices`, `Uninstall`, protocol handlers), `.GamingRoot` drive headers, and environment variables with zero hard-coded paths. Full native image format support includes animated GIFs (`.gif` with `BitmapImage::AutoPlay(true)`), `.png`, `.jpg`/`.jpeg`, `.webp`, `.bmp`, `.ico`, and `.tiff`.
4. **Authentic Launch Execution Hierarchy (`PlatformLauncher`):**
   Always delegates game launches through official client executables where required (e.g. `steam.exe -applaunch <appId>` for Steam to bind the active user profile, DRM, cloud saves, and Steam overlay). Never writes to or alters proprietary storefront files (`shortcuts.vdf`, etc.).
5. **Decoupled Per-Game Metadata Architecture (`metadata.json`):**
   Stores custom games and user overrides in isolated per-game JSON files under `%USERPROFILE%\Game Explorer\metadata\<appId>.json`.

---

## 1. Absolute Invariants — Never Violate

### 1. Game Library Experience Invariant (No Generic Shortcuts Folders)
Windows Game Explorer is fundamentally an authentic, rich, visual **Game Library** inside Windows File Explorer.
- **Generic Shortcuts Folder Degradation is Strictly Prohibited:** Falling back to vanilla Windows Explorer list views (`SHCreateShellFolderView` / `CDefView`) renders plain file-like rows that strip away box art, hero banners, drawer details, and custom library UI. This is classified as an architectural failure and is strictly forbidden.
- The shell integration must deliver an authentic game library experience:
  - Rich visual layouts (tall box art covers, wide hero banners, or formatted details table with high-res thumbnails).
  - Persistent Details Drawer / Sidepane featuring the Fluent controller hero badge, complete game metadata (title, platform, rating, developer, release date, playtime, disk footprint), and one-click launch controls.
  - Active system accent colorization and dark/light mode synchronization with Windows 11 DWM.

### 2. Ban on Blind Trial-and-Error Shell Extension Code Loops
Windows Explorer (`explorer.exe`) hosts shell extensions in-process within its critical Single-Threaded Apartment (STA) main UI thread.
- **Never Make Blind Guesses:** Agents must **NEVER** repeatedly toggle between raw `IShellView` hacks and default `CDefView` fallbacks in iterative guesswork loops.
- **Mandatory Documentation Research:** Before touching or altering shell extension view or folder code, agents must thoroughly research official Microsoft technical documentation, Windows SDK architecture specifications, and verified Win32/COM shell contracts.
- **Analyze Root Causes Thoroughly:** Inspect exact crash offsets, event logs, call stacks, and COM interface query sequences (`QueryInterface` requests for `IFolderView`, `IFolderView2`, `IItemView`, `IExplorerBrowser`).

### 3. Modern Windows 11 File Explorer Architecture Protocol
Modern Windows 11 (Build 22000–26100+) File Explorer uses a XAML Island shell frame (`DesktopWindowXamlSource`) with tabbed navigation:
- Legacy Win32 `IShellView` implementations designed for Windows 95/2000 fail when modern Explorer wraps them in `CLSID_ItemsViewAdapter`.
- If `UIActivate` or window activation forwards focus back to Explorer or receives re-entrant activation messages without an STA-safe decoupling, Explorer enters an infinite activation ping-pong loop (`UIActivate` <-> `OnViewWindowActive` <-> `SetFocus`), exhausting the 1MB thread stack within milliseconds (`0xc00000fd`).
- Inside `explorer.exe`, any call that pumps COM messages (such as synchronous GDI+/WIC image loading or `CoWaitForMultipleHandles` inside `WM_PAINT`) causes re-entrant message dispatch, triggering recursive paints and stack crashes. All disk I/O and image decoding must be strictly decoupled from UI paint routines.

### 4. Zero External Storefront File Writes
Windows Game Explorer never writes to, modifies, or backs up external launcher files (`shortcuts.vdf`, `cloud-storage-namespace-1.json`, or `appmanifest.acf`). Library state, custom overrides, and metadata cache persist exclusively in `%USERPROFILE%\Game Explorer\`.

---

## 2. Component Layout & Directory Structure

The repository under `projects/windows-game-explorer` is organized into focused native C++20 modules:

```
projects/windows-game-explorer/
├── CMakeLists.txt              <- Root CMake configuration (MSVC /W4 /WX C++20)
├── include/
│   └── GameExplorerCore/       <- Public header interfaces
│       ├── Guid.h              <- CLSID/IID declarations and GUID definitions
│       ├── Models.h            <- GameItem, PlatformType, LayoutMode structures
│       ├── StorefrontScanner.h <- Multi-store drive scanning engine
│       ├── PlatformLauncher.h  <- Client launch invocation hierarchy
│       ├── DarkMode.h          <- Windows 11 DWM dark mode & accent helpers
│       ├── Settings.h          <- User settings loader/saver
│       └── Storage.h           <- Paths under %USERPROFILE%\Game Explorer\
├── src/
│   ├── core/                   <- Core engine implementation
│   │   ├── StorefrontScanner.cpp
│   │   ├── PlatformLauncher.cpp
│   │   ├── DarkMode.cpp
│   │   ├── Settings.cpp
│   │   └── Storage.cpp
│   ├── shell/                  <- Windows Shell Extension (GameExplorerShell.dll)
│   │   ├── DllMain.cpp         <- COM DLL entry point & class factory
│   │   ├── Registration.cpp    <- HKCU Shell registration & Desktop\NameSpace
│   │   ├── ShellFolder.h / cpp <- IShellFolder2, IPersistFolder2, IExtractIconW
│   │   ├── CategoryProvider.h / cpp <- ICategoryProvider & ICategorizer (Providers vs Games)
│   │   ├── GameItemUI.h / cpp  <- IThumbnailProvider, IShellItemImageFactory, IPropertyStore
│   │   ├── Resource.h / rc     <- Embedded controller icon & version info
│   │   └── GameExplorerShell.def
│   ├── config/                 <- Win32 Integration Config App (GameExplorerConfig.exe)
│   │   ├── ConfigMain.cpp      <- Integration toggles, layout mode, cloud sync
│   │   └── Resource.rc
│   └── manager/                <- Game Explorer Manager App (GameExplorerManager.exe)
│       ├── ManagerMain.cpp     <- Local game additions, box art picker, metadata editor
│       └── Resource.rc
└── tests/                      <- Dedicated C++ Unit Test Suite (GameExplorerTests.exe)
    ├── CMakeLists.txt
    ├── TestMain.cpp
    └── TestPlatformLauncher.cpp
```

---

## 3. Shell Integration & Registry Protocol

### Shell Folder Registration
Registered under `HKCU\Software\Classes\CLSID\{1666B3DF-60A5-4EF3-8B80-962C82401CD1}`:
- `ThreadingModel = Apartment`
- `InProcServer32 = <full-path-to-GameExplorerShell.dll>`
- `DefaultIcon = <path-to-dll>,-100`
- `ShellFolder\Attributes = 0x20000000` (`SFGAO_FOLDER`)
- `ShellFolder\FolderValueFlags = 0x00000028`
- Pinned to File Explorer navigation pane via `HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Desktop\NameSpace\{1666B3DF-60A5-4EF3-8B80-962C82401CD1}` with title `"Games"`.

### Single Leaf Navigation Node
To prevent Explorer from drawing an expandable dropdown chevron arrow on the "Games" tab (matching Home and Gallery):
- `SFGAO_HASSUBFOLDER` (`0x80000000`) is strictly stripped.
- `SFGAO_STREAM` (`0x40000000`) is strictly avoided.
- `ShellFolder::GetAttributesOf` returns `SFGAO_FOLDER | SFGAO_BROWSABLE | SFGAO_CANLINK` for folder root queries.

---

## 4. Quality Gate & Verification

Every change must compile cleanly under MSVC with zero warnings and pass all unit tests:
```powershell
cmake --build build --config Release
.\build\tests\Release\GameExplorerTests.exe
```
Gate criteria:
- 0 compiler warnings, 0 linker warnings (`/W4 /WX /permissive- /utf-8`).
- 100% test pass rate in `GameExplorerTests.exe`.
- Explorer navigation verified crash-free via `Get-EventLog -LogName Application -Source 'Application Error'`.
