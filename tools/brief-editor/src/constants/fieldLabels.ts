export const FIELD_LABELS: Record<string, string> = {
  industry: 'Industria',
  country: 'País',
  city: 'Ciudad',
  project_contact: 'Contacto principal',
  operational_contact: 'Contacto operativo',
  target_go_live_date: 'Fecha go-live',

  current_scheduling_method: 'Método actual de agendamiento',
  uses_excel_for_orders: 'Usa Excel para órdenes',

  workflow_per_operation: 'Workflow por operación',
  requires_modifications: 'Requiere modificaciones',
  additional_or_missing_stages: 'Etapas adicionales o faltantes',

  shift_creator: 'Crea los turnos',
  check_in_actor: 'Hace check-in',
  dock_assigner: 'Asigna docks',
  checklist_completer: 'Completa el checklist',
  operation_supervisor: 'Supervisa la operación',
  external_users: 'Usuarios externos',
  document_validator: 'Valida documentación',

  warehouses_count: 'Cantidad de warehouses',
  docks_per_warehouse: 'Docks por warehouse',
  operations_per_dock: 'Operaciones por dock',
  shift_duration: 'Duración del turno',
  available_days_hours: 'Días y horarios disponibles',
  time_restrictions: 'Restricciones horarias',

  order_role: 'Rol de las órdenes',
  must_exist_before_booking: 'Debe existir antes del turno',
  can_operate_without_preloaded: 'Puede operar sin órdenes pre-cargadas',
  appointment_multiple_orders: 'Un turno cubre múltiples órdenes',
  assign_to_third_party_before_booking: 'Se asigna a un tercero antes del turno',
  current_management_location: 'Dónde se gestionan hoy',
  load_method_into_easydocking: 'Cómo se cargan a EasyDocking',
  order_fields_required: 'Campos requeridos por orden',
  coordinates_existing_or_on_demand: 'Coordinación existente o on-demand',
  merchandise_detail_level: 'Nivel de detalle de mercadería',
  shift_duration_depends_on_order: 'La duración del turno depende de la orden',

  modifications_summary: 'Resumen de modificaciones',

  template_adjustments_needed: 'Ajustes necesarios en templates',
  missing_key_message: 'Mensajes clave faltantes',

  non_standard_requirements: 'Requerimientos fuera del estándar',
  required_integrations: 'Integraciones requeridas',
  initial_data_import: 'Importación inicial de datos',

  defined_in_meeting: 'Scope definido en la reunión',
  open_pending_items: 'Pendientes abiertos',
  client_deliverables: 'Entregables del cliente',
  next_step: 'Próximo paso',
}

export function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key
}
