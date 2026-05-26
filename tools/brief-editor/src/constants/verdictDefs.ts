import type { VerdictStatus } from '../types'

export type VerdictDef = {
  status: VerdictStatus
  label: string
  cssClass: string
}

export const VERDICT_DEFS: VerdictDef[] = [
  { status: 'ready',              label: 'Listo para implementar', cssClass: 'ready'   },
  { status: 'ready_with_pending', label: 'Listo con pendientes',   cssClass: 'pending' },
  { status: 'blocked',            label: 'Bloqueado',              cssClass: 'blocked' },
]

export const VERDICT_BY_STATUS: Record<string, VerdictDef> = Object.fromEntries(
  VERDICT_DEFS.map(v => [v.status, v])
)
