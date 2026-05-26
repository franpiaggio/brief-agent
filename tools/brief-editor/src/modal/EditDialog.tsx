import { useEffect, useRef } from 'react'
import { useModal } from './ModalContext'

type Props = {
  title: string
  subtitle?: string
  onApply: () => void
  applyDisabled?: boolean
  applyLabel?: string
  children: React.ReactNode
}

export function EditDialog({ title, subtitle, onApply, applyDisabled, applyLabel = 'Aplicar', children }: Props) {
  const { closeModal } = useModal()
  const panelRef = useRef<HTMLDivElement>(null)
  const onApplyRef = useRef(onApply)
  const applyDisabledRef = useRef(applyDisabled)
  onApplyRef.current = onApply
  applyDisabledRef.current = applyDisabled

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const firstField = panelRef.current?.querySelector<HTMLElement>(
      'input, textarea, select, button[data-modal-primary]',
    )
    firstField?.focus()
    return () => {
      previousFocus?.focus?.()
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!applyDisabledRef.current) {
          onApplyRef.current()
        }
        return
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return
        const focusables = panel.querySelectorAll<HTMLElement>(
          'input, textarea, select, button, [tabindex]:not([tabindex="-1"])',
        )
        const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'))
        if (list.length === 0) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        </header>

        <div className="modal-body">{children}</div>

        <footer className="modal-footer">
          <button type="button" className="btn btn--ghost" onClick={closeModal}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onApply}
            disabled={applyDisabled}
            data-modal-primary
          >
            {applyLabel}
          </button>
        </footer>
      </div>
    </div>
  )
}
