#!/usr/bin/env node
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT = path.resolve(__dirname, '..', '..');

export const MIGRATIONS_DIR = path.join(ROOT, '.agents', 'migrations');
export const TEMPLATES_DIR = path.join(ROOT, '.agents', 'templates');
export const SCRIPTS_DIR = path.join(ROOT, 'scripts', 'agents-kb');
// Local-only data + logs live next to the CLI that manages them (gitignored; tracked README only).
export const DATA_DIR = path.join(SCRIPTS_DIR, 'data');
export const LOGS_DIR = path.join(SCRIPTS_DIR, 'logs');
// Built-in reusable test suite (permanent TS code — never throw-away bodies).
export const TESTS_DIR = path.join(SCRIPTS_DIR, 'tests');
// Pluggable content bodies: throw-away text/JSON/MD units consumed by CLI modules
// (update strings, scaffold payloads, templates) so content is never hard-coded in code.
export const BODIES_DIR = path.join(SCRIPTS_DIR, 'bodies');

/**
 * Lazy database path. The `AGENTS_KB_PATH` environment override (used by the test
 * runner to point at a throwaway DB) wins; otherwise the local-only data dir path.
 * Evaluated per call so callers can override at any time before opening the DB.
 */
export function kbPath(): string {
  const override = process.env.AGENTS_KB_PATH;
  return override ? path.resolve(override) : path.join(DATA_DIR, 'knowledge.db');
}

export function secureKbPath(): string {
  const override = process.env.AGENTS_KB_SECURE_PATH;
  return override ? path.resolve(override) : path.join(DATA_DIR, 'secure.db');
}

export function defaultOrgSlug(): string {
  const override = process.env.AGENTS_KB_ORG ?? process.env.AGENTS_KB_ORG_SLUG;
  return override && override.trim() !== '' ? override.trim() : 'HELIX-Origin';
}

export interface KbConfig {
  orgSlug: string;
  // Local-only lifecycle: knowledge.db is created by initial setup after cloning the agents
  // ecosystem and is NEVER tracked in git (gitignored) — clones/forks start with a clean DB
  // and repo-scoped data never gets pushed to other people's clones.
  tracked: boolean;
}

export function defaultConfig(): KbConfig {
  return {
    orgSlug: defaultOrgSlug(),
    tracked: false
  };
}
