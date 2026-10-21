# GitLab CI/CD & SSH Deployment (Free-Tier) Rule

> Applies to any repository hosted on GitLab (including the `ugl-db-*` shards under
> `https://gitlab.com/helix-origin/ugl-db/`).

## Why this rule exists

GitLab's **project access tokens** are a paid feature and are **not available on the free tier**.
Personal access tokens work for human/API use, but for **CI/CD pipelines** running inside GitLab
projects on the free tier, the correct and reliable mechanism is **SSH deploy keys** plus
per-project CI/CD configuration. Agents must not assume a project/personal access token can
drive GitLab CI/CD on a free-tier project.

## Mandatory requirements

1. **SSH deploy keys first.** Any GitLab project that needs automated push/clone/pipeline
   operations must have a dedicated SSH deploy key (read+write where push is required)
   registered on the project (`Settings -> Repository -> Deploy keys`). The private key is
   stored as a masked CI/CD variable / repository secret in the consuming pipeline host
   (e.g. the GitHub `ugl-db-ingest` repo's secrets), never committed to source.

2. **SSH-based git operations in pipelines.** CI/CD jobs that interact with a GitLab shard
   must use SSH (`git@gitlab.com:...`) with the deploy key loaded into `ssh-agent`, not
   HTTPS + a personal/project access token. Configure `GIT_SSH_COMMAND` or an
   `ssh-agent` step in the pipeline.

3. **GitLab CI/CD pipeline definitions live in the GitLab repo.** Each GitLab-hosted shard
   must ship its own `.gitlab-ci.yml` (or equivalent) defining validation/build pipelines,
   because GitLab free-tier CI runs on GitLab's runners against the project's own
   configuration. Agents must create/maintain this file when standing up or migrating a
   GitLab project.

4. **No secrets in source.** Deploy keys, SSH private keys, and tokens are provided only
   via CI/CD variables/secrets. Never hard-code them in `.gitlab-ci.yml`, scripts, or
   committed files.

5. **Free-tier awareness.** Respect GitLab free-tier limits (shared runner minutes, storage,
   artifact retention). Keep pipelines minimal: validate JSON schema, run lightweight checks,
   avoid heavy builds on free runners.

6. **Cross-host pipelines (GitHub ingest -> GitLab shards).** When a GitHub-hosted tool
   (e.g. `ugl-db-ingest`) targets GitLab shards, the pipeline must load the SSH deploy key
   from GitHub secrets and use SSH for all git operations against GitLab. API-only
   operations that require a token must use a **GitLab personal access token** stored as a
   secret (distinct from any GitHub token), never a GitHub PAT.

## When this rule applies

- Creating or migrating a repository to GitLab.
- Adding/modifying CI/CD for a GitLab-hosted project.
- Any ingest/automation that pushes to or reads from GitLab shards.

## Enforcement

Agents must verify a GitLab project has a deploy key + `.gitlab-ci.yml` before declaring
the project "CI/CD ready." Missing either is a blocker, not a follow-up.