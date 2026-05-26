import { useEffect, useMemo, useState } from 'react'
import { useBrief } from '../state/BriefContext'
import { useModal } from './ModalContext'
import { EditDialog } from './EditDialog'
import { groupLabel } from '../constants/groupLabels'

type Props = {
  blockIdx: number
  groupName: string
}

type Draft = { label: string; needed: boolean | null; citation: string }

function nextNeeded(current: boolean | null): boolean | null {
  if (current === true) return false
  if (current === false) return null
  return true
}

function neededLabel(needed: boolean | null) {
  if (needed === true) return 'sí'
  if (needed === false) return 'no'
  return '—'
}

export function EditOptionsGroupDialog({ blockIdx, groupName }: Props) {
  const { state, dispatch, actions } = useBrief()
  const { closeModal } = useModal()
  const block = state?.blocks[blockIdx]

  const initial = useMemo<Draft[]>(() => {
    if (!block) return []
    return block.options
      .filter((o) => o.group_name === groupName)
      .map((o) => ({ label: o.label, needed: o.needed, citation: o.citation ?? '' }))
  }, [block, groupName])

  const [drafts, setDrafts] = useState<Draft[]>(initial)

  useEffect(() => {
    setDrafts(initial)
  }, [initial])

  if (!block) return null

  function update(idx: number, partial: Partial<Draft>) {
    setDrafts((prev) => prev.map((d, i) => (i === idx ? { ...d, ...partial } : d)))
  }

  function handleApply() {
    drafts.forEach((d) => {
      dispatch(
        actions.setOption(blockIdx, groupName, d.label, {
          needed: d.needed,
          citation: d.citation.trim() === '' ? null : d.citation,
        }),
      )
    })
    closeModal()
  }

  return (
    <EditDialog title={groupLabel(groupName)} subtitle="Click en sí/no/— para ciclar. La cita es opcional." onApply={handleApply}>
      {drafts.map((d, idx) => (
        <div key={d.label} className="modal-option-row">
          <div className="modal-option-row-head">
            <span className="modal-option-row-label">{d.label}</span>
            <button
              type="button"
              className={`modal-option-toggle modal-option-toggle--${d.needed === true ? 'yes' : d.needed === false ? 'no' : 'unknown'}`}
              onClick={() => update(idx, { needed: nextNeeded(d.needed) })}
            >
              {neededLabel(d.needed)}
            </button>
          </div>
          <textarea
            className="modal-textarea modal-textarea--cite"
            value={d.citation}
            onChange={(e) => update(idx, { citation: e.target.value })}
            placeholder="Cita del transcript (opcional)"
            rows={2}
          />
        </div>
      ))}
    </EditDialog>
  )
}
