# Skill: Game Metadata Providers & Multi-Source Enrichment

> Authoritative engineering reference for how **Universal Game Launcher** (`projects/Universal-Game-Launcher`) discovers, queries, normalizes, merges, and caches game metadata and artwork across all metadata providers, local game engine manifests, and retro console databases.

---

## 1. Universal Metadata & Artwork Engine Architecture

### 1.1 Unified Universal Metadata Plugin (`metadata-universal`) & Native Backend Execution
- **Why a Single Universal Metadata Plugin:** Having 11 separate frontend metadata plugins (`steam-store.ts`, `gog-catalog.ts`, `epic-store.ts`, `itch-store.ts`, `steamgriddb.ts`, `igdb.ts`, `thegamesdb.ts`, `screenscraper.ts`, `howlongtobeat.ts`, `pcgamingwiki.ts`, `protondb.ts`) caused sequential WebView `fetch()` waterfalls, CORS failures, and fragmented settings cards.
- **Unified Architecture (`src/lib/plugins/metadata/universal.ts` + `src-tauri/src/metadata/universal.rs`):**
  - All metadata and artwork enrichment is consolidated into a single **Universal Metadata & Artwork Engine (`metadata-universal`)** plugin paired with global helper functions.
  - Browser `window.fetch()` inside Tauri (`Origin: http://tauri.localhost`) is blocked by CORS headers on almost every gaming metadata API, so network queries execute natively in Rust.
- **Mandatory Rule:**
  1. `metadata-universal` executes all multi-provider metadata and artwork cascades in Rust (`src-tauri/src/metadata/universal.rs`) and via the native Tauri HTTP proxy command (`fetch_external_json` / `api.fetchExternalJson(url, options)`) backed by `reqwest::Client` with bounded timeouts (`4s` connect, `8s` read).
  2. **Automatic Metadata Enhancement**: Metadata providers automatically fetch and enhance metadata and artwork for all games in the background (both during library sync and when viewing a game in `/library`).
  3. **Settings-Only Cache Refresh & Purge**: Manual refresh and cache purge buttons belong **exclusively in Settings** (`/settings` → `Storage & Cache` tab) for refreshing or purging the application's data cache (`syncLibraryMetadata` / `clearMetadataCache`). Do not clutter the `/library` game showcase topbar or Manage modal with manual refresh/enhance buttons.

### 1.2 Decoupled Inventory vs. Metadata Enrichment (Zero Dummy Placeholders)
- **Decoupled Inventory Principle:** Platform scanners and emulator importers only emit **minimal identity data** (`appId`, `name`, `platform`, `console`, `exe`, `installDir`). They **never** populate fake descriptions (such as `"Emulated title for Nintendo GameCube..."` or `"Local standalone executable game."`) or fake developer/publisher credits (such as `"Nintendo GameCube"`, `"Emulated Console"`, or `"Standalone & Local"`).
- **Why dummy placeholders are fatal:** If a scanner populates `shortDescription` or `developers` with placeholder strings, the field-by-field merger (`if (!current.shortDescription)`) thinks the game already has metadata and skips real enrichment!
- **Mandatory Rule:**
  - Platform scanners (`platform-universal`, `emulation.rs`, `engine.rs`) must leave `shortDescription`, `developers`, `publishers`, `capsuleImage`, and `heroImage` empty (`null` / `[]`) until resolved by a real metadata source.
  - Both backend (`universal.rs`) and frontend (`engine.ts`) must treat any legacy placeholder string (`"Emulated title for..."`, `"Local standalone executable..."`, developer equal to console/platform name) as empty (`null`) so it is unconditionally replaced by real metadata.

### 1.3 Field-by-Field Metadata Cascade
Metadata is resolved **field-by-field** across a prioritized cascade of sources rather than taking an all-or-nothing payload from a single source:

| Metadata Field | Primary Authoritative Source (PC) | Primary Authoritative Source (Emulated / Retro) | Secondary / Fallback Sources |
| --- | --- | --- | --- |
| `name` (Display Title) | Local Engine Manifest (`System.json`, `package.json`, `.itch/receipt.json.gz` cleaned) / Storefront API | `rom.ini` / No-Intro Normalized Title (`normalize_rom_title`) | Steam Store, GOG Catalog, Wikipedia, IGDB, TheGamesDB |
| `shortDescription` / `detailedDescription` | Steam Store (`appdetails`), GOG (`api.gog.com/products/{id}`), itch.io | Wikipedia MediaWiki Extracts API (`prop=extracts&exintro=1&explaintext=1`), ScreenScraper, TheGamesDB | IGDB (`summary` / `storyline`) |
| `developers` & `publishers` | Local Manifest / PE `CompanyName` / Steam Store / GOG Catalog | Wikidata Claims (`P178` Developer, `P123` Publisher), Wikipedia Infobox, ScreenScraper, TheGamesDB | PCGamingWiki Cargo (`Game.Developers`, `Game.Publishers`), IGDB (`involved_companies`) |
| `releaseDate` & `releaseYear` | Steam Store, GOG Catalog, Epic Catalog, `.itch/receipt.json.gz` | Wikidata Claim (`P577` Publication Date), ScreenScraper, TheGamesDB | PCGamingWiki (`Game.Released`), IGDB (`first_release_date`) |
| `genres` & `categories` | Steam Store, GOG Catalog, Local Engine (`RPG Maker`, `Ren'Py`) | Wikidata Claim (`P136` Genre), Console Category (`Nintendo GameCube`, etc.), TheGamesDB | IGDB (`genres`, `themes`, `game_modes`), PCGamingWiki (`Game.Genres`) |
| `capsuleImage` (2:3 Vertical Cover) | Steam (`library_600x900_2x.jpg`), GOG (`_product_card_v2_mobile_slider_639.jpg`), Epic (`OfferImageTall`) | Libretro Thumbnails (`Named_Boxarts/<Title>.png`), Wikipedia (`pageimages` 1000px), TheGamesDB (`boxart/front`), ScreenScraper (`box-3D` / `box-2D`) | SteamGridDB (`/grids/game/{id}`), IGDB (`t_cover_big`) |
| `heroImage` (16:9 Wide Banner) | Steam (`library_hero.jpg`), GOG (`_bg_crop_1920x1080.jpg`), Epic (`OfferImageWide`) | Libretro Thumbnails (`Named_Snaps/<Title>.png` or `Named_Titles/<Title>.png`), ScreenScraper (`fanart`), TheGamesDB (`fanart`) | SteamGridDB (`/heroes/game/{id}`), IGDB (`artworks` `t_1080p`) |
| `logoImage` (Transparent ClearLogo) | Steam (`logo.png`) | Libretro Thumbnails (`Named_Logos/<Title>.png`), ScreenScraper (`wheel` / `wheel-hd`), TheGamesDB (`clearlogo`) | SteamGridDB (`/logos/game/{id}`) |
| `screenshots` (Up to 10) | Steam (`screenshots[].path_full`), GOG (`api.gog.com/products/{id}`) | Libretro Thumbnails (`Named_Snaps/<Title>.png` + `Named_Titles/<Title>.png`), ScreenScraper (`ss`), TheGamesDB (`screenshot`) | IGDB (`screenshots` `t_1080p`) |
| `movies` (Video Previews) | Steam (`movies[].mp4.max` / `webm.max`), GOG (`videos`) | ScreenScraper (`video`), IGDB (`videos.video_id`) | — |

---

## 2. Local Manifest & Title Normalization Specification

Before querying any network metadata provider, local game folders and ROM archives must be inspected and normalized accurately so neither display titles nor search queries are corrupted.

### 2.1 Local Engine & Storefront Receipt Inspection (`src-tauri/src/metadata/local.rs`)
1. **RPG Maker MV / MZ / VX Ace / XP / 2000 (`inspect_rpg_maker`)**:
   - **Recursive Subfolder Depth (0..=2)**: Many itch.io and standalone distributions extract into a versioned child directory (e.g., `E:\Games\itch\games\relicts-auf-aeson\Relicts of Aeson v027 WIN FREE VERSION\data\System.json`).
   - Always check both the game root `dir` AND its immediate child directories for:
     - `data/System.json` or `www/data/System.json` → JSON key `"gameTitle"`
     - `package.json` (NW.js wrapper) → JSON key `"window"."title"` (ignoring generic `"rmmv-game"` / `"rmmz-game"`)
     - `RPG_RT.ini` → INI key `GameTitle=`
   - **Priority over itch.io Receipt Title**: An RPG Maker `System.json` `gameTitle` or NW.js `window.title` (e.g. `"Relicts of Aeson"`) is clean and authoritative, whereas itch.io developer page titles frequently stuff version numbers, dates, and promotional tags into the title field (e.g., `"[18+, NO AI ART!] Relicts of Aeson v0.27.0, Aug 21th, 2026. Over 600 animations!"`).
2. **itch.io Receipt Inspection (`.itch/receipt.json.gz`)**:
   - Decompress `.itch/receipt.json.gz` with `flate2::read::GzDecoder`.
   - Extract `game.title`, `game.short_text` / `game.shortText`, `game.cover_url` / `game.coverUrl`, `game.published_at` / `game.publishedAt`, and `game.user.display_name` / `game.user.username`.
   - Clean promotional noise from `game.title` via `normalize_game_title` (stripping `[...]` prefixes, `(NSFW 18+)`, version strings `v0.27.0, ...`, and trailing promotional sentences).
3. **Executable Selection Priority (`inspect_game_folder` in `src-tauri/src/plugins/engine.rs`)**:
   - Never select embedded helper/runtime binaries in deep subdirectories (`steamcmd.exe`, `nwjc.exe`, `python.exe`, `pythonw.exe`, `zsync.exe`, `zsyncmake.exe`, `butler.exe`, `legendary.exe`, `EpicOnlineServicesInstaller.exe`, `notification_helper.exe`, `crashpad_handler.exe`) over the actual game executable (`Game.exe`, `nw.exe`, `<GameName>.exe`)!
   - Blacklist internal launcher/staging folders: `Launcher`, `Legendary`, `broth`, `downloads`, `download`, `temp`, `cache`, `__MACOSX`.
   - Never scan `Games/itch` as a flat game folder when `Games/itch/games` exists (which previously caused `E:\Games\itch\games` to be ingested as a 41 GB game named `"Games"`).

### 2.2 Dedicated Title Normalizer Utility Plugin (`utility-title-normalizer` & `src-tauri/src/plugins/title_normalizer.rs`)
Title normalization is decoupled from `emulation.rs` into its own dedicated Utility Plugin (`src/lib/plugins/utility/title-normalizer.ts` backed by `src-tauri/src/plugins/title_normalizer.rs`) for clean, centralized management across all platforms:
- **File Extensions**: Only strip known ROM/archive/executable file extensions (`.iso`, `.rvz`, `.gcz`, `.ciso`, `.wbfs`, `.zip`, `.7z`, `.rar`, `.nes`, `.sfc`, `.smc`, `.z64`, `.n64`, `.v64`, `.ndd`, `.gba`, `.gbc`, `.gb`, `.nds`, `.3ds`, `.cia`, `.nsp`, `.xci`, `.chd`, `.cue`, `.bin`, `.mdf`, `.pbp`, `.cso`, `.exe`, `.lnk`, `.url`) — **never** strip arbitrary `.xxx` substrings in the middle or end of versioned titles!
- **Promotional & Version Suffixes**: Strip `[18+...]`, `(NSFW...)`, emoji suffixes (`🔞`), and everything from a version marker (` v0.`, ` v1.`, ` ver `, ` version `) to the end of the string when followed by release dates or promotional sentences (e.g., `[18+, NO AI ART!] Relicts of Aeson v0.27.0, Aug 21th, 2026. Over 600 animations!` → `Relicts of Aeson`).
- **Article Inversion & Unified Subtitle Separators**:
  - `"Legend of Zelda, The - The Wind Waker"` → `"The Legend of Zelda: The Wind Waker"`
  - `"Legend of Zelda, The: The Wind Waker"` → `"The Legend of Zelda: The Wind Waker"`
  - `"Legend of Zelda, The The Wind Waker"` → `"The Legend of Zelda: The Wind Waker"`
  - `"Legend of Zelda, The"` → `"The Legend of Zelda"`
- **Kebab-Case, CamelCase & Compound Word Splitting**: Convert `kebab-case` (`a-house-in-the-rift` → `A House in the Rift`), `PascalCase` (`MyFutaFamily` → `My Futa Family`), and lowercase concatenated words (`myfutafamily` → `My Futa Family`) into properly spaced Title Case.

---

## 3. Complete Provider-by-Provider API Specification

### 3.1 Steam Store & Web API (`metadata-steam`)
- **Authentication**: Keyless for Storefront & CDN artwork; optional `apiKey` (`https://steamcommunity.com/dev/apikey`) for `IPlayerService/GetOwnedGames`.
- **Store Search Endpoint (Keyless)**:
  - `GET https://store.steampowered.com/api/storesearch/?term={encoded_title}&l=english&cc=US`
  - Response: `items[0].id` (Steam `appId`), `items[0].name`, `items[0].tiny_image`.
- **App Details Endpoint (Keyless)**:
  - `GET https://store.steampowered.com/api/appdetails?appids={appId}&cc={cc}&l={lang}`
  - Response path: `{ "{appId}": { "success": true, "data": { ... } } }`
  - Fields: `name`, `short_description`, `detailed_description`, `developers` (`string[]`), `publishers` (`string[]`), `release_date.date`, `genres[].description`, `categories[].description`, `metacritic.score`, `header_image`, `screenshots[].path_full`, `movies[].mp4.max` / `webm.max`.
- **Direct CDN Artwork Templates (Keyless)**:
  - Vertical Capsule (600×900): `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{appId}/library_600x900_2x.jpg` (fallback: `capsule_616x353.jpg`)
  - Hero Banner (3840×1240): `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{appId}/library_hero.jpg`
  - Clear Logo (PNG): `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{appId}/logo.png`
  - Header (460×215): `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{appId}/header.jpg`

### 3.2 GOG Catalog v1 & Products API (`metadata-gog`)
- **Authentication**: 100% Keyless.
- **Catalog v1 Search Endpoint**:
  - `GET https://catalog.gog.com/v1/catalog?limit=5&query=like:{encoded_title}&order=desc:score&productType=in:game,pack`
  - Response `products[0]`:
    - `id` (GOG product ID string/number)
    - `title`
    - `developers` (`string[]`)
    - `publishers` (`string[]`)
    - `genres` (`{ name: string, slug: string }[]`)
    - `tags` (`{ name: string, slug: string }[]`)
    - `releaseDate` (`"YYYY.MM.DD"` or ISO date)
    - `reviewsRating` (0–50 scale → multiply by 2 for 0–100 score)
    - `coverVertical` (2:3 Vertical Capsule URL)
    - `coverHorizontal` (16:9 Banner URL)
    - `screenshots` (`string[]` template URLs with `_{formatter}.jpg` → replace `_{formatter}` with `_ggvgl_2x` or `.jpg`)
- **Product Details Expansion Endpoint (for Rich Descriptions & Videos)**:
  - `GET https://api.gog.com/products/{id}?expand=description,screenshots,videos`
  - Response: `description.lead` (clean summary), `description.full` (HTML detailed description).
- **Filtered Ajax Fallback**:
  - `GET https://embed.gog.com/games/ajax/filtered?mediaType=game&search={encoded_title}`

### 3.3 Wikipedia & Wikidata MediaWiki API (Keyless Universal & Retro Console Provider)
Covers **100% of console, retro, emulated, and PC games** without any API key.
- **Authentication**: 100% Keyless (requires descriptive `User-Agent` header, already configured on `metadata::http_client()`).
- **Step 1 — MediaWiki Article Search**:
  - Query: `GET https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={encoded_query}&srlimit=5&format=json`
  - For emulated games with a known console (e.g. `Nintendo GameCube`), search `"{title}" "{console}" video game`; fallback to `"{title}" video game`.
  - Select the first result whose title or snippet matches the game title and is not a `(disambiguation)` or `List of ...` page.
- **Step 2 — Extract Lead Synopsis, High-Res Box Art, & Wikidata QID**:
  - Query: `GET https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|pageprops&exintro=1&explaintext=1&pithumbsize=1000&redirects=1&titles={encoded_page_title}&format=json`
  - From `query.pages[pageId]`:
    - `extract`: Full plaintext introduction paragraphs (take first 1–2 paragraphs for `short_description`).
    - `thumbnail.source`: High-resolution official game box art cover (`capsule_image` / `header_image`).
    - `pageprops.wikibase_item`: Wikidata entity ID (e.g., `"Q152194"` for *The Legend of Zelda: The Wind Waker*).
- **Step 3 — Wikidata Structured Claims (`P178`, `P123`, `P136`, `P577`)**:
  - Query: `GET https://www.wikidata.org/w/api.php?action=wbgetentities&ids={qid}&props=claims&format=json`
  - Extract target entity QIDs from `entities[qid].claims`:
    - **`P178` (Developer)** → array of entity IDs (e.g., `Q1145692` = `Nintendo EAD`)
    - **`P123` (Publisher)** → array of entity IDs (e.g., `Q8093` = `Nintendo`)
    - **`P136` (Genre)** → array of entity IDs (e.g., `Q343568` = `Action-adventure game`)
    - **`P577` (Publication Date)** → `mainsnak.datavalue.value.time` (e.g., `"+2002-12-13T00:00:00Z"` → `release_date = "2002-12-13"`, `release_year = 2002`)
  - Resolve human-readable English labels for all collected developer/publisher/genre QIDs in a single batched call:
    - `GET https://www.wikidata.org/w/api.php?action=wbgetentities&ids={qid1|qid2|...}&props=labels&languages=en&format=json`

### 3.4 Libretro Thumbnails Repository (Keyless Official Retro Artwork CDN)
Official retro artwork CDN providing boxarts, title screens, gameplay snaps, and clear logos.
- **Authentication**: 100% Keyless.
- **Base URL Pattern**:
  - `https://thumbnails.libretro.com/{LibretroSystem}/{AssetFolder}/{SanitizedTitle}.png`
- **Asset Folders**:
  - `Named_Boxarts`: Official 2D/3D front box art (`capsule_image`, `header_image`)
  - `Named_Titles`: Title screen capture (`hero_image` or `screenshots[0]`)
  - `Named_Snaps`: In-game gameplay screenshot (`hero_image` primary, `screenshots`)
  - `Named_Logos`: Transparent ClearLogo (`logo_image`)
- **Libretro Filename Sanitization Invariant**:
  - Libretro replaces the following 10 characters with an underscore `_`: `&`, `*`, `/`, `:`, `?`, `<`, `>`, `\`, `|`, `"`.
  - Subtitle separators in No-Intro names use either `" - "` (e.g., `The Legend of Zelda - The Wind Waker (USA).png` or `Legend of Zelda, The - The Wind Waker (USA).png`) or `"_ "` when converted from a colon.
  - Candidate probe order for a title (e.g. `The Legend of Zelda: The Wind Waker`):
    1. `{Title with ': ' -> ' - '} (USA).png` (e.g. `The Legend of Zelda - The Wind Waker (USA).png`)
    2. `{Inverted ', The' Title with ': ' -> ' - '} (USA).png` (e.g. `Legend of Zelda, The - The Wind Waker (USA).png`)
    3. `{Title with ': ' -> ' - '} (Europe).png` / `(World).png` / `(En,Fr,De,Es,It).png`
    4. `{LibretroSanitizedTitle} (USA).png`

### 3.5 TheGamesDB API v1 (`metadata-thegamesdb`)
- **Authentication**: Requires `apikey` parameter (`https://api.thegamesdb.net/key.php`). When no `apikey` is configured in `metadata-thegamesdb`, transparently fall back to the backend Wikipedia + Wikidata + Libretro pipeline so retro metadata enhancement always succeeds!
- **Endpoint**:
  - `GET https://api.thegamesdb.net/v1/Games/ByGameName?name={encoded_title}&apikey={apiKey}&include=boxart,platform&fields=overview,publishers,genres,rating,players`
- **Image URL Construction**:
  - Base URL: `data.base_url.original` (or `include.boxart.base_url.original`, default `"https://cdn.thegamesdb.net/images/original/"`).
  - Images list: `include.boxart.data[gameId]` (or `data.include.images[gameId]`).
  - Match `type == "boxart" && side == "front"` → `capsuleImage`; `type == "fanart"` → `heroImage`; `type == "clearlogo"` → `logoImage`; `type == "screenshot"` → `screenshots`.

### 3.6 ScreenScraper API v2 (`metadata-screenscraper`)
- **Authentication**: Requires registered ScreenScraper developer credentials (`devid`, `devpassword`) and optional user account (`ssid`, `sspassword`). When unconfigured or rate-limited, transparently fall back to the backend Wikipedia + Wikidata + Libretro pipeline!
- **Endpoints**:
  - Search: `https://api.screenscraper.fr/api2/jeuRecherche.php?devid={devId}&devpassword={devPass}&softname=UniversalGameLauncher&output=json&recherche={encoded_title}&ssid={userId}&sspassword={userPass}`
  - Game Info: `https://api.screenscraper.fr/api2/jeuInfos.php?devid={devId}&devpassword={devPass}&softname=UniversalGameLauncher&output=json&gameid={gameId}&ssid={userId}&sspassword={userPass}`
- **Media Types (`response.jeu.medias`)**:
  - `box-3D` / `box-2D` → `capsuleImage`
  - `fanart` → `heroImage`
  - `wheel-hd` / `wheel` → `logoImage`
  - `ss` → `screenshots`
  - `video` / `video-normalized` → `movies`

### 3.7 IGDB API v4 (`metadata-igdb`)
- **Authentication**: Twitch Developer `clientId` + `clientSecret` (`https://dev.twitch.tv/console/apps`).
  1. `POST https://id.twitch.tv/oauth2/token?client_id={clientId}&client_secret={clientSecret}&grant_type=client_credentials` → `access_token`.
  2. `POST https://api.igdb.com/v4/games` with headers `Client-ID: {clientId}`, `Authorization: Bearer {access_token}`, and APICalypse body:
     `search "{title}"; fields name, summary, storyline, first_release_date, genres.name, themes.name, game_modes.name, involved_companies.developer, involved_companies.publisher, involved_companies.company.name, cover.url, artworks.url, screenshots.url, videos.video_id, total_rating, rating, websites.url, collection.name, franchises.name; limit 1;`
- **Image Sizing**: Replace `t_thumb` in `//images.igdb.com/igdb/image/upload/t_thumb/{hash}.jpg` with `t_cover_big` (capsule) or `t_1080p` (hero & screenshots) and prefix with `https:`.

### 3.8 SteamGridDB API v2 (`metadata-steamgriddb`)
- **Authentication**: Bearer token (`Authorization: Bearer {apiKey}`) from `https://www.steamgriddb.com/profile/preferences/api`.
- **Endpoints**:
  - Search: `GET https://www.steamgriddb.com/api/v2/search/autocomplete/{encoded_title}` → `data[0].id`
  - Grids (2:3 Vertical): `GET https://www.steamgriddb.com/api/v2/grids/game/{gameId}?dimensions=600x900&nsfw={nsfw}&humor={humor}`
  - Heroes: `GET https://www.steamgriddb.com/api/v2/heroes/game/{gameId}?nsfw={nsfw}&humor={humor}`
  - Logos: `GET https://www.steamgriddb.com/api/v2/logos/game/{gameId}?nsfw={nsfw}&humor={humor}`
  - Icons: `GET https://www.steamgriddb.com/api/v2/icons/game/{gameId}?nsfw={nsfw}&humor={humor}`

### 3.9 PCGamingWiki MediaWiki & Cargo API (`metadata-pcgamingwiki`)
- **Authentication**: 100% Keyless via MediaWiki `opensearch` + `parse` / `pageimages` / `cargoquery`.
- **Important Note on Cargo Table Name**: PCGamingWiki's Cargo table was renamed from `Infobox_game` to `Game` (and anonymous `cargoquery` requests may return an error code if restricted). Therefore, always combine:
  1. `GET https://www.pcgamingwiki.com/w/api.php?action=opensearch&search={encoded_title}&limit=1&format=json` → `pageTitle`, `pageUrl`
  2. `GET https://www.pcgamingwiki.com/w/api.php?action=cargoquery&tables=Game&fields=Game._pageName=Page,Game.Developers,Game.Publishers,Game.Released,Game.Genres,Game.Cover_URL,Game.Steam_AppID,Game.GOGcom_ID&where=Game._pageName=%22{encoded_pageTitle}%22&format=json`
  3. Fallback if `cargoquery` is restricted: `GET https://www.pcgamingwiki.com/w/api.php?action=query&titles={encoded_pageTitle}&prop=pageimages|extracts&pithumbsize=800&exintro=1&explaintext=1&format=json`

### 3.10 HowLongToBeat (`metadata-howlongtobeat`) & ProtonDB (`metadata-protondb`)
- **ProtonDB**:
  - `GET https://www.protondb.com/api/v1/reports/summaries/{steamAppId}.json`
  - Returns `tier` (`platinum`, `gold`, `silver`, `bronze`, `borked`, `native`), `score`, `confidence`, `total`.
- **HowLongToBeat**:
  - Executes via native Rust `reqwest` proxy (`api.fetchExternalJson`) with `Referer: https://howlongtobeat.com/` and `User-Agent` headers to avoid browser CORS errors.
