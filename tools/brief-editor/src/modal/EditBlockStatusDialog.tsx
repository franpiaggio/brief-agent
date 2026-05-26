import { useEffect, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { BLOCK_STATUS_LABELS } from '../constants/groupLabels'
import type { BlockStatus } from '../types'

type Props = { blockIdx: number }

export function EditBlockStatusDialog({ blockIdx }: Props) {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const block = state?.blocks[blockIdx]
  const blockDef = state ? BLOCK_DEFS[blockIdx] : null

  const [status, setStatus] = useState<BlockStatus>(block?.status ?? 'ok')
  const [reason, setReason] = useState(block?.status_reason ?? '')

  useEffect(() => {
    setStatus(block?.status ?? 'ok')
    setReason(block?.status_reason ?? '')
  }, [block])

  if (!block) return null

  function handleApply() {
    dispatch(actions.setBlockStatus(blockIdx, status))
    dispatch(actions.setField(`blocks.${blockIdx}.status_reason`, reason))
    closeModal()
  }

  return (
    <EditDialog
      title={`Bloque ${String(block.id).padStart(2, '0')} · ${blockDef?.label ?? block.name}`}
      subtitle="Estado del bloque y razón si aplica"
      onApply={handleApply}
    >
      <fieldset className="modal-field modal-field--state">
        <legend className="modal-field-label">Estado</legend>
        <div className="modal-state-row">
          {(['ok', 'warning', 'blocker'] as const).map((s) => (
            <label key={s} className={`modal-state-option modal-state-option--${s}${status === s ? ' is-selected' : ''}`}>
              <input
                type="radio"
                name="block-status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
              />
              <span>{BLOCK_STATUS_LABELS[s]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="modal-field">
        <span className="modal-field-label">Comentario</span>
        <textarea
          className="modal-textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={
            status === 'ok'
              ? 'Opcional. Comentario sobre el bloque.'
              : 'Frase corta que explica el aviso o bloqueo'
          }
          rows={3}
        />
      </label>
    </EditDialog>
  )
}
