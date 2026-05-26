import type { Brief, Block } from './schema.js';
import {
  VERDICT_MAP,
  BLOCK_MAP,
  STATUS_MAP,
  OPTION_GROUP_LABEL,
  FIELD_LABEL,
  IDENTITY_CARD_CONFIG,
  IDENTITY_CARD_ORDER,
  NEEDED_CLASS,
} from './mappings.js';

const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function formatDateEs(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;

  const [, year, month, day] = match;
  const m = Number(month);
  const monthLabel = MONTHS_ES[m - 1];
  if (!monthLabel) return iso;

  return `${Number(day)} ${monthLabel} ${year}`;
}

function padId(n: number): string {
  return String(n).padStart(2, '0');
}

function neededClass(needed: boolean | null): string {
  if (needed === true) return NEEDED_CLASS['true'];
  if (needed === false) return NEEDED_CLASS['false'];
  return NEEDED_CLASS['null'];
}

function computeIdentityCards(block: Block): unknown[] {
  const fieldMap = Object.fromEntries(block.fields.map((f) => [f.key, f]));
  return IDENTITY_CARD_ORDER.map((key) => {
    const cfg = IDENTITY_CARD_CONFIG[key];
    if (!cfg) return null;
    const field = fieldMap[key];
    const missing = !field || field.state === 'missing' || field.answer === null;
    return {
      cardClass: cfg.cardClass,
      iconName: cfg.iconName,
      label: cfg.label,
      value: field?.answer ?? null,
      missing,
    };
  }).filter(Boolean);
}

function computeFieldsForRender(block: Block): unknown[] {
  const labels = FIELD_LABEL[block.name] ?? {};
  return block.fields.map((f) => ({
    label: labels[f.key] ?? f.key,
    value: f.answer,
    missing: f.state === 'missing' || f.answer === null,
  }));
}

function computeOptionsForBlock(block: Block): unknown[] {
  const groups = new Map<string, { label: string; needed: boolean | null; citation: string | null }[]>();
  for (const opt of block.options) {
    const existing = groups.get(opt.group_name);
    const item = { label: opt.label, needed: opt.needed, citation: opt.citation };
    if (existing) {
      existing.push(item);
    } else {
      groups.set(opt.group_name, [item]);
    }
  }
  return Array.from(groups.entries()).map(([groupName, items]) => ({
    groupLabel: OPTION_GROUP_LABEL[groupName] ?? groupName,
    items: items.map((item) => ({
      label: item.label,
      neededClass: neededClass(item.needed),
    })),
  }));
}

function enrichBlock(block: Block): unknown {
  const blockMeta = BLOCK_MAP[block.name];
  const statusMeta = STATUS_MAP[block.status];
  const isBlock1 = block.id === 1;
  const options = computeOptionsForBlock(block);

  return {
    ...block,
    idPadded: padId(block.id),
    iconName: blockMeta?.iconName ?? 'circle',
    title: blockMeta?.title ?? block.name,
    shortName: blockMeta?.shortName ?? block.name,
    statusLabel: statusMeta?.label ?? block.status,
    reasonIconName: statusMeta?.reasonIconName ?? '',
    isBlock1,
    identityCards: isBlock1 ? computeIdentityCards(block) : [],
    fieldsForRender: isBlock1 ? [] : computeFieldsForRender(block),
    options,
  };
}

function computeBlocksWithOptions(enrichedBlocks: ReturnType<typeof enrichBlock>[]): unknown[] {
  return (enrichedBlocks as Array<{
    id: number;
    idPadded: string;
    title: string;
    options: unknown[];
  }>)
    .filter((b) => Array.isArray(b.options) && b.options.length > 0)
    .map((b) => ({
      idPadded: b.idPadded,
      title: b.title,
      options: b.options,
    }));
}

function computePendingFlat(brief: Brief, enrichedBlocks: unknown[]): unknown[] {
  const flat: unknown[] = [];
  const sorted = [...brief.blocks].sort((a, b) => a.id - b.id);
  for (const block of sorted) {
    const blockMeta = BLOCK_MAP[block.name];
    const sourceLabel = `${padId(block.id)} · ${blockMeta?.title ?? block.name}`;
    for (const p of block.pending) {
      flat.push({
        description: p.description,
        citation: p.citation,
        sourceLabel,
      });
    }
  }
  return flat;
}

export interface RenderContext {
  meta: Brief['meta'];
  verdict: Brief['verdict'];
  custom: Brief['custom'];
  narrative: Brief['narrative'];
  next_meeting?: Brief['next_meeting'];
  coverage?: Brief['coverage'];
  blocks: unknown[];
  computed: {
    verdict_class: string;
    verdict_label: string;
    summary_color_class: string;
    pending_total: number;
    ok_count: number;
    warning_count: number;
    blocker_count: number;
    blocks_with_options: unknown[];
    pending_flat: unknown[];
    has_any_actions: boolean;
    has_any_narrative: boolean;
    coverage_percent: number | null;
    next_meeting_date_display: string | null;
  };
}

export function compute(brief: Brief): RenderContext {
  const sorted = [...brief.blocks].sort((a, b) => a.id - b.id);
  const enrichedBlocks = sorted.map(enrichBlock);

  const verdictMeta = VERDICT_MAP[brief.verdict.status] ?? {
    cssClass: brief.verdict.status,
    label: brief.verdict.status,
    summaryColorClass: 'ok',
  };

  const pendingTotal = brief.blocks.reduce(
    (sum, b) => sum + b.pending.length,
    0
  );
  const okCount = brief.blocks.filter((b) => b.status === 'ok').length;
  const warningCount = brief.blocks.filter((b) => b.status === 'warning').length;
  const blockerCount = brief.blocks.filter((b) => b.status === 'blocker').length;

  const blocksWithOptions = computeBlocksWithOptions(
    enrichedBlocks as Parameters<typeof computeBlocksWithOptions>[0]
  );
  const pendingFlat = computePendingFlat(brief, enrichedBlocks);

  const hasAnyActions = pendingTotal > 0 || brief.custom.count > 0;

  const { current_situation, what_they_want, closure } = brief.narrative;
  const hasAnyNarrative =
    current_situation !== null ||
    what_they_want !== null ||
    (closure !== null && closure !== undefined);

  const coveragePct = brief.coverage
    ? Math.round(
        (brief.coverage.blocks_covered / brief.coverage.blocks_total) * 100
      )
    : null;

  const nextMeetingDateDisplay = brief.next_meeting?.date
    ? formatDateEs(brief.next_meeting.date)
    : null;

  return {
    meta: {
      ...brief.meta,
      client_name: brief.meta.client_name ?? 'Cliente sin nombre',
    },
    verdict: brief.verdict,
    custom: brief.custom,
    narrative: brief.narrative,
    next_meeting: brief.next_meeting,
    coverage: brief.coverage,
    blocks: enrichedBlocks,
    computed: {
      verdict_class: verdictMeta.cssClass,
      verdict_label: verdictMeta.label,
      summary_color_class: verdictMeta.summaryColorClass,
      pending_total: pendingTotal,
      ok_count: okCount,
      warning_count: warningCount,
      blocker_count: blockerCount,
      blocks_with_options: blocksWithOptions,
      pending_flat: pendingFlat,
      has_any_actions: hasAnyActions,
      has_any_narrative: hasAnyNarrative,
      coverage_percent: coveragePct,
      next_meeting_date_display: nextMeetingDateDisplay,
    },
  };
}
