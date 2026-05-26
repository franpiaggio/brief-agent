// Drops list items the agent emits with missing/empty required fields, so a
// single malformed pending/flag/note doesn't fail the whole render on Zod parse.

const FLAG_TYPES = new Set(['custom', 'ideal_process', 'vague_answer']);

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function nullableString(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

type DropCounts = {
  pending: number;
  flags: number;
  notes: number;
  customItems: number;
};

function sanitizeBlock(block: unknown, drops: DropCounts): unknown {
  if (!isObject(block)) return block;
  const out: Record<string, unknown> = { ...block };

  if (Array.isArray(block.pending)) {
    const kept: unknown[] = [];
    for (const item of block.pending) {
      if (isObject(item) && isNonEmptyString(item.description)) {
        kept.push({ description: item.description, citation: nullableString(item.citation) });
      } else {
        drops.pending += 1;
      }
    }
    out.pending = kept;
  }

  if (Array.isArray(block.flags)) {
    const kept: unknown[] = [];
    for (const item of block.flags) {
      if (
        isObject(item) &&
        typeof item.type === 'string' &&
        FLAG_TYPES.has(item.type) &&
        isNonEmptyString(item.description) &&
        isNonEmptyString(item.citation)
      ) {
        kept.push({ type: item.type, description: item.description, citation: item.citation });
      } else {
        drops.flags += 1;
      }
    }
    out.flags = kept;
  }

  if (Array.isArray(block.additional_notes)) {
    const kept: unknown[] = [];
    for (const item of block.additional_notes) {
      if (isObject(item) && isNonEmptyString(item.note) && isNonEmptyString(item.citation)) {
        kept.push({ note: item.note, citation: item.citation });
      } else {
        drops.notes += 1;
      }
    }
    out.additional_notes = kept;
  }

  return out;
}

export function sanitizeBrief(raw: unknown): unknown {
  if (!isObject(raw)) return raw;
  const out: Record<string, unknown> = { ...raw };
  const drops: DropCounts = { pending: 0, flags: 0, notes: 0, customItems: 0 };

  if (Array.isArray(raw.blocks)) {
    out.blocks = raw.blocks.map((b) => sanitizeBlock(b, drops));
  }

  if (isObject(raw.custom) && Array.isArray((raw.custom as Record<string, unknown>).items)) {
    const items = (raw.custom as Record<string, unknown>).items as unknown[];
    const kept: unknown[] = [];
    for (const item of items) {
      if (isObject(item) && isNonEmptyString(item.description)) {
        kept.push({ description: item.description, citation: nullableString(item.citation) });
      } else {
        drops.customItems += 1;
      }
    }
    out.custom = { ...(raw.custom as Record<string, unknown>), items: kept };
  }

  const dropped = drops.pending + drops.flags + drops.notes + drops.customItems;
  if (dropped > 0) {
    console.warn(
      `[sanitizeBrief] dropped malformed items: pending=${drops.pending} flags=${drops.flags} notes=${drops.notes} custom=${drops.customItems}`
    );
  }

  return out;
}
