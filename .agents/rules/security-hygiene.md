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
2. Confirm `.gitignore` protects certificates (`/certificates/`, `*.pfx`, `*.p12`), signing keystores, and build output directories.
3. If user credentials are required to build or sign assets, ensure signing is completely opt-in, run locally by the user with user-managed environment variables, and never hardcoded in scripts.

---

## 3. Code Signing Certificate Standards

1. **Generic Paths & Passwords:** Standardize local certificate paths to `certificates/certificate.pfx` (or `certificate.p12`) and fallback password to `youshallnotpass`. Never hardcode project-specific names in certificate file paths or passwords.
2. **Web Distribution Realities:** Uploading self-signed or development certificates to GitHub Secrets is pointless for software distributed via the web, as Windows SmartScreen / Mark-of-the-Web (MOTW) will still warn untrusted publisher without a publicly trusted EV/OV Certificate Authority. Reserve signing scripts for local developer verification or official trusted hardware tokens.
