# Rule: Shell Command Usage
**Status:** BINDING.

## PowerShell quirks
- PowerShell does NOT have `head`/`tail` (Linux). Use `Select-Object -First n` / `Select-Object -Last n`.
- Avoid `cd` inside commands when setting `workdir:`. For `bundle exec jekyll build`, set `workdir` to the directory containing `Gemfile`.
- Always pass absolute or fully qualified paths for source/destination.

## Building
- Always prepend Ruby to PATH when running bundle/jekyll:
  `$env:PATH = "C:\\Ruby33-x64\\bin;$env:PATH"; ...`
- For Jekyll: `bundle exec jekyll build --source "<abs>" --destination "<abs>"`
- Set `workdir: D:\\Projects\\helix-docs` when building the theme.

## Git
- `D:\Projects` is NOT a git repo; use `git -C <repo> <cmd>`.
- Read-only by default; no mutating ops without explicit authorization.

## Output
- Display progress concisely; avoid dumping huge logs. Grep for specific errors first.