# Rule: Windows Shell Extensions & Game Library Invariants

**Status:** BINDING.
**Scope:** All Windows Shell Namespace Extensions and File Explorer integrations (specifically `projects/windows-game-explorer` — Windows Game Explorer).

---

## 1. Game Library Experience Invariant (No Generic Shortcuts Folders)

Windows Game Explorer is fundamentally an authentic, rich, visual **Game Library** inside Windows File Explorer — continuing and elevating the vision of Microsoft's legacy Windows Game Explorer.

> [!CAUTION]
> **Generic Shortcuts Folder Degradation is Strictly Prohibited.**
> Falling back to vanilla Windows Explorer list views (`SHCreateShellFolderView` / `CDefView`) reduces the virtual folder to nothing more than a plain folder of file shortcuts. This strips away all game covers, hero banners, rich metadata, library overview state, and launch buttons, completely defeating the project's purpose. Any implementation that results in a generic shortcuts folder is classified as a design regression and is rejected.

The shell integration must deliver an authentic game library experience:
- Dedicated visual presentation (tall box art covers, wide hero banners, or formatted details table with high-res thumbnails).
- Persistent Details Drawer / Sidepane featuring the Fluent controller hero badge, complete game metadata (title, platform, rating, developer, release date, playtime, disk footprint), and one-click launch controls.
- Active system accent colorization and dark/light mode synchronization with Windows 11 DWM.

---

## 2. Ban on Blind Trial-and-Error Shell Extension Code Loops

> [!IMPORTANT]
> **No Speculative Guessing on Shell COM Interfaces.**
> Windows Explorer (`explorer.exe`) hosts shell extensions in-process within its critical Single-Threaded Apartment (STA) main UI thread. A crash or stack overflow in a shell extension crashes the entire Windows shell interface.

When a shell crash occurs (e.g. `0xc00000fd` `STATUS_STACK_OVERFLOW` in `ntdll.dll` or access violations):
1. **Never Make Blind Guesses**: Agents must **NEVER** repeatedly toggle between raw `IShellView` hacks and default `CDefView` fallbacks in iterative guesswork loops.
2. **Mandatory Documentation Research**: Before touching or altering shell extension view or folder code, agents must thoroughly research official Microsoft technical documentation, Windows SDK architecture specifications, and verified Win32/COM shell contracts.
3. **Analyze Root Causes Thoroughly**: Inspect exact crash offsets, event logs, call stacks, and COM interface query sequences (`QueryInterface` requests for `IFolderView`, `IFolderView2`, `IItemView`, `IExplorerBrowser`).

---

## 3. Modern Windows 11 File Explorer Architecture Understanding

Modern Windows 11 (Version 22H2/23H2/24H2, Build 22000–26100+) File Explorer is fundamentally different from legacy Windows XP/Vista/7 Explorer:

1. **WinUI 3 & XAML Island Shell Frame**:
   - Modern File Explorer uses `DesktopWindowXamlSource` (XAML Islands) to host modern WinUI 3 controls for tabs, the address bar, command bar, and navigation tree.
   - The view canvas is managed by modern shell view adapters (`CLSID_ItemsViewAdapter`) bridging legacy COM `IShellView` into the XAML frame.
2. **The `0xc00000fd` Stack Overflow Mechanism**:
   - Legacy Win32 `IShellView` implementations that only implement basic methods (`CreateViewWindow`, `UIActivate`) fail when modern Explorer wraps them.
   - When modern Explorer's tabbed frame activates a view, it queries for modern folder view interfaces (`IFolderView2`, `IFolderViewSettings`, `IExplorerViewStyle`).
   - If `UIActivate` or window activation forwards focus back to Explorer or receives re-entrant activation messages without an STA-safe decoupling, Explorer enters an infinite activation ping-pong loop (`UIActivate` <-> `OnViewWindowActive` <-> `SetFocus`), exhausting the 1MB thread stack within milliseconds.
3. **STA Thread Concurrency & COM Message Pumps**:
   - Inside `explorer.exe`, any call that pumps COM messages (such as synchronous GDI+/WIC image loading, `CoWaitForMultipleHandles`, or modal calls inside `WM_PAINT`) causes re-entrant message dispatch, triggering recursive paints and stack crashes.
   - All disk I/O and image decoding must be strictly decoupled from UI paint routines.

---

## 4. Valid Architectural Pathways for Modern Rich Shell Views

When implementing or refining the Windows Game Explorer shell view:
- **Path A: Modern Out-of-Process / Island View Hosting**:
  Evaluate hosting the rich WinUI or hardware-accelerated Direct2D/DirectComposition game library view in an isolated frame or embedded window bridge so Explorer's internal STA message pump cannot be destabilized.
- **Path B: Canonical `IFolderView2` + Shell Details / Preview Handler**:
  If using native shell view infrastructure, all modern interfaces (`IFolderView`, `IFolderView2`) must be handled correctly with zero activation loops, and the rich presentation (cover art, launcher buttons, synopsis) must be powered via dedicated `IPreviewHandler` or Details Pane integrations.
- **Path C: Complete `IShellView` Contract Compliance**:
  If hosting a custom Win32 view window via `IShellView::CreateViewWindow`, the implementation must adhere strictly to Microsoft's shell browser protocol:
  - Query parent window hierarchy via `IShellBrowser::GetControlWindow(FCW_VIEW, &hwndParent)`.
  - Process accelerator tables via `IShellBrowser::TranslateAcceleratorSB`.
  - Maintain absolute recursion guards on `UIActivate(SVUIA_ACTIVATE_FOCUS)` and never call `SetFocus` during non-focus activations.
  - Return `S_OK` / `E_NOTIMPL` strictly according to Windows Shell specifications.
