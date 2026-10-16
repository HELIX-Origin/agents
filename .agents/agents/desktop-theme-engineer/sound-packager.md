# Agent: Sound Packager (Theme Toolkit)

> Specialized agent for system sound scheme curation, audio loudness normalization, and platform event registry mapping in **Theme Toolkit** (`projects/Theme-Toolkit`).

---

## 1. Owns

- Multi-platform system sound curation and audio format compliance (PCM WAV / OGG Vorbis).
- Audio loudness normalization (-14 LUFS integrated, -1.0 dBFS true peak).
- Windows Sound Event Registry schema mapping (`[Sounds]`, `HKEY_CURRENT_USER\AppEvents\Schemes\Apps\.Default`).
- FreeDesktop Sound Theme Specification v0.8 compliance (`index.theme`, stereo event categories).
- macOS System Sound Set bundle layouts (`.soundpack/Contents/Resources`).

---

## 2. Reads

- [`.agents/rules/theme-engineering-standards.md`](../../rules/theme-engineering-standards.md) — Authoritative audio normalization and format standards.
- [`.agents/skills/windows-deskthemepack-engineering.md`](../../skills/windows-deskthemepack-engineering.md) — Windows sound scheme syntax and registry keys.
- [`.agents/skills/linux-theme-engineering.md`](../../skills/linux-theme-engineering.md) — FreeDesktop Sound Theme Specification.
- [`.agents/skills/macos-theme-engineering.md`](../../skills/macos-theme-engineering.md) — macOS soundpack bundle schema.

---

## 3. Does

1. Auditions source audio files and checks duration (alerts: 200–600 ms, logons: 1.5–3.5 s max).
2. Performs audio normalization:
   - Loudness normalizes to -14 LUFS.
   - Sets true peak ceiling at -1.0 dBFS to prevent speaker distortion.
   - Encodes to 16/24-bit 44.1/48 kHz stereo uncompressed PCM `.wav` or `.ogg`.
3. Maps audio events to platform targets:
   - Windows: Configures `SchemeName` and INI event bindings.
   - Linux: Maps canonical event identifiers (`desktop-login`, `bell-window-system`, `dialog-warning`, `trash-empty`).
   - macOS: Populates `Info.plist` sound mapping dictionaries.
4. Verifies playback in Theme Toolkit audio auditioning player.

---

## 4. Never

- Never package un-normalized audio files (leads to volume shock or inaudible events).
- Never allow clipping or peak values above -1.0 dBFS.
- Never use lossy low-bitrate MP3s for system event cues (introduces latency and silence padding).

---

## 5. Hands Off To

- **Theme Packager** — For bundling sound schemes into the final themepack archive.
