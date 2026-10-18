#!/usr/bin/env node
import { TESTS_DIR } from './kb-config.ts';
import { loadUnits } from './kb-body.ts';
import { createLogger } from './kb-log.ts';

/**
 * Built-in reusable test suite runner for the agents-kb CLI. Discovers
 * `tests/*.test.ts` via `loadUnits()`, runs each in sorted order, and exits
 * non-zero if any test throws. Tests are permanent suite members (never
 * throw-away bodies); each creates its own temp DBs via `AGENTS_KB_PATH`.
 */
const logger = createLogger('test');
logger.section('agents-kb test suite');

const tests = await loadUnits(TESTS_DIR, '.test.ts');
logger.log(`tests discovered: ${tests.length}`);

let passed = 0;
let failed = 0;
for (const test of tests) {
  const timer = logger.startTimer(test.name);
  try {
    await test.run({ logger });
    logger.log(`PASS ${test.name} (${timer()}ms)`);
    passed += 1;
  } catch (err) {
    logger.error(`FAIL ${test.name} (${timer()}ms): ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`);
    failed += 1;
  }
}

logger.section('summary');
logger.log(`${passed} passed, ${failed} failed (${tests.length} tests)`);
logger.close();
if (failed > 0) process.exit(1);
