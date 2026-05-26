import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { toHtml } from '../export/toHtml'
import { downloadHtml, buildFilename } from '../export/downloadHtml'
import { downloadPdf } from '../export/downloadPdf'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { VERDICT_DEFS, VERDICT_BY_STATUS } from '../constants/verdictDefs'
import { BLOCK_STATUS_LABELS } from '../constants/groupLabels'

export function Toolbar() {
  const { state, dispatch, actions, isDirty, markExported, resetEditor } = useBrief()
  const [blocksOpen, setBlocksOpen] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        handleExport()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!state) return null

  const filename = buildFilename(state).replace(/\.html$/, '')
  const verdictDef = VERDICT_BY_STATUS[state.verdict.status]

  async function handleExport() {
    if (!state) return
    const html = await toHtml(state)
    downloadHtml(html, buildFilename(state))
    markExported()
  }

  async function handleExportPdf() {
    if (!state || pdfLoading) return
    setPdfLoading(true)
    try {
      await downloadPdf(state)
      markExported()
    } finally {
      setPdfLoading(false)
    }
  }

  function handleReset() {
    if (isDirty) {
      const ok = window.confirm('Hay cambios sin exportar. ¿Querés descartarlos y cargar otro brief?')
      if (!ok) return
    }
    resetEditor()
  }

  function handleVerdictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(actions.setVerdictStatus(e.target.value))
  }

  function jumpToBlock(blockId: number) {
    setBlocksOpen(false)
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.preview-iframe')
    const target = iframe?.contentDocument?.querySelector<HTMLElement>(`[data-block-id="${blockId}"]`)
    if (target && iframe?.contentDocument) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">brief editor</span>
        </div>
        <span className="brand-sep" aria-hidden="true">/</span>
        <span className="file-name">
          {filename}<span className="file-name-ext">.html</span>
        </span>
      </div>

      <div className="toolbar-right">
        <label className={`toolbar-select toolbar-select--verdict verdict-pill--${verdictDef?.cssClass ?? 'ready'}`}>
          <span className="toolbar-select-text">{verdictDef?.label ?? state.verdict.status}</span>
          <select value={state.verdict.status} onChange={handleVerdictChange}>
            {VERDICT_DEFS.map((v) => (
              <option key={v.status} value={v.status}>{v.label}</option>
            ))}
          </select>
          <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </label>

        <div className="toolbar-dropdown">
          <button
            type="button"
            className="toolbar-dropdown-trigger"
            aria-expanded={blocksOpen}
            onClick={() => setBlocksOpen((v) => !v)}
            onBlur={() => setTimeout(() => setBlocksOpen(false), 120)}
          >
            <span>Bloques</span>
            <span className="toolbar-dropdown-count">{state.blocks.length}</span>
            <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {blocksOpen && (
            <div className="toolbar-dropdown-menu" role="menu">
              {state.blocks.map((block, idx) => {
                const def = BLOCK_DEFS[idx]
                return (
                  <button
                    key={block.id}
                    type="button"
                    className="toolbar-dropdown-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => jumpToBlock(block.id)}
                  >
                    <span className="toolbar-dropdown-num">{String(block.id).padStart(2, '0')}</span>
                    <span className="toolbar-dropdown-name">{def?.label ?? `Bloque ${block.id}`}</span>
                    <span className={`block-status block-status--${block.status}`}>
                      {BLOCK_STATUS_LABELS[block.status]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <span className="toolbar-divider" aria-hidden="true" />

        <span className={`toolbar-status toolbar-status--${isDirty ? 'dirty' : 'clean'}`}>
          {isDirty ? 'Sin exportar' : 'Documento exportado'}
        </span>

        <button className="btn btn--ghost" type="button" onClick={handleReset}>
          Cargar otro
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={handleExportPdf}
          disabled={pdfLoading}
          title="Exportar PDF (con JSON embebido para seguir editando)"
        >
          {pdfLoading ? (
            'Generando…'
          ) : (
            <>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
                <path d="M9 8h1" />
              </svg>
              Exportar PDF
            </>
          )}
        </button>
        <button className="btn btn--primary" type="button" onClick={handleExport} title="Exportar (⌘E)">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar HTML
        </button>
      </div>
    </header>
  )
}
