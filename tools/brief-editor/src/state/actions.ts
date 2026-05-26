import type { BriefData, NextMeeting } from '../types'

export type Action =
  | { type: 'SET_FIELD'; path: string; value: string }
  | { type: 'TOGGLE_CHIP'; blockIdx: number; groupName: string; label: string }
  | { type: 'SET_OPTION'; blockIdx: number; groupName: string; label: string; needed?: boolean | null; citation?: string | null }
  | { type: 'ADD_PENDING'; blockIdx: number }
  | { type: 'REMOVE_PENDING'; blockIdx: number; pendingIdx: number }
  | { type: 'UPSERT_PENDING'; blockIdx: number; itemIdx: number | null; description: string; citation: string | null }
  | { type: 'ADD_CUSTOM' }
  | { type: 'REMOVE_CUSTOM'; customIdx: number }
  | { type: 'UPSERT_CUSTOM'; itemIdx: number | null; description: string; citation: string | null }
  | { type: 'SET_BLOCK_STATUS'; blockIdx: number; status: 'ok' | 'warning' | 'blocker' }
  | { type: 'SET_VERDICT_STATUS'; status: string }
  | { type: 'SET_NEXT_MEETING'; value: NextMeeting | null }
  | { type: 'LOAD_BRIEF'; data: BriefData }
  | { type: 'RESET' }

export const actions = {
  setField: (path: string, value: string): Action => ({ type: 'SET_FIELD', path, value }),

  toggleChip: (blockIdx: number, groupName: string, label: string): Action => ({
    type: 'TOGGLE_CHIP',
    blockIdx,
    groupName,
    label,
  }),

  setOption: (
    blockIdx: number,
    groupName: string,
    label: string,
    partial: { needed?: boolean | null; citation?: string | null },
  ): Action => ({ type: 'SET_OPTION', blockIdx, groupName, label, ...partial }),

  addPending: (blockIdx: number): Action => ({ type: 'ADD_PENDING', blockIdx }),

  removePending: (blockIdx: number, pendingIdx: number): Action => ({
    type: 'REMOVE_PENDING',
    blockIdx,
    pendingIdx,
  }),

  upsertPending: (
    blockIdx: number,
    itemIdx: number | null,
    description: string,
    citation: string | null,
  ): Action => ({ type: 'UPSERT_PENDING', blockIdx, itemIdx, description, citation }),

  addCustom: (): Action => ({ type: 'ADD_CUSTOM' }),

  removeCustom: (customIdx: number): Action => ({ type: 'REMOVE_CUSTOM', customIdx }),

  upsertCustom: (itemIdx: number | null, description: string, citation: string | null): Action => ({
    type: 'UPSERT_CUSTOM',
    itemIdx,
    description,
    citation,
  }),

  setBlockStatus: (blockIdx: number, status: 'ok' | 'warning' | 'blocker'): Action => ({
    type: 'SET_BLOCK_STATUS',
    blockIdx,
    status,
  }),

  setVerdictStatus: (status: string): Action => ({ type: 'SET_VERDICT_STATUS', status }),

  setNextMeeting: (value: NextMeeting | null): Action => ({ type: 'SET_NEXT_MEETING', value }),

  loadBrief: (data: BriefData): Action => ({ type: 'LOAD_BRIEF', data }),

  reset: (): Action => ({ type: 'RESET' }),
}
