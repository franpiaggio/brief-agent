import { z } from 'zod';

const BlockName = z.enum([
  'general_info',
  'classification',
  'workflow',
  'process_actors',
  'schedule_docks_warehouse',
  'orders_module',
  'fields_and_forms',
  'messages_notifications',
  'exceptions_integrations',
  'closure',
]);

const BlockStatus = z.enum(['ok', 'warning', 'blocker']);

const OptionSchema = z.object({
  group_name: z.string(),
  label: z.string(),
  needed: z.boolean().nullable(),
  citation: z.string().nullable(),
});

const FieldSchema = z.object({
  key: z.string(),
  answer: z.string().nullable(),
  citation: z.string().nullable(),
  state: z.enum(['ok', 'vague', 'missing']),
});

const PendingSchema = z.object({
  description: z.string(),
  citation: z.string().nullable(),
});

const FlagSchema = z.object({
  type: z.enum(['custom', 'ideal_process', 'vague_answer']),
  description: z.string(),
  citation: z.string(),
});

const CustomItemSchema = z.object({
  description: z.string(),
  citation: z.string().nullable().optional(),
});

const BlockSchema = z.object({
  id: z.number().int().min(1).max(10),
  name: BlockName,
  status: BlockStatus,
  status_reason: z.string(),
  options: z.array(OptionSchema).default([]),
  fields: z.array(FieldSchema).default([]),
  additional_notes: z
    .array(z.object({ note: z.string(), citation: z.string() }))
    .default([]),
  flags: z.array(FlagSchema).default([]),
  pending: z.array(PendingSchema).default([]),
});

export const BriefSchema = z.object({
  meta: z.object({
    client_name: z.string().nullable(),
    industry: z.string().nullable(),
    country: z.string().nullable(),
    meeting_date: z.string(),
  }),
  verdict: z.object({
    status: z.enum(['ready', 'ready_with_pending', 'blocked']),
    summary: z.string(),
    blockers_count: z.number().int(),
    warnings_count: z.number().int(),
    detail: z.string().nullable().optional(),
  }),
  custom: z.object({
    count: z.number().int(),
    items: z.array(CustomItemSchema),
  }),
  narrative: z.object({
    current_situation: z.string().nullable(),
    what_they_want: z.string().nullable(),
    closure: z.string().nullable().optional(),
  }),
  next_meeting: z
    .object({
      label: z.string(),
      summary: z.string(),
      date: z.string(),
      time: z.string().nullable().optional(),
    })
    .optional(),
  coverage: z
    .object({
      blocks_covered: z.number().int(),
      blocks_total: z.number().int(),
    })
    .optional(),
  blocks: z.array(BlockSchema).length(10),
});

export type Brief = z.infer<typeof BriefSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Field = z.infer<typeof FieldSchema>;
export type Option = z.infer<typeof OptionSchema>;
