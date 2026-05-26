import { useEffect, useMemo, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'

type Props = {
  path: string
  label: string
  multiline?: boolean
  citationPath?: string
  placeholder?: string
}

function readPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined
    if (Array.isArray(acc)) return acc[Number(key)]
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

export function EditTextDialog({ path, label, multiline, citationPath, placeholder }: Props) {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()

  const initialValue = useMemo(() => {
    const v = readPath(state, path)
    return typeof v === 'string' ? v : ''
  }, [state, path])

  const initialCitation = useMemo(() => {
    if (!citationPath) return ''
    const v = readPath(state, citationPath)
    return typeof v === 'string' ? v : ''
  }, [state, citationPath])

  const [value, setValue] = useState(initialValue)
  const [citation, setCitation] = useState(initialCitation)

  useEffect(() => {
    setValue(initialValue)
    setCitation(initialCitation)
  }, [initialValue, initialCitation])

  function handleApply() {
    dispatch(actions.setField(path, value))
    if (citationPath) {
      dispatch(actions.setField(citationPath, citation))
    }
    closeModal()
  }

  return (
    <EditDialog title={label} onApply={handleApply}>
      <label className="modal-field">
        <span className="modal-field-label">Texto</span>
        {multiline ? (
          <textarea
            className="modal-textarea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={5}
          />
        ) : (
          <input
            className="modal-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        )}
      </label>

      {citationPath && (
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
      )}
    </EditDialog>
  )
}
