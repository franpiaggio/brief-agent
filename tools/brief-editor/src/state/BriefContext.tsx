import { createContext, use, useCallback, useEffect, useReducer, useState } from 'react'
import type { Dispatch } from 'react'
import type { BriefData } from '../types'
import { actions } from './actions'
import type { Action } from './actions'
import { reducer } from './reducer'

type BriefContextValue = {
  state: BriefData | null
  actions: typeof actions
  dispatch: Dispatch<Action>
  isDirty: boolean
  markExported: () => void
  resetEditor: () => void
}

export const BriefContext = createContext<BriefContextValue | null>(null)

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, null)
  const [isDirty, setIsDirty] = useState(false)

  const dispatch = useCallback<Dispatch<Action>>((action) => {
    rawDispatch(action)
    if (action.type === 'LOAD_BRIEF' || action.type === 'RESET') {
      setIsDirty(false)
    } else {
      setIsDirty(true)
    }
  }, [])

  const markExported = useCallback(() => setIsDirty(false), [])

  const resetEditor = useCallback(() => {
    rawDispatch({ type: 'RESET' })
    setIsDirty(false)
  }, [])

  useEffect(() => {
    if (!isDirty) return
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  return (
    <BriefContext value={{ state, dispatch, actions, isDirty, markExported, resetEditor }}>
      {children}
    </BriefContext>
  )
}

export function useBrief() {
  const ctx = use(BriefContext)
  if (!ctx) throw new Error('useBrief must be used within BriefProvider')
  return ctx
}
