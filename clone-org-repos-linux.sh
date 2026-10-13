#!/usr/bin/env bash
#
# clone-org-repos-linux.sh
#
# Clone every repository in a GitHub organization into the workspace's
# projects/ folder using the GitHub CLI (gh).
#
# The 'agents' repository (this workspace's own repo) is skipped by default so
# the workspace is never nested inside its own projects/ folder; pass
# --include-self to clone it anyway.
#
# Run with:  bash clone-org-repos-linux.sh   (or chmod +x and ./ it)
#
set -euo pipefail

ORG="HELIX-Origin"
EXCLUDES=()
INCLUDE_SELF=0
UPDATE=0
SHALLOW=0
DRY_RUN=0

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/projects"

usage() {
    cat <<'EOF'
Clone every repository in a GitHub organization into the workspace's projects/ folder.

Usage:
  ./clone-org-repos-linux.sh [options]

Options:
  --org <name>      Organization to clone from (default: HELIX-Origin)
  --dest <path>     Destination directory (default: <script dir>/projects)
  --exclude a,b     Comma-separated repository names to skip (repeatable)
  --include-self    Also clone the 'agents' workspace repository
  --update          Fast-forward repositories that already exist instead of skipping
  --shallow         Perform a shallow clone (--depth 1)
  --dry-run         Show what would happen without changing anything
  -h, --help        Show this help
EOF
}

add_excludes() {
    _rest="$1"
    while [ -n "$_rest" ]; do
        _item="${_rest%%,*}"
        _item="$(printf '%s' "$_item" | tr -d '[:space:]')"
        if [ -n "$_item" ]; then
            EXCLUDES+=("$_item")
        fi
        case "$_rest" in
            *,*) _rest="${_rest#*,}" ;;
            *)   _rest="" ;;
        esac
    done
}

while [ $# -gt 0 ]; do
    case "$1" in
        --org)        ORG="$2"; shift 2 ;;
        --org=*)      ORG="${1#*=}"; shift ;;
        --dest)       DEST="$2"; shift 2 ;;
        --dest=*)     DEST="${1#*=}"; shift ;;
        --exclude)    add_excludes "$2"; shift 2 ;;
        --exclude=*)  add_excludes "${1#*=}"; shift ;;
        --include-self) INCLUDE_SELF=1; shift ;;
        --update)     UPDATE=1; shift ;;
        --shallow)    SHALLOW=1; shift ;;
        --dry-run)    DRY_RUN=1; shift ;;
        -h|--help)    usage; exit 0 ;;
        *)            printf 'Unknown option: %s\n\n' "$1" >&2; usage >&2; exit 2 ;;
    esac
done

# --- Colours -----------------------------------------------------------------

if [ -t 1 ]; then
    C_RESET=$'\033[0m'
    C_WHITE=$'\033[97m'
    C_CYAN=$'\033[36m'
    C_GREEN=$'\033[32m'
    C_GREY=$'\033[90m'
    C_RED=$'\033[31m'
    C_YELLOW=$'\033[33m'
else
    C_RESET=; C_WHITE=; C_CYAN=; C_GREEN=; C_GREY=; C_RED=; C_YELLOW=
fi

# --- Preflight ---------------------------------------------------------------

if ! command -v gh >/dev/null 2>&1; then
    for p in "$HOME/.local/bin" "$HOME/.linuxbrew/bin" /usr/local/bin; do
        if [ -d "$p" ]; then
            PATH="$p:$PATH"
        fi
    done
fi

if ! command -v gh >/dev/null 2>&1; then
    printf '%sERROR: GitHub CLI (gh) was not found on PATH.%s\n' "$C_RED" "$C_RESET" >&2
    printf 'Install it from https://cli.github.com/ then run: gh auth login\n' >&2
    exit 2
fi

if ! command -v git >/dev/null 2>&1; then
    printf '%sERROR: git was not found on PATH.%s\n' "$C_RED" "$C_RESET" >&2
    exit 2
fi

if ! gh auth status >/dev/null 2>&1; then
    printf '%sERROR: GitHub CLI is not authenticated.%s\n' "$C_RED" "$C_RESET" >&2
    printf 'Run: gh auth login\n' >&2
    exit 2
fi

# --- Enumerate repositories --------------------------------------------------

printf '%sCloning all repositories in %s into: %s%s\n' "$C_WHITE" "$ORG" "$DEST" "$C_RESET"
if [ "$DRY_RUN" -eq 1 ]; then
    printf '%s(dry run - nothing will be changed)%s\n' "$C_YELLOW" "$C_RESET"
fi
printf '\n'

printf '%sListing repositories in %s ...%s\n' "$C_CYAN" "$ORG" "$C_RESET"
if ! REPO_LIST="$(gh repo list "$ORG" --limit 1000 --json name --jq '.[].name' | sort)"; then
    printf '%sERROR: failed to list repositories for %s.%s\n' "$C_RED" "$ORG" "$C_RESET" >&2
    exit 2
fi

is_excluded() {
    r="$1"
    if [ "$INCLUDE_SELF" -eq 0 ] && [ "$r" = "agents" ]; then
        return 0
    fi
    for e in ${EXCLUDES[@]+"${EXCLUDES[@]}"}; do
        if [ "$e" = "$r" ]; then
            return 0
        fi
    done
    return 1
}

# --- Prepare destination -----------------------------------------------------

if [ ! -d "$DEST" ]; then
    if [ "$DRY_RUN" -eq 1 ]; then
        printf '%s  (dry run) would create %s%s\n' "$C_GREY" "$DEST" "$C_RESET"
    else
        mkdir -p "$DEST"
    fi
fi

# --- Clone / update ----------------------------------------------------------

cloned=0
updated=0
skipped=0
failed=0
failures=""

while IFS= read -r repo; do
    if [ -z "$repo" ]; then
        continue
    fi

    if is_excluded "$repo"; then
        printf '%s  skip %s (excluded)%s\n' "$C_GREY" "$repo" "$C_RESET"
        skipped=$((skipped + 1))
        continue
    fi

    target="$DEST/$repo"

    if [ -d "$target" ]; then
        if [ "$UPDATE" -eq 0 ]; then
            printf '%s  skip %s (already present)%s\n' "$C_GREY" "$repo" "$C_RESET"
            skipped=$((skipped + 1))
            continue
        fi

        if [ "$DRY_RUN" -eq 1 ]; then
            printf '%s  ->   would update %s%s\n' "$C_GREY" "$repo" "$C_RESET"
            updated=$((updated + 1))
            continue
        fi

        printf '%s  ->   updating %s%s\n' "$C_CYAN" "$repo" "$C_RESET"
        if git -C "$target" fetch --all --prune >/dev/null 2>&1 \
            && git -C "$target" pull --ff-only >/dev/null 2>&1; then
            printf '%s  ok   %s updated%s\n' "$C_GREEN" "$repo" "$C_RESET"
            updated=$((updated + 1))
        else
            printf '%s  fail %s (update failed)%s\n' "$C_RED" "$repo" "$C_RESET"
            failed=$((failed + 1))
            failures="$failures $repo"
        fi
        continue
    fi

    if [ "$DRY_RUN" -eq 1 ]; then
        printf '%s  ->   would clone %s/%s%s\n' "$C_GREY" "$ORG" "$repo" "$C_RESET"
        cloned=$((cloned + 1))
        continue
    fi

    printf '%s  ->   cloning %s/%s%s\n' "$C_CYAN" "$ORG" "$repo" "$C_RESET"
    if [ "$SHALLOW" -eq 1 ]; then
        if gh repo clone "$ORG/$repo" "$target" -- --depth 1; then rc=0; else rc=1; fi
    else
        if gh repo clone "$ORG/$repo" "$target"; then rc=0; else rc=1; fi
    fi

    if [ "$rc" -eq 0 ]; then
        printf '%s  ok   %s cloned%s\n' "$C_GREEN" "$repo" "$C_RESET"
        cloned=$((cloned + 1))
    else
        printf '%s  fail %s (clone failed)%s\n' "$C_RED" "$repo" "$C_RESET"
        failed=$((failed + 1))
        failures="$failures $repo"
    fi
done <<< "$REPO_LIST"

# --- Summary -----------------------------------------------------------------

printf '\n%sDone. cloned=%d updated=%d skipped=%d failed=%d%s\n' \
    "$C_WHITE" "$cloned" "$updated" "$skipped" "$failed" "$C_RESET"

if [ "$failed" -gt 0 ]; then
    printf '%sFailed repositories:%s%s\n' "$C_RED" "$failures" "$C_RESET" >&2
    exit 1
fi

exit 0
