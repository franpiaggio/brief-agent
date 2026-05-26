import { useEffect, useRef, useState } from 'react'

type Props = {
  jsonFilename: string
  onDownloadJson: () => void
  onConfirm: () => void
  onCancel: () => void
}

export function ExportPdfWarningDialog({ jsonFilename, onDownloadJson, onConfirm, onCancel }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [jsonDownloaded, setJsonDownloaded] = useState(false)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>('button[data-modal-primary]')?.focus()
    return () => {
      previousFocus?.focus?.()
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return
        const list = Array.from(
          panel.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.hasAttribute('disabled'))
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
  }, [onCancel])

  function handleDownloadJson() {
    onDownloadJson()
    setJsonDownloaded(true)
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        ref={panelRef}
        className="modal-panel modal-panel--export"
        role="dialog"
        aria-modal="true"
        aria-label="Exportar PDF"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <span className="modal-eyebrow">EXPORTAR PDF</span>
          <h2 className="modal-title">Conservá el archivo de edición</h2>
          <p className="modal-subtitle">
            El PDF es la entrega final, pero no se puede re-abrir en el editor. Para volver a editar este
            brief en el futuro necesitás guardar también el <code>.json</code>.
          </p>
        </header>

        <div className="modal-body">
          <button
            type="button"
            className={`export-json-action${jsonDownloaded ? ' is-confirmed' : ''}`}
            onClick={handleDownloadJson}
          >
            <span className="export-json-action-icon" aria-hidden="true">
              {jsonDownloaded ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </span>
            <span className="export-json-action-text">
              <span className="export-json-action-label">
                {jsonDownloaded ? 'JSON descargado' : 'Descargar JSON de edición'}
              </span>
              <span className="export-json-action-filename">{jsonFilename}</span>
            </span>
          </button>
        </div>

        <footer className="modal-footer">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onConfirm}
            data-modal-primary
          >
            Exportar PDF
          </button>
        </footer>
      </div>
    </div>
  )
}
