import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'
import { VERDICT_DEFS } from '../constants/verdictDefs'
import type { VerdictStatus } from '../types'

export function EditVerdictDialog() {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const verdict = state?.verdict

  const [status, setStatus] = useState<VerdictStatus>(verdict?.status ?? 'ready')
  const [summary, setSummary] = useState(verdict?.summary ?? '')
  const [detail, setDetail] = useState(verdict?.detail ?? '')

  useEffect(() => {
    if (!verdict) return
    setStatus(verdict.status)
    setSummary(verdict.summary)
    setDetail(verdict.detail ?? '')
  }, [verdict])

  if (!verdict) return null

  function handleApply() {
    dispatch(actions.setVerdictStatus(status))
    dispatch(actions.setField('verdict.summary', summary))
    dispatch(actions.setField('verdict.detail', detail))
    closeModal()
  }

  return (
    <EditDialog title="Verdict" subtitle="Cambia el estado, resumen y detalle del verdict" onApply={handleApply}>
      <fieldset className="modal-field modal-field--state">
        <legend className="modal-field-label">Estado</legend>
        <div className="modal-state-row modal-state-row--verdict">
          {VERDICT_DEFS.map((v) => (
            <label key={v.status} className={`modal-state-option modal-state-option--verdict-${v.cssClass}${status === v.status ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="verdict-status"
                value={v.status}
                checked={status === v.status}
                onChange={() => setStatus(v.status)}
              />
              <span>{v.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="modal-field">
        <span className="modal-field-label">Resumen</span>
        <input
          className="modal-input"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Ej: 2 bloqueantes, 3 avisos"
        />
      </label>

      <label className="modal-field">
        <span className="modal-field-label">Detalle</span>
        <textarea
          className="modal-textarea"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Sub-línea que expande el verdict"
          rows={3}
        />
      </label>
    </EditDialog>
  )
}
