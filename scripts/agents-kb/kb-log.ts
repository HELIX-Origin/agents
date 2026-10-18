#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { LOGS_DIR } from './kb-config.ts';

export interface KbLogger {
  readonly logFile: string | null;
  section(title: string): void;
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  startTimer(label: string): () => number;
  close(): void;
}

const MAX_LOG_FILES = 50;

function timestampSlug(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/** Keep only the newest MAX_LOG_FILES runs per command prefix; never throws. */
function prune(logDir: string, prefix: string): void {
  try {
    const entries = fs
      .readdirSync(logDir)
      .filter(f => f.startsWith(`${prefix}-`) && f.endsWith('.log'))
      .map(f => ({ f, mtime: fs.statSync(path.join(logDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    for (const entry of entries.slice(MAX_LOG_FILES)) {
      fs.rmSync(path.join(logDir, entry.f), { force: true });
    }
  } catch {
    // Pruning must never break a run.
  }
}

/**
 * Structured per-run logger: tees ISO-timestamped lines to the console and a
 * gitignored `logs/<command>-<slug>.log` file. If the log file cannot be created
 * the logger degrades to console-only — a logging failure never crashes a CLI.
 */
export function createLogger(command: string): KbLogger {
  const prefix =
    command
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'cli';

  let stream: fs.WriteStream | null = null;
  let logFile: string | null = null;
  try {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    logFile = path.join(LOGS_DIR, `${prefix}-${timestampSlug()}.log`);
    stream = fs.createWriteStream(logFile, { flags: 'w' });
    stream.write(`# ${command} @ ${new Date().toISOString()}\n`);
    prune(LOGS_DIR, prefix);
  } catch {
    stream = null;
    logFile = null;
  }

  const write = (level: string, message: string): void => {
    if (stream) stream.write(`[${new Date().toISOString()}] [${level}] ${message}\n`);
    if (level === 'error') console.error(message);
    else if (level === 'warn') console.warn(message);
    else console.log(message);
  };

  return {
    get logFile(): string | null {
      return logFile;
    },
    section(title: string): void {
      write('section', `== ${title} ==`);
    },
    log(message: string): void {
      write('info', message);
    },
    warn(message: string): void {
      write('warn', message);
    },
    error(message: string): void {
      write('error', message);
    },
    startTimer(label: string): () => number {
      const started = Date.now();
      write('timer', `start ${label}`);
      return (): number => {
        const ms = Date.now() - started;
        write('timer', `end ${label} (${ms}ms)`);
        return ms;
      };
    },
    close(): void {
      try {
        stream?.end();
      } catch {
        // Ignore close errors.
      }
      stream = null;
    }
  };
}

/** Console-only logger for library calls that were not given one (creates no files). */
export function createConsoleLogger(): KbLogger {
  return {
    logFile: null,
    section: (title: string): void => {
      console.log(`== ${title} ==`);
    },
    log: (message: string): void => {
      console.log(message);
    },
    warn: (message: string): void => {
      console.warn(message);
    },
    error: (message: string): void => {
      console.error(message);
    },
    startTimer: (): (() => number) => {
      const started = Date.now();
      return (): number => Date.now() - started;
    },
    close: (): void => {
      // Nothing to close.
    }
  };
}
