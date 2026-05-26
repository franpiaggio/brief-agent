# AGENTS.md

Guía para Codex (Codex.ai/code) sobre cómo trabajar en este repo.

## Qué es este repo

Casa canónica del **brief de onboarding de EasyDocking**: el reporte que se entrega después de cada reunión de relevamiento con un cliente. Todo el contenido es en español.

El repo se organiza en dos pilares:

1. **Contratos del agente** (`agent/`) — el cuestionario canónico, el system prompt y el output schema. Cuestionario = fuente de verdad sobre la que se construye todo. Prompt y schema = cómo el agente toma un transcript de reunión y emite el JSON del brief.
2. **Templates HTML** (`templates/`) — la representación visual del brief en sus distintos estados, alimentada por el JSON que produce el agente.

El orden es jerárquico: el cuestionario manda. El agente extrae respuestas contra esos bloques. Los templates renderizan esas respuestas. Cualquier producto interactivo futuro se valida contra los tres artefactos de `agent/` más los templates.

## El cuestionario es la fuente de verdad

`agent/cuestionario-onboarding.md` define los **10 bloques temáticos** que toda reunión de onboarding cubre, en orden:

1. Información general
2. Clasificación
3. Workflow operativo
4. Actores del proceso
5. Agenda, docks y warehouse
6. Módulo de Órdenes
7. Campos y formularios
8. Mensajes y notificaciones
9. Excepciones e integraciones
10. Cierre

Toda decisión sobre el brief tiene que poder justificarse contra estos 10 bloques. Si una sección del brief no mapea a un bloque del cuestionario, sobra; si un bloque del cuestionario no aparece en el brief, falta.

## Agente

`agent/` contiene los tres contratos vivos:

- **`agent/cuestionario-onboarding.md`** — guía operativa para el equipo humano que conduce la reunión, y fuente de verdad de los 10 bloques contra los que extrae el agente.
- **`agent/output-schema.md`** — forma exacta del JSON que el agente emite. Enums cerrados por bloque, reglas de `block.status` y `verdict.status`, qué deriva el renderer y qué emite el agente.
- **`agent/system-prompt.md`** — el system prompt operativo. Reglas estrictas (no inventar, citar todo, labels exactos), schema por bloque embebido, autocontrol antes de emitir.

El cuestionario manda; el schema es el contrato de salida; el prompt los une. Cualquier cambio en uno impacta a los otros.

## Templates HTML

`templates/` contiene los 5 estados de verdict del brief. Cada estado es una carpeta con su `index.html`; el `styles.css`, los `assets/` (logo, etc.) y el `template.html` scaffold viven compartidos en `templates/`. El sidecar de tokens vive en `.impeccable/design.json`.

- `brief-html-ready/` — todo respondido, sin pendientes, listo para configurar.
- `brief-html-with-pendings/` — mayoría respondida, faltan datos puntuales.
- `brief-html-blocked/` — gaps críticos que impiden seguir.
- `brief-html-off-script/` — la reunión cubrió temas fuera del cuestionario o se salió del orden.
- `brief-html-no-meeting/` — no hubo reunión / no hay material para armar el brief.

`templates/index.html` es la landing que linkea a los cinco estados. Es lo que se publica vía GitHub Pages.

### Cómo deployar

`.github/workflows/deploy.yml` publica el contenido de `templates/` a GitHub Pages en cada push a `main`. No hay build step — los templates son HTML estático con `styles.css` adyacente.

## Design system

`DESIGN.md` contiene **todos los tokens** del brief: paleta, tipografía, radios, spacing, especificación de componentes. Es la referencia normativa. Cualquier nuevo template o variante respeta estos tokens. Si una pieza necesita un token que no existe, primero se agrega a `DESIGN.md`, después se usa.

`PRODUCT.md` define el producto: usuarios (equipo EasyDocking + stakeholders del cliente), personalidad de marca (sistemático · grounded · calm), principios de diseño, anti-references. Es el norte cualitativo cuando hay decisiones ambiguas.

## Convenciones

- **Todo en español.** Contenido del brief, prosa de notas, copies de UI.
- **Tokens cerrados.** No introducir colores ni tipografías fuera de `DESIGN.md` sin actualizar el archivo.
- **Print = web.** Cada template tiene que verse igual de bien como HTML en browser y como PDF. No optimizar uno a costa del otro.
- **Verdict legible sin color.** Estado del brief siempre se refuerza con label/texto, nunca depende solo de color (accesibilidad + impresión B&N).
- **Citas opcionales, no decorativas.** Cuando un template muestra una cita de Read.AI, es para respaldar una afirmación concreta. No se usan como adorno.

## Qué NO hacer

- **No crear documentación que no se pidió.** No generes READMEs, CHANGELOGs, notas de planning, ni docs de "qué cambió". Si la información no es contrato vigente, no pertenece al repo.
- **No agregar genealogía a los documentos.** Notas de "antes era X, ahora es Y" o referencias a versiones pasadas no van. Cada doc dice qué es ahora; el historial vive en git.
- **No mezclar productos interactivos con templates.** Cuando aparezca tooling interactivo, vive en su propia carpeta (probablemente `tools/`). Los templates de `templates/` siguen siendo HTML estático rendereable como referencia visual pura.
