#!/usr/bin/env node
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

export interface KbUnit {
  name: string;
  path: string;
  run: (...args: unknown[]) => unknown;
}

/**
 * Discover importable runtime units under `dir`:
 * - the permanent reusable test suite (`tests/*.test.ts`), and
 * - pluggable content bodies (`bodies/**` — throw-away text/JSON/MD payloads).
 *
 * TS units are permanent code; bodies are swappable content — this loader serves both.
 * - ENOENT directory → empty list (nothing to discover yet).
 * - Sorted by filename for deterministic order.
 * - Each unit exposes its entry point as a named `run` export or a default export.
 */
export async function loadUnits(dir: string, suffix: string): Promise<KbUnit[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }

  const units: KbUnit[] = [];
  for (const file of entries.filter(f => f.endsWith(suffix)).sort()) {
    const full = path.join(dir, file);
    const mod = (await import(pathToFileURL(full).href)) as Record<string, unknown>;
    const run =
      typeof mod.run === 'function'
        ? (mod.run as KbUnit['run'])
        : typeof mod.default === 'function'
          ? (mod.default as KbUnit['run'])
          : null;
    if (!run) {
      throw new Error(`unit ${file} must export a named 'run' function or a default function export`);
    }
    units.push({ name: file, path: full, run });
  }
  return units;
}
