# Rule: Security & Secret Hygiene

**Status:** BINDING.
**Scope:** All repositories and agent operations across the organization.

---

## 1. Zero Secret Ingestion & Leakage

Never commit, log, or leak sensitive data into repositories, release notes, or chat outputs.

### Strictly Forbidden Items:
- API keys, access tokens, personal access tokens (PATs), OAuth credentials.
- Code signing keys, private keys (`.pfx`, `.key`, `.keystore`, `.asc`, `.pem`).
- Passwords, authentication headers, database connection strings.
- Hardcoded local file system personal directories (e.g. `C:\Users\<username>`).

---

## 2. Pre-Commit Secret Audit

Before any file is staged or committed:
1. Scan diffs for accidental tokens, signing keys, or credentials.
2. Confirm `.gitignore` protects certificates, signing keystores, and build output directories.
3. If user credentials are required to build or sign assets (such as in `NH-Reader`), ensure signing is completely opt-in, run locally by the user with user-managed environment variables, and never hardcoded in scripts.
