#!/usr/bin/env bash
# ==============================================================================
# Canonical Uninstaller Script for HELIX Origin Desktop Applications (Linux)
# Gracefully terminates running processes before uninstallation so file removal,
# desktop shortcuts, and icon cleanups are never blocked by open handles.
# ==============================================================================

set -euo pipefail

APP_NAME="{{ APP_NAME }}"
BINARY_NAME="{{ BINARY_NAME }}"

echo "==> Uninstalling ${APP_NAME}..."

# 1. Terminate running application instances and companion tools
echo "--> Terminating running instances of ${BINARY_NAME}..."
pkill -f "${BINARY_NAME}" 2>/dev/null || true

# Wait for process termination and file lock release
sleep 1

# 2. Remove Desktop Entries and MIME associations
USER_DESKTOP="${HOME}/.local/share/applications/${BINARY_NAME}.desktop"
SYSTEM_DESKTOP="/usr/share/applications/${BINARY_NAME}.desktop"

if [ -f "${USER_DESKTOP}" ]; then
  echo "--> Removing desktop shortcut: ${USER_DESKTOP}"
  rm -f "${USER_DESKTOP}"
fi

if [ -f "${SYSTEM_DESKTOP}" ]; then
  echo "--> Removing system desktop shortcut: ${SYSTEM_DESKTOP}"
  if [ -w "/usr/share/applications" ]; then
    rm -f "${SYSTEM_DESKTOP}"
  else
    sudo rm -f "${SYSTEM_DESKTOP}"
  fi
fi

# Update desktop database if tool is installed
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "${HOME}/.local/share/applications" 2>/dev/null || true
fi

# 3. Remove Desktop Icons
rm -f "${HOME}/.local/share/icons/hicolor/"*"/apps/${BINARY_NAME}."* 2>/dev/null || true

# 4. Optional: Clean User Data and Caches if requested with --purge
if [[ "${1:-}" == "--purge" ]]; then
  echo "--> Purging application data, config, and cache..."
  rm -rf "${HOME}/.config/${BINARY_NAME}"
  rm -rf "${HOME}/.local/share/${BINARY_NAME}"
  rm -rf "${HOME}/.cache/${BINARY_NAME}"
fi

echo "==> ${APP_NAME} successfully uninstalled."
