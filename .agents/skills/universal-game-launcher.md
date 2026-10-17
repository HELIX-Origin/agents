# Skill: Universal Game Launcher Architecture & Design System

> Authoritative architectural specification, UI navigation model, visual palette, and plugin engine engineering standard for **Universal Game Launcher** (`projects/Universal-Game-Launcher` / `projects/Steam-Vault`).

---

## 1. Core Philosophy & Non-Invasive Invariants

Universal Game Launcher is a standalone, fast, privacy-focused cross-platform universal game library organizer and launcher built on **Tauri v2** (Rust backend + SvelteKit static SPA with Svelte 5 Runes).

### Absolute Invariants — Never Violate
1. **Core Launcher Non-Invasive Invariant:**
   - Universal Game Launcher's core binary operates completely non-invasively.
   - The core binary never directly writes to or modifies Steam's local files (`shortcuts.vdf`, `cloud-storage-namespace-1.json`, or `appmanifest.acf`) and never requires Steam or other clients to be closed (`ensure_steam_closed()` eliminated from core).
   - If store management (e.g. managing the Steam library) is desired, it is encapsulated cleanly in an opt-in plugin.
2. **Official Depressurizer Plugin Architecture:**
   - Legacy Depressurizer concepts and hardcoded AutoCat logic are decoupled from the core launcher binary.
   - Features that Depressurizer had (reference: `https://github.com/Depressurizer/Depressurizer`) will be provided via an official, dedicated **Depressurizer plugin** within the native modular plugins library.
3. **Internal Modular Library Architecture (Zero Detached Crate Overhead):**
   - The plugin engine operates cleanly as an internal library module within `universal_game_launcher_lib` (`src-tauri/src/plugins/`) on the backend and native TypeScript framework on the frontend (`src/lib/plugins/engine.ts`). No detached cargo crates (`crates/plugin-engine`) are required.
4. **Native Client Delegation & Zero Credential Invariant:**
   - Game launching, installing, updating, and uninstallation always delegate to official client protocols (`steam://rungameid/{id}`, `com.epicgames.launcher://apps/{id}?action=launch`, `goggalaxy://openGameView/{id}`, etc.) or directly execute standalone binaries with configured working directories.
   - Applications must never handle, scrape, or store third-party user credentials or passwords.
   - Preserves official game overlays, cloud synchronization, community friend lists, playtime tracking, and achievements.
5. **Generic SQLite & In-Memory KV Persistence:**
   - All library data, custom collections, custom tags, favorite flags, playtime counters, custom artwork mappings, and plugin settings are persisted locally in `database.sqlite` (with fallback to `database.db`) using SQLite WAL mode.
   - Backed by an in-memory fast KV tier (`mem_kv`) for sub-millisecond (<1ms) responsive transitions.
6. **Emulation & ROM Support via Drop-In Plugins:**
   - Emulation platforms and ROM library organizers are decoupled into the plugin ecosystem. The core binary is not restricted by WinGet policies, and ROM/emulator features are cleanly installed and maintained as drop-in plugins.
7. **Native In-App Modular Plugins Framework (Zero Network/Cloudflare Liabilities):**
   - All game platform integrations (Steam, Epic, GOG, Xbox, EA, Ubisoft, Battle.net, itch, Amazon, Rockstar, Standalone, EmulationStation), metadata providers (Steam Store, GOG, Epic, itch, IGDB, SteamGridDB, TheGamesDB, ScreenScraper, PCGamingWiki, HowLongToBeat, ProtonDB), and feeds (GamerPower Free Game alerts, Store Promotions & Deals, Library Patch Notes) are built directly into the app under `src/lib/plugins/` (`platforms/`, `metadata/`, `utility/`, and `media/`).
   - Visibly called **"Plugins"** across all user-facing interfaces and documentation due to their drop-in modularity, while internally managed as native modules via the in-app plugin engine framework.
   - Every supported platform and metadata provider is authored as its own **dedicated file** (zero monolithic bundle files).
   - Platform plugins integrate all native launcher features outside the store: game launching with official overlays/cloud saves/playtime/achievements, game installation/uninstallation protocols, friends list integration, and native authoritative metadata and artwork fetching.
   - **Cache Reset Invariant**: Game providers are strictly prohibited from overwriting metadata contributed by metadata providers unless the user explicitly chooses to reset the metadata cache. Enhanced records are marked with `userEnhanced: true`.
   - Completely eliminates Cloudflare network blockages, CDN rate limits, runtime `.mjs` in-memory eval liabilities, and fragile external JSON manifests.

---

## 2. Navigation & UI Layout Architecture

The user interface mirrors the proven, ergonomic layout of **Steam and GOG Galaxy**, customized with our high-contrast obsidian purple visual identity.

```
+---------------------------------------------------------------------------------------------------------+
| [LOGO] Universal Game Launcher  < >   DASHBOARD   LIBRARY   STORAGE   PLUGINS   SETTINGS    [Search] [_][#][X]|  <- Custom Title Bar
+------------------------------------+--------------------------------------------------------------------+
|  [🔍 Filter library...           ] |  HERO WALLPAPER BANNER (16:9 / 21:9 with dark vignette)            |
|  [All (142)] [Installed] [★ Favs]  |  +---------------------------------------------------------------+ |
|                                    |  | [Capsule]  TITLE LOGO TYPOGRAPHY                              | |
|  ▼ STEAM (84)                      |  |            By Developer · Published by Publisher · 2024       | |
|    • Cyberpunk 2077                |  |            [▶ PLAY NOW]  [★] [⚙ Manage]   Playtime: 48.2 hrs  | |
|    • Elden Ring                    |  +---------------------------------------------------------------+ |
|    • Hades II                      |                                                                    |
|  ▼ GOG GALAXY (28)                 |  MEDIA GALLERY (Screenshots & Videos with Fullscreen Lightbox)     |
|    • The Witcher 3: Wild Hunt      |  [Img 1] [Img 2] [Img 3] [Img 4] [Img 5]                           |
|    • Hollow Knight                 |                                                                    |
|  ▼ EPIC GAMES (18)                 |  GAME DETAILS & OVERVIEW                                           |
|    • Alan Wake 2                   |  Full description, community tags, store links, install folder.   |
|  ▼ STANDALONE / INDIE (12)         |                                                                    |
|    • Custom Game                   |  CUSTOM ARTWORK STUDIO                                             |
|                                    |  Portrait Capsule · Hero Wallpaper · Transparent Logo · Icon       |
+------------------------------------+--------------------------------------------------------------------+
```

### 1. Title Bar Navigation (Steam / GOG style)
The custom frameless window title bar serves as the primary top-level navigation:
- **Left:** App squircle logo (`static/logo.svg`), brand title `Universal Game Launcher`, and browser history back/forward navigation arrows (`<` / `>`).
- **Center Navigation Tabs:**
  - **DASHBOARD (`/`)**: Executive gaming cockpit featuring Jump Back In / Quick Launch carousel, total library statistics, drive utilization snapshot, top played titles, and real-time Free Games giveaways and Store Deals.
  - **LIBRARY (`/library`)**: The primary gaming cockpit and game showcase.
  - **STORAGE (`/storage`)**: Storage metrics, drive capacity usage bars across connected volumes, and multi-platform installed games disk explorer.
  - **PLUGINS (`/settings?tab=plugins`)**: Comprehensive drop-in plugin manager (Installed, Discover Catalog, Repositories).
  - **SETTINGS (`/settings`)**: Preferences, System Locale, Cache reset, and Per-Plugin Configuration.
- **Right:** Quick filter search box, Settings gear shortcut (`⚙`), and native window controls (Minimize, Maximize, Close).

### 2. Left Sidebar — The Games List (Steam & GOG Galaxy style)
The persistent left sidebar is dedicated to organizing and selecting games instantly:
- **Quick Filter Header:**
  - Instant text filter search input.
  - Filter pills: `All` (with total count), `Installed` (installed on disk only), `★ Favorites`.
  - Asynchronous background platform refresh trigger (`↻ Scan`).
- **Platform Sections (GOG Galaxy style):**
  - Collapsible platform headers with platform badge and game count: Steam, Epic Games, GOG Galaxy, Xbox / Microsoft Store, itch.io, EA App, Ubisoft Connect, Battle.net, Amazon Games, Standalone.
  - Clicking any platform collapses/expands its list of titles.
- **Collections Section (Steam style):**
  - Collapsible user collections with game count badges and `+ New Collection` action.
- **Instant Selection:** Clicking any game in the sidebar immediately renders that game in the Main Showcase View with zero page reloads.

### 3. Main Showcase View (`/library`)
Directly showcases the selected game without cumbersome nested cards:
- **Hero Wallpaper Banner:** High-resolution 16:9 or 21:9 backdrop with smooth purple gradient vignette overlay.
- **Primary Action Header:**
  - Game capsule cover thumbnail (aspect ratio 2:3).
  - Transparent game logo or bold title typography.
  - Big prominent **PLAY / LAUNCH** button that triggers native launcher delegation or executable spawn.
  - Favorite star toggle and Manage dropdown.
  - Live Playtime counter and Last Played timestamp.
- **Media Gallery:** Interactive screenshot gallery with fullscreen lightbox modal.
- **Game Metadata & Overview:** Developer, Publisher, Release Date, Official Store URI, and Custom Tags pills.
- **Custom Artwork Studio:** Slot inspector allowing users to view and replace portrait capsule, hero banner, transparent logo, and app icon via SteamGridDB or local file import.

---

## 3. UI Design System & Color Palette

The interface features an **obsidian dark futuristic purple visual identity** optimized for zero GPU stutter and zero composite hang:

| Token | Hex / CSS Value | Semantic Role |
|---|---|---|
| `--bg-canvas` | `#080511` | Root application background under frameless window |
| `--bg-base` | `#0f0920` | Base workspace and sidebar background |
| `--bg-card` | `#160e2e` | Elevated cards, sidebar rows, and surface panels |
| `--bg-card-hover` | `#221646` | Active hover surface for cards and buttons |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Hairline 1px border for cards and dividers |
| `--border-accent` | `rgba(168, 85, 247, 0.40)` | Focused input and active navigation border |
| `--accent-primary` | `#a855f7` | Neon electric purple (primary brand accent, buttons, active tabs) |
| `--accent-secondary` | `#38bdf8` | Cyber sky blue / cyan (secondary accents, links, info badges) |
| `--accent-glow` | `0 0 20px rgba(168, 85, 247, 0.35)` | Subtle hardware-accelerated glow for active tabs and play button |
| `--text-main` | `#f8fafc` | High-contrast crisp white typography |
| `--text-muted` | `#94a3b8` / `#64748b` | Subtitle text, metadata labels, and secondary hints |
| `--color-success` | `#22c55e` | Installed state, verification pass, online status |
| `--color-warning` | `#f59e0b` | Missing credentials, pending update, disk capacity warning |
| `--color-error` | `#ef4444` | Failure message, process error, remove action |

### High-Performance Rendering Standard
- **Zero `backdrop-filter: blur(...)` Overhead:** Blurring large regions triggers GPU composite stalls on high-refresh displays. Surfaces use solid obsidian tones with clean 1px borders instead.
- **Hardware Acceleration:** All animated elements use `transform: translateZ(0)` and `will-change: transform`.

---

## 4. Native In-App Modular Plugins Framework

The application employs a native, in-app modular plugins framework (`src/lib/plugins/`) where platforms and metadata providers are compiled directly into the application. This ensures instant offline loading, immunity to Cloudflare blocks, and zero external JSON manifests.

### Dedicated Per-Plugin Architecture (Zero Monolithic Files)
Every supported platform and metadata provider lives in its own dedicated, isolated file:
- **Platform Integrations (`src/lib/plugins/platforms/`):**
  - `steam.ts`: Steam library VDF detection, `steam://rungameid/{id}` launch, install/uninstall protocols, and friends status.
  - `gog.ts`: GOG Galaxy registry detection, direct DRM-free executable launch, and `goggalaxy://` protocols.
  - `epic.ts`: Epic Games manifests and Legendary CLI integration with headless DRM-free launch, cloud sync, and auth status.
  - `itch.ts`: itch.io app database and `itch://games/{id}` launch protocols.
  - `xbox.ts`: Xbox Game Pass and `shell:AppsFolder\{id}!App` package launch.
  - `ea.ts`: EA Desktop and `origin2://game/launch?offerIds={id}` launch protocols.
  - `ubisoft.ts`: Ubisoft Connect and `uplay://launch/{id}/0` protocols.
  - `battlenet.ts`: Blizzard Battle.net and `battlenet://{id}` protocols.
  - `amazon.ts`: Amazon Games client and `amazon-games://play/{id}` protocols.
  - `rockstar.ts`: Rockstar Games Launcher and `rockstar://launch/{id}` protocols.
  - `standalone.ts`: Direct standalone and emulator executable launcher with working directory inheritance.
- **Metadata Providers (`src/lib/plugins/metadata/`):**
  - `steam-store.ts`: Store metadata & CDN artwork + Steam Web API key settings & keyless public mode.
  - `steamgriddb.ts`: High-res covers, heroes, logos, dimensions select, NSFW/Humor toggles, and live connection test.
  - `igdb.ts`: Twitch/IGDB client ID & secret, OAuth token test connection, and taxonomy queries.
  - `itch-store.ts`: itch.io indie game metadata & optional API key.
  - `howlongtobeat.ts`: HowLongToBeat completion metrics & preferred metric selector.
  - `pcgamingwiki.ts`: PCGamingWiki bugfixes, FOV fixes, and controller flags.
  - `protondb.ts`: Proton & Steam Deck compatibility tiers and badge settings.
  - `rawg.ts`: RAWG database with optional API key.
  - `gog-catalog.ts`: Official GOG store catalog & CDN artwork.
  - `epic-store.ts`: Epic Games Store catalog & promotional artwork.

### Full Launcher Feature Integration
Platform plugins are not simple launchers; they integrate all features the native client provides (outside of the store):
1. **Game Launching:** Protocol-based or headless CLI execution with native client overlays, cloud save sync, and playtime recording.
2. **Installation & Uninstallation Protocols:** Direct native install and uninstall URIs (e.g. `steam://install/{id}`, `steam://uninstall/{id}`).
3. **Friends List Integration:** Protocol shortcuts to open official client friend rosters and social hubs (e.g. `steam://friends/status`, `goggalaxy://openFriends`).
4. **Achievements & Stats:** Direct hooks to view official client achievement pages.

### Dedicated Tabbed Plugin Settings Sub-Window (`PluginSettingsDialog.svelte`)
- Clicking **Plugin Settings** in Settings (or ⚙ **Configure** on any plugin card) opens a dedicated sub-window dialog with a tabbed UI.
- Displays a distinct configuration tab for each enabled plugin that declares configurable settings.
- Features:
  - Live password visibility eye toggles.
  - Direct "Get API Key ↗" help links opening the official credential portal in the default browser.
  - Real-time in-memory **"🔌 Test Connection"** verification testing API keys or client status on the fly.
  - Direct persistence to the Redis KV tier (`plugin_cfg:<id>`) and SQLite database.
- **Decoupled API Keys Invariant:** All API keys (Steam Web API, SteamGridDB, IGDB, itch.io) are strictly housed in their respective plugin settings tabs and completely purged from the General Settings view.
