# AGENTS.md

Guía para Codex sobre cómo trabajar en este repo.

## Qué es este repo

Casa canónica del **brief de onboarding de EasyDocking**: el reporte en español que se entrega después de una reunión de relevamiento con un cliente.

El repo se organiza en cuatro partes:

1. **Contratos del agente** (`agent/`) — cuestionario, system prompt y schema JSON.
2. **Renderer** (`tools/render/`) — valida el JSON y genera el HTML final.
3. **Example templates** (`example-templates/`) — briefs HTML estáticos para revisar los cinco estados visuales.
4. **Documentación de producto/diseño** (`docs/`) — contexto cualitativo y design system.

El orden de verdad es: cuestionario → schema/prompt → renderer → examples. Los examples no son runtime; son referencia visual publicada.

## Contratos vivos

`agent/cuestionario-onboarding.md` define los 10 bloques temáticos de la reunión. Toda sección del brief tiene que mapear a esos bloques.

`agent/output-schema.md` define el JSON que emite el agente. Si cambia el schema, revisar también `tools/render/core/schema.ts`.

`agent/system-prompt.md` define cómo extraer datos del transcript: no inventar, citar datos, respetar labels cerrados y clasificar `ok | vague | missing`.

## Renderer

`tools/render/` es el código activo de generación:

- `template.html` — plantilla Handlebars activa.
- `styles.css` — CSS activo del HTML generado.
- `core/schema.ts` — validación Zod.
- `core/compute.ts` — campos derivados.
- `core/mappings.ts` — labels, iconos y clases.
- `core/render.ts` — compila la plantilla.
- `adapters/cli.ts` — CLI.

Uso:

```bash
cd tools/render
npm run render -- test-ready.json output-examples/ready.html
```

`tools/render/output-examples/` es para inspección local y está ignorado por git.

## Example Templates

`example-templates/` contiene los cinco briefs estáticos:

- `brief-html-ready/`
- `brief-html-with-pendings/`
- `brief-html-blocked/`
- `brief-html-off-script/`
- `brief-html-no-meeting/`

`.github/workflows/deploy.yml` publica `example-templates/` en GitHub Pages. No hay build step.

## Docs

- `docs/product.md` — propósito, usuarios, personalidad y principios del producto.
- `docs/design.md` — tokens, componentes y reglas visuales.

## Convenciones

- Todo contenido visible del brief va en español.
- El renderer es fuente de verdad para el HTML generado; no duplicar contratos en Markdown.
- Los examples sirven para revisar visualmente estados, no para meter lógica runtime.
- Si cambia el JSON del agente, revisar schema, mappings, fixtures y examples.
- Si cambia el look, actualizar `tools/render/styles.css` y sincronizar `example-templates/styles.css` si corresponde.
