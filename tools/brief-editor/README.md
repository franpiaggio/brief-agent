<div align="center">

<img src="public/favicon.svg" alt="brief editor" width="72" height="72" />

# Brief Editor

**Editor estático local-only para pulir briefs de onboarding antes de mandarlos al cliente.**

</div>

Cargá un brief (HTML con JSON embebido o JSON suelto), corregí cualquier dato con un click directo sobre el documento, exportá el HTML actualizado. Sin servidor, sin LLM, sin auto-save: la edición vive en tu navegador y el resultado es un `.html` standalone con todo el CSS inline, listo para mandar por email o publicar.

## Características

- **WYSIWYG por click**: clickeás cualquier dato del brief (cliente, citas, status, opciones, pendientes, narrativa, próxima reunión) y se abre un modal contextual para editar.
- **Sin servidor**: 100% client-side. Cargá, editá, exportá, cerrás la tab.
- **Roundtrip lossless**: el HTML exportado embebe el JSON canónico en un `<script id="brief-source">`, así podés recargarlo más tarde y seguir editando sin perder nada.
- **Validación con Zod**: cuando cargás un archivo, el schema se valida con paths claros (`Campo inválido: blocks.0.fields.2.answer, expected string`).
- **CSS inline en el export**: el HTML descargado no depende de archivos externos. Funciona offline, por email, en cualquier visor.
- **Spanish-first**: labels y copy en español, sin keys `snake_case` expuestas.

> [!NOTE]
> Esto es parte de [`brief-agent-templates`](../..). El editor consume el JSON que define [`agent/output-schema.md`](../../agent/output-schema.md) y renderiza con los tokens del design system de [`tools/render/`](../render/).

## Stack

- React 19 + TypeScript
- Vite 8 (con `base: '/tools/brief-editor/'` para deploy bajo subpath)
- Zod 4 para validación de schema
- Cero dependencias adicionales: sin router, sin state library, sin UI kit

## Instalación

```bash
cd tools/brief-editor
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrí `http://localhost:5173/tools/brief-editor/` en el navegador y arrastrá un `.html` (con JSON embebido) o `.json` canónico a la dropzone.

## Build de producción

```bash
npm run build
npm run preview   # opcional: levanta el bundle compilado
```

El bundle queda en `dist/`. Por defecto está configurado para servirse bajo `/tools/brief-editor/` (ver `vite.config.ts`).

## Flujo de uso

1. **Dropzone inicial**: arrastrá un `.html` (con JSON embebido) o `.json` canónico.
2. **Vista de edición**: el brief se rinde a 920 px nativos, escalado al viewport.
   - Click en un dato, modal con los campos editables (respuesta, cita, confianza).
   - Click en un chip de opción, cicla `sí → no → por definir`.
   - Click en el label del grupo, editor de citas por opción.
   - Click en la pill de status de un bloque, cambia estado y comentario.
   - Click en la verdict pill, cambia estado del verdict, summary y detalle.
   - Hover al final de un bloque, botón `+ Agregar pendiente`.
3. **Toolbar**: dropdown de verdict (cambio rápido), dropdown de bloques (jump-to), indicador `Sin exportar` / `Documento exportado`, botón `Exportar HTML` (atajo `Cmd+E`).
4. **Cancelar**: cualquier modal se cierra con `Esc` o click en el backdrop, sin aplicar cambios.

> [!TIP]
> El editor avisa con un prompt nativo del navegador si intentás recargar o cerrar la tab con cambios sin exportar.

## Formatos de entrada

| Formato | Cuándo usar |
|---|---|
| `.html` | El output del agente o un brief ya editado. El loader busca `<script id="brief-source">` en el HTML, extrae el JSON y lo parsea. |
| `.json` | El JSON canónico directo, sin renderizar. Útil para inspección o pruebas (por ejemplo los fixtures de `tools/render/fixtures/`). |

Si el HTML no contiene el `<script>`, el editor muestra un error claro. Para que un HTML del renderer sea editable, debe haberse generado con la versión actual del renderer (que embebe automáticamente el JSON).

## Shortcuts

| Atajo | Acción |
|---|---|
| `Cmd` / `Ctrl` + `E` | Exportar HTML |
| `Esc` | Cerrar modal (sin aplicar) |
| `Cmd` / `Ctrl` + `Enter` | Aplicar dentro de un modal |
| `Tab` / `Shift+Tab` | Navegar campos dentro del modal |
