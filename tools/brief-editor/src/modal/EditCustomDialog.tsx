import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'

type Props = { itemIdx: number | null }

export function EditCustomDialog({ itemIdx }: Props) {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const items = state?.custom?.items ?? []
  const existing = itemIdx !== null ? items[itemIdx] : null

  const [description, setDescription] = useState(existing?.description ?? '')
  const [citation, setCitation] = useState(existing?.citation ?? '')

  useEffect(() => {
    setDescription(existing?.description ?? '')
    setCitation(existing?.citation ?? '')
  }, [existing])

  function handleApply() {
    dispatch(
      actions.upsertCustom(
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
    dispatch(actions.removeCustom(itemIdx))
    closeModal()
  }

  const isNew = itemIdx === null

  return (
    <EditDialog
      title={isNew ? 'Agregar requerimiento custom' : 'Editar requerimiento custom'}
      subtitle="Fuera del estándar de EasyDocking, evaluado por Producto"
      onApply={handleApply}
      applyDisabled={description.trim() === ''}
      applyLabel={isNew ? 'Agregar' : 'Aplicar'}
    >
      <label className="modal-field">
        <span className="modal-field-label">Requerimiento</span>
        <textarea
          className="modal-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Qué necesita el cliente que está fuera del estándar"
          rows={3}
        />
      </label>

      <label className="modal-field">
        <span className="modal-field-label">Cita del transcript</span>
        <textarea
          className="modal-textarea modal-textarea--cite"
          value={citation}
          onChange={(e) => setCitation(e.target.value)}
          placeholder="Frase literal que respalda este requerimiento"
          rows={2}
        />
      </label>

      {!isNew && (
        <div className="modal-secondary-actions">
          <button type="button" className="btn-link-danger" onClick={handleRemove}>
            Eliminar este requerimiento
          </button>
        </div>
      )}
    </EditDialog>
  )
}
