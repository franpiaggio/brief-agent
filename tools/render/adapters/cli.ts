#!/usr/bin/env node
/**
 * Usage:
 *   cat brief.json | tsx adapters/cli.ts > output.html
 *   tsx adapters/cli.ts brief.json > output.html
 *   tsx adapters/cli.ts brief.json output.html
 */

import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { renderBrief } from '../core/render.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RENDER_ROOT = resolve(__dirname, '..');

function readInput(arg?: string): string {
  if (arg) return readFileSync(arg, 'utf-8');
  return readFileSync('/dev/stdin', 'utf-8');
}

function copyStaticAssets(outputPath: string): void {
  const outputDir = dirname(resolve(outputPath));
  const outputAssetsDir = resolve(outputDir, 'assets');
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(outputAssetsDir, { recursive: true });
  cpSync(resolve(RENDER_ROOT, 'styles.css'), resolve(outputDir, 'styles.css'));
  cpSync(resolve(RENDER_ROOT, 'assets'), outputAssetsDir, {
    recursive: true,
  });
}

const [, , inputArg, outputArg] = process.argv;

try {
  const raw = readInput(inputArg);
  const json = JSON.parse(raw);
  const html = renderBrief(json);

  if (outputArg) {
    copyStaticAssets(outputArg);
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
