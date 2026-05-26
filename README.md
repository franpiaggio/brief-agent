# EasyDocking — Brief de onboarding

Contratos del agente, templates y herramientas para el pipeline de briefs de onboarding.

🔗 **[Reportes de ejemplo](https://franpiaggio.github.io/brief-agent/)**

---

## Tools

### Brief Editor

Editor local para pulir briefs antes de mandarlos al cliente. Cargás un brief (HTML con JSON embebido o JSON suelto), corregís datos con un click sobre el documento y exportás el HTML actualizado. Sin servidor, sin LLM, sin auto-save.

→ [`tools/brief-editor/`](tools/brief-editor/) · [README](tools/brief-editor/README.md)

### Render

CLI TypeScript que valida el JSON del agente contra el schema Zod, calcula campos derivados y genera el HTML final del brief. Es la fuente de verdad del output — el Brief Editor y el Runner lo usan internamente.

```bash
cd tools/render
npm run render -- fixtures/test-ready.json output.html
```

→ [`tools/render/`](tools/render/) · [README](tools/render/README.md)

### Runner

> [!NOTE]
> Work in progress — coming soon.

Ejecutor local del agente. Arrastrás un transcript, elegís proveedor y modelo, y genera el brief completo. Soporta Claude Max (CLI local), Anthropic API y OpenAI API. Historial de runs con métricas de tokens y costo.

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

