# EasyDocking - Agente de onboarding

Este repositorio tiene contratos del agente, templates HTML y tooling para ejecutar el agente de onboarding.

🔗 **[Reportes de ejemplo](https://franpiaggio.github.io/brief-agent/)**

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

## `tools/render/`

Renderer TypeScript que valida el JSON, calcula campos derivados y genera el HTML final.

Ver detalle de uso en [tools/render/README.md](tools/render/README.md).

| Archivo | Qué es |
|---|---|
| `core/schema.ts` | Validación Zod del JSON de entrada. |
| `core/mappings.ts` | Labels, iconos y clases derivados de estados/bloques. |
| `core/compute.ts` | Enriquecimiento del JSON para render. |
| `template.html` | Plantilla Handlebars activa del renderer. |
| `styles.css` | CSS activo para el HTML generado por el renderer. |
| `fixtures/` | JSONs de ejemplo para validar estados del brief. |
| `core/render.ts` | Compila `tools/render/template.html` y devuelve HTML. |
| `adapters/cli.ts` | CLI para renderizar desde un archivo o stdin. |

Uso:

```bash
cd tools/render
npm run render -- fixtures/test-ready.json output.html
```

Para revisar ejemplos generados localmente, usar `tools/render/output-examples/`. Esa carpeta esta ignorada por git.

## `transcripts/`

Transcripts de ejemplo para probar el agente (cliente ficticio).
