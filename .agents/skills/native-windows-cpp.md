---
name: Native C++ Windows Desktop Engineering
description: Authoritative standards, patterns, and runbooks for native C++ Windows desktop applications across HELIX-Origin, supporting Windows 2000/XP to Windows 11+.
applies_to: [windows-game-explorer, nh-reader, theme-toolkit, depressurizer]
tags: [cpp, win32, windows, direct2d, msvc, native, legacy-windows]
---

# Skill: Native C++ Windows Desktop Engineering

> Authoritative engineering standard for native C++ Windows desktop applications across HELIX-Origin.
> Covers C++20, MSVC compiler flags, Win32 APIs, progressive enhancement from **Windows 2000 (or XP)** up to **Windows 11+**, and zero-warning enforcement.

---

## 1. Core Architecture Invariants

1. **Pure Native Windows Execution:**
   - All desktop applications target **Windows exclusively**.
   - **Tauri, webviews, and cross-platform abstractions (macOS, Linux, Android) are completely abandoned** for desktop applications across the organization.
   - Applications compile to lean, hardware-accelerated native Win32 executables and DLLs with near-instant cold startup, low memory footprint, and deep OS integration.
2. **Universal OS Support (Windows 2000 / XP through Windows 11+):**
   - **Minimum Supported Windows Version:** **Windows 2000** (NT 5.0) or **Windows XP** (NT 5.1).
   - **Maximum Supported Windows Version:** **Windows 11+** (NT 10.0+).
   - Applications must run cleanly across this entire lineage without failing to launch due to missing static DLL exports.
3. **Progressive Enhancement Pattern:**
   - **Core Linkage:** Link statically only against core NT 5.0/5.1 system DLLs (`kernel32.dll`, `user32.dll`, `gdi32.dll`, `advapi32.dll`, `shell32.dll`, `comctl32.dll`).
   - **Dynamic Feature Probing:** Advanced modern features (Direct2D/DirectWrite on Win7+, DWM dark mode/blur on Vista/10/11, Per-Monitor V2 DPI awareness on Win10+, modern File Explorer Shell Extensions) must be loaded dynamically via `LoadLibraryW` / `GetProcAddress`.
   - **Graceful Fallbacks:** When running on legacy Windows 2000 or XP where modern APIs are unavailable, fall back cleanly to classic GDI/GDI+ rendering, standard Win32 dialogs, and classic system palettes without crashing.
4. **Compiler & Warning Standards:**
   - Compiler: Microsoft Visual C++ (MSVC) toolchain targeting `C++20` standard (`/std:c++20`).
   - Warning level: `/W4` with warnings treated as fatal errors (`/WX`).
   - Every build must pass with **0 errors and 0 warnings**.
5. **Memory & Resource Safety (RAII):**
   - No raw owning pointers; use `std::unique_ptr` and `std::shared_ptr`.
   - Wrap Win32 handles in RAII wrappers (`CloseHandle`, `FindClose`, `DeleteObject`).
   - Wrap COM interfaces in smart pointers (`Microsoft::WRL::ComPtr<T>` or `_com_ptr_t`).

---

## 2. Win32 API & Unicode Standards

- **Strict Unicode (Wide Characters):**
  - All Win32 API invocations must use explicit wide-character APIs (`W` suffix: `CreateWindowExW`, `RegOpenKeyExW`, `CreateFileW`, `GetModuleFileNameW`).
  - Internal string representation: `std::wstring` for Win32 filesystem paths and OS interactions.
  - Network payloads / JSON: `std::string` (UTF-8), converted explicitly via `MultiByteToWideChar` / `WideCharToMultiByte`.
  - Always define `UNICODE` and `_UNICODE` in build configurations.

---

## 3. UI Rendering & Version Adaptation

1. **Modern Windows 10 & 11+:**
   - Hardware-accelerated Direct2D (`d2d1.h`) and DirectWrite (`dwrite.h`).
   - Windows 11 dark mode awareness dynamically probed via `DwmSetWindowAttribute` (`DWMWA_USE_IMMERSIVE_DARK_MODE`).
   - Dynamic Per-Monitor V2 DPI awareness (`SetProcessDpiAwarenessContext`).
2. **Legacy Windows 2000 & XP Fallback:**
   - Standard GDI/GDI+ double-buffered rendering for custom controls.
   - Respect classic `GetSysColor` metrics and system color schemes.
   - High-performance, zero-stutter execution even on vintage potato hardware.

---

## 4. Networking & Local Persistence

1. **Native Networking:**
   - Native **WinHTTP** (`winhttp.h`) with fallback to sockets / libcurl.
   - Asynchronous non-blocking requests with proper timeouts and handle cleanup.
2. **Local Persistence & SQLite:**
   - Native SQLite engine (`sqlite3.c`/`sqlite3.h`) compiled directly into the binary.
   - WAL mode enabled where supported (`PRAGMA journal_mode=WAL;`).
   - User data isolated in user-scoped directories under `%USERPROFILE%` or `%APPDATA%`.

---

## 5. Verification Commands

```powershell
# Standard CMake configure and build with MSVC
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release

# Native test suite execution
ctest --test-dir build -C Release --output-on-failure
```
