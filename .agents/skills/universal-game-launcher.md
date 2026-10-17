# Skill: Universal Game Launcher Architecture & Design System

> Authoritative architectural specification, UI navigation model, visual palette (`src/styles/_tokens.scss`), and Universal Core Plugins + Global Helpers engineering standard for **Universal Game Launcher** (`projects/Universal-Game-Launcher`).

---

## 1. Core Philosophy & Non-Invasive Invariants

Universal Game Launcher is a standalone, fast, privacy-focused cross-platform universal game library organizer and launcher built on **Tauri v2** (Rust backend + SvelteKit static SPA with Svelte 5 Runes).

### Absolute Invariants — Never Violate
1. **Core Launcher Non-Invasive Invariant:**
   - Universal Game Launcher's core binary operates completely non-invasively.
   - The core binary never writes to or modifies Steam's local files (`shortcuts.vdf`, `cloud-storage-namespace-1.json`, or `appmanifest.acf`) and never requires Steam or other clients to be closed (`ensure_steam_closed()` eliminated from core).
2. **Internal Modular Library Architecture (Zero Detached Crate Overhead):**
   - The plugin engine operates cleanly as an internal library module within `universal_game_launcher_lib` (`src-tauri/src/plugins/` and `src-tauri/src/metadata/`) on the backend and native TypeScript framework on the frontend (`src/lib/plugins/`). No detached cargo crates (`crates/plugin-engine`) are used.
3. **Native Client Delegation & Zero Credential Invariant:**
   - Game launching, installing, updating, and uninstallation always delegate to official client protocols (`steam://rungameid/{id}`, `com.epicgames.launcher://apps/{id}?action=launch`, `goggalaxy://openGameView/{id}`, `uplay://launch/{id}/0`, `origin2://game/launch?offerIds={id}`, `battlenet://{code}`, `shell:AppsFolder\{pfn}!{appId}`, `itch://games/{id}/launch`, etc.) or directly execute standalone binaries / emulator command lines with configured working directories.
   - The application never scrapes or stores third-party user account passwords.
   - Preserves official game overlays, cloud synchronization, community friend lists, playtime tracking, and achievements.
4. **Generic SQLite & In-Memory KV Persistence:**
   - All library data (`library:default`, `library:custom_games`), game metadata (`game_meta:<appId>`), custom display names (`customNames`), favorite flags, playtime counters, and plugin settings (`plugin_config:<id>`) are persisted locally in `database.sqlite` (with fallback to `database.db`) using SQLite WAL mode.
   - Backed by an in-memory fast KV tier (`mem_kv`) for sub-millisecond (<1ms) responsive transitions.
5. **Universal Core Plugins + Global Helper Modules Architecture:**
   - Instead of dozens of fragmented per-platform or per-service plugin files, core capabilities are consolidated into **Universal Core Plugins** paired with **Global Helper Modules/Functions** under `src/lib/plugins/` and `src-tauri/src/`:
     - **Universal Platform Plugin (`platform-universal`)**: `src/lib/plugins/platforms/universal.ts`
     - **Universal Metadata & Artwork Plugin (`metadata-universal`)**: `src/lib/plugins/metadata/universal.ts` + `src-tauri/src/metadata/universal.rs`
     - **Dedicated Title Normalizer Utility Plugin (`utility-title-normalizer`)**: `src/lib/plugins/utility/title-normalizer.ts` + `src-tauri/src/plugins/title_normalizer.rs`
     - **Universal Media Plugin (`media-universal`)**: `src/lib/plugins/media/universal.ts`
     - **Utility Feed & Storage Plugins**: `src/lib/plugins/utility/gamerpower.ts` (`utility-gamerpower`) & `src/lib/plugins/utility/storage-analyzer.ts` (`utility-storage`)
6. **Automatic Metadata Enhancement & Settings-Only Cache Refresh/Purge Invariant:**
   - Metadata providers (`metadata-universal`) **automatically** fetch and enhance metadata and artwork for all games (including emulated console ROMs, standalone games, and itch.io games) during library scanning and when selecting a game with incomplete metadata.
   - There are **no** manual "Refresh Metadata" or "Enhance Metadata" buttons in the `/library` game showcase topbar or Manage modal.
   - Cache refresh and cache purge buttons live **exclusively in Settings** (`/settings` → `Storage & Cache` tab) for refreshing or purging the app's data cache.
   - Game providers are strictly prohibited from overwriting user customizations or metadata contributed by metadata providers (`userEnhanced: true`) unless the user explicitly resets or purges the metadata cache in Settings.

---

## 2. Navigation & UI Layout Architecture

The user interface combines a custom frameless titlebar with a conditional left game-list sidebar (active only on `/library`) and high-contrast obsidian purple surfaces (`src/routes/+layout.svelte`).

```
+----------------------------------------------------------------------------------------------------------+
| [LOGO] Universal Game Launcher      Dashboard   Library   Store   Social   Storage   Settings   [_][□][✕]| <- Custom Title Bar
+------------------------------------+---------------------------------------------------------------------+
|  [🔍 Filter games...     ] [+] [↻] |  TOP ACTION BAR (details-topbar)                                    |
|  [All 142] [Installed 68] [★ 12]   |  Title  [Console/Platform] [Installed]   [▶ Play] [⚙ Manage] [★] [+]|
|                                    +---------------------------------------------------------------------+
|  ▾ ♨ Steam (84)                    |  HERO BANNER (details-hero — 16:9 backdrop + dark vignette)         |
|    ● Cyberpunk 2077             ★  |  +----------------------------------------------------------------+ |
|    ● Elden Ring                    |  | [2:3 Capsule]  GAME TITLE                                      | |
|  ▾ ◈ GOG Galaxy (28)               |  |                Short description summary...                    | |
|    ● The Witcher 3: Wild Hunt      |  |                [Platform] [App ID] [Playtime] [Size on Disk]   | |
|  ▾ ⌗ itch.io (14)                  |  +----------------------------------------------------------------+ |
|    ● My Futa Family                |                                                                     |
|    ● Relicts of Aeson              |  DETAILS GRID (2-Column Responsive Layout)                          |
|  ▾ 🎲 Nintendo GameCube (5)        |  +----------------------------------------+-----------------------+ |
|    ● The Legend of Zelda:          |  | MEDIA GALLERY (Up to 10 images + zoom) | META & REFERENCE LINKS| |
|      The Wind Waker                |  | VIDEO TRAILERS & PREVIEWS (<video>)    | GAME INFORMATION      | |
|    ● The Legend of Zelda:          |  | GAME AUDIO & SOUNDTRACKS (<audio>)     | INSTALLATION & STORAGE| |
|      Twilight Princess             |  |                                        | PLAYTIME TRACKING     | |
|                                    |  +----------------------------------------+-----------------------+ |
|  68 of 142 installed               |                                                                     |
+------------------------------------+---------------------------------------------------------------------+
```

### 1. Custom Frameless Title Bar (`src/routes/+layout.svelte`)
The custom frameless window title bar (`header.titlebar`) provides top-level navigation with **no** right-side search input or quick-filter bar:
- **Left (`tb-brand`):** App logo (`/logo.svg`), brand title (`Universal Game Launcher`), and brand subtitle (`All-in-One Game Library`).
- **Center Navigation Links (`nav.tb-nav` — `titlebarNav`):**
  1. **Dashboard (`/`)**: Executive gaming cockpit featuring Jump Back In carousel, library & playtime stats, connected drive utilization snapshot, notifications drawer (Free Games, Store Deals, Library Patch Notes), and active tool/overlay downloads status.
  2. **Library (`/library`)**: The primary game library and showcase view (activates the Left Game List Sidebar).
  3. **Store (`/store`)**: Multi-platform store discovery featuring a Steam-style Hero Carousel, live Free Game giveaways, Store Deals filterable by platform/price/discount/DRM-free, and direct store page delegation.
  4. **Social (`/social`)**: Cross-platform friends roster and presence status (`in-game`, `online`, `offline`) with one-click protocol shortcuts to open native client friend overlays (`steam://friends/status`, `goggalaxy://openFriends`, etc.).
  5. **Storage (`/storage`)**: Multi-drive capacity usage bars and unified installed games disk explorer filterable by platform and sortable by disk footprint.
  6. **Settings (`/settings`)**: Categorized configuration workspace with 5 tabs: `General`, `Providers`, `API & Credentials`, `Media & Audio`, and `Storage & Cache`.
- **Right:** Flexible drag spacer (`tb-spacer`) and native window controls (`<WindowControls position="right" />`: Minimize, Maximize/Restore, Close).

### 2. Left Sidebar — The Games List (`aside.sidebar`, Active on `/library` Only)
Rendered conditionally when `isLibraryPage` is true (`page.url.pathname === "/library"`):
- **Sidebar Top (`sidebar-top`):**
  - Search row (`sidebar-search-row`): Instant filter input (`🔍 Filter games...` with `×` clear button), `+` Add Local Game button (`add-game-action-btn`), and `↻` Scan All Platforms button (`scan-action-btn`).
  - Quick Filter Pills (`sidebar-filters`): `All <count>`, `Installed <count>`, and `★ <count>` (Favorites).
- **Live Game List (`sidebar-game-list`):**
  - When a search query is active: renders a flat filtered list of matching games.
  - When browsing normally: renders collapsible **Platform & Console Accordions** (`platform-group-accordion`), sorted with PC platforms first (`Steam`, `GOG Galaxy`, `Epic Games`, `itch.io`, `Xbox`, `EA App`, `Ubisoft Connect`, `Battle.net`, `Amazon Games`, `Rockstar Games`, `Standalone`), followed by **Emulation Console Sections** grouped by each game's specific console (`🎲 Nintendo GameCube`, `🎮 PlayStation`, `🕹️ Nintendo 64`, etc.).
  - Games inside each group are sorted alphabetically by display name (`$customNames[game.appId] ?? game.name`) and show an installed status dot (`status-dot.is-installed`) and favorite star (`★`).
- **Sidebar Footer (`sidebar-footer`):**
  - Displays `{installedCount} of {$games.length} installed`.

### 3. Main Showcase View (`src/routes/library/+page.svelte`)
Displays the selected game in a rich, non-blocking layout:
- **Top Action Bar (`details-topbar`):**
  - Left: Localized/custom game title (`topbar-game-name`), Console/Platform pill (`pill-accent2`), and `Installed` / `Not Installed` pill.
  - Right (`topbar-action-group`): `▶ Play` (or `Install`) primary button, `⚙ Manage` button, `★` Favorite toggle button, and `➕ Add Game` button. (No manual Refresh/Enhance buttons in the topbar.)
- **Hero Banner (`details-hero`):**
  - High-resolution 16:9 / 21:9 hero backdrop (`hero-backdrop`) with gradient overlay (`hero-overlay`).
  - Left: 2:3 Portrait Capsule image (`hero-capsule`, `130px × 195px`) or styled platform icon fallback (`hero-capsule-fallback`).
  - Right (`hero-meta`): Game title (`hero-title`), localized/custom short description (`hero-desc`), and metadata pills (Platform label, App ID, Playtime, Last played date, Size on disk).
- **Main Content Grid (`details-grid`):**
  - **Left / Main Column:**
    1. **Media Gallery Card (`media-gallery-card`):** Up to 10 high-resolution screenshots and official artwork with thumbnail strip (`gallery-thumbnails`) and click-to-expand Fullscreen Lightbox modal (`lightbox-backdrop`).
    2. **Video Trailers & Previews Card (`trailers-card`):** HTML5 `<video>` player for HD trailers and gameplay previews with trailer selector chips (`Trailer 1`, `Trailer 2`, ...).
    3. **Game Audio & Soundtracks Card (`soundtracks-card`):** Built-in `<audio>` player with `▶ Play Theme` / `⏸ Pause Theme`, volume slider, `🔁 Loop` toggle, and track selector list.
  - **Right Column (`details-sidebar`):**
    1. **Meta & Reference Links Card:** Direct external links to Steam Store, SteamDB, ProtonDB, GOG Store, PCGamingWiki Fixes & Settings, and Wikipedia Article.
    2. **Game Information Card:** Platform/Console, Developers, Publishers, Release Date, Metascore badge, Storage size, Install Folder, Executable path, and Genre pills.
    3. **Installation & Storage Card:** Installed/Cloud status badge, Disk Footprint, full Install Folder path, Executable path, Library Host path, and `📂 Open Folder` button.
    4. **Playtime Tracking Card:** Total Playtime and Last Played stat boxes.
- **Per-Game Management & Customization Modal (`⚙ Manage`):**
  - Allows customizing the game's **Display Name / Title**, **Short Description**, **Developers**, **Publishers**, **Release Date**, **Genres**, and **Custom Artwork URLs / Local Paths** (Portrait Capsule Cover, Hero Wallpaper Banner, Transparent Logo).
  - Saves custom title overrides to `customNames` and custom metadata/artwork fields to `game_meta:<appId>` with `userEnhanced: true`.

---

## 3. UI Design System & Color Palette (`src/styles/_tokens.scss`)

The interface uses the **HELIX Origin Futuristic Dark Purple Design System** defined in `src/styles/_tokens.scss` and `src/styles/app.scss`:

| CSS Custom Property | Value | Semantic Role |
|---|---|---|
| `--bg-0` | `#080511` | Deepest obsidian root background |
| `--bg-1` | `#0e091e` | Primary app gradient base background |
| `--bg-2` | `#150e2a` | Secondary elevated background |
| `--panel` | `#140d28` | Standard glass/card surface background |
| `--panel-subtle` | `#0f0a1f` | Subtle recessed surface background |
| `--panel-strong` | `#1b1236` | Elevated card, modal, and button surface |
| `--panel-hover` | `#221743` | Interactive hover surface for cards and buttons |
| `--panel-active` | `#2d1f56` | Active/selected surface state |
| `--border` | `rgba(168, 85, 247, 0.18)` | Standard neon violet hairline border |
| `--border-subtle` | `rgba(168, 85, 247, 0.10)` | Subtle divider border |
| `--border-strong` | `rgba(192, 132, 252, 0.35)` | Emphasized / hovered border |
| `--border-glow` | `rgba(192, 132, 252, 0.60)` | Active glow border |
| `--text` | `#f5f3ff` | Primary violet-tinted high-contrast white text |
| `--text-dim` | `#c4b5fd` | Secondary lavender subtitle text |
| `--text-mute` | `#8b7ca6` | Muted labels, hints, and metadata captions |
| `--accent` | `#a855f7` | Primary neon electric purple accent |
| `--accent-hover` | `#c084fc` | Lighter purple hover accent |
| `--accent-2` | `#e879f9` | Secondary fuchsia/magenta highlight |
| `--accent-cyan` | `#38bdf8` | Cyber cyan accent for links and info badges |
| `--ok` | `#34d399` | Installed badge, online status, verification pass |
| `--warn` | `#fbbf24` | Warning state |
| `--danger` | `#f87171` | Error banner, destructive action |

### Per-Platform Theme Tokens (`$platforms` SCSS map in `_tokens.scss`) & Authentic Vector SVG Platform Icons
- Each platform (`steam`, `itch`, `gog`, `epic`, `xbox`, `ubisoft`, `ea`, `battlenet`, `amazon`, `rockstar`, `other`) automatically generates:
  - `--platform-<id>-gradient`
  - `--platform-<id>-accent`
  - `--platform-<id>-glow`
- **Authentic Vector SVG Platform & Console Icons (`src/lib/components/PlatformIcon.svelte` & `PLATFORM_SPECS`):**
  - Instead of generic Unicode shapes (`♨`, `◈`, `▲`, `●`, etc.), all platform headers, badges, and fallback capsules across the Library sidebar (`+layout.svelte`), Library Showcase (`/library`), Dashboard (`/`), Store (`/store`), Social (`/social`), Storage (`/storage`), and Settings (`/settings`) render crisp, recognizable vector SVG variants (`<PlatformIcon platform={...} />`) representing each actual provider and console brand mark (Steam piston crank, GOG Galaxy ring/G, Epic Games shield, itch.io storefront/gamepad, Xbox sphere X, EA monogram, Ubisoft swirl, Battle.net crest, Amazon smile arrow, Rockstar R★, Nintendo GameCube cube, PlayStation mark, Nintendo Switch, etc.).

### High-Performance Rendering Standard
- **Zero Blur on Cards (`--blur: 0px`, `--blur-strong: 0px`):** Avoids WebView2 GPU composite lag across scrollable lists and cards by using solid obsidian-violet surfaces (`--panel`, `--panel-strong`) paired with inset highlights (`--glass-highlight`).
- **Hardware Acceleration:** Interactive buttons and cards use `transform: translateY(-1px) translateZ(0)`.

---

## 4. Native In-App Universal Core Plugins & Global Helpers Framework

The application employs a native, in-app **Universal Core Plugins + Global Helper Modules** architecture (`src/lib/plugins/` paired with `src-tauri/src/plugins/` and `src-tauri/src/metadata/`). Instead of maintaining dozens of separate per-platform or per-service plugin files, core functional domains are consolidated into cohesive **Universal Plugins** backed by global helper functions.

### Universal Core Plugins (`src/lib/plugins/`)
1. **Universal Platform Providers Plugin (`src/lib/plugins/platforms/universal.ts` — `id: "platform-universal"`):**
   - Consolidates support for all 12 game providers (`steam`, `gog`, `epic`, `itch`, `xbox`, `ea`, `ubisoft`, `battlenet`, `amazon`, `rockstar`, `emulationstation`, `standalone`) into a single declarative `PLATFORM_SPECS` registry (including authentic vector SVG icon paths) and unified `platformUniversalPlugin`.
   - Paired with **Global Platform Helper Functions**:
     - `getAllPlatformSpecs()` / `getPlatformSpec(platformId)` / `getPlatformMetadata(platformId)` / `getAllPlatformMetadata()`: Returns canonical platform metadata, authentic SVG icon definitions (`svgPath` / `viewBox`), colors, known folders, and launcher capabilities.
     - `detectPlatformLauncher(platformId, config?)`: Unified binary, PATH, system store, and CLI (`legendary`, `butler`, `nile`) detection.
     - `installPlatformLauncher(platformId, options?, config?)`: Unified silent WinGet installation, CLI bootstrap, and official download fallback.
     - `getPlatformLaunchSpec(platformId, game, config?)`: Unified protocol URI, headless CLI, and standalone/emulator executable launch specification resolver.
     - `getPlatformUris(platformId, game)`: Unified `installUri`, `uninstallUri`, `storePageUri`, `friendsListUri`, and `achievementsUri` helpers.
2. **Universal Metadata & Artwork Plugin (`src/lib/plugins/metadata/universal.ts` — `id: "metadata-universal"`, backed by `src-tauri/src/metadata/universal.rs`):**
   - Consolidates all metadata and artwork providers into a single **Universal Metadata & Artwork Engine** with field-by-field cascade resolution.
   - Automatically enriches games using keyless multi-source resolution (Local Engine/Receipt Inspector, Steam Store & CDN, GOG Catalog v1 & Products API, Wikipedia + Wikidata MediaWiki API, Libretro Thumbnails CDN, Epic Catalog, itch.io, PCGamingWiki Cargo, ProtonDB) and optional authenticated sources (SteamGridDB, IGDB, TheGamesDB, ScreenScraper) through native Rust `reqwest` (`fetch_external_json`) with zero WebView CORS failures.
   - **Detailed Provider API Architecture Reference**: Always consult [`.agents/skills/game-metadata-providers.md`](./game-metadata-providers.md) when working on metadata resolution, title normalization, or artwork pipelines.
3. **Universal Title Normalizer Utility Plugin (`src/lib/plugins/utility/title-normalizer.ts` — `id: "utility-title-normalizer"`, backed by `src-tauri/src/plugins/title_normalizer.rs`):**
   - Dedicated utility plugin and global helper functions (`normalizeGameTitle`, `normalizeRomTitle`, `canonicalTitleKey`) handling article inversion (`", The"` → `"The ...: "`), subtitle separator unification, No-Intro/GoodTools dump tag stripping, version/promotional noise removal (`Relicts of Aeson`), and slug/PascalCase/compound word splitting (`My Futa Family`).
4. **Universal Media, Feeds & Storage Plugins (`src/lib/plugins/media/` & `src/lib/plugins/utility/`):**
   - `media/universal.ts` (`media-universal`): Unified video trailer streaming and ambient soundtrack playback engine + global media helpers.
   - `utility/gamerpower.ts` (`utility-gamerpower`): Unified free games, store deals, and patch notes alerts.
   - `utility/storage-analyzer.ts` (`utility-storage`): Multi-drive storage footprint analyzer.

### Categorized Settings View (`/settings`) & Cache Management
- All settings live inside `/settings` across 5 functional tabs:
  1. `General`: Language/locale, country code, Steam root path, and default startup behavior.
  2. `Providers`: Per-platform enable/disable toggles, installation status, silent installer actions, and library root directories (`PlatformsSection.svelte`).
  3. `API & Credentials`: Optional API keys for Steam Web API, SteamGridDB, IGDB, and ScreenScraper with password visibility toggles, "Get API Key ↗" links, and live **"🔌 Test Connection"** verification.
  4. `Media & Audio`: Trailer autoplay/mute preferences and ambient soundtrack volume/loop controls (`media-universal`).
  5. `Storage & Cache`: Background storage sync toggle, **Refresh Metadata Cache** button (`refreshAllMetadata`), and **Purge / Reset Metadata Cache** button (`handleClearCache`).
