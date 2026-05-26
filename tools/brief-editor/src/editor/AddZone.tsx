import { use } from 'react'
import { BriefContext } from '../state/BriefContext'

type Props =
  | { kind: 'pending'; blockIdx: number; label?: string }
  | { kind: 'custom'; label?: string }

export function AddZone(props: Props) {
  const ctx = use(BriefContext)
  if (!ctx) return null

  const label = props.label ?? (props.kind === 'pending' ? 'Agregar pendiente' : 'Agregar requerimiento custom')
  const dataAttrs: Record<string, string> = {
    'data-edit-type': props.kind,
  }
  if (props.kind === 'pending') {
    dataAttrs['data-edit-block-idx'] = String(props.blockIdx)
  }

  return (
    <button type="button" className="add-zone" {...dataAttrs}>
      <svg className="add-zone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {label}
    </button>
  )
}
