import { useRef, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { loadHtml } from '../loaders/loadHtml'
import { loadJson } from '../loaders/loadJson'
import { loadPdf } from '../loaders/loadPdf'
import { BriefSchema } from '../schema'
import sampleBrief from '../sample-brief.json'
import './dropzone.css'

type DropzoneState = 'idle' | 'loading' | { error: string }

export function Dropzone() {
  const { dispatch, actions, hashLoadError, clearHashLoadError } = useBrief()
  const [status, setStatus] = useState<DropzoneState>(
    hashLoadError ? { error: hashLoadError } : 'idle',
  )
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'html' && ext !== 'json' && ext !== 'pdf') {
      setStatus({ error: 'Formato no soportado. Usá un archivo .html, .json o .pdf' })
      return
    }

    setStatus('loading')
    clearHashLoadError()
    try {
      const data =
        ext === 'html' ? await loadHtml(file) :
        ext === 'pdf'  ? await loadPdf(file)  :
                         await loadJson(file)
      dispatch(actions.loadBrief(data))
    } catch (err) {
      setStatus({ error: err instanceof Error ? err.message : 'Error desconocido' })
    }
  }

  function loadSample() {
    setStatus('loading')
    clearHashLoadError()
    try {
      const data = BriefSchema.parse(sampleBrief)
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
            accept=".html,.json,.pdf"
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

          <div className="dropzone-eyebrow">Editor de reporte</div>
          <h1 className="dropzone-title">Carga el reporte generado</h1>

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
              : 'o arrástralo a la tarjeta'}
          </div>

          <div className="dropzone-formats">
            <span className="format-pill">.html</span>
            <span className="format-pill">.json</span>
            <span className="format-pill">.pdf</span>
          </div>
        </div>

        <button
          type="button"
          className="dropzone-sample"
          onClick={loadSample}
          disabled={status === 'loading'}
        >
          Cargar informe de prueba
        </button>
      </div>
    </main>
  )
}
