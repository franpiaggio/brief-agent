import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'

export function EditNextMeetingDialog() {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const meeting = state?.next_meeting ?? null

  const [label, setLabel] = useState(meeting?.label ?? '')
  const [summary, setSummary] = useState(meeting?.summary ?? '')
  const [date, setDate] = useState(meeting?.date ?? '')
  const [time, setTime] = useState(meeting?.time ?? '')

  useEffect(() => {
    setLabel(meeting?.label ?? '')
    setSummary(meeting?.summary ?? '')
    setDate(meeting?.date ?? '')
    setTime(meeting?.time ?? '')
  }, [meeting])

  function handleApply() {
    if (!label && !summary && !date) {
      dispatch(actions.setNextMeeting(null))
    } else {
      dispatch(actions.setNextMeeting({
        label: label || null,
        summary: summary || null,
        date: date || null,
        time: time || null,
      }))
    }
    closeModal()
  }

  function handleRemove() {
    dispatch(actions.setNextMeeting(null))
    closeModal()
  }

  return (
    <EditDialog title="Próxima reunión" onApply={handleApply}>
      <label className="modal-field">
        <span className="modal-field-label">Encabezado</span>
        <input
          className="modal-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ej: Próxima reunión"
        />
      </label>

      <label className="modal-field">
        <span className="modal-field-label">Resumen</span>
        <textarea
          className="modal-textarea"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Qué se va a tratar"
          rows={3}
        />
      </label>

      <div className="modal-field-row">
        <label className="modal-field">
          <span className="modal-field-label">Fecha</span>
          <input
            className="modal-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="modal-field">
          <span className="modal-field-label">Hora</span>
          <input
            className="modal-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>

      {meeting && (
        <div className="modal-secondary-actions">
          <button type="button" className="btn-link-danger" onClick={handleRemove}>
            Quitar próxima reunión
          </button>
        </div>
      )}
    </EditDialog>
  )
}
