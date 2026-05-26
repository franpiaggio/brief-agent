import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { BriefSchema } from './schema.js';
import { compute } from './compute.js';
import { getLucidePaths } from './lucide.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = resolve(__dirname, '../template.html');

// Register Lucide as a partial. When called as {{> lucide name=this.iconName}},
// Handlebars merges hash args INTO the context before invoking the function,
// so the icon name arrives as context.name (first argument), not options.hash.
Handlebars.registerPartial(
  'lucide',
  function (context: Record<string, unknown>) {
    return getLucidePaths((context?.name as string) ?? '');
  } as unknown as HandlebarsTemplateDelegate
);

// Cache compiled template (module-level singleton)
let compiled: HandlebarsTemplateDelegate | null = null;

function getTemplate(): HandlebarsTemplateDelegate {
  if (!compiled) {
    const src = readFileSync(TEMPLATE_PATH, 'utf-8');
    compiled = Handlebars.compile(src);
  }
  return compiled;
}

function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/-->/g, '--\\u003e');
}

export function renderBrief(rawJson: unknown): string {
  const brief = BriefSchema.parse(rawJson);
  const context = compute(brief);
  const sourceJson = safeJsonForScript(brief);
  return getTemplate()({ ...(context as Record<string, unknown>), sourceJson });
}
