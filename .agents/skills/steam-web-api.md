# Skill: Steam Web API (Key-Only Integration)

> Domain knowledge for working with the official Steam Web API — the sole required
> integration surface for `projects/depressurizer` (Sprint 32 API-only architecture).

## Architecture Directive (Locked)

Depressurizer relies **entirely on the Steam Web API key**: it provides account
authorization, the full owned-game library, and collection customization. No feature may
depend on direct Steam client access. The legacy Steam-client methods — local path
autodetection and VDF parsing/writing (`loginusers.vdf`, `libraryfolders.vdf`,
`localconfig.vdf`, `sharedconfig.vdf`) — are **abandoned and being removed**, not kept as an
optional fallback: they were flaky and Windows-locked, which is precisely why the migration
moves to the key + SteamID64 API architecture. The app never reads or writes local Steam
client files. A pure HTTP/key-only client additionally unlocks future Android and iOS
support.

### Running Steam Client Precaution (Troubleshooting Warning)

Steam stores library collections in its cloud config, which the API updates through cloud
sync. Because of how the **desktop** Steam client works, a running desktop client **may**
occasionally re-sync and overwrite collection/category changes applied through the API — though
it often will not. This is known flakiness on Valve's side that we cannot improve, so it is
documented purely as a **troubleshooting warning** for users and AI tools: *if collections do
not stick after an API sync, try fully closing the desktop Steam client and re-applying.*

**Do not gate on it.** No running-instance detection, block, or hard requirement to close Steam
— a check is pointless (the app never interacts with the client, and non-desktop platforms have
no equivalent client). This advisory does not reintroduce any Steam client dependency.

**Key + SteamID64 pairing (sanctioned):** the user Web API key is **account-scoped** —
on its own it authenticates its owning account and returns that account's info and
library. Pairing it with the account's **SteamID64** is explicitly allowed wherever it
adds benefit: `GetOwnedGames` requires an explicit `steamid`, explicit SteamID64
targeting keeps requests deterministic (stable local cache keys in `depressurizer.db`,
future multi-account support), and identity endpoints (`GetPlayerSummaries`,
`ResolveVanityURL`, `GetFriendList`) key off SteamID64.

## Reference & Request Mechanics

- Full endpoint reference (auto-generated from `GetSupportedAPIList` + client protobufs):
  **https://steamapi.xpaw.me/** (by xPaw; supports in-page execution with your key).
- Base URLs: `https://api.steampowered.com` or `https://community.steam-api.com`.
- URL format: `/<interface>/<method>/<version>/`. `*Service` interfaces accept arguments
  as a single JSON object via `input_json` (key and format stay as query parameters);
  legacy interfaces use query/form params. Array params use `name[0]` + `count`.
- Response formats: `json` (default; 64-bit integers as strings), `xml`, `vdf`,
  `protobuf_raw`. Parse flexibly — result order is not guaranteed.

## Core Read Endpoints (User Key)

- `IPlayerService/GetOwnedGames/v1` — the library: `key`, `steamid` (required),
  `include_appinfo`, `include_played_free_games`, `include_free_sub`, `appids_filter`,
  `language`, `include_extended_appinfo`, `include_family_licenses`.
  (Depressurizer already uses this to capture all 137 owned games.)
- `IPlayerService/GetRecentlyPlayedGames/v1`, `GetSingleGamePlaytime/v1`,
  `GetSteamLevel/v1`, `ClientGetLastPlayedTimes/v1`.
- Achievements: `IPlayerService/GetGameAchievements` (available list),
  `GetUserAchievements`, `GetAchievementsProgress`, `GetTopAchievementsForGames`,
  `ISteamUserStats/GetGlobalAchievementPercentages`.
- Identity: `ISteamUser/GetPlayerSummaries/v2`, `ISteamUser/ResolveVanityURL/v1`.
- Store metadata: Store API app details endpoint, `IStoreService/GetAppList`.

## Account Writes Available With a User Key

`IPlayerService/Set*` methods prove key-authenticated account mutations work without any
publisher key: `SetProfileBackground`, `SetMiniProfileBackground`, `SetAvatarFrame`,
`SetAnimatedAvatar`, `SetProfileTheme`, `SetFavoriteBadge`, `SetSteamDeckKeyboardSkin`,
`SetProfilePreferences`, `SetEquippedProfileItemFlags`.

## Collections Status (CRITICAL — Validate in W.55i Before Implementing W.55j)

- **No library-collections method exists in `IPlayerService`** — verified against the
  complete method list at steamapi.xpaw.me including UNDOCUMENTED entries: there is no
  `GetCollections` / `SetCollection` / favorites endpoint.
- `ISteamRemoteStorage/GetCollectionDetails` targets workshop collections
  (`publishedfileids`) — NOT library category tags; do not conflate.
- Valve's feedback wiki shows `GetOwnedGames?category=` filtering has long been requested
  by developers and never shipped — the gap is Valve-side and acknowledged.
- The modern Steam client stores library collections in
  `userdata/<steam3id>/config/cloudstorage/cloud-storage-namespace-1.json`
  (a cloud-synced client storage namespace; category changes are written client-side).
- W.55i must therefore probe: (1) undocumented endpoints beyond `IPlayerService`,
  (2) access-token-based endpoints used by Steam's own Store/Community web pages
  (access tokens ≠ API keys — some methods only accept one or the other), and
  (3) the client cloud-storage sync protocol. Document findings before W.55j coding.

## Auth Tiers, Limits & Hygiene

- Three access levels: public (no auth) / **user Web API key** (any Steam account; pass as
  `key` query param or `x-webapi-key` header) / publisher key (protected methods,
  server-side only, never shipped to clients).
- Access tokens: Steam's own web pages authenticate users with tokens instead of keys;
  not all methods support both. Steam also acts as an OpenID provider for credential-free
  login.
- Rate limits are per-method and undocumented: expect HTTP 429 or `x-eresult`
  25 (LimitExceeded) / 84 (RateLimitExceeded) — back off, cache aggressively.
- Always use HTTPS; store keys securely; keys must never be committed to public repos.

## Related

- Workspace rule: `.agents/rules/security-hygiene.md`, `.agents/rules/verification.md`.
- Game metadata context: `.agents/skills/game-metadata-providers.md`.
