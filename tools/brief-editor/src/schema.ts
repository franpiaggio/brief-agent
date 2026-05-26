import { z } from 'zod'

const OptionSchema = z.object({
  group_name: z.string(),
  label: z.string(),
  needed: z.boolean().nullable(),
  citation: z.string().nullable(),
})

const FieldSchema = z.object({
  key: z.string(),
  answer: z.string().nullable(),
  citation: z.string().nullable(),
  state: z.enum(['ok', 'vague', 'missing']),
})

const FlagSchema = z.object({
  type: z.enum(['custom', 'ideal_process', 'vague_answer']),
  description: z.string(),
  citation: z.string(),
})

const PendingItemSchema = z.object({
  description: z.string(),
  citation: z.string().nullable(),
})

const AdditionalNoteSchema = z.object({
  note: z.string(),
  citation: z.string(),
})

export const BlockSchema = z.object({
  id: z.number().int().min(1).max(10),
  name: z.string(),
  status: z.enum(['ok', 'warning', 'blocker']),
  status_reason: z.string(),
  options: z.array(OptionSchema),
  fields: z.array(FieldSchema),
  flags: z.array(FlagSchema).default([]),
  pending: z.array(PendingItemSchema),
  additional_notes: z.array(AdditionalNoteSchema).default([]),
})

export const BriefSchema = z.object({
  meta: z.object({
    client_name: z.string().nullable(),
    industry: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    meeting_date: z.string().nullable(),
  }),
  verdict: z.object({
    status: z.enum(['ready', 'ready_with_pending', 'blocked']),
    summary: z.string(),
    blockers_count: z.number().optional(),
    warnings_count: z.number().optional(),
    detail: z.string().nullable().optional(),
  }),
  custom: z.object({
    count: z.number(),
    items: z.array(z.object({
      description: z.string(),
      citation: z.string().nullable(),
    })),
  }).optional(),
  narrative: z.object({
    current_situation: z.string().nullable(),
    what_they_want: z.string().nullable(),
    closure: z.string().nullable().optional(),
  }),
  next_meeting: z.object({
    label: z.string().nullable(),
    summary: z.string().nullable(),
    date: z.string().nullable(),
    time: z.string().nullable(),
  }).optional(),
  coverage: z.object({
    blocks_covered: z.number(),
    blocks_total: z.number(),
  }).optional(),
  blocks: z.array(BlockSchema),
})

export type BriefData = z.infer<typeof BriefSchema>
