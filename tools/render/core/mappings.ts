// Mapping tables for labels, icons, status classes, and field display names.

// Table A: verdict.status → CSS class + label + summary color
export const VERDICT_MAP: Record<
  string,
  { cssClass: string; label: string; summaryColorClass: string }
> = {
  ready: {
    cssClass: 'ready',
    label: 'Listo para implementar',
    summaryColorClass: 'ok',
  },
  ready_with_pending: {
    cssClass: 'pending',
    label: 'Listo con pendientes',
    summaryColorClass: 'warn',
  },
  blocked: {
    cssClass: 'blocked',
    label: 'Bloqueado',
    summaryColorClass: 'danger',
  },
};

// Table B: blocks[].name → title + lucide icon + short name (for coverage tiles)
export const BLOCK_MAP: Record<
  string,
  { title: string; iconName: string; shortName: string }
> = {
  general_info: {
    title: 'Información general',
    iconName: 'building',
    shortName: 'Información',
  },
  classification: {
    title: 'Clasificación',
    iconName: 'layers',
    shortName: 'Clasificación',
  },
  workflow: {
    title: 'Workflow operativo',
    iconName: 'workflow',
    shortName: 'Workflow',
  },
  process_actors: {
    title: 'Actores del proceso',
    iconName: 'users',
    shortName: 'Actores',
  },
  schedule_docks_warehouse: {
    title: 'Agenda, docks y warehouse',
    iconName: 'calendar-days',
    shortName: 'Agenda',
  },
  orders_module: {
    title: 'Módulo de Órdenes',
    iconName: 'package',
    shortName: 'Órdenes',
  },
  fields_and_forms: {
    title: 'Campos y formularios',
    iconName: 'list-checks',
    shortName: 'Formularios',
  },
  messages_notifications: {
    title: 'Mensajes y notificaciones',
    iconName: 'mail',
    shortName: 'Mensajes',
  },
  exceptions_integrations: {
    title: 'Excepciones e integraciones',
    iconName: 'sliders-horizontal',
    shortName: 'Integraciones',
  },
  closure: {
    title: 'Cierre',
    iconName: 'circle-check',
    shortName: 'Cierre',
  },
};

// Table C: blocks[].status → pill label + reason icon
export const STATUS_MAP: Record<
  string,
  { label: string; reasonIconName: string }
> = {
  ok: { label: 'ok', reasonIconName: '' },
  warning: { label: 'aviso', reasonIconName: 'triangle-alert' },
  blocker: { label: 'bloqueante', reasonIconName: 'octagon-alert' },
};

// Table D: options[].group_name → row label in chk-shell
export const OPTION_GROUP_LABEL: Record<string, string> = {
  site_type: 'Tipo de sitio',
  implementation_focus: 'Objetivo principal',
  operations: 'Operaciones',
  modules: 'Módulos',
  module_decision: 'Decisión módulo Órdenes',
  forms_to_review: 'Formularios a revisar',
  channels: 'Canales de comunicación',
};

// Table E: fields[].key → display label (by block)
export const FIELD_LABEL: Record<string, Record<string, string>> = {
  general_info: {
    industry: 'Industria',
    country: 'País',
    city: 'Ciudad',
    project_contact: 'Contacto del proyecto',
    operational_contact: 'Contacto operativo',
    target_go_live_date: 'Fecha objetivo de go-live',
  },
  classification: {
    current_scheduling_method: 'Método de agendamiento actual',
    uses_excel_for_orders: 'Usan Excel para órdenes/turnos',
  },
  workflow: {
    workflow_per_operation: 'Workflow por operación',
    requires_modifications: 'Requiere modificaciones',
    additional_or_missing_stages: 'Etapas adicionales o faltantes',
  },
  process_actors: {
    shift_creator: 'Crea los turnos',
    check_in_actor: 'Realiza el check-in',
    dock_assigner: 'Asigna el dock',
    checklist_completer: 'Completa checklists',
    operation_supervisor: 'Supervisa la operación',
    external_users: 'Usuarios externos',
    document_validator: 'Valida documentación',
  },
  schedule_docks_warehouse: {
    warehouses_count: 'Cantidad de warehouses',
    docks_per_warehouse: 'Docks por warehouse',
    operations_per_dock: 'Operaciones por dock',
    shift_duration: 'Duración del turno',
    available_days_hours: 'Días y horarios habilitados',
    time_restrictions: 'Restricciones horarias',
  },
  orders_module: {
    order_role: 'Rol de la orden',
    must_exist_before_booking: 'Debe existir antes de agendar',
    can_operate_without_preloaded: 'Puede operar sin órdenes precargadas',
    appointment_multiple_orders: 'Cita puede incluir varias órdenes',
    uses_excel_for_orders: 'Usa Excel para órdenes',
    assign_to_third_party_before_booking: 'Asignar a tercero antes de agendar',
    current_management_location: 'Ubicación actual de gestión',
    load_method_into_easydocking: 'Método de carga en EasyDocking',
    order_fields_required: 'Campos requeridos en la orden',
    coordinates_existing_or_on_demand: 'Coordina orden existente o on-demand',
    merchandise_detail_level: 'Nivel de detalle de mercadería',
    shift_duration_depends_on_order:
      'Duración del turno depende de datos de la orden',
  },
  fields_and_forms: {
    modifications_summary: 'Resumen de modificaciones',
  },
  messages_notifications: {
    template_adjustments_needed: 'Ajustes a plantillas',
    missing_key_message: 'Mensaje clave faltante',
  },
  exceptions_integrations: {
    non_standard_requirements: 'Requerimientos no-estándar',
    required_integrations: 'Integraciones requeridas',
    initial_data_import: 'Datos iniciales a importar',
  },
  closure: {
    defined_in_meeting: 'Definido en la reunión',
    open_pending_items: 'Pendientes abiertos',
    client_deliverables: 'Debe enviar el cliente',
    next_step: 'Próximo paso',
  },
};

// Block 1 identity-grid card config
export const IDENTITY_CARD_CONFIG: Record<
  string,
  { cardClass: string; iconName: string; label: string }
> = {
  industry: { cardClass: 'scalar', iconName: 'tv', label: 'Industria' },
  country: { cardClass: 'scalar', iconName: 'globe', label: 'País' },
  city: { cardClass: 'scalar', iconName: 'map-pin', label: 'Ciudad' },
  project_contact: {
    cardClass: 'person',
    iconName: 'user',
    label: 'Contacto del proyecto',
  },
  operational_contact: {
    cardClass: 'person',
    iconName: 'user-star',
    label: 'Contacto operativo',
  },
  target_go_live_date: {
    cardClass: 'date',
    iconName: 'highlighter',
    label: 'Go-live objetivo',
  },
};

// Ordered identity card keys for block 1 (layout order)
export const IDENTITY_CARD_ORDER = [
  'industry',
  'country',
  'city',
  'project_contact',
  'operational_contact',
  'target_go_live_date',
];

// needed boolean → chk-chip class
export const NEEDED_CLASS: Record<string, string> = {
  true: 'yes',
  false: 'no',
  null: 'unknown',
};
