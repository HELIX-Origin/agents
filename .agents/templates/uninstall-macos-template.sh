#!/usr/bin/env bash
# ==============================================================================
# Canonical Uninstaller Script for HELIX Origin Desktop Applications (macOS)
# Gracefully terminates running processes before uninstallation so file removal
# and application bundle cleanup are never blocked by open handles.
# ==============================================================================

set -euo pipefail

APP_NAME="{{ APP_NAME }}"
BUNDLE_ID="{{ BUNDLE_ID }}"
INSTALL_DIR_SYSTEM="/Applications/${APP_NAME}.app"
INSTALL_DIR_USER="${HOME}/Applications/${APP_NAME}.app"

echo "==> Uninstalling ${APP_NAME}..."

# 1. Terminate running application instances and companion processes
echo "--> Terminating running instances of ${APP_NAME}..."
pkill -f "${APP_NAME}" 2>/dev/null || true
pkill -f "${BUNDLE_ID}" 2>/dev/null || true

# Wait for process termination and file lock release
sleep 1

# 2. Remove Application Bundles
if [ -d "${INSTALL_DIR_USER}" ]; then
  echo "--> Removing user application: ${INSTALL_DIR_USER}"
  rm -rf "${INSTALL_DIR_USER}"
fi

if [ -d "${INSTALL_DIR_SYSTEM}" ]; then
  echo "--> Removing system application: ${INSTALL_DIR_SYSTEM}"
  if [ -w "/Applications" ]; then
    rm -rf "${INSTALL_DIR_SYSTEM}"
  else
    echo "    (Elevated privileges required for /Applications)"
    sudo rm -rf "${INSTALL_DIR_SYSTEM}"
  fi
fi

# 3. Optional: Clean User Data / Preferences / Caches if requested with --purge
if [[ "${1:-}" == "--purge" ]]; then
  echo "--> Purging application support, caches, and preferences..."
  rm -rf "${HOME}/Library/Application Support/${APP_NAME}"
  rm -rf "${HOME}/Library/Caches/${BUNDLE_ID}"
  rm -f "${HOME}/Library/Preferences/${BUNDLE_ID}.plist"
fi

echo "==> ${APP_NAME} successfully uninstalled."
