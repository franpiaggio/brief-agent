# EasyDocking: Brief de onboarding

Contratos del agente, templates y herramientas para el pipeline de briefs de onboarding.

**Sitio publicado:**

- 🔗 [Reportes de ejemplo](https://franpiaggio.github.io/brief-agent/) (los 5 estados visuales del brief)
- 🔗 [Brief editor](https://franpiaggio.github.io/brief-agent/brief-editor/) (editor en vivo)

---

## Tools

### Brief Editor

Editor web para **generar reportes desde el JSON estructurado que emite el LLM** o para **editar briefs ya generados** después del onboarding. Acepta el HTML del brief con JSON embebido o el JSON canónico suelto, permite corregir cualquier dato haciendo click sobre el documento y exporta el HTML actualizado. Sin servidor, sin LLM, sin auto-save.

→ [`tools/brief-editor/`](tools/brief-editor/) · [README](tools/brief-editor/README.md) · [Sitio publicado](https://franpiaggio.github.io/brief-agent/brief-editor/)

### Render

CLI TypeScript que valida el JSON del agente contra el schema Zod, calcula campos derivados y genera el HTML final del brief. Es la fuente de verdad del output. Pensado para convertir `data.json` a HTML desde la línea de comandos cuando no hace falta interfaz web — por ejemplo, en pipelines orquestados con `make` u otros entornos automatizados. El Brief Editor y el Runner lo usan internamente.

```bash
cd tools/render
npm run render -- fixtures/test-ready.json output.html
```

→ [`tools/render/`](tools/render/) · [README](tools/render/README.md)

### Runner

> [!NOTE]
> Work in progress, coming soon.

Ejecutor local del agente. Recibe un transcript, deja elegir proveedor y modelo, y genera el brief completo. Soporta Claude Max (CLI local), Anthropic API y OpenAI API. Incluye historial de runs con métricas de tokens y costo.

→ [`tools/runner/`](tools/runner/)

---

## `agent/`

Contratos del agente que procesa el transcript y emite el brief.

| Archivo | Qué es |
|---|---|
| `cuestionario-onboarding.md` | Los 10 bloques temáticos que cubre la reunión. Fuente de verdad. |
| `system-prompt.md` | Instrucciones del agente para extraer y estructurar la información. |
| `output-schema.md` | Forma exacta del JSON que emite el agente. |

## `example-templates/`

Ejemplos visuales del brief como HTML estático. No son dependencias runtime del renderer.

| Carpeta | Estado |
|---|---|
| `brief-html-ready/` | Todo relevado, sin pendientes. |
| `brief-html-with-pendings/` | Faltan datos puntuales. |
| `brief-html-blocked/` | Gaps críticos que bloquean el avance. |
| `brief-html-off-script/` | La reunión se desvió del cuestionario. |
| `brief-html-no-meeting/` | Sin reunión o sin material suficiente. |
