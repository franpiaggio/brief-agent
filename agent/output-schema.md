# Output schema — Brief de onboarding

Contrato del JSON que el agente emite. El renderer en `tools/render/` lo valida contra este schema y lo convierte a HTML.

## Principios

1. **Solo lo que se renderiza.** Si una clave no aparece en el HTML, no está en el JSON.
2. **Citas en cada dato extraído.** Cualquier `answer`, `needed: true|false` o pendiente lleva `citation` con el fragmento literal del transcript que lo respalda.
3. **`null` es válido.** Si el cliente no mencionó algo, el agente emite `null`. El renderer muestra `Sin definir`.
4. **El agente no cuenta totales.** Counts de pendientes, cobertura, leyenda de coverage — todo lo deriva el renderer.

## Estructura top-level

```json
{
  "meta": {
    "client_name":  "string | null",
    "industry":     "string | null",
    "country":      "string | null",
    "meeting_date": "YYYY-MM-DD"
  },
  "verdict": {
    "status":         "ready | ready_with_pending | blocked",
    "summary":        "string  (1 frase, ej. '2 bloqueantes · 3 avisos')",
    "blockers_count": 0,
    "warnings_count": 0,
    "detail":         "string | null  // opcional — sub-línea que expande el verdict"
  },
  "custom": {
    "count": 0,
    "items": [
      { "description": "string", "citation": "string | null" }
    ]
  },
  "narrative": {
    "current_situation": "string | null",
    "what_they_want":    "string | null",
    "closure":           "string | null  // opcional"
  },
  // Opcional — solo si hay próxima reunión con fecha acordada
  "next_meeting": {
    "label":   "string",
    "summary": "string",
    "date":    "YYYY-MM-DD",
    "time":    "HH:MM | null"
  },
  // Opcional — solo cuando cobertura < mitad de bloques (reunión off-script)
  "coverage": {
    "blocks_covered": 0,
    "blocks_total":   10
  },
  "blocks": [ /* 10 entradas, id 1–10 en orden — ver shape abajo */ ]
}
```

## Shape de un bloque

```json
{
  "id": 1,
  "name": "general_info",
  "status": "ok | warning | blocker",
  "status_reason": "string",
  "options": [
    { "group_name": "site_type", "label": "Centro de distribución", "needed": true, "citation": "string | null" }
  ],
  "fields": [
    { "key": "industry", "answer": "string | null", "citation": "string | null", "state": "ok | vague | missing" }
  ],
  "flags": [
    { "type": "custom | ideal_process | vague_answer", "description": "string", "citation": "string" }
  ],
  "pending": [
    { "description": "string", "citation": "string | null" }
  ],
  "additional_notes": [
    { "note": "string", "citation": "string" }
  ],
  "workflow_states": [ /* solo bloque 3 — ver abajo */ ]
}
```

Reglas:

- `name` es el identificador en inglés del bloque (ver tabla más abajo).
- `status_reason` es string vacío `""` cuando `status: "ok"`, frase corta cuando `warning` o `blocker`.
- `options` es `[]` para los bloques sin enums (actores, agenda, excepciones, cierre).
- `fields[].state`: `"ok"` si respondido directamente; `"vague"` si vago o inferido; `"missing"` si no fue mencionado.
- `flags` de `type: "custom"` se agregan también a `custom.items[]` a nivel top. Los de `type: "ideal_process"` o `"vague_answer"` solo van en `flags[]` del bloque.
- `pending`, `additional_notes`, `workflow_states` son `[]` si no aplica.

## Nombres de bloque (`name`)

| `id` | `name` |
|------|--------|
| 1 | `general_info` |
| 2 | `classification` |
| 3 | `workflow` |
| 4 | `process_actors` |
| 5 | `schedule_docks_warehouse` |
| 6 | `orders_module` |
| 7 | `fields_and_forms` |
| 8 | `messages_notifications` |
| 9 | `exceptions_integrations` |
| 10 | `closure` |

## Options por bloque

Options van en `options[]` del bloque con cada ítem como entrada plana (con `group_name`). Nunca en `fields[]`.

| `name` | `group_name` | Ítems posibles |
|---|---|---|
| `general_info` | `site_type` | `"Planta industrial"`, `"Centro de distribución"`, `"Almacén"`, `"Otro"` |
| `general_info` | `implementation_focus` | `"Scheduling"`, `"Yard management"` (multi: si los dos quedan en `needed: true`, es porque contratan ambos) |
| `classification` | `operations` | `"Descarga"`, `"Carga"`, `"Retira Cliente"`, `"Interplantas"`, `"Otro"` |
| `classification` | `modules` | `"YMS"`, `"Dock Scheduling"`, `"Inducción"`, `"Control Documental"` |
| `orders_module` | `module_decision` | `"Módulo de Órdenes"` (binario, single item: `needed: true` activa, `false` descarta, `null` por definir) |
| `fields_and_forms` | `forms_to_review` | `"Planificación / Turnos"`, `"Confirmación de turno"`, `"Check-in"`, `"Checklists"`, `"Asignación de dock / llamado"` |
| `messages_notifications` | `channels` | `"Email"`, `"WhatsApp"` |

## Fields por bloque (`key`)

### `general_info`
`industry`, `country`, `city`, `project_contact`, `operational_contact`, `target_go_live_date`

### `classification`
`current_scheduling_method`

### `workflow`
`workflow_per_operation`, `requires_modifications`, `additional_or_missing_stages`

### `process_actors`
`shift_creator`, `check_in_actor`, `dock_assigner`, `checklist_completer`, `operation_supervisor`, `external_users`, `document_validator`

### `schedule_docks_warehouse`
`warehouses_count`, `docks_per_warehouse`, `operations_per_dock`, `shift_duration`, `available_days_hours`, `time_restrictions`

### `orders_module`
`order_role`, `must_exist_before_booking`, `can_operate_without_preloaded`, `appointment_multiple_orders`, `uses_excel_for_orders`, `assign_to_third_party_before_booking`, `current_management_location`, `load_method_into_easydocking`, `order_fields_required`, `coordinates_existing_or_on_demand`, `merchandise_detail_level`, `shift_duration_depends_on_order`

### `fields_and_forms`
`modifications_summary`

### `messages_notifications`
`template_adjustments_needed`, `missing_key_message`

### `exceptions_integrations`
`non_standard_requirements`, `required_integrations`, `initial_data_import`

### `closure`
`defined_in_meeting`, `open_pending_items`, `client_deliverables`, `next_step`

### `workflow` — `workflow_states[]` (solo bloque 3)

Cuando el cliente describe el workflow con suficiente claridad:

```json
{ "operation": "string", "step": 1, "name": "string", "actor": "string", "notes": "string | null", "citation": "string" }
```

Si no queda claro, dejar `workflow_states: []` y usar el field `workflow_per_operation`.

## Reglas para `block.status`

- **`ok`** — todas las preguntas cubiertas directamente, sin opciones `null`, sin pendientes bloqueantes.
- **`warning`** — alguna opción con `needed: null`, o algún field con `state: "vague"` o `"missing"`, o tiene entradas en `pending`, o tiene flags `ideal_process` o `vague_answer`.
- **`blocker`** — falta una decisión crítica que impide configurar:
  - Bloque 1: `site_type` o `implementation_focus` sin ningún `needed: true`.
  - Bloque 2: ninguna operación o ningún módulo confirmados.
  - Bloque 5: `warehouses_count` o `docks_per_warehouse` con `answer: null`.
  - Bloque 6: `module_decision` con `needed: null` (decisión pendiente).

## Reglas para `verdict.status`

- `blocked` — al menos un bloque en `blocker`.
- `ready_with_pending` — ningún blocker, al menos un `warning`.
- `ready` — todos los bloques en `ok`.

`custom` se reporta siempre, independiente del verdict.

## Lo que el renderer deriva (no va al JSON)

| Elemento HTML | Derivación |
|---|---|
| Leyenda coverage (`n ok · n aviso · n bloqueo`) | Contar `blocks[].status` |
| Color de cada coverage-tile | `blocks[i].status` |
| Pill del verdict | `verdict.status` → clase CSS + label |
| Count "Pendientes cliente" | `sum(blocks[].pending.length)` |
| Banner off-script | `coverage` presente en JSON |
| Source label de cada pending | `zero-pad(block.id) · block title` |
| Formato de fecha | `next_meeting.date` (ISO) → `DD MMM YYYY` en español |
| Total `custom.count` | Reportado por el agente; el renderer también puede contar `flags[type=custom]` |
