import { createContext, use, useCallback, useState } from 'react'

export type ModalState =
  | { type: 'text'; path: string; label: string; multiline?: boolean; citationPath?: string; placeholder?: string }
  | { type: 'field'; blockIdx: number; fieldIdx: number }
  | { type: 'block-status'; blockIdx: number }
  | { type: 'verdict' }
  | { type: 'option-group'; blockIdx: number; groupName: string }
  | { type: 'pending'; blockIdx: number; itemIdx: number | null }
  | { type: 'custom'; itemIdx: number | null }
  | { type: 'next-meeting' }

type ModalContextValue = {
  modal: ModalState | null
  openModal: (modal: ModalState) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState | null>(null)
  const openModal = useCallback((next: ModalState) => setModal(next), [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <ModalContext value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext>
  )
}

export function useModal() {
  const ctx = use(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
