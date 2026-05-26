export const GROUP_LABELS: Record<string, string> = {
  site_type: 'Tipo de sitio',
  implementation_focus: 'Foco de implementación',
  operations: 'Operaciones',
  modules: 'Módulos contratados',
  module_decision: 'Decisión sobre módulo de Órdenes',
  forms_to_review: 'Formularios a revisar',
  channels: 'Canales de notificación',
}

export function groupLabel(name: string): string {
  return GROUP_LABELS[name] ?? name
}

export const FIELD_STATE_LABELS: Record<'ok' | 'vague' | 'missing', string> = {
  ok: 'Respondido',
  vague: 'Vago',
  missing: 'Falta',
}

export const BLOCK_STATUS_LABELS: Record<'ok' | 'warning' | 'blocker', string> = {
  ok: 'ok',
  warning: 'aviso',
  blocker: 'bloqueo',
}
