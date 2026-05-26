export type BlockDef = {
  id: number
  name: string
  label: string
  shortName: string
  iconName: string
}

export const BLOCK_DEFS: BlockDef[] = [
  { id: 1,  name: 'general_info',             label: 'Información general',         shortName: 'Información',   iconName: 'building'           },
  { id: 2,  name: 'classification',            label: 'Clasificación',               shortName: 'Clasificación', iconName: 'layers'             },
  { id: 3,  name: 'workflow',                  label: 'Workflow operativo',           shortName: 'Workflow',      iconName: 'workflow'           },
  { id: 4,  name: 'process_actors',            label: 'Actores del proceso',          shortName: 'Actores',       iconName: 'users'              },
  { id: 5,  name: 'schedule_docks_warehouse',  label: 'Agenda, docks y warehouse',    shortName: 'Agenda',        iconName: 'calendar-days'      },
  { id: 6,  name: 'orders_module',             label: 'Módulo de Órdenes',            shortName: 'Órdenes',       iconName: 'package'            },
  { id: 7,  name: 'fields_and_forms',          label: 'Campos y formularios',         shortName: 'Formularios',   iconName: 'list-checks'        },
  { id: 8,  name: 'messages_notifications',    label: 'Mensajes y notificaciones',    shortName: 'Mensajes',      iconName: 'mail'               },
  { id: 9,  name: 'exceptions_integrations',   label: 'Excepciones e integraciones',  shortName: 'Integraciones', iconName: 'sliders-horizontal' },
  { id: 10, name: 'closure',                   label: 'Cierre',                       shortName: 'Cierre',        iconName: 'circle-check'       },
]

export const BLOCK_BY_NAME: Record<string, BlockDef> = Object.fromEntries(
  BLOCK_DEFS.map(b => [b.name, b])
)
