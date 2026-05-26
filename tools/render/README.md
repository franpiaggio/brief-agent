# Render

Renderer TypeScript que toma el JSON del agente de onboarding y lo convierte en el brief HTML final.

## Ejemplos

Render de un fixture a HTML autocontenido:

```bash
cd tools/render
npm run render -- fixtures/test-ready.json output-examples/ready.html
```

Render por stdin:

```bash
cat brief.json | tsx adapters/cli.ts > output.html
```

Render a un archivo cualquiera:

```bash
npm run render -- fixtures/test-blocked.json /private/tmp/blocked.html
```
