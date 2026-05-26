import type { z } from 'zod'
import type { BriefSchema, BlockSchema } from './schema'

export type BriefData = z.infer<typeof BriefSchema>
export type Block = z.infer<typeof BlockSchema>
export type Meta = BriefData['meta']
export type Verdict = BriefData['verdict']
export type VerdictStatus = Verdict['status']
export type BlockStatus = Block['status']
export type Narrative = BriefData['narrative']
export type NextMeeting = NonNullable<BriefData['next_meeting']>
export type Option = Block['options'][number]
export type Field = Block['fields'][number]
export type PendingItem = Block['pending'][number]
export type CustomItem = NonNullable<BriefData['custom']>['items'][number]
export type Flag = Block['flags'][number]
