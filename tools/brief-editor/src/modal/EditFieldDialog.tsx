import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'
import { fieldLabel } from '../constants/fieldLabels'
import { FIELD_STATE_LABELS } from '../constants/groupLabels'
import type { Field } from '../types'

type Props = {
  blockIdx: number
  fieldIdx: number
}

export function EditFieldDialog({ blockIdx, fieldIdx }: Props) {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const field = state?.blocks[blockIdx]?.fields[fieldIdx]

  const [answer, setAnswer] = useState(field?.answer ?? '')
  const [citation, setCitation] = useState(field?.citation ?? '')
  const [fieldState, setFieldState] = useState<Field['state']>(field?.state ?? 'ok')

  useEffect(() => {
    setAnswer(field?.answer ?? '')
    setCitation(field?.citation ?? '')
    setFieldState(field?.state ?? 'ok')
  }, [field])

  if (!field) return null

  function handleApply() {
    if (!field) return
    const basePath = `blocks.${blockIdx}.fields.${fieldIdx}`
    dispatch(actions.setField(`${basePath}.answer`, answer))
    dispatch(actions.setField(`${basePath}.citation`, citation))
    dispatch(actions.setField(`${basePath}.state`, fieldState))
    closeModal()
  }

  return (
    <EditDialog title={fieldLabel(field.key)} subtitle="Respuesta del cliente, cita y nivel de confianza" onApply={handleApply}>
      <label className="modal-field">
        <span className="modal-field-label">Respuesta</span>
        <textarea
          className="modal-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
        />
      </label>

      <label className="modal-field">
        <span className="modal-field-label">Cita del transcript</span>
        <textarea
          className="modal-textarea modal-textarea--cite"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
          placeholder="Frase literal que respalda esta respuesta"
          rows={3}
        />
      </label>

      <fieldset className="modal-field modal-field--state">
        <legend className="modal-field-label">Confianza</legend>
        <div className="modal-state-row">
          {(['ok', 'vague', 'missing'] as const).map((s) => (
            <label key={s} className={`modal-state-option modal-state-option--${s}${fieldState === s ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="field-state"
                value={s}
                checked={fieldState === s}
                onChange={() => setFieldState(s)}
              />
              <span>{FIELD_STATE_LABELS[s]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </EditDialog>
  )
}
