import { useRef, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { loadHtml } from '../loaders/loadHtml'
import { loadJson } from '../loaders/loadJson'
import './dropzone.css'

type DropzoneState = 'idle' | 'loading' | { error: string }

export function Dropzone() {
  const { dispatch, actions } = useBrief()
  const [status, setStatus] = useState<DropzoneState>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'html' && ext !== 'json') {
      setStatus({ error: 'Formato no soportado. Usá un archivo .html o .json' })
      return
    }

    setStatus('loading')
    try {
      const data = ext === 'html' ? await loadHtml(file) : await loadJson(file)
      dispatch(actions.loadBrief(data))
    } catch (err) {
      setStatus({ error: err instanceof Error ? err.message : 'Error desconocido' })
    }
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <main className="landing-body">
      <div className="landing-content">
        <div
          className="dropzone-card"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".html,.json"
            onChange={onInputChange}
            style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
            tabIndex={-1}
            aria-hidden="true"
          />

          <div className="dropzone-icon" aria-hidden="true">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M9 16l3-3 3 3" />
              <path d="M12 13v6" />
            </svg>
          </div>

          <div className="dropzone-eyebrow">Cargar reporte</div>
          <h1 className="dropzone-title">Soltá el brief para editar</h1>
          <p className="dropzone-sub">
            Acepta el HTML completo del brief (con su JSON embebido) o el JSON canónico suelto. Sin LLM, sin server: edición local, exportás el HTML actualizado.
          </p>

          {status === 'loading' ? (
            <button className="dropzone-cta" type="button" disabled>
              Cargando…
            </button>
          ) : (
            <button
              className="dropzone-cta"
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Elegir archivo
            </button>
          )}

          <div className={`dropzone-or${typeof status === 'object' ? ' dropzone-or--error' : ''}`}>
            {typeof status === 'object'
              ? status.error
              : 'o arrastralo a esta tarjeta'}
          </div>

          <div className="dropzone-formats">
            <span className="format-pill">.html</span>
            <span className="format-pill">.json</span>
          </div>
        </div>

        <div className="landing-tips">
          <div className="tip">
            <span className="tip-label">HTML</span>
            El brief tal cual lo emitió el agente. El editor lee el JSON embebido en <code>{'<script id="brief-source">'}</code> y lo usa como fuente de verdad.
          </div>
          <div className="tip">
            <span className="tip-label">JSON</span>
            El reporte sin renderizar. El editor lo monta sobre el template del verdict correspondiente y permite ajustarlo.
          </div>
        </div>
      </div>

      <footer className="landing-footer">
        Validación con Zod antes de montar · errores con la ruta exacta del campo
      </footer>
    </main>
  )
}
