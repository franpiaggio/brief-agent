import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'
import { BLOCK_DEFS } from '../constants/blockDefs'

type Props = {
  blockIdx: number
  itemIdx: number | null
}

export function EditPendingDialog({ blockIdx, itemIdx }: Props) {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const block = state?.blocks[blockIdx]
  const def = state ? BLOCK_DEFS[blockIdx] : null
  const existing = itemIdx !== null ? block?.pending[itemIdx] : null

  const [description, setDescription] = useState(existing?.description ?? '')
  const [citation, setCitation] = useState(existing?.citation ?? '')

  useEffect(() => {
    setDescription(existing?.description ?? '')
    setCitation(existing?.citation ?? '')
  }, [existing])

  if (!block) return null

  function handleApply() {
    dispatch(
      actions.upsertPending(
        blockIdx,
        itemIdx,
        description.trim(),
        citation.trim() === '' ? null : citation,
      ),
    )
    closeModal()
  }

  function handleRemove() {
    if (itemIdx === null) {
      closeModal()
      return
    }
    dispatch(actions.removePending(blockIdx, itemIdx))
    closeModal()
  }

  const isNew = itemIdx === null

  return (
    <EditDialog
      title={isNew ? 'Agregar pendiente' : 'Editar pendiente'}
      subtitle={`Bloque ${String(block.id).padStart(2, '0')} · ${def?.label ?? block.name}`}
      onApply={handleApply}
      applyDisabled={description.trim() === ''}
      applyLabel={isNew ? 'Agregar' : 'Aplicar'}
    >
      <label className="modal-field">
        <span className="modal-field-label">Pendiente</span>
        <textarea
          className="modal-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Qué tiene que enviar el cliente"
          rows={3}
        />
      </label>

      <label className="modal-field">
        <span className="modal-field-label">Cita del transcript</span>
        <textarea
          className="modal-textarea modal-textarea--cite"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
          placeholder="Frase literal que respalda este pendiente"
          rows={2}
        />
      </label>

      {!isNew && (
        <div className="modal-secondary-actions">
          <button type="button" className="btn-link-danger" onClick={handleRemove}>
            Eliminar este pendiente
          </button>
        </div>
      )}
    </EditDialog>
  )
}
