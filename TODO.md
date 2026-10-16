# TODO.md — HELIX Origin Consolidated Task Ledger

> 📋 **Living Source of Truth**: Actionable task ledger across all projects in the **HELIX Origin** organization.
> Statuses: ⬜ backlog · 🚧 in progress · ✅ done (tracked as `- [ ]` and `- [x]` checkboxes).
> High-level direction lives in [`ROADMAP.md`](./ROADMAP.md), active sprint planning in [`PLAN.md`](./PLAN.md), issues in [`BUGS.md`](./BUGS.md).
> Last updated: 2026-10-14

---

## 📜 Tracking Rules

- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Consistent Formatting**: Maintain consistent formatting and style throughout all documentation to ensure readability and professionalism.
- **Clear Sectioning**: Use clear and descriptive headers for each section to improve navigation and readability.
- **Mandatory Project Tagging**: **Every single task, workstream, and backlog item must explicitly include its project tag** (`[<project-name>]`). Agents must never guess which repository a task belongs to.
- **Active Items First**: The currently active milestone, sprint, task, or workstream must always be placed at the top of the content sections.
- **Regular Updates**: Ensure that this file is regularly updated to reflect the latest developments and changes in the project.
- **Improve User Directives**: Continuously refine and clarify user directives to ensure they are easily understood and actionable.
- **Same-Change Updates**: When a task changes behavior or scope, update this file in the same change.
- **Done Moves Down**: When a task is done, check it off and archive completed sections under Completed Workstreams.
- **Tracking Docs Stay True**: Update `ROADMAP.md`, `TODO.md`, `BUGS.md`, and `PLAN.md` first or in lockstep with code changes.
- **Always Track Everything**: Every new feature request, enhancement, or bug report must be logged before execution.

---

## 🔥 Active Workstreams

### 🎯 [Steam-Vault] & [Steam-Vault-Catalogue] Workstream W.35: Multi-Provider Metadata Parity, Lightweight Catalogue Index Manifest, Settings & Per-Game Refresh Metadata, and i18n Localization
- **Project Identifiers:** `[Steam-Vault]` (`projects/Steam-Vault`), `[Steam-Vault-Catalogue]` (`projects/Steam-Vault-Catalogue`)
- **Target Components:** `projects/Steam-Vault/src-tauri/src/commands.rs`, `projects/Steam-Vault/src-tauri/src/lib.rs`, `projects/Steam-Vault/src/lib/api.ts`, `projects/Steam-Vault/src/lib/types.ts`, `projects/Steam-Vault/src/lib/i18n/*`, `projects/Steam-Vault/src/routes/settings/+page.svelte`, `projects/Steam-Vault/src/routes/library/+page.svelte`; `projects/Steam-Vault-Catalogue/scripts/modules/types.ts`, `projects/Steam-Vault-Catalogue/scripts/modules/config.ts`, `projects/Steam-Vault-Catalogue/scripts/modules/indexer.ts`, `projects/Steam-Vault-Catalogue/scripts/modules/engine.ts`, `projects/Steam-Vault-Catalogue/scripts/modules/providers/*`, `projects/Steam-Vault-Catalogue/index.json`

**Locked user directives:**
- "ok the web search needs to be keyword based instead of direct image url based. aslo some of the images being fetched by our providers are showing up as broken images"
- "Also using the steam store and steamdgridb as the sole source for metadata is problematic. we have multiple supported meatdat providers to ensure we never miss artowrk. many of the games this app will support are not on the steam store and don't have artowkr on the steamgriddb."
- "We support multiple. I have repeatedly told you to use the same metadata sources we use in our steam-vault-catalogue. so VNDB, IGDB, Wikapedia, PCGaminkWiki, Elulation game metadata sources, etc. we need a versatile amount of metadata providers. minimal api keys if possible but api keys can be accepted if they are completey free and working. RAWG is intentionally not supported sicne the website has been broken for eyars and is no longer able to get an API key from."
- "Note: Our steam-vault-catalogue has a cron workflow that adds new games to it's metadata on a daily basis. so it gets new games every day. We can technically update that with the same metadata source updates we make here. in fact, i recommend doing that so both repos have the same support."
- "Note: A button in the settings tab to fetch metadata for all games would be usful for updating missing metadata and artwork and ehnacing existing metadata and artwork if possible. Ths is also needed since the per game details pages will need it to refresh or update their auto fetched details. This can be a refresh metadata button."
- "ok. the index.json file in the steam-vault-catalogue repo needs to serve as an ntree point to detect the actual per game json files. it should not carryu the infor they provide. that is redundant and will cause it to become far too large to keep in the repo defeating the point of having per game json files to begin with."
- "We should include proper i18n support so it works with our steam-vault apps i18n localization support."
- "we need to update the population workflow in the steam vault catalogue repo. rn it only uses a cron, it also needs an option for manually running it. we also need to make sure it is corrctly using the updated modular script when populating and updating the catalogue."

**Implementation checklist:**
- [x] `[Steam-Vault-Catalogue]` **Lightweight Index Manifest** — refactored `scripts/modules/indexer.ts` and `types.ts` to output `CatalogueIndexEntry` in root `index.json`, providing a compact entrypoint (220 KB, >80% reduction) pointing to `games/<slug>.json` without bloated descriptions, categories, scores, and image arrays.
- [x] `[Steam-Vault-Catalogue]` **Expanded Metadata Providers** — implemented `pcgamingwiki.ts` (MediaWiki parsing & box art), `libretro.ts` (emulation box art, snaps, titles across console systems), and enhanced `wikipedia.ts` with direct box art image extraction (`pageimages`); integrated all into `scripts/modules/engine.ts`.
- [x] `[Steam-Vault]` **Backend Single-Game & Library Metadata Refresh** — implemented `refresh_game_metadata` command querying and merging across Steam Store, Catalogue, PCGamingWiki, Wikipedia, and VNDB; updated `sync_library_metadata` with `force` and `auto_artwork` support in `commands.rs` and registered in `lib.rs`.
- [x] `[Steam-Vault]` **Settings Library Metadata & Artwork Refresh Action** — added "Fetch & Refresh Library Metadata" UI block in `/settings` under Preferences & Offline Cache with live status indicators, auto-artwork toggle, and online catalogue sync trigger.
- [x] `[Steam-Vault]` **Per-Game Details & Modal Refresh Metadata Buttons** — added prominent "Refresh Metadata" button on game details topbar and in Manage modal with spin indicator and live feedback toast.
- [x] `[Steam-Vault]` **Keyword-Based Multi-Provider Artwork Search** — added PCGamingWiki and Libretro Emulation search providers to Artwork Manager modal; updated filter dropdown with all providers; enabled safe search toggle; and enforced client-side `onerror` removal of dead URLs to prevent broken image cards.
- [x] `[Steam-Vault]` **Comprehensive i18n Localization** — expanded `TranslationDictionary` in `types.ts` and `en.ts` with all strings for metadata refresh, display name customization, artwork search placeholders, and provider filter labels.
- [x] `[Steam-Vault-Catalogue]` & `[Steam-Vault]` **Cross-Repo i18n & Multilingual Metadata Schema Parity** — added `locales` to `game.schema.json` and `types.ts` in `Steam-Vault-Catalogue`, added `languages.ts` supporting all 30 Valve/Steam languages, added `locales` validation in `validator.ts`, aggregated multilingual titles into `aliases` during index generation in `indexer.ts`, preserved `locales` in `catalogue.db.gz`, added `locales` to `AppMeta` in both Rust (`models.rs`) and TypeScript (`types.ts`), and implemented `getLocalizedTitle` and `getLocalizedDescription` in `projects/Steam-Vault/src/routes/library/+page.svelte` dynamically reacting to active `$locale` and `$activeLanguage`.
- [x] `[Steam-Vault-Catalogue]` **Manual & Scheduled Population Workflow Overhaul** — updated `.github/workflows/populate-catalogue.yml` with comprehensive `workflow_dispatch` manual inputs (`mode` selection: `missing`, `all`, `crawl`, `seeds`, `query`, `slug`, `index`, `validate`; `provider`, `limit`, `query`, `slug`, `dry_run`), added `--experimental-strip-types` to npm scripts in `package.json` for seamless Node 22+ execution, and verified `populate-catalogue.yml` and `validate.yml`.
- [x] `[Steam-Vault]` & `[Steam-Vault-Catalogue]` **Verification Suite** — verified with `npm run catalogue:validate` (729/729 games valid), `npm run catalogue:build:index`, `npm run check` (0 errors, 0 warnings), and `npm run build` (clean Vite + SvelteKit bundle).
- [x] `[Steam-Vault]` & `[Steam-Vault-Catalogue]` **Release Workflows, Manual Asset Attachment & Semantic Releases** — updated `.github/workflows/release.yml` in `Steam-Vault` and `.github/workflows/build-release.yml` in `Steam-Vault-Catalogue` to support `workflow_dispatch` manual inputs for selected release tags and automated asset uploads (`.msi`, `.exe`, `.dmg`, `.deb`, `.AppImage` for Steam Vault; `dist/catalogue.db.gz` and `dist/index.json.gz` for Catalogue). Published semantic releases `v1.2.0` and `v1.1.0` conforming strictly to workspace release notes standards.

---

### 🎯 [Steam-Vault] Workstream W.34: Library 500 Repair, Steam-Parity Artwork & Custom Display Name Sub-Window, and Settings Navigation & Layout Consolidation (Completed)

---

### 🎯 [Steam-Vault] & [Steam-Vault-Catalogue] Workstream W.33: Multi-Platform Owned Games Detection, Official & Enhanced Metadata Engine, Interactive Library Grid & Per-Game Management Pages, and Catalog Alignment (Completed)
- **Project Identifiers:** `[Steam-Vault]` (`projects/Steam-Vault`), `[Steam-Vault-Catalogue]` (`projects/Steam-Vault-Catalogue`)
- **Target Components:** `src-tauri/src/platforms/detectors.rs`, `src-tauri/src/platforms/mod.rs`, `src-tauri/src/metadata/*`, `src-tauri/src/commands.rs`, `src-tauri/src/steam/models.rs`, `src/routes/library/+page.svelte`, `src/lib/api.ts`, `src/lib/types.ts`; `projects/Steam-Vault-Catalogue/schema/game.schema.json`, `projects/Steam-Vault-Catalogue/scripts/build-index.ts`, `projects/Steam-Vault-Catalogue/scripts/manage-catalog.ts`

**Locked user directives:**
- "using the official integrations for the primary metadata source with our additional metadata sources for enhancement or filling in missing metadata will be useful for the library tab."
- "The library tab can user per game sub pages for managing installation/uninstalltion. the sub pages will have rich detailes with description, metadata links, etc. these will serve as the per game management pages."
- "This means our steam-vault-catalogue will also need to be updated to support this new direction."
- "Actually the library tab CAN get the grid layout and can be useful for installing/uninstalling games. It should display all owned games from every supported platform and have filtering options to allow people to easily differentiate between, platform, installed, uninstalled, etc."
- "This means our game platform integrations will need to detect all owned games if possible."
- "I think we needs to update our autodetection for all supported platforms to detect the game installation locations and then use the correct methods for launching those games."
- "I think the most effective option is to auto detect the locations by default, and instead of having the user fetch them just use a toggle in the settings app to enable/disable the integrations."
- "Cloud drives like Google Drive, OneDrive, etc should not be showing up in the app."
- "Note: game launching can also be added to the per game details/management pages. this way the Steam Vault app can alos be a more detailed launcher if the users desire it."
- "It can use steam to launch the games since it wills till be adding all non-steam games to the steam library. this *should* simplify things a little bit."
- "Note: The library tab should have a righ sidebar for toggling sort/filter/etc options. These would make it easier to sort, filter, or find games and would be generally a useful addition to the library tab update we are working on."
- "The per game details/management pages should have a 10 image mideia gallery, a meta links card, details card(s), playtime treacking, etc. they should be extensive details pages with a play button for launching the game and a manage button that opens a small management sub window with all of the per game management options."
- "Note: The library tab itself will still use the grid display i suggested before. This entire update is actually revolving around the redisgned library tab."
- "This will also allow us to simplify the storage, organize, and other management tabs and move the simplified versions to the sttings page as their own dedicated sections. Note: The organization will still need to have the ability to fully organize the steam library on the steam side, but instea d of using cards, it will use lists. This way users can select multiple organizations copes, and even be eabke to make their own custom scopes (similar to how Deperessurizer worked)."
- "no the library tab will be grid view. We are no abandoning the library tab redesig. The storage info will no longer display a library sinc eit won't need it and will be for dispaying the sotrage statistics. This plan is to streamline teh app's UI and functionality since we are implementing a luancher functionality to it."
- "the commands need to be corrected as well. they should be catalogue:{command}"
- "catalogue:all should be catalogue:update:all basically the update commands should be catalogue:update:{command}, follow the naming pattern basically main:sub:option"
- "remove incorrectly formatted commands too. we don't need duplicate commands."
- "Note: our plan is to slowly move the metata sources solely over to official source and our catalogue. this way user's aren't required to provide api keys or anable.disable ketadata sources."
- "User's will still need to provide their steam web api key to get all of their steam games, but that will be the only api key users will need to provide in the Steam Vault app once our metadata source update is complete."
- "The media gallery is strictly enforcing 10 images instead of capping at 10 images. this is causing duplicate images. We should fix that. We should also expand the type of media allowed. up to 2 videos allowed as the first 2 media items, and the images can be screenshots, game previews, and videos."
- "for the game grid, instead of having the play and download buttons show over the images on hover, we can have a play/download button and a manage button on the bottom right of the grid cards. the play button will appear for installed games, and the download button will appear for games that are not installed."
- "we can actually leave the manage button solely in the per game details/management pages"
- "Note: for emulation, we do support emulated roms and games in Steam Vault, however, the directories will need to be set manually since there is no standard location for roms. not to mention emulation is often used for piracy, so auto detection is not optional. we can have support for various popular emulation platforms to allow emulated games to work in our Steam vault app, but no automated detection of installation directories will be done for emulated games. Users will need to add their emulators themselves so the app can scan it for the configured rom directories."
- "Note: This repo can be used to scaffold a premade roms storage directory for the users: https://github.com/retrogamecorps/ES-DE-Directories"
- "in fact. emulation station can be our supported method for handling ROMs"

**Implementation checklist:**
- [x] `[Steam-Vault]` **Multi-platform owned games detection backend** — expand GOG detector to read `%ProgramData%\GOG.com\Galaxy\storage\galaxy-2.0.db` in read-only mode, extracting owned and installed games, titles, and store images; surface uninstalled games with installation URIs across GOG, Epic, Steam, Ubisoft, and EA.
- [x] `[Steam-Vault]` **Zero-third-party-API-key metadata architecture transition** — implement metadata resolver prioritizing authoritative official sources (Steam Store API / ACF manifests, GOG Galaxy DB / APIs, Epic manifests, Xbox AppxManifest, Itch receipts, PE headers) layered with the open Community Game Catalogue (`catalog_seed.bin` / `index.json`); plan extraction from local authenticated Steam installation data (`appinfo.vdf`, `packageinfo.vdf`, `localconfig.vdf`) to make even the Steam Web API key completely optional.
- [x] `[Steam-Vault]` **Per-game management commands** — add backend commands for `launch_game` (via `steam://run/{app_id}` with native URI/executable fallback), `install_game`, `uninstall_game`, and `open_game_folder`.
- [x] `[Steam-Vault]` **Redesigned Library Grid & Right Sidebar** — primary vertical capsule Grid view as the central launcher hub with clean box art (no hover overlay); bottom-right card actions with Play (installed) or Download (uninstalled); collapsible Right Sidebar with instant sort options (Name, Playtime, Last played, Size) and granular filters (Platform counts, Install state, Collections, Favorites, Hidden).
- [x] `[Steam-Vault]` **Extensive Per-Game Details & Management Sub-Page with Video Support** — interactive media gallery supporting up to 2 videos first, followed by screenshots and preview artwork, capped strictly at 10 items without artificial padding or duplicate URLs; full-screen lightbox modal with inline video player; meta links card (Store, PCGamingWiki, SteamDB, ProtonDB, Wikipedia, Community Catalogue), comprehensive details cards, playtime tracking, Play/Install button, and dedicated Manage button launching the game management modal.
- [x] `[Steam-Vault]` **Missing Artwork Cascading & High-DPI Vector Glyphs** — multi-stage fallback (local Steam `grid/` artwork → `library_600x900.jpg` → `header.jpg` → `capsule_616x353.jpg` → `game.icon` → styled platform-themed fallback card); replaced blurry download glyph with crisp inline vector SVG download arrow and play button.
- [x] `[Steam-Vault]` **Complete App-Wide SCSS Architecture Migration** — installed `sass`, established `src/styles/` (`_tokens.scss`, `_mixins.scss`, `_platforms.scss`, `app.scss`, `library.scss`, `settings.scss`, `storage.scss`, `organize.scss`, `platforms.scss`, `artwork.scss`, `collections.scss`), configured `$styles` alias in `svelte.config.js`, removed all embedded `<style>` blocks and hardcoded inline styles across all route pages.
- [x] `[Ecosystem]` **Styling Standards & SCSS Agent Ecosystem Integration** — created authoritative rule `.agents/rules/styling-standards.md`, modern skill `.agents/skills/scss-architecture.md`, updated `desktop-engineer.md`, and updated `AGENTS.md` quick reference table.
- [x] `[Steam-Vault]` **Manual Emulation, Anti-Piracy Invariant & ES-DE Directory Scaffolding** — disabled automated filesystem sweeps, drive candidate scanning, and emulator config sniffing for ROMs/emulators; supported EmulationStation Desktop Edition (`ES-DE`) as standard ROM management method; implemented `scaffold_es_de_directories` for 50+ consoles with `systeminfo.txt` guides; added UI in Settings for manual emulator configuration and deterministic console detection from `ROMs/<system>/...` directory paths.
- [x] `[Steam-Vault]` **Streamlined Storage Statistics & Multi-Scope Organize Lists** — pure storage analytics and library folder manager on `/storage`; Depressurizer-style multi-select scope lists and custom rule builder on `/organize`.
- [x] `[Steam-Vault-Catalogue]` **YAML issue templates** — add `.github/ISSUE_TEMPLATE/` configuration with `config.yml`, `1_bug_report.yml`, `2_metadata_correction.yml`, and `3_feature_proposal.yml` tailored for catalogue ingestion and multi-storefront metadata reporting, linking directly to the dedicated Discord community (`https://discord.com/invite/Ww3XBZC2HV`).
- [x] `[Steam-Vault-Catalogue]` **Jekyll documentation site with helix-docs & vCard home page** — create `docs/` site configured with `remote_theme: HELIX-Origin/helix-docs`, `docs/_config.yml`, 5-section vCard styled `docs/index.md` home page, user guides in `docs/_docs/`, technical architecture in `docs/_wiki/`, and compliant 256x256 squircle logo `docs/assets/images/logo.svg` verified with ImageMagick.
- [x] `[helix-origin.github.io]` **Portal showcase card & asset integration** — add Steam Vault Catalogue project card and `steam-vault-catalogue.svg` asset to the portal homepage grid.
- [x] `[Ecosystem / Org]` **Disable GitHub Discussions & route to Discord** — disabled GitHub Discussions across all repositories in `HELIX-Origin` via GitHub CLI and routed community contact links in issue templates to `https://discord.com/invite/Ww3XBZC2HV`.
- [x] `[Steam-Vault-Catalogue]` **Standardized `main:sub:option` NPM scripts & living index** — unified modular TypeScript ESM catalogue manager (`scripts/manage-catalogue.ts`, `scripts/modules/*`) with `catalogue:update:all`, `catalogue:update:missing`, `catalogue:populate:games`, `catalogue:populate:seeds`, `catalogue:validate`, `catalogue:build:index`, and root living `index.json`.
- [x] `[Steam-Vault]` **Verification & test suite** — `cargo test` passes 39 unit tests with 0 failures; `cargo check` exits code 0; `npm run check` passes with 0 Svelte errors and 0 warnings; `npm run build` succeeds cleanly.

---

### 🎯 [Steam-Vault] Workstream W.32: Windows Store & Xbox Game Detection, Custom NSIS Installer, and System Tray Support
- **Project Identifier:** `[Steam-Vault]` (`projects/Steam-Vault`)
- **Target Components:** `src-tauri/src/platforms/detectors.rs`, `src-tauri/src/platforms/registry.rs`, `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/windows/hooks.nsh`, `src-tauri/windows/sidebar.bmp`, `src-tauri/icons/tray-icon.png`

**Implementation checklist:**
- [x] `[Steam-Vault]` **AppModel registry & WindowsApps game detection** — query Windows AppModel repository registry packages and `WindowsApps` folders for `xboxservices.config`, `MicrosoftGame.config`, Xbox manifest protocols (`xboxliveapp`, `ms-xbl-`), and `shell:AppsFolder` AUMID resolution.
- [x] `[Steam-Vault]` **Steam shortcut UWP launcher handling** — wire `explorer.exe shell:AppsFolder\...` for UWP / Windows Store games on shortcut import so games launch reliably via Windows AppContainer activation.
- [x] `[Steam-Vault]` **Custom NSIS script & installer hooks** (`src-tauri/windows/hooks.nsh`) — implement preinstall process termination for running instances and synchronous uninstaller execution matching NH-Reader pattern.
- [x] `[Steam-Vault]` **ImageMagick NSIS sidebar bitmap** (`src-tauri/windows/sidebar.bmp`) — generate 164x314 branded obsidian 24-bit BMP with centered squircle mark and add generator script.
- [x] `[Steam-Vault]` **NSIS configuration in tauri.conf.json** — configure `bundle.windows.nsis` with `installMode: "both"`, multilingual selector, installer icon, hooks, and sidebar bitmap.
- [x] `[Steam-Vault]` **System tray implementation** (`src-tauri/src/lib.rs`) — enable `tray-icon` and `image-png` features in Tauri, build tray icon with "Show Steam Vault", "Minimize to Tray", separator, "Quit", left-click toggle, and window close-to-tray event handler.
- [x] `[Steam-Vault]` **Verification & test suite** — verify live detection of Microsoft Solitaire Collection, run unit tests, cargo check, cargo test, and full test runner.

---

### 🎯 [Multi-Project] Workstream W.31: FFXIV-Config vCard Home Pattern & Portal Showcase Integration
- **Project Identifiers:** `[FFXIV-Config]` (`projects/FFXIV-Config`), `[helix-origin.github.io]` (`projects/helix-origin.github.io`)
- **Target Components:** `projects/FFXIV-Config/docs/index.md`, `projects/FFXIV-Config/docs/assets/images/ffxiv-config.svg`, `projects/helix-origin.github.io/docs/index.md`, `projects/helix-origin.github.io/README.md`, `projects/helix-origin.github.io/docs/assets/images/ffxiv-config.svg`

**Locked user directives:**
- "Our FFXIV-Config repo docs didn't use the custom vcard layout for the home page. we need to fix that. we also need to add it to the primary docs site."

**Implementation checklist:**
- [x] `[FFXIV-Config]` **Refactor home page to vCard pattern** — restructured `docs/index.md` strictly according to `helix-docs` vCard specification (`_docs/home-page.md`) with 5 numbered sections (`01 Overview`, `02 Features & Hotbar Architecture`, `03 Supported Jobs`, `04 Documentation Directory`, `05 Credits & Disclaimer`) and boxed counters.
- [x] `[FFXIV-Config]` **Vector artwork generation** — authored 16:9 widescreen SVG artwork (`ffxiv-config.svg`) following `.agents/rules/project-artwork.md` standards with meteor/crystal emblem and gold/cyan palette.
- [x] `[helix-origin.github.io]` **Portal showcase card integration** — added FFXIV Config project card with 16:9 artwork to `docs/index.md` project grid and linked repository in `README.md`.

---

### 🎯 [Steam-Vault-Catalog] Workstream W.30: Community Game Catalog Infrastructure & High-Precision Platform Discovery
- **Project Identifiers:** `[Steam-Vault-Catalog]` (`projects/Steam-Vault-Catalog`), `[Steam-Vault]` (`projects/Steam-Vault`)
- **Target Components:** `scripts/populate.js`, `scripts/build-index.js`, `schema/game.schema.json`, `package.json`, `README.md`, `.github/workflows/*`; `src-tauri/src/cache.rs`, `src-tauri/src/commands.rs`, `src-tauri/src/platforms/detectors.rs`

**Locked user directives:**
- "ah slight issue in the steam vault catalogue rpeo, the workflow didn't add any new game json files to the repo. we may need a workflow for populating the repo with game json files."
- "it also got the tag and release versions wrong. actual semantic versioning is important."
- "ah the populate workflow is a bit too manual it needs to populate the repo with all games from all supported metadata providers."
- "the games folder is where the json files are stored not dist, so it should not be psushing the dist folder since that is local only."
- "ok. the steam-vault-catalogue repo needs an update. it has outdated documentation, it needs it's description and topics set, and it needs to have it's games populated a few times to get a decent catalogue built up."
- "also the poplate script isn't accepting .env files and i'm not sure if the generate script is needed since we have the populate script."
- "basically it needs to support both .env files and github secrets"
- "the build-index command should be build:index, populate can be populate:games, etc, keeping a standard where beneficial is useful for the commands."
- "this means removing the build-index, buld, and populate commands since we don't need duplicate commands."
- "ok. one slight issue in our steam-vault-catalogue repo. it's only populating the info for windows. each game file needs to info for windows, macos, and linux. so all supported platforms must be included in each game json file. we need to fix this in our populations cripts and also update all existing game json files to fix them as well."
- "note, not many metadata providers support roms or emulators. so we need metadata providers for console games as well as retro console games. this should fill in for that lack of info. Both the Steam Vault and Steam Vault Catalogue projects need this update."
- "the platform integration needs to be able to determine console platforms too, such as GameCube, Wii, Playstation, etc. this is necessary for emulated games."
- "note: emulator is not a valid platform in the per game json files, that is more of a software category."
- "our game json files have property names that aren't allowed. we need to fix our json files to ensure we are using the correct format and keys"
- "we have incorrect types in our game json files in the catalogue repo"

**Implementation checklist:**
- [x] `[Steam-Vault-Catalog]` **Repository initialization & schema** — created `HELIX-Origin/Steam-Vault-Catalog` with MIT license, `.gitattributes` (LF), `.gitignore` (ignoring `dist/` and `node_modules/`), and formal JSON schema in `schema/game.schema.json`.
- [x] `[Steam-Vault-Catalog]` **Automated multi-provider crawler** (`scripts/populate.js`) — automated pagination crawler for IGDB (`IGDB_CLIENT_ID` & `IGDB_CLIENT_SECRET`), SteamGridDB (`STEAMGRIDDB_API_KEY`), Steam Storefront API, and VNDB Kana API with state persistence in `scripts/.crawler-state.json`.
- [x] `[Steam-Vault-Catalog]` **Zero-dependency .env & GitHub secrets loader** — added `loadEnv()` supporting local `.env` files while cleanly preserving GitHub Actions repository secrets in CI.
- [x] `[Steam-Vault-Catalog]` **VNDB Kana API query fix** — fixed query fields from `dev.name` to `developers.name` and updated data extraction for `developers`.
- [x] `[Steam-Vault-Catalog]` **Script command standardization & de-duplication** — standardized npm scripts to canonical colon-scoped names (`build:index`, `populate:games`, `validate`), dropped duplicate aliases (`generate`, `populate`, `build`, `build-index`, `test`), and deleted obsolete `scripts/generate.js`.
- [x] `[Steam-Vault-Catalog]` **Repository metadata configuration** — set GitHub repository description and 12 relevant topics (`steam-vault`, `game-catalog`, `metadata`, `pc-gaming`, `steam`, `gog`, `epic-games`, `itch-io`, `ea-app`, `emulators`, `helix-origin`, `game-metadata`) via `gh repo edit`.
- [x] `[Steam-Vault-Catalog]` **Documentation update** — updated `README.md` and `CONTRIBUTING.md` with accurate architecture, `.env` setup, and updated command names (avoiding static game counts as the catalog continuously expands).
- [x] `[Steam-Vault-Catalog]` **Automated CI SemVer release pipeline** (`.github/workflows/populate-catalog.yml`, `build-release.yml`) — automated patch bumping (`npm version patch`), CHANGELOG/README updating, git push authenticated via `PAT_TOKEN`, git release tagging, and release assets generation (`catalog.db.gz`, `index.json`, `index.json.gz`).
- [x] `[Steam-Vault]` **Offline SQLite game catalog & platform detector fixes** — implemented local SQLite game catalog in `cache.rs`, Roman numeral normalization, passive Windows uninstall registry metadata ingestion (eliminating duplicates), EA working directory `start_dir` fix, itch.io cache blacklist and multi-engine support, emulator config-based ROM discovery, and Settings UI catalog synchronization.
- [x] `[Steam-Vault-Catalog]` **Multi-platform & console platforms taxonomy** — updated all game JSON files to include supported OS platforms (`windows`, `macos`, `linux`) and specific console hardware (`PlayStation`, `PlayStation 2`, `GameCube`, `Wii`, `Nintendo 64`, `Super Nintendo`, `Game Boy Advance`, `Genesis`, `Dreamcast`, etc.), while strictly excluding software categories like `"emulator"`.
- [x] `[Steam-Vault-Catalog]` **Game JSON type & schema validation fix** — resolved type violation where visual novel files had string VNDB IDs (e.g. `"v239"`) in `externalIds.igdbId` (which expects an integer or null); preserved VNDB IDs in `externalIds.vndbId` and reset `externalIds.igdbId` to null; updated `scripts/populate.js` and `scripts/validate.js` to strictly enforce type safety; verified `npm run validate` passes with 0 errors across all game files.
- [x] `[Steam-Vault]` **Console platform identification & UI badge** — implemented `determine_console_platform` in `src-tauri/src/platforms/detectors.rs` resolving console platforms from ROM extensions and emulator paths, exposed `console: Option<String>` in `PlatformGame`, and surfaced console badges in `src/routes/platforms/+page.svelte`.
- [x] `[Steam-Vault]` **Wikipedia video game & console metadata provider** — implemented keyless MediaWiki wikitext infobox parser in `src-tauri/src/metadata/extra.rs` resolving developer, publisher, genre, release year, console platforms, and summaries; wired into `ensure_game_metadata` for console shortcuts and exposed via `wikipedia_game_lookup` Tauri command.
- [x] `[Steam-Vault]` **Console platform shortcut tags** — updated `shortcuts::NewShortcut` and `shortcuts::build_fields` to write console platforms into binary `shortcuts.vdf` `tags`, and updated `shortcuts::load_shortcuts` to load tags into `game.collections` for automatic categorization.
- [x] `[Steam-Vault]` **Catalog seed database synchronization** — compiled `dist/catalog.db.gz` from the game files in `Steam-Vault-Catalog` and synchronized it to `projects/Steam-Vault/src-tauri/src/catalog_seed.bin`.
- [x] `[Steam-Vault & Catalog]` **Online catalog sync JSON deserialization & case normalization** — resolved `JSON error: invalid type: sequence` when syncing online catalog archives; added untagged `StringOrSeq` enum in `cache.rs` supporting both stringified and sequence arrays for `platforms` and `known_exes`, and `Option<serde_json::Value>` for `meta_json` / `meta`; added serde aliases (`app_id`, `release_year`, etc.) and defaults to `AppMeta` in `models.rs`; recomputed normalized titles and lookups during import; updated `build-index.js` to emit both camelCase and snake_case properties in catalog metadata; verified with dedicated unit tests and full 7-suite runner.

---

### 🎯 [Multi-Project] Workstream W.29: Multi-Platform Tauri v2 CI Release Workflows (Steam-Vault & NH-Reader)
- **Project Identifiers:** `[Steam-Vault]` (`projects/Steam-Vault`), `[NH-Reader]` (`projects/NH-Reader`)
- **Target Components:** `.github/workflows/release.yml`, `.github/releases/*.md`

**Locked user directives:**
- "the release workflow failed. you should research how to make a proper release workflow for a tauri v2 app when making the release workflow"
- "we also need the release actually made so the workflow can attatch the compiled installers to it."
- "if the release workflow is going to create the release, it needs to follow our release notes format standards."
- "NH-Reader will need a proper release workflow as well. hwoever NH-Reader has a optional singing step for local builds that will be skipped in the release workflow, and android and ios builds won't be included in the release workflow in NH-Reader either."

**Implementation checklist:**
- [x] `[Steam-Vault]` **Release notes standard compliance** — create `.github/releases/v1.0.0.md` strictly following `.agents/rules/release-notes.md` (Highlights, Key Improvements, Changed, Fixed, Compatibility Matrix, Verification, Changes & Commits).
- [x] `[Steam-Vault]` **Two-stage release workflow architecture** — re-architect `.github/workflows/release.yml` into separate `create-release` (creates/updates release with full notes via `PAT_TOKEN`) and `build-and-upload` (matrix: Windows, macOS universal, Ubuntu 22.04 with `releaseId` and `tagName`).
- [x] `[Steam-Vault]` **Ubuntu 22.04 CI dependency fix** — replace missing `libappindicator3-dev` with `libayatana-appindicator3-dev` and `libwebkit2gtk-4.1-dev` (eliminating exit code 100).
- [x] `[NH-Reader]` **Release notes standard compliance** — create `.github/releases/v0.7.5.md` strictly following `.agents/rules/release-notes.md` standard structure.
- [x] `[NH-Reader]` **Two-stage release workflow architecture** — create `.github/workflows/release.yml` with `create-release` (release notes from `.github/releases/v0.7.5.md`) and desktop matrix `build-and-upload` (Windows, macOS universal, Ubuntu 22.04).
- [x] `[NH-Reader]` **Local signing and mobile excluded** — release workflow omits `scripts/sign.mjs` (signing stays local-only opt-in) and excludes Android/iOS from the build matrix.
- [x] `[Workspace]` **Update release notes taxonomy rule** — update `.agents/rules/release-notes.md` table to document prebuilt desktop installer assets for Steam-Vault and NH-Reader.
- [ ] `[Multi-Project]` **Verification & push** — verify builds, commit, and push changes to origin.

---

### 🎯 [Steam-Vault] Workstream W.24: Platform & Non-Steam Enhancements
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src-tauri/src/platforms/{mod,detectors,registry}.rs`, `src-tauri/src/steam/shortcuts.rs`, `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`; `src/routes/platforms/+page.svelte`, `src/lib/{api,types}.ts`; `docs/_docs/…`

**Locked user directives:**
- "a complete management tool for the steam library with organization, storage management, non-steam game support, and any other feature that benefits a completely steam library management suite."
- "we also need to implement a log file cleanup. this way we don't get a excessive amount of stale log files. we should have a max amount of log files so only the most recent log files are kept. This should help prevent the log files from eating up the user's storage. We should do this alongside our current work."
- Docs stay "100% accurate" and free of stale information.

**Implementation checklist:**
- [x] `[Steam-Vault]` **Settings non-Steam paths refinement** *(user request)* — mirror Steam's set/find UX: each platform's "extra folders" becomes a list of individual path inputs with a **+** button that spawns another input and a remove (**×**) button; a per-platform **Find folders** button autofills its detected library folders (new `find_platform_folders` command). Drop the semicolon-joined text field.
- [x] `[Steam-Vault]` **Storefront launch URIs** — populate `PlatformGame.launch_uri` for Epic (`com.epicgames.launcher://apps/<id>`) and itch (`itch://games/<id>`), and write it as the non-Steam shortcut's launch option on import.
- [x] `[Steam-Vault]` **Per-game platform override** — command to set/clear the appid → platform mapping (`set_game_platform`), plus UI in Library to re-tag a shortcut's source storefront individually or in bulk.
- [x] `[Steam-Vault]` **Microsoft Store / Xbox Game Pass detection** — manifest-based (`MicrosoftGame.config`, `appxmanifest.xml`) detector for `Platform::Xbox`, no scraping.
- [x] `[Steam-Vault]` **Log file cleanup** *(user request)* — automated retention in `scripts/lib/logger.mjs` capping the number of `logs/*.log` files to the most recent entries (default 25) so stale files do not accumulate on disk.
- [x] `[Steam-Vault]` **Multi-provider game metadata resolver & organization fix** *(user request)* — resolve developer, publisher, genre, tags, release year across all games (Steam + non-Steam shortcuts); split multi-value developer/publisher strings (`autocat.rs`); platform publisher fallback; fix missing collections in `compute_categorization` and `compute_autocats`.
- [x] `[Steam-Vault]` **Automatic artwork fetching for non-Steam games** *(user request)* — automatically query SteamGridDB / Steam / VNDB and apply grid portrait, hero, logo, and icon into `userdata/<id3>/config/grid/` when shortcuts are scanned or imported (`import_platform_games`), plus bulk `auto_fetch_missing_artwork` command.
- [x] `[Steam-Vault]` **Diverse metadata sources (VNDB, Steam Store Search, Local Engine Inspector)** *(user request)* — add keyless `vndb` provider for visual novels / Ren'Py titles; keyless `steam_search` (`storesearch`) to match non-Steam titles with Steam app IDs; `local` engine sniffer (itch `receipt.json`, Ren'Py `game/*.rpa`, RPG Maker `System.json`, Windows PE executable VersionInfo).
- [x] `[Steam-Vault]` **Emulator & ROM support** *(user request)* — `Platform::Emulator`; scan popular emulators (Dolphin, Mupen64Plus/Project64, PCSX2, DuckStation, PPSSPP, RPCS3, Citra, Cemu, Ryujinx, mGBA, RetroArch, Snes9x) and ROM directories with launch parameter wiring (`-b -e "<rom>"`, etc.); UI dropdowns and settings paths.
- [x] `[Steam-Vault]` **High-performance platform scanner & ROM matching** *(user request)* — replace `A..=Z` drive probing with `sysinfo::Disks`; pre-locate emulators for $O(1)$ in-memory ROM extension resolution; add top-level executable fast paths and opt-in "Scan all drives" toggle.
- [x] `[Steam-Vault]` **Verify + docs** — `node scripts/test.mjs all` green; README/CHANGELOG/`_docs`/`_wiki` updated.

> **Status:** Complete — W.24 fully implemented and verified across 32 unit tests and full test runner.

---

### 🎯 [Steam-Vault] Workstream W.24b: Hand-Rolled i18n Localization Engine (All 30 Steam Languages)
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src/lib/i18n/*`, `src/lib/stores.ts`, `src/lib/types.ts`, `src/routes/+layout.svelte`, `src/routes/settings/+page.svelte`, `src/routes/**/+page.svelte`; `docs/_docs/Localization.md`, `README.md`, `CHANGELOG.md`

**Locked user directives:**
- "we need to add ii8n localization support using hand rolled localization. All languages supported by steam need to be added."
- Zero bulky external runtime dependencies — hand-rolled TypeScript + Svelte reactive stores.
- Full platform support for all 30 Valve/Steam officially supported languages: English, German, French, Italian, Korean, Spanish (Spain), Simplified Chinese, Traditional Chinese, Russian, Thai, Japanese, Portuguese (Portugal), Polish, Danish, Dutch, Finnish, Norwegian, Swedish, Hungarian, Czech, Romanian, Turkish, Brazilian Portuguese, Bulgarian, Greek, Arabic (with RTL layout support), Ukrainian, Latin American Spanish, Vietnamese, Indonesian.

**Implementation checklist:**
- [x] `[Steam-Vault]` **i18n core engine & stores** (`src/lib/i18n/index.ts`, `types.ts`) — reactive `$t` store, fallback resolution to English, parameter interpolation (`{param}`), local storage persistence (`steam_vault_language`), RTL direction detector.
- [x] `[Steam-Vault]` **30 Steam language translation dictionaries** (`src/lib/i18n/locales/*`) — comprehensive translations for navigation, common actions, dashboard, library, storage, artwork, collections, platforms, organize, and settings.
- [x] `[Steam-Vault]` **Settings language selector** (`src/routes/settings/+page.svelte`) — replace text input with accessible dropdown featuring all 30 languages with native script and English names, instant language switching, and persistence to backend settings.
- [x] `[Steam-Vault]` **Layout & navigation localization** (`src/routes/+layout.svelte`) — translate sidebar navigation, titlebar, window status, error banner, and add dynamic `dir="rtl"` support for Arabic.
- [x] `[Steam-Vault]` **View integration** — wire `$t` across library, platforms, storage, artwork, organize, collections, and dashboard.
- [x] `[Steam-Vault]` **Unit tests & verification** (`scripts/verify-i18n.mjs`, `node scripts/test.mjs all`) — verify all 30 languages load, test missing key fallbacks, verify parameter interpolation, and run verification suites.
- [x] `[Steam-Vault]` **Documentation & tracking** — document i18n architecture in `docs/_docs/Localization.md`, update `README.md` and `CHANGELOG.md`.

> **Status:** Complete — W.24b fully implemented and verified. Ready for W.25 (Dynamic collections).

---

### 🎯 [Steam-Vault] Workstream W.25: Dynamic (Filter-Spec) Collections
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src-tauri/src/filter.rs`, new `src-tauri/src/steam/filters.rs`, `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`; `src/routes/organize/+page.svelte`, `src/routes/collections/+page.svelte`, `src/lib/{api,types}.ts`; docs

**Implementation checklist:**
- [x] `[Steam-Vault]` **Filter-spec model** — persist named Allowed/Required/Excluded specs, evaluate against the current library.
- [x] `[Steam-Vault]` **Smart collections** — save/apply/re-apply a spec; refresh a collection from its spec.
- [x] `[Steam-Vault]` **UI** — Organize gains spec save/load; Collections shows which are smart with one-click re-evaluation.
- [x] `[Steam-Vault]` **Verify + docs** — `npm run test:all` green; docs updated.

> **Status:** Complete — W.25 fully implemented and verified. Next: W.26 (SQLite metadata cache).

---

### 🎯 [Steam-Vault] Workstream W.26: SQLite Metadata Cache
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src-tauri/Cargo.toml` (`rusqlite` bundled), `src-tauri/src/cache.rs`, `src-tauri/src/commands.rs`; docs

**Locked user directives:**
- Dependency decision: **rusqlite with the `bundled` feature** (compiles SQLite from source; no system dependency).

**Implementation checklist:**
- [x] `[Steam-Vault]` **SQLite cache layer** — schema + open/migrate; get/put/count metadata rows keyed by provider + id in WAL mode.
- [x] `[Steam-Vault]` **Swap the JSON cache** — metadata providers read/write SQLite; one-time auto-migration importing existing `metadata-cache.json`.
- [x] `[Steam-Vault]` **Verify + docs** — all 7 test suites pass; SQLite metadata cache architecture documented.

> **Status:** Completed.

---

### 🎯 [Steam-Vault] Workstream W.27: Milestone M5 — Glassmorphism UI Pass
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src/app.css`, `src/routes/+layout.svelte`, all `src/routes/**/+page.svelte`

**Locked user directives:**
- Deferred until "the app is more or less complete" — now that features are frozen, do the full pass.
- "Full modern dark glassmorphism visual design pass across every view."

**Implementation checklist:**
- [x] `[Steam-Vault]` **Design tokens** — glass surfaces, blur, radii, elevation, accent system in `app.css`.
- [x] `[Steam-Vault]` **Apply across every view** — library, organize, collections, platforms, storage, artwork, settings, title bar.
- [x] `[Steam-Vault]` **Verify + docs** — test suites pass; modern dark obsidian glass styling applied across all routes.

> **Status:** Completed.

---

### 🎯 [Steam-Vault] Workstream W.28: v1.0 Release Packaging
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `static/`, `src-tauri/icons/`, `.github/`, `CHANGELOG.md`, `README.md`

**Implementation checklist:**
- [x] `[Steam-Vault]` **HELIX squircle branding artwork** — app icon set + repository 16:9 vector SVG social preview (`static/steam-vault.svg`, `docs/assets/images/steam-vault.svg`, ImageMagick verified).
- [x] `[Steam-Vault]` **GitHub issue templates** — `config.yml`, `1_bug_report.yml`, `2_feature_proposal.yml`.
- [x] `[Steam-Vault]` **Release notes + CHANGELOG v1.0.0** — version bump across `package.json`, `Cargo.toml`, `tauri.conf.json`, `CHANGELOG.md`, and portal project card.

> **Status:** Completed.

---

### 🎯 [Steam-Vault] Workstream W.23: Milestone M4 — Custom Artwork Manager
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src-tauri/src/steam/artwork.rs` (new), `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`, `src-tauri/src/steam/mod.rs`, `src-tauri/src/metadata/steamgriddb.rs`; `src/routes/artwork/+page.svelte` (new), `src/routes/+layout.svelte`, `src/lib/{api,types}.ts`; `docs/_docs/Artwork-Management.md` (new), `README.md`, `CHANGELOG.md`

**Locked user directives:**
- Steam Vault is "a complete management tool for the steam library with organization, storage management, non-steam game support, and any other feature that benefits a completely steam library management suite."
- Docs must stay "100% accurate" and free of stale information.
- The full glassmorphism UI pass stays deferred until "the app is more or less complete".

**Implementation checklist:**
- [x] `[Steam-Vault]` **Artwork backend** — `src-tauri/src/steam/artwork.rs`: inspect/apply/remove the five custom-artwork slots in `userdata/<id3>/config/grid/` (portrait grid, landscape grid, hero, logo, icon); magic-byte PNG/JPEG sniffing; dependency-free base64 `data:` previews; backup-on-replace; 7 unit tests.
- [x] `[Steam-Vault]` **Commands + wiring** — `get_artwork`, `read_artwork`, `apply_artwork_from_url`, `apply_artwork_from_file`, `remove_artwork`, `steamgriddb_for_game`; `lib.rs` registration; `api.ts`/`types.ts` wrappers. Artwork writes are exempt from the Steam-closed guard.
- [x] `[Steam-Vault]` **SteamGridDB resolution** — `steamgriddb::for_game` + `pick_match`: exact app id for real Steam games, name lookup (exact-title preferred) for non-Steam shortcuts.
- [x] `[Steam-Vault]` **Artwork view** — new `src/routes/artwork/+page.svelte` (game list, per-slot cards, SteamGridDB browse, local-file import, remove) + nav entry (eight-item navigation).
- [x] `[Steam-Vault]` **Docs** — new `docs/_docs/Artwork-Management.md`; `_docs/index.md`, `_docs/Metadata-Providers.md`, `_docs/Non-Steam-Games.md`, `_wiki/Backend-Rust.md`, `_wiki/Frontend-SvelteKit.md`, `_wiki/Steam-Data-Layer.md`, `README.md`, `CHANGELOG.md` updated (incl. removing the stale "seven-item navigation" claim).
- [x] `[Steam-Vault]` **Toolchain hygiene** — cleared rustfmt + clippy (`-D warnings`) findings the current toolchain surfaced on pre-existing code (`derivable_impls`, `manual_find`, `too_many_arguments` allowance, `unnecessary_sort_by`, `for_kv_map`, `doc_lazy_continuation`).
- [x] `[Steam-Vault]` **Verification** — `npm run test:all` **all green**: fmt, clippy, cargo check, cargo test (**21 tests**, incl. 7 artwork), svelte-check **0 errors / 0 warnings**, vite build.
- [x] `[Steam-Vault]` **Commit + push** — `4d49d25` (rustfmt/clippy hygiene) and `4bc8001` (M4 artwork manager), pushed to `HELIX-Origin/Steam-Vault` `main`.

> **Status:** Complete — code, tests, and docs done; full verification green; committed and pushed (`4d49d25`, `4bc8001`).

---

### 🎯 [Steam-Vault] Workstream W.22: Milestone M3 — Filter Builder, Non-Steam Sources, Branding & Storage Manager
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src-tauri/src/steam/storage.rs` (new), `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`, `src-tauri/src/metadata/steam_store.rs`, `src-tauri/src/platforms/`, `src-tauri/src/settings.rs`; `src/routes/storage/+page.svelte` (new), `src/routes/organize/+page.svelte`, `src/routes/settings/+page.svelte`, `src/routes/+layout.svelte`, `src/lib/{api,types}.ts`; `scripts/test.mjs` + `scripts/lib/suites.mjs` (new), `scripts/lib/{logger,runner}.mjs`, `package.json`, `logs/README.md`; `CHANGELOG.md`, `README.md`, `docs/_docs/Storage-Management.md` (new)

**Locked user directives:**
- "The idea of Steam Vault is a complete management tool for the steam library with organization, storage management, non-steam game support, and any other feature that benefits a completely steam library management suite."
- "We need mjs scripts for our test commands as well to allow better more optimized handling of them to prevent shell hangs and agent issues. We should make these first since they are critical and important for future development."
- Storage Manager completion confirmed end-to-end; the full glassmorphism UI pass stays deferred ("we can do that later once the app is more or less complete").

**Implementation checklist:**
- [x] `[Steam-Vault]` **Steam Store metadata fetch fix** — per-appid requests with bounded concurrency (`MAX_CONCURRENT_REQUESTS = 8`); fixes the HTTP 400 caused by comma-joined `appids`.
- [x] `[Steam-Vault]` **Platform detection honours settings** — `ScanConfig { sources, include_other_drives }`; per-platform enable flags, extra folders, and all-drive enumeration; `platform_sources` persisted in settings; `Platform` serializes with `lowercase` ids.
- [x] `[Steam-Vault]` **Settings → Non-Steam sources UI** — per-launcher enable/disable and semicolon-separated extra folders.
- [x] `[Steam-Vault]` **Organize filter builder** — Allowed / Required / Excluded + name search + kind with a live match count, passed to categorization via `CategorizeRequest.filter`.
- [x] `[Steam-Vault]` **Branding** — `static/logo.svg` in the title bar and `app.html`; new `favicon.png`; extra window icons in `tauri.conf.json`; `lib.rs` pins the window icon.
- [x] `[Steam-Vault]` **Storage management backend** — `src-tauri/src/steam/storage.rs`: library inspect/add/remove/move, per-game move, disk overview, throttled `storage-progress` events, backup + Steam-closed guard, 4 unit tests.
- [x] `[Steam-Vault]` **Storage management wiring** — Tauri commands (`get_storage_report`, `preview_move_library`, `move_library`, `preview_move_game`, `move_game`, `add_library_folder`, `remove_library_folder`), `lib.rs` registration (moves via `spawn_blocking` so progress events flow), `api.ts`/`types.ts` wrappers, and a new **Storage** view + nav entry (seven-item navigation).
- [x] `[Steam-Vault]` **Agent-friendly test runner** — `scripts/test.mjs` + `scripts/lib/suites.mjs`: named suites (`fmt`, `clippy`, `check`, `rust`, `frontend`, `build`, `all`) run the toolchain directly (no nested `npm`) with **stdin closed**, a per-step timeout (default 900s; exit `124`), per-step transcripts, and a PASS/FAIL summary; `runner.mjs` gains `stdin`/`timeoutMs`; npm scripts `test`, `test:rust`, `test:frontend`, `test:all`, `verify`.
- [x] `[Steam-Vault]` **Docs** — CHANGELOG `[Unreleased]` entries; README **Tests & verification** + status; `docs/_docs/Storage-Management.md` + index links; `logs/README.md`; plus an accuracy pass across README, CONTRIBUTING, `docs/_docs`, and `docs/_wiki` (module maps, command surface, written files, frontend routes) that removed duplicated table rows and stale "only two files written", "six-item navigation", and "50/request batching" claims.
- [x] `[Steam-Vault]` **Verification** — `npm test`: cargo check **PASS**, cargo test **PASS** (12 tests, incl. 4 storage), svelte-check **0 errors / 0 warnings**; `vite build` **PASS**.
- [x] `[Steam-Vault]` **Commit + push** — four M3 commits (`d6b9c84` test runner, `ba67c23` filters/sources/branding, `292ca5d` storage manager, `992be3c` docs), pushed to `HELIX-Origin/Steam-Vault` `main`.

> **Status:** Complete — code, tests, and docs done; full verification green; committed and pushed as four M3 commits (`d6b9c84`, `ba67c23`, `292ca5d`, `992be3c`).

---

### 🎯 [Ecosystem / HELIX-Origin] Workstream W.21: Agent Workflow Skills & Rules Expansion
- **Project Identifier:** `[Ecosystem]`
- **Repository Path:** Workspace Root (`D:\Projects\GitHub\HELIX Origin`)
- **Target Component:** `.agents/skills/` (`task-decomposition.md`, `large-session-management.md`, `test-execution.md`, `shell-command-management.md`, `file-editing.md`), `.agents/rules/` (`large-task-handling.md`, `background-tasks.md`, `session-management.md`, `shell-commands.md`), `AGENTS.md`

**Locked user directives:**
- "continue with the agent skill updates. proper skills for managing shell commands are needed as well. you keep getting caught up on format and path issues when editing files. also stop getting hung up."

**Implementation checklist:**
- [x] `[Ecosystem]` **Workflow skills** — `task-decomposition.md` (decompose large work into verifiable steps), `large-session-management.md` (context/compression discipline), `test-execution.md` (non-blocking builds/tests with timestamped logs).
- [x] `[Ecosystem]` **Workflow rules** — `large-task-handling.md` (mandatory decomposition), `background-tasks.md` (never block on long-running commands), `session-management.md` (resume from tracking docs; compress closed content only).
- [x] `[Ecosystem]` **Shell command skill** — `shell-command-management.md`: Windows/PowerShell contract, path quoting (workspace root contains a space), `workdir` instead of `cd`, Unix→PowerShell translation table, no `&&` on PS 5.1, `git -C`, background execution via the tool's `background: true`, output discipline, and a **2-retry budget** ("don't get hung up").
- [x] `[Ecosystem]` **File editing skill** — `file-editing.md`: tool selection, read-before-edit, `oldString` uniqueness/exact match, `replaceAll`, EOL/CRLF preservation, no shell-based edits, and a **2-retry escalation** (re-read → narrow anchor → `write`) so a failing edit never loops.
- [x] `[Ecosystem]` **Rule refresh** — expanded `.agents/rules/shell-commands.md` to cross-reference both new skills and add long-running/background, output, line-ending, and retry-budget sections.
- [x] `[Ecosystem]` **Registration** — `AGENTS.md` quick-reference table (shell/file skills, `test-execution`, all new rules) and session-start checklist **step 7** (shell command + file editing skills); removed duplicated and `&amp;`-mangled rows.
- [x] `[Ecosystem]` **Commit + push** — commit `76feb66` (13 files, +644/−6), pushed to `HELIX-Origin/agents` `main`.

> **Status:** Authored, registered, committed, and pushed (`76feb66`).

---

### 🎯 [Steam-Vault] Workstream W.20: Developer Tooling — Logged Command Scripts & On-Demand Metadata Cache Warming
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `scripts/` (`lib/logger.mjs`, `lib/runner.mjs`, `dev.mjs`, `build.mjs`, `run.mjs`), `logs/`, `package.json`, `.gitattributes`, `.gitignore`; `src-tauri/src/metadata/steam_store.rs`, `src-tauri/src/autocat.rs`, `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`; `src/lib/api.ts`, `src/lib/types.ts`, `src/routes/organize/+page.svelte`

**Locked user directives:**
- "we are in the process of making proper mjs scripts to enhance our commands with proper debug logging."
- "we were in the process of making mjs scripts for running our build, dev, and other commands. These scripts will allow for better debug logging. They will be in a scripts folder in the root of the repo and will store their log files in a logs folder in the root of the repo. The purpose of these scripts will be to simply handle our tauri:build, tauri:dev, and any other commands that would benefit from having proper detailed logging. Log files will have their log type and timestamp appended to their name to prevent them from being overwritten."

**Implementation checklist:**
- [x] `[Steam-Vault]` **Logging library** — `scripts/lib/logger.mjs` (ROOT/LOG_DIR, local `YYYY-MM-DD_HH-MM-SS` timestamp, ANSI stripping, `createLogger(type)` writing a header/chunk/footer transcript to `logs/<type>-<timestamp>.log` while the console keeps colour) and `scripts/lib/runner.mjs` (`runLogged` / `runTauri`: spawn with piped stdio, SIGINT/SIGTERM forwarding, DEP0190-safe shell quoting, portable Tauri CLI via `node_modules/@tauri-apps/cli/tauri.js`).
- [x] `[Steam-Vault]` **Command wrappers** — `scripts/dev.mjs` (log type `tauri-dev`), `scripts/build.mjs` (`tauri-build`), and a generic `scripts/run.mjs` (`<type> <command> [args…]`, exit 2 on usage error); `logs/README.md` documents the naming convention.
- [x] `[Steam-Vault]` **npm wiring** — `tauri:dev` / `tauri:build` run through the logged wrappers; raw escape hatches added (`tauri:dev:raw`, `tauri:build:raw`) plus `npm run log -- <type> <command> [args…]`.
- [x] `[Steam-Vault]` **Repo hygiene** — `.gitattributes` gains `*.mjs text eol=lf`; `.gitignore` ignores `logs/` and `*.log` while whitelisting `!logs/README.md`.
- [x] `[Steam-Vault]` **Metadata cache warming** — Steam Store provider gains a keyless `fetch_tags` (`actions/ajaxgetstoretags`); `ensure_steam_metadata` de-duplicates ids, reuses cached entries within the TTL, and batches `appdetails` 50/request; new `sync_library_metadata` command warms the whole owned library; `compute_autocats` / `compute_categorization` are now `async` and auto-fetch when a rule/kind needs metadata or tags; `CategorizeRequest.fetchMetadata` defaults to `true`.
- [x] `[Steam-Vault]` **Frontend** — Organize view gains a **Sync metadata** button and a metadata summary line; `api.ts` gains `syncLibraryMetadata`; `types.ts` gains `MetadataSyncResult` and `fetchMetadata`.
- [x] `[Steam-Vault]` **Verification** — `npm run check` (0 errors / 0 warnings), `npm run build` (static SPA), `cargo check` (clean), `cargo test` (7 passed), and a logging smoke test (clean transcript, no `DEP0190` warning).
- [x] `[Steam-Vault]` **Docs** — CHANGELOG `[Unreleased]` entries for the logged scripts and metadata warming; README Building & running documents the wrappers, `logs/`, raw escape hatches, and `npm run log`.
- [x] `[Steam-Vault]` **Committed** — shipped as commits `733a93c` (logged command scripts for dev, build, and arbitrary commands) and `4d648d0` (on-demand Steam metadata cache warming) on `HELIX-Origin/Steam-Vault` `main` (both pushed).

> **Status:** Implemented, verified, committed, and pushed (`4d648d0`, `733a93c`). Later feature/UI work is tracked under W.22.

---

### 🎯 [Steam-Vault] Workstream W.19: Milestone M2 — Whole-Library Organizing, Platform Import & Custom Title Bar
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** `src-tauri/src/platforms/`, `src-tauri/src/steam/owned.rs`, `src-tauri/src/steam/shortcuts.rs`, `src-tauri/src/autocat.rs`, `src-tauri/src/commands.rs`, `src/` (custom title bar, Platforms + Organize views)

**Locked user directives:**
- "the UI you built when scaffolding is actually almost perfect. we should simply use a custom title bar so it has a cleaner look and feel"
- "we need a way to identify installed games from other platforms as well. GOG, itch.io, Epic, and other popular platforms."
- "when creating collections we need to be able to select the sorting option that is used to create the collections" / "all of our sorting options need to be selectable".
- "For steam, limiting solely to installed games only will miss a massive amount of games. This is why we use the Steam Web API Key to get all games the user owns. This allows proper organization of the user's entire steam library instead of just the installed steam games."

**Implementation checklist:**
- [x] `[Steam-Vault]` **Custom title bar** — `decorations: false` in `tauri.conf.json`; `core:window:*` permissions; `src/lib/platform.ts` (UA-based platform detection) and `src/lib/components/WindowControls.svelte` (macOS traffic lights, Windows-style buttons elsewhere); `+layout.svelte` rewritten with a draggable title bar and six-item navigation.
- [x] `[Steam-Vault]` **Full owned library** — `steam/owned.rs` caches the Steam Web API `GetOwnedGames` result to `owned-games.json`; `commands::collect_library` merges owned-but-not-installed games (marked not-installed) with local games, play stats, shortcuts, and collection membership; new `refresh_owned_games` / `get_owned_library`.
- [x] `[Steam-Vault]` **Platform detection** — new `platforms/` module: `Platform` enum, `PlatformGame`, `PlatformStatus`, `PlatformScan`, a persisted appid → platform map, Windows `registry.rs` (Uninstall + GOG), and `detectors.rs` (GOG, Epic manifests + legendary/Heroic, the itch app library, Amazon Games, and the Uninstall-registry publisher heuristic for Ubisoft/EA/Battle.net/Rockstar/other).
- [x] `[Steam-Vault]` **Import as shortcuts** — `shortcuts::NewShortcut` + `add_shortcuts` (append, de-duplicate by appid), `shortcut_app_id` = `crc32(exe + name) | 0x80000000`, canonical `Exe` / `StartDir` quoting, tolerant reads with quote stripping; new `import_platform_games`.
- [x] `[Steam-Vault]` **Create collections from any sorting option** — `autocat::AutoCatKind` extended with `Platform`, `InstalledState`, `Playtime`, `Name`; new `CategorizeRequest` / `CategorizationPlan` / `ApplyResult` with `compute_categorization` (dry run) and `apply_categorization` (one backed-up write; prefix, installed-only, replace-membership options).
- [x] `[Steam-Vault]` **Frontend** — `types.ts` / `api.ts` / `stores.ts` updated; new **Platforms** view (scan, per-platform cards, select + import) and **Organize** view (owned-library sync, sorting-option picker, preview + create); Library shows owned/installed counts, a Sync button, and platform / not-installed badges.
- [x] `[Steam-Vault]` **Verification** — `npm run check` (0 errors / 0 warnings), `npm run build` (static SPA), `cargo check` (clean), `cargo test` (7 passed: CRC32 vector, shortcut quoting, and KeyValues round-trips).
- [x] `[Steam-Vault]` **Docs** — README UI direction + status, CHANGELOG M2 entries, new `docs/_docs/External-Platforms.md`, and updates to `_docs/index.md`, `Non-Steam-Games.md`, `Organizing-Your-Library.md`, `AutoCategorization.md`, `_wiki/Backend-Rust.md`, `_wiki/Frontend-SvelteKit.md`.
- [x] `[Steam-Vault]` Commit + push M2 to `HELIX-Origin/Steam-Vault` — commit `6718183` (35 files, +2840/−134); pushed to `main`.
- [ ] `[Steam-Vault]` Backlog (deferred): storefront launch URIs (Epic / itch) as shortcut launch options; per-game platform override UI; Microsoft Store / Xbox Game Pass detection.

> **Status:** M2 implementation complete and verified locally. Owned-library sync requires a Steam Web API key and a public profile; platform detection is local-only (no scraping).

---

### 🎯 [Steam-Vault] Workstream W.18: Milestone M1 — Foundation (Tauri v2 Depressurizer Revival)
- **Project Identifier:** `[Steam-Vault]`
- **Repository Path:** `projects/Steam-Vault`
- **Target Component:** whole repo (scaffold, `src-tauri/` Rust backend, `src/` SvelteKit frontend, docs)

**Locked user directives:**
- "We need to begin a new project. This will be a GUI app using Tauri V2. It will require a steam web api key and possibly a steamgriddb key. This will be for providing ways to organize the user's steam library. It will basically be a revival of Deperessurizer in Tauri V2… Depressurizer had a versatile organization method that imported all games from a user's account and allowed organizing their actual steam library directly. It allowed custom organizations such as developer + publisher, genre, and much more."
- "we need a way that works and doesn't risk being broken every time steam updates something."
- "We want all of the library organization support that Depressurizer had. But in our own Tauri V2 app. The SteamGridDB API, IGDB API (Twitch), and other popular game metadata providers will be needed to add support for adding and organizing non-steam games to the user's steam library. Note: SteamGridDB and IGDB are the only metadata providers we will support that use api keys (outside Steam Web API of course)."
- "We want it to have a modern dark UI with a glass morphism style. The UI work can be saved for when we get to it, but it should be noted so we don't forget it."
- "RAWG is dead. no support will be included for RAWG."
- "SteamGridDB will be useful for allowing the addition and organization of non-steam games to the user's steam library."
- "we should use the same framework as the NH-Reader app." (SvelteKit + adapter-static SPA + Svelte 5 + Vite + TS)
- "the repo will need to be made in our GitHub organization https://github.com/HELIX-Origin"

**Context:** Clean-room, cross-platform revival of Depressurizer (rallion/depressurizer, GPL-3.0, abandoned).
Steam-Vault targets documented/stable data sources instead of HTML scraping. Verified local Steam data on this
machine: root `C:\Program Files (x86)\Steam`, libraries `C:\Program Files (x86)\Steam` / `E:\Games\SteamLibrary` /
`D:\SteamLibrary`; account SteamID64 `76561198156324597` / ID3 `196058869` / `OG_Nimbi`. Modern collections live in
`userdata/<id3>/config/cloudstorage/cloud-storage-namespace-1.json` (array of `[key, entry]` pairs; collection
`value` is an escaped JSON string; built-ins `user-collections.favorite` / `.hidden`). Legacy `localconfig.vdf`
`apps/<appid>/tags` categories are empty for this account. Non-Steam games live in `shortcuts.vdf` (binary
KeyValues; empty file is exactly `00 73 68 6F 72 74 63 75 74 73 00 08 08`).

**Implementation checklist:**
- [x] `[Steam-Vault]` Scaffold Tauri v2 + SvelteKit app (`npm create tauri-app`), configure `package.json`, `tauri.conf.json` (id `org.helixorigin.steamvault`, window 1280×820), `Cargo.toml`, `app.html`, `.gitignore`.
- [x] `[Steam-Vault]` Rust: text KeyValues (VDF) parser/serializer + binary KeyValues reader/writer (with unit tests).
- [x] `[Steam-Vault]` Rust: Steam discovery (`paths.rs`) — Windows registry `SteamPath`/`InstallPath` + cross-platform fallbacks; `libraryfolders.vdf` libraries; `loginusers.vdf` + `userdata/` accounts.
- [x] `[Steam-Vault]` Rust: library aggregation (`library.rs`) from `appmanifest_*.acf`, libraryfolders app map, `localconfig.vdf` play stats.
- [x] `[Steam-Vault]` Rust: collections read/write (`collections.rs`) against the cloud namespace store + legacy tag import; non-Steam shortcuts (`shortcuts.rs`).
- [x] `[Steam-Vault]` Rust: Steam process detection (`process.rs`) + timestamped file backups (`backup.rs`).
- [x] `[Steam-Vault]` Rust: metadata providers — Steam Store (`appdetails`), Steam Web API, SteamGridDB, IGDB (Twitch), PCGamingWiki, Wikipedia. RAWG intentionally excluded.
- [x] `[Steam-Vault]` Rust: AutoCats engine (`autocat.rs`) + Allowed/Required/Excluded filter model (`filter.rs`).
- [x] `[Steam-Vault]` Rust: JSON metadata cache (`cache.rs`) + local settings store (`settings.rs`).
- [x] `[Steam-Vault]` Rust: Tauri command surface (`commands.rs`) + `lib.rs` wiring.
- [x] `[Steam-Vault]` Frontend: glassmorphism theme (`app.css`), typed API layer, stores, app shell + Dashboard/Library/Collections/Settings pages.
- [x] `[Steam-Vault]` Docs: `README.md` (incl. planned dark glassmorphism UI note), `CHANGELOG.md`, `LICENSE` (BSD-3-Clause), `SECURITY.md`, `CONTRIBUTING.md`.
- [x] `[Steam-Vault]` App icons: `assets/Steam_icon_logo.svg` (Wikimedia Commons) → `assets/steam-icon-1024.png` → full `src-tauri/icons/` set via `npm run tauri icon`; favicon regenerated from the same source; attribution/trademark noted in `assets/README.md`.
- [x] `[Steam-Vault]` Verify: `npm run check` (0 errors/0 warnings), `npm run build` (SPA to `build/`), `cargo check` (clean), `cargo test` (4 passed).
- [x] `[Steam-Vault]` Register project in `.agents/rules/verification.md`, `.agents/rules/workspace.md`, `AGENTS.md`, `.agents/skills/tauri-desktop-engineering.md`.
- [x] `[Steam-Vault]` Git: `git init`, initial commit, create `HELIX-Origin/Steam-Vault` via `gh repo create`, push. Live at https://github.com/HELIX-Origin/Steam-Vault (public, default branch `main`, commit `bdffc0c`).
- [x] `[Steam-Vault]` `docs/` GitHub Pages site at `docs/` — Jekyll consuming `remote_theme: HELIX-Origin/helix-docs`, vCard-style home page (`docs/index.md`), `_docs/` user guides (index + 9 pages, parent **Documentation Home**), `_wiki/` technical wiki (index + 7 pages, parent **Steam Vault Technical Wiki**), squircle `logo.svg` + `favicon.ico`/`icon.png` in `docs/assets/images/`. GitHub Pages enabled (source `main` / `/docs`) at **https://helix-origin.github.io/Steam-Vault/** (commit `0475ed9`).
- [ ] `[Steam-Vault]` Backlog (deferred UI pass): implement the full **modern dark glassmorphism** visual design (frosted panels, layered depth, HELIX obsidian palette) across all views.
- [ ] `[Steam-Vault]` Backlog: HELIX squircle branding artwork; GitHub issue templates; release notes; SQLite metadata cache; dynamic (filter-spec) collection authoring.

> **Status:** Milestone **M1 (Foundation)** delivered and pushed to `HELIX-Origin/Steam-Vault` (commit `bdffc0c`). The repo also ships a `docs/` GitHub Pages site (helix-docs remote theme, vCard home, user guides + technical wiki). Verification green (`npm run check` 0/0, `npm run build` ok, `cargo check` clean, `cargo test` 4 passed). Remaining items are deferred backlog.

---

### 🎯 [FFXIV-Config] Workstream W.17: README Entry Point + `docs/` GitHub Pages Site
- **Project Identifier:** `[FFXIV-Config]`
- **Repository Path:** `projects/FFXIV-Config`
- **Target Component:** `README.md`, `docs/` (new Jekyll site on the `helix-docs` remote theme), `.gitignore`

**Locked user directives:**
- "Restructure `projects/FFXIV-Config` so `README.md` is a minimal entry point and a new `docs/` GitHub Pages site (remote `helix-docs` theme) holds the detailed information (install instructions + per-file details)."
- "It currently has basic details. It needs proper details with instructions on how to install the configs, as well as detailed information on what each config file effects."
- "we use manual deployment. so no github pages workflows."

**Context:** FFXIV Config is a HUD/hotbar/macro layout built on Fr4nsson's FFC for 8.x jobs. The ten shipped `.DAT` files were reverse-engineered for accuracy: `CONTROL0.DAT` = keyboard/mouse controls, `CONTROL1.DAT` = gamepad controls (both plain-text `<Charcter Settings>` key/value); `MACRO.DAT` is XOR-masked (`0x73`) with typed records (`T` title, `I`/`K` ids, 15× `L` command lines) → 100 macro slots (job-change, menu controls, BFX 1–5 presets, reserved slots). Files are 17-byte header + content + 15-byte null footer.

**Implementation checklist:**
- [x] `[FFXIV-Config]` Author `docs/_config.yml`: `remote_theme: HELIX-Origin/helix-docs`, `baseurl: /FFXIV-Config`, `docs` collection (`permalink: /docs/:path/`), NH-Reader-style plugin list, `defaults` by `type` (`path: ""`), no `_data/navigation.yml`, no logo/favicon (theme guards + GitHub org fallback).
- [x] `[FFXIV-Config]` Write `docs/index.md` (portal, `layout: default`, `notice` + `header_actions`) and `docs/_docs/` pages: `index.md` ("Documentation Directory", `permalink: /docs/`), `Installation.md`, `Configuration-Files.md`, `Hud-And-Hotbars.md`, `Macros.md`, `Troubleshooting.md` — theme-neutral, per-file effects table, 10 shipped + 3 untouched files, verified technical notes.
- [x] `[FFXIV-Config]` Rewrite `README.md` as a minimal entry point (overview, 3-step install, supported jobs, full docs-site links, credits).
- [x] `[FFXIV-Config]` Add `.gitignore` for Jekyll build output (`_site/`, `.jekyll-cache/`, `.jekyll-metadata`, `Gemfile.lock`, …); repo previously had none.
- [x] `[FFXIV-Config]` Local build verified: `jekyll build` exit 0, remote theme fetched, 7 pages generated, sidebar nav + parent tree resolve, links carry `/FFXIV-Config` baseurl, no `_data` remnants. Build artifacts cleaned.
- [x] `[Ecosystem]` Register FFXIV-Config in `.agents/skills/helix-theme.md` per-project parent-anchor table (`"Documentation Directory"`, wiki `—`).
- [x] `[FFXIV-Config]` Commit + push the README rewrite, `docs/` site, and `.gitignore` (`87304dd`, pushed `99d5b28..87304dd`).
- [x] `[FFXIV-Config]` Set the GitHub repository description and 10 topics (`ffxiv`, `final-fantasy-xiv`, `ffxiv-config`, `ffxiv-hud`, `ffxiv-macros`, `hud-layout`, `hotbar`, `macros`, `game-config`, `mmorpg`) via `gh repo edit`.
- [x] `[Ecosystem]` Commit + push the agents-repo changes: clone scripts (`clone-org-repos-windows.ps1` / `-linux.sh` / `-macos.sh`, exec bits set), `AGENTS.md`, `.agents/skills/clone-org-repos.md`, `.agents/skills/helix-theme.md`, tracking docs (`3a99a83`, pushed `0c993a3..3a99a83`).
- [ ] `[FFXIV-Config]` Enable GitHub Pages (Settings → Pages → deploy from `main` / `/docs`) — deployment is manual, so the site goes live once the Pages source is set/rebuilds.

---

### 🎯 [Windhawk-Themes] Workstream W.15: Command Center Suite Docs Sync (2026-10-13 Refactor)
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Target Component:** `docs/_catalogue/command-center.md`, `docs/_wiki/start-menu-styler/*`, `docs/_wiki/taskbar-styler/*`, `docs/_docs/Notification-Center.md`

**Locked user directives:**
- "I made some changes and fixes to the Command Center suite. Let's update the Command Center catalogue page to correctly reflect the current state of the command center suite."
- "the changes are pushed but the site itself needs to be updated. The details about the Command Center suite need to reflect the current state of the command center suite."
- "Also sync the whole docs site" (site-wide token-vocabulary sync); "Yes — commit & push".

**Context:** User refactored `windows-11-start-menu-styler.yml` + `windows-11-taskbar-styler.yml` (pushed `f9f228b`, 2026-10-13). Start Menu token set simplified/renamed: `CornerRadius=35`, `SearchBoxRadius=25`, `HoverCornerRadius=15`, `ElementCornerRadius=10`, `FlyoutCornerRadius=6` (retired `PanelRadius`/`CardRadius`/`ChipRadius` + the `ElementBackground`/`OverlayColor`/`RecommendedBorderBrush`/`ViewBorderBrush`/`HighlightBorder` fills). Taskbar tokens renamed: `R1=6`, `R2=20`, `Height=42`, `Width=42` (retired `CornerRadius`/`CornerRadiusAlt1`/`BaseHeight`/`BaseWidth`); added `ActiveColor`. New suite header image.

**Implementation checklist:**
- [x] `[Windhawk-Themes]` Rewrite `docs/_catalogue/command-center.md`: current surface-coverage sentence, radii-tier semantics (XL 35 / L 25 / M 15 / S 10 / XS 6), new **Accent-Aware States** pillar, updated Supported Surface Mods cells (taskbar flyouts, Snap Layout picker, virtual desktop bar; shell flyouts & context menus, folder modal, Lock screen).
- [x] `[Windhawk-Themes]` **Docs-neutrality correction (user directive, supersedes the earlier suite-vocabulary "sync"):** the wiki/docs must stay theme-neutral and mod-agnostic — they must **not** mirror the Command Center (or any catalogue theme). Reverted the token-vocabulary sync and removed **every** Command Center token/value/geometry from `docs/` + `docs/_wiki/` (5 element-target tables, 5 `configurations/schema.md`, 5 `overview.md`, the affected `_docs/` pages, plus `docs/index.md` / `Architecture.md` / `Getting-Started.md` / `Companion-Shell.md` branding and the signature rim gradient/thickness). Docs now name only the mod mechanism and stylable XAML properties; examples use generic `My*` placeholders. `docs/_catalogue/` remains the only suite-specific surface.
- [x] `[Windhawk-Themes]` Update `projects/command-center/README.md` to the current configs (taskbar no longer a detached dock; Start glass panel is `Grid#Root > Border`; per-file radii/token tables; `Height`/`Width`=42; removed invented tokens; `src/`→`projects/command-center/`); fixed stale `src/` links in `extras/README.md`.
- [x] `[Windhawk-Themes]` Static gate `tools/Test-WindhawkStyles.ps1` → **0 errors, 0 warnings** (deduplicated 8 repeated target selectors as behavior-preserving unions) — see BUGS.
- [ ] `[Windhawk-Themes]` Commit + push the neutralized docs + README + gate dedup (Pages rebuild pending live verification).
- [ ] `[Windhawk-Themes]` Open follow-ups (see BUGS): Notification Center still uses its own `PanelRadius=13`/`CardRadius=10`/`ChipRadius=6` scale (drift vs the refactored Start/Taskbar) — decide refactor-or-document; Start Menu `HoverCornerRadius=15` declared but unreferenced; `Grid#CompanionRoot > Border#AcrylicBorder` glass-styled yet collapsed by a more specific selector; `Border#AppBorder` collapsed **and** glass-styled.

---

### 🎯 [Ecosystem / HELIX-Origin] Workstream W.16: Global Documentation Theme-Neutrality Invariant
- **Project Identifier:** `[Ecosystem]`
- **Repository Path:** Workspace Root (`D:\Projects\GitHub\HELIX Origin`)
- **Target Component:** `.agents/rules/documentation-standards.md`, `AGENTS.md`, `.github/copilot-instructions.md`

**Locked user directives:**
- "don't make my styles the source of truth in the styling docs! those are intentionally supposed to be ambiguous to explain to users how to work with the mods. The catalogue is where users share their own themes and suites, the docs should not use style references from the catalogue."
- "you need to add this as a strict rule to follow in the agents ecosystem since you consistently choose ignore this rule."

**Implementation checklist:**
- [x] `[Ecosystem]` Author `.agents/rules/documentation-standards.md` (**BINDING — GLOBAL**): strictly separates `docs/` (theme-neutral, mechanism-only) from `docs/_catalogue/` + `docs/_store/` (the only home for an author's tokens/values/geometry), with 5 hard prohibitions, a decision test, and an enforcement clause.
- [x] `[Ecosystem]` Register the invariant in `AGENTS.md`: new absolute invariant **#6**, a Quick-reference row, and session-start checklist step 4.
- [x] `[Ecosystem]` Add hard invariant **#6** to `.github/copilot-instructions.md`.
- [ ] `[Ecosystem]` Commit + push the agents ecosystem (`AGENTS.md`, new rule, copilot-instructions, tracking docs).

---

### 🎯 [Ecosystem / HELIX-Origin] Workstream W.13: Stale Agents-Ecosystem Reference Cleanup Across Project Repos
- **Project Identifier:** `[Ecosystem]`
- **Repository Path:** Workspace Root + `projects/Windhawk-Themes`, `projects/NH-Reader`, `projects/helix-origin.github.io`
- **Target Component:** Removed per-repo agent ecosystems (`AGENTS.md`, `.agents/`, `check:agents`), agent-managed folders (`.backups/`, `scratch/`), and per-repo tracking docs (ROADMAP/PLAN/TODO/BUGS)

**Locked user directives:**
- "we should clean up all stale agents ecosystem references in all of our projects — we removed the old per-repo agents ecosystems in favor of the new global agents ecosystem."
- "the .backups folder is now managed by the new global agents ecosystem so it should not be in any of the other project repos either."
- "scratch is a folder used by the agent ecosystem so it only belongs in the agents repo as well."
- "TODO.md, ROADMAP.md, BUGS.md, and PLAN.md are all tracking files used by the agents ecosystem — they should only be in the agents ecosystem project repo."

**Implementation checklist:**
- [x] `[Windhawk-Themes]` Deleted the "AI Agent Ecosystem" section + TOC row from `README.md`; cleaned `AGENTS.md`/`.agents/`/tracker claims from `projects/command-center/README.md` + `extras/README.md` (incl. Rule 08/09 and Related Documentation).
- [x] `[Windhawk-Themes]` Cleaned multi-agent ecosystem claims in `docs/README.md`, `docs/index.md`, `docs/_docs/Getting-Started.md`; removed `.agents`/`scratch` Jekyll excludes; replaced `scratch/json` example paths in `Diagnostics.md` and `Companion-System.md`; reworded the tracked-in-BUGS note in `tools/style-baseline.ini`.
- [x] `[Windhawk-Themes]` Removed `.backups/` and `scratch/` folders (tracked `README.md` files deleted) + `.gitignore` whitelist entries.
- [x] `[NH-Reader]` Deleted `scripts/check-agents.mjs` + `check:agents` npm script; purged AGENTS.md / `.agents/` / tracker / scratch references from CONTRIBUTING.md, `docs/_wiki/Development-and-Contributing.md`, README, SECURITY, docs pages, and all five issue templates.
- [x] `[NH-Reader]` Deleted local `scratch/` folder (untracked) and removed `.agents`/`scratch` Jekyll excludes.
- [x] `[helix-origin.github.io]` Removed `.agents`/`scratch` excludes from `docs/_config.yml`.
- [x] `[Ecosystem]` Commit + push `Windhawk-Themes` (`72ab93d`), `NH-Reader` (`8a46971`), `helix-origin.github.io` (`0d87680`), and `agents` (`2098235`) — all pushed.

### 🎯 [helix-docs + Windhawk-Themes] Workstream W.14: Doc Site Refinements — Catalogue Width & ShareX Copy
- **Project Identifier:** `[helix-docs]` / `[Windhawk-Themes]`
- **Repository Path:** `projects/helix-docs`, `projects/Windhawk-Themes`
- **Target Component:** `.catalogue-item-shell` width; ShareX `VK_SLEEP` doc mentions

**Locked user directives:**
- "the category item pages need to be a little wider. the tables are causing mod names to render across two lines..." — render the catalogue item page cards wider.
- "There is no need to mention the vk_sleep print screen mappings. that is solely my system... the auto keybinding detection is enough to point out that it can detect wonky keybinds caused by the os."

**Implementation checklist:**
- [x] `[helix-docs]` Widened `.catalogue-item-shell` from `min(1080px, 100%)` → `min(1440px, 100%)` in `_sass/modules/catalogue.scss`; recompiled `assets/css/site.css` via Dart Sass with rule parity (0 lost rules; `b78c983`).
- [x] `[Windhawk-Themes]` Removed the device-specific `VK_SLEEP` PrintScreen mapping example from `docs/index.md`, `docs/_docs/Toolchain.md`, and `tools/README.md`; kept the generic "auto-detects user keybindings" wording (`a7f6ec8`).
- [x] `[Windhawk-Themes]` Mod-title rename in **tables only** (fixes table wrapping): renamed "Mod ID"/"Windhawk Mod ID"/"Styler Mod ID" columns → **Windhawk Mod** using formatted names (`Taskbar Styler`, `Start Menu Styler`, `Notification Center Styler`, `Settings Styler`, `File Explorer Styler`) in `docs/index.md` home surfaces table, `docs/README.md` Supported Mods table, `docs/_catalogue/command-center.md` Supported Surface Mods table (merged redundant Styler Mod + Mod ID columns), and the 5 `docs/_wiki/*/overview.md` spec tables; split multi-process cells onto separate lines (`ShellExperienceHost.exe` / `ShellHost.exe` in `index.md`/`README.md`/`docs/_docs/Architecture.md`, `SearchHost.exe` / `SearchApp.exe` in `Diagnostics.md`/start-menu overview). Non-table contexts (prose, bullets, headings, mermaid, file paths, URLs) keep the real `windows-11-*` IDs; companion-extras table & CHANGELOG untouched.

### 🎯 [Windhawk-Themes] Workstream W.12: Command Center — High-Contrast & explorer.exe Crash Fixes
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Target Component:** Command Center Suite (`windows-11-start-menu-styler.yml`, `windows-11-taskbar-styler.yml`)

**Locked user directives:**
- "this is not a high contrast theme."
- "It's more than likely the taskbar style since it effects explorer.exe and is known to have this exact problem when a misconfigured style is being used." — superseded: root cause later confirmed as the external `file-operations-styler` companion mod.

**Implementation checklist:**
- [ ] `[Windhawk-Themes]` High-contrast neutrality (open): the `64711d2` removal of `Border#MainMenuHighContrastBorder` / `Border#RightCompanionHighContrastBorder` was rolled back — it damaged the Start Menu styling (the borders affect normal-mode rendering). Redesign a correct fix later that never alters normal glass styling. **Update (2026-10-13, `f9f228b`):** the refactor removed the `*HighContrastBorder` targets entirely, superseding the rollback — needs live re-verification that normal glass styling is intact before closing.
- [x] `[Windhawk-Themes]` Explorer crash root cause confirmed **external**: the companion `file-operations-styler` mod crashes `explorer.exe` during file ops (repro: folder delete → "provide administrator permission" prompt → freeze → crash). Not fixable in-repo; disable the mod pending upstream fix; user to report to the Windhawk mods team.
- [x] `[Windhawk-Themes]` Revert the taskbar styler edits from `64711d2` (bare-type flyout/menu targets + two `RenderTransform` overrides restored) — they were not the crash source and their removal undid intended styling.
- [x] `[Windhawk-Themes]` Restore `docs/_wiki/start-menu-styler/targets/elements.md` high-contrast row so the target catalog matches the restored Start Menu config.
- [x] `[Windhawk-Themes]` Static gate `tools/Test-WindhawkStyles.ps1` → 0 errors, 0 warnings on the restored configs.
- [x] `[Windhawk-Themes]` Commit + push `Windhawk-Themes` (restored stylers + `elements.md` + changelog) and `agents` (`BUGS.md`, `TODO.md`, `PLAN.md`).

---

### 🎯 [Windhawk-Themes] Workstream W.11: Command Center Catalogue — Companion Extras Documentation
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Target Component:** `docs/_catalogue/command-center.md`

**Locked user directives:**
- "our catalogue has a page for the command center suite. but that page lacks instructions for configuring the extras. we need to add instructions for those into it as well."

**Implementation checklist:**
- [x] `[Windhawk-Themes]` Add a "🧩 Configuring the Companion Extras" section to the Command Center Suite catalogue page: extras matrix (8 companion mods with mod IDs, YAML files, and target process/scope), step-by-step install instructions, and a link to the full `projects/command-center/extras/README.md` reference.
- [x] `[Windhawk-Themes]` Commit + push (`5a331de`); Pages build succeeded and the rendered section was live-verified at `https://helix-origin.github.io/Windhawk-Themes/catalogue/command-center/`.

---

### 🎯 [helix-origin.github.io] Workstream W.09: Portal Project Card Naming
- **Project Identifier:** `[helix-origin.github.io]`
- **Repository Path:** `projects/helix-origin.github.io`
- **Target Component:** `docs/index.md` project grid

**Locked user directives:**
- "the repo title needs proper formatting. The correct way for the repo title to be displayed is HELIX Docs"

**Implementation checklist:**
- [x] `[helix-origin.github.io]` Render the HELIX Docs project card with the display title "HELIX Docs" instead of the repo slug `helix-docs` (card heading + image `alt`).
- [x] `[helix-docs]` Title the theme README heading as "HELIX Docs".
- [x] `[helix-docs]` Display the theme/preview site title as "HELIX Docs" (`_config.yml` `title:` + `index.md`) and dedupe the home-page `<title>` in `_includes/head.html`.
- [x] `[helix-origin.github.io]` Live verification after commit + Pages rebuild — portal card confirmed reading "HELIX Docs" (`409111f`; theme README `a00a540`).

---

### 🎯 [helix-docs] Workstream W.10: Home Page (vCard Pattern) Documentation
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Target Component:** `_docs/home-page.md`, `_docs/index.md`, `_docs/layouts.md`

**Locked user directives:**
- "add instructions in the site for properly writing the index.md page to use our custom vcard layout in the site home pages"
- The vCard is a *pattern*, not a layout: home pages keep `layout: default` and are composed with hand-written HTML sections in `index.md`.

**Implementation checklist:**
- [x] `[helix-docs]` Author `_docs/home-page.md` documenting the vCard home pattern (hero front matter, `.doc-section`/`.section-heading`, feature cards, project cards, documentation directory, previews, timeline, closing CTA) with copy-paste snippets.
- [x] `[helix-docs]` Link the guide from the Theme Documentation Directory and cross-reference it from the Default layout section; renumber `nav_order` for the components/multilingual pages.
- [x] `[helix-docs]` Local build verified (Liquid examples render literally; page builds at `/docs/home-page/`); pushed `3b79c5f`.

---

### 🎯 [Windhawk-Themes] Workstream W.08: Site Branding Artwork (logo / icon / favicon)
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Target Component:** `docs/assets/images/` (`logo.svg`, `icon.png`, `favicon.ico`), `docs/_config.yml` branding keys

Derive matching squircle branding artwork for the Windhawk Themes wiki from the existing `windhawk.jpg` source with ImageMagick.

**Locked user directives:**
- "The Windhawk Themes repo has a windhawk.jpg image that we can use as the source to generate the new svg, ico, and png images from."

**Implementation checklist:**
- [x] `[Windhawk-Themes]` Extract the white Windhawk glyph from the 600×600 grayscale `windhawk.jpg` (level 40%→100%, masked to alpha).
- [x] `[Windhawk-Themes]` Author `docs/assets/images/logo.svg` (256×256 squircle, dark tile + cyan→purple accent, embedded glyph).
- [x] `[Windhawk-Themes]` Export `docs/assets/images/icon.png` (256×256) and multi-size `docs/assets/images/favicon.ico` (256/48/32/16).
- [x] `[Windhawk-Themes]` Set `logo:`, `favicon:`, `icon:` in `docs/_config.yml`.
- [x] `[Windhawk-Themes]` Live verification after commit + Pages rebuild (logo/favicon/apple-touch-icon confirmed live on `eb4b2a6`).

---

### 🎯 [helix-docs] Workstream W.07: Site Branding Artwork (logo / icon / favicon)
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Target Component:** `assets/images/` (`logo.svg`, `icon.png`, `favicon.ico`), `_config.yml` branding keys, `_includes/head.html`, `_includes/components/header.html`, `_includes/components/sidebar.html`

Generate matching HELIX Docs squircle branding artwork with ImageMagick and wire it as the preview site logo and favicon.

**Locked user directives:**
- "let's use imagemagick to generate custom matching logo.svg, icon.png, and favicon.ico images... under assets/images."
- "We have a squircle shape we use in all of our sites." (256×256 canvas, `rect x=8 y=8 w=240 h=240 rx=56`.)
- "favicon is able to be set via the _config.yml... so we should make sure your change isn't breaking that."

**Implementation checklist:**
- [x] `[helix-docs]` Author `assets/images/logo.svg` (256×256 squircle, cyan→purple accent matching the theme).
- [x] `[helix-docs]` Export `assets/images/icon.png` (256×256) and multi-size `assets/images/favicon.ico` (256/48/32/16) via ImageMagick.
- [x] `[helix-docs]` Set `logo:`, `favicon:`, `icon:` in `_config.yml`.
- [x] `[helix-docs]` **Robust path resolution** (`BUG-18`): resolve non-absolute `logo`/`favicon` paths from the site root in `head.html` + `header.html` (+ `sidebar.html`), passing absolute and protocol-relative URLs through untouched; add `apple-touch-icon`.
- [x] `[helix-docs]` Validate SVG/PNG/ICO with `magick` (zero RSVG errors) and verify emitted markup on nested routes (baseline, absolute, protocol-relative, root-relative).
- [x] `[helix-docs]` Live verification after commit + Pages rebuild (brand mark, favicon, Apple touch icon on nested pages) — confirmed live on `05b9943`.

---

### 🎯 [helix-docs] Workstream W.06: Sidebar & Mermaid Rendering Fixes
- **Project Identifier:** `[helix-docs]`
- **Repository Path:** `projects/helix-docs`
- **Target Component:** Sidebar navigation/footer (`_includes/components/nav.html`, `nav-icon.html`, `sidebar.html`), mermaid loader (`_includes/components/mermaid.html`), styles (`_sass/modules/navigation.scss`, `_sass/modules/sidebar.scss`)

Make the shared theme render Mermaid fences on every consuming site, and give the sidebar a left-aligned, structured navigation tree (category emoji + sub-page bullets) whose icons are configurable via YAML.

**Locked user directives:**
- "several sites have an ugly centered version with emoji in place of bullets. we need to left align it so it is properly structured and replace the emoji with proper emoji for the head category pages and bullets for the sub pages."
- "as an added measure to give users more control over category icons, we can make it so the categories and their icons are set via the yaml front matter."
- "We should also left align the sidebar footer links too."

**Implementation checklist:**
- [x] `[helix-docs]` **Mermaid default-on** (`BUG-15`): invert the `components/mermaid.html` gate to opt-out; verify the loader emits without config and is suppressed by `mermaid: false`.
- [x] `[helix-docs]` **Sidebar category icons + sub-page bullets** (`BUG-16`): emoji for level-1 categories, indented bullet dots for nested pages, left-aligned marker column in both docs and wiki trees.
- [x] `[helix-docs]` **Front-matter icon control**: resolve icons page `nav_icon:` → `_config.yml` `nav_icons:` map (title/path/url) → keyword heuristic → folder fallback via shared `components/nav-icon.html`.
- [x] `[helix-docs]` **Left-align sidebar footer links** (`BUG-17`): `justify-items`/`text-align` start; footer Docs/Wiki icons follow the category index front matter.
- [x] `[helix-docs]` Recompile `assets/css/site.css` with Dart Sass.
- [x] `[helix-docs]` Live verification on consuming sites (Windhawk-Themes, NH-Reader, Hentai-Senpai, helix-origin.github.io) after commit + Pages rebuild — `mermaid@11.12.0` loader, `nav-bullet`/`nav-icon` markers, and left-aligned footer confirmed live on `05b9943`.
- [ ] `[helix-docs]` Refresh docs that still reference the removed `assets/js/mermaid-init.js` (`README.md`, `_wiki/javascript-modules.md`).

---

### 🎯 [Windhawk-Themes] Workstream W.04: Suite Refinements & Geometry Alignment
- **Project Identifier:** `[Windhawk-Themes]`
- **Repository Path:** `projects/Windhawk-Themes`
- **Target Component:** Command Center Suite (`windows-11-start-menu-styler.yml`, `windows-11-notification-center-styler.yml`, `windows-11-taskbar-styler.yml`)

```mermaid
flowchart TD
    W4_SM["[Windhawk-Themes] Start Menu Header & Gap Alignment"] --> W4_NC["[Windhawk-Themes] Action Center Split Buttons & States"]
    W4_NC --> W4_Snap["[Windhawk-Themes] Taskbar Snap Container Theming"]
    W4_Snap --> W4_Gate["[Windhawk-Themes] Validation Gate (Test-WindhawkStyles.ps1)"]
```

Refine spatial alignment in the Start Menu and companion pane, resolve color mismatches on Action Center Quick Settings split buttons, and theme internal Snap Layout elements.

**Locked user directives:**
- "The phone link cards should be moved up so they align with the top of the menu (this way the search box is perfectly aligned to the left of them as well)."
- "The extra space between the start menu sections and phone link sections needs to be reduced for improved visuals."
- "The search box needs to have its width shrunk so the toggle button is evenly lined up with the pinned app section under it."
- "Basically the left edge of the search box needs to align with the left edge of the pinned apps section while the right edge of the phone link toggle button should align with the right edge of the pinned apps section."
- "The notification/action center needs a bit of fixing. some areas are not applied correctly... section buttons are not getting the correct colors due to how things are applied."
- "Snap containers internal elements still aren't themed... we need to get that styled to match our styling."

**Implementation checklist:**
- [ ] **[Windhawk-Themes] Start Menu Search & Companion Alignment & Layering**:
  - [x] `[Windhawk-Themes]` Restore compact panel width (470px MainMenu, 3-column pins, 2-column categories) per user preference.
  - [x] `[Windhawk-Themes]` Eliminate right drift and center pinned apps within card with balanced padding.
  - [x] `[Windhawk-Themes]` Align search box width and spacing to avoid clipping into Phone Link toggle button.
  - [x] `[Windhawk-Themes]` Adjust overall height (`MaxHeight=790`) so panel is slightly taller than wide.
  - [x] `[Windhawk-Themes]` Preserve all custom styling, cards, and status icons intact.
- [ ] **[Windhawk-Themes] Notification / Action Center Split Buttons & Colors**:
  - [x] `[Windhawk-Themes]` Reset outer button backgrounds to `Transparent` and route states through `ContentPresenter@CommonStates`.
  - [ ] `[Windhawk-Themes]` Verify fix eliminating high-contrast blue fallback on split buttons (Wi-Fi, Bluetooth chevrons) on user desktop.
  - [ ] `[Windhawk-Themes]` Confirm canonical `$ElementBackground` and `$BorderBrush` on unselected quick action tiles.
- [ ] **[Windhawk-Themes] Taskbar Snap Layout Containers Theming**:
  - [ ] `[Windhawk-Themes]` Style internal snap containers (`SnapLayoutControl`, `LayoutBorder`, `Grid#LayoutGrid > Button`) with frosted glass and subtle borders without altering layout coordinate calculations.
- [ ] **[Windhawk-Themes] Taskbar System Tray Overflow Grid Glass Background**:
  - [ ] `[Windhawk-Themes]` Restore frosted glass background (`$Background`), top-lit border (`$BorderBrush`), and matching corner radius to the system tray overflow flyout (`Grid#OverflowRootGrid > Border` and `Border#OverflowFlyoutBackgroundBorder`).
  - [ ] `[Windhawk-Themes]` **Update (2026-10-13, `f9f228b`):** the refactor sets `Grid#OverflowRootGrid > Border` to `Background:=Transparent` / `BorderBrush:=Transparent` / `BorderThickness=0` — confirm whether this intentionally supersedes the glass restoration or is a regression.
- [ ] **[Windhawk-Themes] Validation & Quality Gate**:
  - [ ] `[Windhawk-Themes]` Pass `tools/Test-WindhawkStyles.ps1` with 0 errors and 0 warnings.
  - [ ] `[Windhawk-Themes]` Conduct live verification on user desktop.

---

### 🎯 [Ecosystem / HELIX-Origin] Workstream W.05: Organization Tracking Consolidation & Template Architecture
- **Project Identifier:** `[Ecosystem]`
- **Repository Path:** Workspace Root (`D:\Projects\GitHub\HELIX Origin`)

- [x] `[Ecosystem]` Survey root tracking files across all sub-projects (`NH-Reader`, `Windhawk-Themes`, `Hentai-Senpai`, `helix-docs`).
- [x] `[Ecosystem]` Create centralized [`ROADMAP.md`](./ROADMAP.md) detailing master milestone matrix and per-project direction.
- [x] `[Ecosystem]` Author canonical tracking templates with mandatory project tagging in `.agents/templates/`:
  - [x] `[Ecosystem]` [`roadmap-template.md`](.agents/templates/roadmap-template.md)
  - [x] `[Ecosystem]` [`plan-template.md`](.agents/templates/plan-template.md)
  - [x] `[Ecosystem]` [`todo-template.md`](.agents/templates/todo-template.md)
  - [x] `[Ecosystem]` [`bugs-template.md`](.agents/templates/bugs-template.md)
- [x] `[Ecosystem]` Consolidate all project sprint execution into master [`PLAN.md`](./PLAN.md) with explicit project tags.
- [x] `[Ecosystem]` Consolidate all task checklists into master [`TODO.md`](./TODO.md) with explicit project tags.
- [x] `[Ecosystem]` Consolidate all open and resolved issues into master [`BUGS.md`](./BUGS.md) with explicit project tags.
- [x] `[Ecosystem]` Update [`AGENTS.md`](./AGENTS.md) index table to register new tracking templates.

---

## ⬜ Backlog / Candidate Tasks

### [NH-Reader] (projects/NH-Reader) — Post-v0.7.5 / M13 Candidates
- [ ] `[NH-Reader]` **Tag Frequency Analytics**: Local reading history analytics showing top consumed tags, artists, and languages.
- [ ] `[NH-Reader]` **Multi-Profile Partitioning**: Allow switching between isolated library/blacklist profile stores.
- [ ] `[NH-Reader]` **Background Update Inspection**: Non-intrusive GitHub release notification check on app launch.

### [helix-docs] (projects/helix-docs) — v1.1.0 Candidates
- [ ] `[helix-docs]` **Mermaid Helper Component**: Client-side rendering helper for legible ` ```mermaid ` fences.
- [ ] `[helix-docs]` **In-Page TOC Module**: Robust sidebar TOC parser resolving `BUG-14`.
- [ ] `[helix-docs]` **Dynamic Catalogue Filters**: Interactive category filtering for software and theme showrooms.

### [Windhawk-Themes] (projects/Windhawk-Themes) — M.04 Candidates
- [ ] `[Windhawk-Themes]` **Theme Catalogue Integration**: Generate Jekyll showcase documentation in `docs/_catalogue/`.
- [ ] `[Windhawk-Themes]` **Full Multi-Mod Windows 11 Verification**: Validate cohesive visual language across 22H2, 23H2, and 24H2.

### [Hentai-Senpai-Multi-DE-Theme] (projects/Hentai-Senpai-Multi-DE-Theme) — Candidates
- [ ] `[Hentai-Senpai]` **GTK4/libadwaita Script Synchronization**: Scripted color overrides for libadwaita desktop environments.

---

## ✅ Completed Workstreams & Archive

### ✅ [Ecosystem] Workspace Scaffolding & Agent Governance
- [x] `[Ecosystem]` `AGENTS.md` at workspace root defining binding invariants (read-only git by default, org scope, tracking docs contract).
- [x] `[Ecosystem]` `.agents/rules/`: `git-operations.md`, `workspace.md`, `release-notes.md`, `verification.md`, `security-hygiene.md`, `project-artwork.md`.
- [x] `[Ecosystem]` `.agents/skills/`: `clone-org-repos.md`, `sass-compile.md`, `helix-theme.md`, `gfm-content.md`, `jekyll-remote-theme.md`, `project-artwork-generation.md`, `windhawk-styler-engineering.md`, `tauri-desktop-engineering.md`, `gtk-desktop-theming.md`.
- [x] `[Ecosystem]` `.agents/templates/`: `release-notes-template.md`, `pull-request-template.md`, `milestone-summary-template.md`, `project-artwork-template.svg`, `roadmap-template.md`, `plan-template.md`, `todo-template.md`, `bugs-template.md`.

### ✅ [helix-docs] Theme Phases 1–5 & v1.0.0 Release (`projects/helix-docs`)
- [x] `[helix-docs]` Reorganized `_sass/` into layered architecture (`support/`, `modules/`, `color_schemes/`, `vendor/`, `custom/`).
- [x] `[helix-docs]` Precompiled `assets/css/site.css` via Dart Sass (`sass-embedded` 1.105.1; 432 rules preserved + 5 nested-nav rules).
- [x] `[helix-docs]` Mirrored just-the-docs includes: `header`, `sidebar`, `nav`, `breadcrumbs`, `children_nav`, `footer`, `scripts`.
- [x] `[helix-docs]` Eliminated `_data/navigation.yml`; implemented frontmatter-driven tree navigation (`parent`, `nav_order`, `published`).
- [x] `[helix-docs]` Extracted universal site-wide top navbar partial (`_includes/components/navbar.html`).
- [x] `[helix-docs]` Expanded `.catalogue-grid` min column width to 400px in SCSS and regenerated CSS.
- [x] `[helix-docs]` Replaced standalone `docs.html` with delegation to `layout: wiki`.
- [x] `[helix-docs]` Standardized `{path: "", type: ...}` scope form across all configs.
- [x] `[helix-docs]` Published initial release `v1.0.0` with annotated git tag and SemVer release notes.

### ✅ [NH-Reader] Core Milestones M1–M12 & Web Assets (`projects/NH-Reader`)
- [x] `[NH-Reader]` Completed Milestones M1 through M12.
- [x] `[NH-Reader]` Built unified cross-platform sign script (`scripts/sign.mjs`) replacing five individual npm scripts.
- [x] `[NH-Reader]` Resolved blacklist pagination backfill via stream buffering (`streamBackfilledList`).
- [x] `[NH-Reader]` Fixed NSIS installer finish page contrast and synchronous uninstaller wait.
- [x] `[NH-Reader]` Shipped v0.7.5 release notes, tag, and GitHub Discussions announcement.
- [x] `[NH-Reader]` Generated squircle-shaped (`rx="56"`) website assets (`logo.svg`, `favicon.ico`, `icon.png`) from `assets/appicon.jpg`.
- [x] `[NH-Reader]` Updated `docs/_config.yml` logo/favicon and cleaned redundant `docs/assets/images/appicon.jpg`.

### ✅ [Windhawk-Themes] Milestones M.01 & M.02 Foundation (`projects/Windhawk-Themes`)
- [x] `[Windhawk-Themes]` Established complete agent governance ecosystem (Rules 00–09, skills, templates, validation gate).
- [x] `[Windhawk-Themes]` Generated `windows-11-notification-center-styler.yml` applying frosted glass and specular rim highlights.
- [x] `[Windhawk-Themes]` Evaluated and shelved Windows 11 File Explorer Styler (M.03) to avoid invasive translucency hooks.
- [x] `[Windhawk-Themes]` Migrated theme catalogue documentation to `_catalogue/index.md` and configured `{path: "", type: catalogue}` defaults.

### ✅ [Hentai-Senpai-Multi-DE-Theme] v1.0.0 Release & Icon Suite (`projects/Hentai-Senpai-Multi-DE-Theme`)
- [x] `[Hentai-Senpai]` Multi-desktop GTK theme installer for GNOME, Cinnamon, XFCE, Budgie, and MATE.
- [x] `[Hentai-Senpai]` Authored squircle vector icon assets (`icon.svg`, `logo.ico`, `my-avatar.png`).
- [x] `[Hentai-Senpai]` Aligned documentation with `helix-docs` remote theme and frontmatter navigation.

### ✅ [helix-origin.github.io] Portal Modernization (`projects/helix-origin.github.io`)
- [x] `[helix-origin.github.io]` Standardized on `remote_theme: HELIX-Origin/helix-docs`.
- [x] `[helix-origin.github.io]` Authored 16:9 vector project showcase artwork suite (`windhawk-themes.svg`, `nh-reader.svg`, `hentai-senpai-theme.svg`, `helix-docs.svg`).
- [x] `[helix-origin.github.io]` Integrated `helix-docs.svg` into `docs/index.md` project card.
