<#
.SYNOPSIS
  Provisions the shared PAT_TOKEN secret to GitHub repositories in the HELIX-Origin organization.

.DESCRIPTION
  Loads the PAT_TOKEN from the local untracked .env file in the workspace root
  and uses the GitHub CLI (gh) to securely set the repository secret.

.PARAMETER Repo
  The target repository (e.g. "HELIX-Origin/windows-game-explorer").
  If omitted, provisions all known organization repositories.

.EXAMPLE
  .\provision-repo-secrets.ps1 -Repo "HELIX-Origin/windows-game-explorer"
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [string]$Repo
)

$ErrorActionPreference = "Stop"

# 1. Locate and read .env in workspace root
$envFilePath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFilePath)) {
  Write-Error "Could not find .env file at $envFilePath. Please ensure PAT_TOKEN is configured in .env."
  exit 1
}

$patToken = $null
Get-Content $envFilePath | ForEach-Object {
  if ($_ -match '^\s*PAT_TOKEN\s*=\s*(.*)$') {
    $patToken = $matches[1].Trim()
  }
}

if (-not $patToken) {
  Write-Error "PAT_TOKEN is missing or empty in $envFilePath."
  exit 1
}

$reposToProvision = @()
if ($Repo) {
  $target = if ($Repo -notmatch '/') { "HELIX-Origin/$Repo" } else { $Repo }
  $reposToProvision += $target
} else {
  $reposToProvision = @(
    "HELIX-Origin/windows-game-explorer",
    "HELIX-Origin/helix-jekyll-theme",
    "HELIX-Origin/nh-reader",
    "HELIX-Origin/theme-toolkit",
    "HELIX-Origin/windhawk-themes",
    "HELIX-Origin/ffxiv-config",
    "HELIX-Origin/depressurizer",
    "HELIX-Origin/agents"
  )
}

Write-Host "Provisioning PAT_TOKEN secret across $( $reposToProvision.Count ) repository/repositories..."

foreach ($r in $reposToProvision) {
  Write-Host "  -> Setting PAT_TOKEN on $r..."
  $patToken | gh secret set PAT_TOKEN -R $r
  if ($LASTEXITCODE -eq 0) {
    Write-Host "     [OK] Successfully configured secret on $r" -ForegroundColor Green
  } else {
    Write-Warning "     [FAILED] Could not set secret on $r (Exit code: $LASTEXITCODE)"
  }
}

# Clear sensitive variable from session memory
$patToken = $null
Write-Host "Secret provisioning complete." -ForegroundColor Cyan
