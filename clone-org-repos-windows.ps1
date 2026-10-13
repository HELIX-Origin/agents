#Requires -Version 5.1
<#
.SYNOPSIS
    Clone every repository in a GitHub organization into the workspace's projects/ folder (Windows).

.DESCRIPTION
    Enumerates all repositories in the target organization using the GitHub CLI
    (gh), then clones any that are not already present into <workspace-root>/projects.

    Existing clones are left untouched unless -Update is supplied, in which case
    they are fast-forwarded (git fetch --all --prune && git pull --ff-only).

    The 'agents' repository (this workspace's own repo) is skipped by default so
    the workspace is never nested inside its own projects/ folder. Use
    -IncludeSelf to clone it anyway.

.PARAMETER Org
    GitHub organization to clone from (default: HELIX-Origin).

.PARAMETER Destination
    Directory to clone into (default: <script folder>/projects).

.PARAMETER Exclude
    One or more repository names to skip.

.PARAMETER IncludeSelf
    Also clone the 'agents' workspace repository.

.PARAMETER Update
    For repositories that already exist on disk, run a fast-forward pull instead
    of skipping them.

.PARAMETER Shallow
    Perform a shallow clone (--depth 1).

.PARAMETER DryRun
    Print the actions that would be taken without cloning or updating anything.

.EXAMPLE
    .\clone-org-repos-windows.ps1

.EXAMPLE
    .\clone-org-repos-windows.ps1 -DryRun

.EXAMPLE
    .\clone-org-repos-windows.ps1 -Update -Exclude FFXIV-Config

.EXAMPLE
    .\clone-org-repos-windows.ps1 -IncludeSelf -Shallow
#>
[CmdletBinding()]
param(
    [string]   $Org         = 'HELIX-Origin',
    [string]   $Destination,
    [string[]] $Exclude     = @(),
    [switch]   $IncludeSelf,
    [switch]   $Update,
    [switch]   $Shallow,
    [switch]   $DryRun
)

Set-StrictMode -Version Latest

# Native commands are expected to fail sometimes (e.g. a clone error); we check
# $LASTEXITCODE explicitly, so keep PowerShell from turning those into throws.
$ErrorActionPreference = 'Continue'
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

# $PSScriptRoot is not populated while an advanced script's param() defaults are
# evaluated, so resolve the workspace root and default destination here instead.
$ScriptRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $Destination) { $Destination = Join-Path $ScriptRoot 'projects' }

function Say {
    param([string] $Text, [string] $Color = 'Gray')
    Write-Host $Text -ForegroundColor $Color
}

# --- Preflight ---------------------------------------------------------------

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Say 'ERROR: GitHub CLI (gh) was not found on PATH.' Red
    Say 'Install it from https://cli.github.com/ then run: gh auth login' Yellow
    exit 2
}

& gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Say 'ERROR: GitHub CLI is not authenticated.' Red
    Say 'Run: gh auth login' Yellow
    exit 2
}

Say "Cloning all repositories in '$Org' into: $Destination" White
if ($DryRun) { Say '(dry run - nothing will be changed)' Yellow }
Say ''

# --- Enumerate repositories --------------------------------------------------

Say "Listing repositories in '$Org' ..." Cyan
$listing = & gh repo list $Org --limit 1000 --json name --jq '.[].name' 2>$null
if ($LASTEXITCODE -ne 0) {
    Say "ERROR: failed to list repositories for '$Org'." Red
    exit 2
}

$skip = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach ($name in $Exclude) {
    if ($name) { [void] $skip.Add($name.Trim()) }
}
if (-not $IncludeSelf) { [void] $skip.Add('agents') }

$repos = @(
    $listing |
        Where-Object { $_ } |
        ForEach-Object { $_.Trim() } |
        Where-Object { -not $skip.Contains($_) } |
        Sort-Object
)

if ($repos.Count -eq 0) {
    Say 'No repositories to clone.' Yellow
    exit 0
}

Say ("Found {0} repository(ies): {1}" -f $repos.Count, ($repos -join ', ')) White
Say ''

# --- Prepare destination -----------------------------------------------------

if (-not (Test-Path -LiteralPath $Destination)) {
    if ($DryRun) {
        Say "  (dry run) would create $Destination" DarkGray
    }
    else {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    }
}

# --- Clone / update ----------------------------------------------------------

$cloned  = 0
$updated = 0
$skipped = 0
$failed  = 0
$failures = [System.Collections.Generic.List[string]]::new()

foreach ($repo in $repos) {
    $target = Join-Path $Destination $repo
    $exists = Test-Path -LiteralPath $target

    if ($exists) {
        if (-not $Update) {
            Say ("  skip {0} (already present)" -f $repo) DarkGray
            $skipped++
            continue
        }

        if ($DryRun) {
            Say ("  ->   would update {0}" -f $repo) DarkGray
            $updated++
            continue
        }

        Say ("  ->   updating {0}" -f $repo) Cyan
        & git -C $target fetch --all --prune 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) { & git -C $target pull --ff-only 2>&1 | Out-Null }
        if ($LASTEXITCODE -eq 0) {
            Say ("  ok   {0} updated" -f $repo) Green
            $updated++
        }
        else {
            Say ("  fail {0} (update failed)" -f $repo) Red
            $failed++
            $failures.Add($repo)
        }
        continue
    }

    if ($DryRun) {
        Say ("  ->   would clone {0}/{1}" -f $Org, $repo) DarkGray
        $cloned++
        continue
    }

    Say ("  ->   cloning {0}/{1}" -f $Org, $repo) Cyan
    if ($Shallow) {
        & gh repo clone "$Org/$repo" $target '--' '--depth' '1'
    }
    else {
        & gh repo clone "$Org/$repo" $target
    }

    if ($LASTEXITCODE -eq 0) {
        Say ("  ok   {0} cloned" -f $repo) Green
        $cloned++
    }
    else {
        Say ("  fail {0} (clone failed)" -f $repo) Red
        $failed++
        $failures.Add($repo)
    }
}

# --- Summary -----------------------------------------------------------------

Say ''
Say ("Done. cloned={0} updated={1} skipped={2} failed={3}" -f $cloned, $updated, $skipped, $failed) White

if ($failed -gt 0) {
    Say ("Failed repositories: {0}" -f ($failures -join ', ')) Red
    exit 1
}

exit 0
