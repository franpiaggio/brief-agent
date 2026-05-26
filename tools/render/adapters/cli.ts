#!/usr/bin/env node
/**
 * Usage:
 *   cat brief.json | tsx adapters/cli.ts > output.html
 *   tsx adapters/cli.ts brief.json > output.html
 *   tsx adapters/cli.ts brief.json output.html
 */

import { readFileSync, writeFileSync } from 'fs';
import { renderBrief } from '../core/render.js';

function readInput(arg?: string): string {
  if (arg) return readFileSync(arg, 'utf-8');
  // stdin
  return readFileSync('/dev/stdin', 'utf-8');
}

const [, , inputArg, outputArg] = process.argv;

try {
  const raw = readInput(inputArg);
  const json = JSON.parse(raw);
  const html = renderBrief(json);

  if (outputArg) {
    writeFileSync(outputArg, html, 'utf-8');
    process.stderr.write(`✓ ${outputArg}\n`);
  } else {
    process.stdout.write(html);
  }
} catch (err) {
  process.stderr.write(`Error: ${(err as Error).message}\n`);
  if (err instanceof Error && err.stack) {
    process.stderr.write(err.stack + '\n');
  }
  process.exit(1);
}
