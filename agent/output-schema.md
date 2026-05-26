# Output schema — Brief de onboarding

> Contrato del JSON que el agente emite. Diseñado para mapear 1:1 con lo que el HTML renderiza, sin claves muertas. Todo lo derivable lo deriva el renderer; el agente solo emite hechos extraídos del transcript.

## Principios

1. **Solo lo que se renderiza.** Si una clave no aparece en el HTML, no está en el JSON.
2. **Citas inline.** Cada `value`, `needed:true|false`, `pending`, `custom` lleva `cite` con texto literal del transcript. Anti-invención sin ceremonia.
3. **Null es válido.** Si el cliente no mencionó algo, el agente emite `null` (en `value`, `cite`, `needed`). El renderer muestra `"—"`.
4. **El agente no cuenta ni decide totales.** Cobertura, banner off-script, verdict counts — todo lo deriva el renderer leyendo `blocks[].status`.

## Estructura top-level

```json
{
  "meta": {
    "client_name":  "string | null",
    "meeting_date": "YYYY-MM-DD | null"
  },
  "verdict": {
    "status":  "ready | ready_with_pending | blocked",
    "summary": "string",
    "detail":  "string"
  },
  "narrative": {
    "current_situation": "string | null",
    "what_they_want":    "string | null",
    "closure":           "string | null"
  },
  "next_meeting": {
    "label":   "string | null",
    "summary": "string | null",
    "date":    "string | null",
    "time":    "string | null"
  },
  "blocks": [ /* 10 entradas, en orden — ver schema por bloque abajo */ ]
}
```

## Shape de un bloque

```json
{
  "id": 1,
  "status": "ok | warning | blocker",
  "status_reason": "string | null",
  "options": [
    {
      "group_name": "string",
      "items": [
        { "label": "string", "needed": true | false | null, "cite": "string | null" }
      ]
    }
  ],
  "fields": [
    { "label": "string", "value": "string | null", "cite": "string | null" }
  ],
  "pending": [
    { "description": "string", "cite": "string | null" }
  ],
  "custom": [
    { "description": "string", "cite": "string | null" }
  ]
}
```

Reglas:

- `status_reason` es `null` cuando `status:"ok"`, string corto cuando `warning` o `blocker`.
- `options` es `[]` para los bloques que no tienen enums (3 después de la reforma: actores, agenda, cierre).
- `fields[].cite` puede ser `null` solo si `value` también es `null` (no se mencionó).
- `pending` y `custom` son `[]` si no hay nada que pedir.
- El agente NO emite `field.state`, `flag.type`, `options[].group_id`, `block.name`, `decisions[]`, `open_questions[]`, `workflow_states[]`, `custom.count`, `verdict.blockers_count/warnings_count`. Todo eso o se derivó al renderer o murió.

## Schema por bloque (enums cerrados)

### 1. Información general
- **Options**:
  - `Tipo de sitio` → `["Planta industrial", "Centro de distribución", "Almacén"]` (single-select)
  - `Objetivo principal` → `["Turnos", "YMS", "Ambos"]` (single-select)
- **Fields**: `Industria`, `País`, `Ciudad`, `Contacto principal`, `Contacto operativo diario`, `Fecha objetivo go-live`

> Nota: `meta` queda mínimo (`client_name` + `meeting_date`). Industria, país, ciudad, contacto principal viven **solo** en `blocks[0].fields`. El renderer los proyecta al hero meta line desde ahí.

### 2. Clasificación
- **Options**:
  - `Operaciones` → `["Descarga", "Carga", "Retira Cliente", "Interplantas", "Otro"]` (multi-select)
  - `Módulos` → `["YMS", "Dock Scheduling", "Inducción", "Control Documental"]` (multi-select)
- **Fields**: `Método de agendamiento actual`, `Usan Excel para órdenes/turnos`

### 3. Workflow operativo
- **Options**:
  - `Workflow seleccionado` → `["Recepción", "Expedición", "Retira cliente"]` (single-select)
- **Fields**: `Requiere modificaciones`, `Etapas adicionales o faltantes`

### 4. Actores del proceso
- **Options**: ninguno
- **Fields**: `Crea los turnos`, `Realiza el check-in`, `Asigna el dock`, `Completa checklists`, `Supervisa la operación`, `Usuarios externos`, `Valida documentación`

### 5. Agenda, docks y warehouse
- **Options**: ninguno
- **Fields**: `Cantidad de warehouses`, `Docks por warehouse`, `Operaciones por dock`, `Duración del turno`, `Días y horarios habilitados`, `Restricciones horarias`

### 6. Módulo de Órdenes
- **Options**:
  - `Decisión módulo Órdenes` → `["Con módulo de Órdenes", "Sin módulo de Órdenes"]` (single-select)
- **Fields**: `Rol de la orden`, `Debe existir antes de agendar`, `Puede operar sin órdenes precargadas`, `Cita puede incluir varias órdenes`, `Usa Excel para órdenes`, `Asignar a tercero antes de agendar`, `Ubicación actual de gestión`, `Método de carga en EasyDocking`, `Campos requeridos en la orden`, `Coordina orden existente o on-demand`, `Nivel de detalle de mercadería`, `Duración del turno depende de datos de la orden`

### 7. Campos y formularios
- **Options**:
  - `Formularios a revisar` → `["Planificación", "Confirmación de turno", "Check-in", "Checklists", "Asignación de dock"]` (multi-select)
- **Fields**: `Resumen de modificaciones`

### 8. Mensajes y notificaciones
- **Options**:
  - `Canales de comunicación` → `["Mail", "WhatsApp"]` (multi-select)
- **Fields**: `Ajustes a plantillas`, `Mensaje clave faltante`

### 9. Excepciones e integraciones
- **Options**: ninguno
- **Fields**: `Requerimientos no-estándar`, `Integraciones requeridas`, `Datos iniciales a importar`

### 10. Cierre
- **Options**: ninguno
- **Fields**: `Definido en la reunión`, `Pendientes abiertos`, `Debe enviar el cliente`, `Próximo paso`

## Reglas para `block.status`

El agente decide el status de cada bloque usando criterios internos (no se emiten al JSON):

- **`ok`** — Todas las preguntas obligatorias respondidas de forma directa y completa. Sin opciones en `null`. Pendientes opcionales no degradan.
- **`warning`** — El bloque está cubierto pero hay rugosidad: respuestas vagas, opciones sin confirmar, o pendientes que el cliente prometió enviar.
- **`blocker`** — Falta un dato crítico que impide avanzar a configuración:
  - Bloque 1: ningún item en `Tipo de sitio` o ningún item en `Objetivo principal` con `needed:true`.
  - Bloque 2: ninguna operación seleccionada o ningún módulo seleccionado.
  - Bloque 3: ningún workflow seleccionado.
  - Bloque 5: `Cantidad de warehouses` o `Docks por warehouse` con `value:null`.
  - Bloque 6: ninguna opción de `Decisión módulo Órdenes` con `needed:true`.

## Reglas para `verdict.status`

Derivable. El agente puede emitirlo directamente (más simple) o el renderer puede recalcularlo. Convención:

- `blocked` si **algún** `blocks[].status === "blocker"`.
- `ready_with_pending` si no hay blockers pero **algún** `warning`.
- `ready` si todos los bloques `ok`.

`verdict.summary` y `verdict.detail` son frases humanas que el agente sí emite (no se derivan):
- `summary`: cuenta breve, ej. `"2 bloqueantes · 3 avisos"` o `"10 bloques en orden"`.
- `detail`: una línea cualitativa, ej. `"Configuración lista, pendientes operativos"` o `"Faltan datos críticos del cliente"`.

## Lo que el renderer deriva (no va al JSON)

| Item del HTML | Cómo se deriva |
|---|---|
| Cobertura legend (`5 ok · 3 aviso · 2 bloqueo`) | Contar `blocks[].status` por valor |
| Color de cada coverage-tile | `blocks[i].status` |
| Pill del verdict (verde/amarillo/rojo) | `verdict.status` |
| Hero meta line (`Industria · País · Ciudad · Contacto`) | Lookup en `blocks[0].fields[].value` por label (con `"—"` si null) |
| Summary cell "Pendientes cliente" count | `sum(blocks[].pending.length)` |
| Summary cell "Pedidos custom" count | `sum(blocks[].custom.length)` |
| Summary cell "Go-live objetivo" | `blocks[0].fields[].value` donde label = "Fecha objetivo go-live" |
| Action-box pending list | Flatten de `blocks[].pending` con `id · nombre del bloque` como source |
| Action-box custom list | Flatten de `blocks[].custom` con `id · nombre del bloque` como source |
| Banner off-script | Aparece si `count(blocks[].status === "blocker") >= 5` (umbral a confirmar) |

## No-meeting (estado especial)

Cuando no hubo reunión o no hay material para armar el brief, el JSON sigue el mismo schema pero con todo `null`:

```json
{
  "meta": { "client_name": null, "meeting_date": null },
  "verdict": { "status": "blocked", "summary": "Sin reunión", "detail": "..." },
  "narrative": { "current_situation": null, "what_they_want": null, "closure": null },
  "next_meeting": { ... },  // si hay próxima reunión agendada
  "blocks": [
    { "id": 1, "status": "blocker", "status_reason": "Sin datos", "options": [], "fields": [], "pending": [], "custom": [] },
    /* x10 */
  ]
}
```

El renderer detecta el caso por `narrative.current_situation === null` (o un flag explícito si hace falta) y cambia al layout no-meeting.

## Ejemplo mínimo — estado `ready`

```json
{
  "meta": {
    "client_name": "Example Corp SA",
    "meeting_date": "2026-05-08"
  },
  "verdict": {
    "status": "ready",
    "summary": "10 bloques en orden",
    "detail": "Sin pendientes ni avisos"
  },
  "narrative": {
    "current_situation": "Example Corp SA opera una planta de embotellado en Mendoza...",
    "what_they_want": "Implementar YMS + Dock Scheduling + Inducción...",
    "closure": "Configuración base completa y validada..."
  },
  "next_meeting": {
    "label": "Validación",
    "summary": "Equipo EasyDocking presenta la configuración base",
    "date": "22 May 2026",
    "time": "10:00 hs"
  },
  "blocks": [
    {
      "id": 1,
      "status": "ok",
      "status_reason": null,
      "options": [
        {
          "group_name": "Tipo de sitio",
          "items": [
            { "label": "Planta industrial", "needed": true,  "cite": "es nuestra planta principal de embotellado en Mendoza" },
            { "label": "Centro de distribución", "needed": false, "cite": "tenemos un CD aparte pero no entra en este onboarding" },
            { "label": "Almacén", "needed": false, "cite": "tenemos un CD aparte pero no entra en este onboarding" }
          ]
        },
        {
          "group_name": "Objetivo principal",
          "items": [
            { "label": "Turnos", "needed": false, "cite": "necesitamos todo el YMS, no solo agendamiento" },
            { "label": "YMS",    "needed": false, "cite": "necesitamos todo el YMS, no solo agendamiento" },
            { "label": "Ambos",  "needed": true,  "cite": "necesitamos todo el YMS, no solo agendamiento" }
          ]
        }
      ],
      "fields": [
        { "label": "Industria", "value": "Bebidas no alcohólicas", "cite": "somos un embotellador de bebidas no alcohólicas" },
        { "label": "País", "value": "Argentina", "cite": "operamos en Argentina" },
        { "label": "Ciudad", "value": "Mendoza", "cite": "es nuestra planta principal de embotellado en Mendoza" },
        { "label": "Contacto principal", "value": "Lucía Fernández (Jefa de Logística)", "cite": "yo soy Lucía Fernández, jefa de logística" },
        { "label": "Contacto operativo diario", "value": "Mariano Sosa (Supervisor de Patio)", "cite": "el día a día lo va a llevar Mariano Sosa" },
        { "label": "Fecha objetivo go-live", "value": "2026-07-15", "cite": "queremos estar en vivo el 15 de julio" }
      ],
      "pending": [],
      "custom": []
    }
    /* ... bloques 2-10 ... */
  ]
}
```
