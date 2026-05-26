import type { Verdict as VerdictType } from '../types'
import { Editable } from '../editor/Editable'

type Props = {
  verdict: VerdictType
  pendingCount?: number
  customCount?: number
}

export function Verdict({ verdict, pendingCount = 0, customCount = 0 }: Props) {
  const isOk = verdict.status === 'ready'
  const isBlocked = verdict.status === 'blocked'

  const summaryValueClass = isOk
    ? 'summary-value summary-value--ok'
    : isBlocked
      ? 'summary-value summary-value--danger'
      : 'summary-value summary-value--warn'

  return (
    <div className="hero-summary">
      <div className="summary-cell">
        <div className="summary-label">Resumen</div>
        <Editable as="div" editType="verdict" className={summaryValueClass}>{verdict.summary}</Editable>
        <Editable as="div" editType="verdict" className="summary-detail">{verdict.detail}</Editable>
      </div>
      <div className="summary-cell">
        <div className="summary-label">Pendientes cliente</div>
        <div className="summary-value summary-value--big">{pendingCount}</div>
        <div className="summary-detail">entregables comprometidos</div>
      </div>
      <div className="summary-cell">
        <div className="summary-label">Pedidos custom</div>
        <div className="summary-value summary-value--big">{customCount}</div>
        <div className="summary-detail">fuera del estándar</div>
      </div>
    </div>
  )
}
