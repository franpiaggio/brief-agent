import type { BriefData } from '../types'
import type { Action } from './actions'

function setPath(obj: unknown, path: string, value: unknown): unknown {
  const keys = path.split('.')
  const key = keys[0]

  if (keys.length === 1) {
    if (Array.isArray(obj)) {
      const idx = Number(key)
      const next = [...(obj as unknown[])]
      next[idx] = value
      return next
    }
    return { ...(obj as Record<string, unknown>), [key]: value }
  }

  if (Array.isArray(obj)) {
    const idx = Number(key)
    const next = [...(obj as unknown[])]
    next[idx] = setPath(next[idx], keys.slice(1).join('.'), value)
    return next
  }

  const record = obj as Record<string, unknown>
  return {
    ...record,
    [key]: setPath(record[key], keys.slice(1).join('.'), value),
  }
}

function cycleNeeded(current: boolean | null): boolean | null {
  if (current === true) return false
  if (current === false) return null
  return true
}

export function reducer(state: BriefData | null, action: Action): BriefData | null {
  if (action.type === 'LOAD_BRIEF') {
    return action.data
  }

  if (action.type === 'RESET') {
    return null
  }

  if (state === null) return state

  switch (action.type) {
    case 'SET_FIELD': {
      return setPath(state, action.path, action.value) as BriefData
    }

    case 'TOGGLE_CHIP': {
      const blocks = state.blocks.map((block, idx) => {
        if (idx !== action.blockIdx) return block
        const options = block.options.map((opt) => {
          if (opt.group_name !== action.groupName || opt.label !== action.label) return opt
          return { ...opt, needed: cycleNeeded(opt.needed) }
        })
        return { ...block, options }
      })
      return { ...state, blocks }
    }

    case 'SET_OPTION': {
      const blocks = state.blocks.map((block, idx) => {
        if (idx !== action.blockIdx) return block
        const options = block.options.map((opt) => {
          if (opt.group_name !== action.groupName || opt.label !== action.label) return opt
          return {
            ...opt,
            ...(action.needed !== undefined ? { needed: action.needed } : {}),
            ...(action.citation !== undefined ? { citation: action.citation } : {}),
          }
        })
        return { ...block, options }
      })
      return { ...state, blocks }
    }

    case 'UPSERT_PENDING': {
      const blocks = state.blocks.map((block, idx) => {
        if (idx !== action.blockIdx) return block
        const newItem = { description: action.description, citation: action.citation }
        const pending =
          action.itemIdx === null
            ? [...block.pending, newItem]
            : block.pending.map((item, i) => (i === action.itemIdx ? newItem : item))
        return { ...block, pending }
      })
      return { ...state, blocks }
    }

    case 'UPSERT_CUSTOM': {
      const current = state.custom ?? { count: 0, items: [] }
      const newItem = { description: action.description, citation: action.citation }
      const items =
        action.itemIdx === null
          ? [...current.items, newItem]
          : current.items.map((item, i) => (i === action.itemIdx ? newItem : item))
      return {
        ...state,
        custom: { count: items.length, items },
      }
    }

    case 'SET_NEXT_MEETING': {
      return { ...state, next_meeting: action.value ?? undefined }
    }

    case 'ADD_PENDING': {
      const blocks = state.blocks.map((block, idx) => {
        if (idx !== action.blockIdx) return block
        return {
          ...block,
          pending: [...block.pending, { description: '', citation: null }],
        }
      })
      return { ...state, blocks }
    }

    case 'REMOVE_PENDING': {
      const blocks = state.blocks.map((block, idx) => {
        if (idx !== action.blockIdx) return block
        const pending = block.pending.filter((_, i) => i !== action.pendingIdx)
        return { ...block, pending }
      })
      return { ...state, blocks }
    }

    case 'ADD_CUSTOM': {
      const current = state.custom ?? { count: 0, items: [] }
      return {
        ...state,
        custom: {
          count: current.count + 1,
          items: [...current.items, { description: '', citation: null }],
        },
      }
    }

    case 'REMOVE_CUSTOM': {
      const current = state.custom ?? { count: 0, items: [] }
      const items = current.items.filter((_, i) => i !== action.customIdx)
      return {
        ...state,
        custom: { count: items.length, items },
      }
    }

    case 'SET_BLOCK_STATUS': {
      const blocks = state.blocks.map((block, idx) => {
        if (idx !== action.blockIdx) return block
        return { ...block, status: action.status }
      })
      return { ...state, blocks }
    }

    case 'SET_VERDICT_STATUS': {
      return {
        ...state,
        verdict: { ...state.verdict, status: action.status as BriefData['verdict']['status'] },
      }
    }
  }
}
