# Rule: Shell Command Usage
**Status:** BINDING.

## PowerShell quirks
- PowerShell does NOT have `head`/`tail` (Linux). Use `Select-Object -First n` / `Select-Object -Last n`.
- Avoid `cd` inside commands when setting `workdir:`. For `bundle exec jekyll build`, set `workdir` to the directory containing `Gemfile`.
- Always pass absolute or fully qualified paths for source/destination.

## Building
- Ensure Ruby is available in the shell PATH when running bundle/jekyll:
  `$env:PATH = "<ruby-bin-dir>;$env:PATH"; ...`
- For Jekyll: `bundle exec jekyll build --source "<site-source-dir>" --destination "<site-dest-dir>"`
- Set `workdir: projects/helix-docs` when building the theme.

## Git
- Use `git -C <repo> <cmd>` when operating inside individual project repositories under `projects/`.
- Read-only by default; no mutating ops without explicit authorization.

## Output
- Display progress concisely; avoid dumping huge logs. Grep for specific errors first.