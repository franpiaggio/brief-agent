import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { Brief } from '../brief/Brief'
import type { BriefData } from '../types'

let cachedCss: string | null = null

async function loadBriefStyles(): Promise<string> {
  if (cachedCss !== null) return cachedCss
  const url = `${import.meta.env.BASE_URL}brief-styles.css`
  const res = await fetch(url)
  cachedCss = await res.text()
  return cachedCss
}

function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/-->/g, '--\\u003e')
}

export async function toHtml(data: BriefData): Promise<string> {
  const briefHtml = renderToStaticMarkup(createElement(Brief, { data }))
  const json = safeJsonForScript(data)
  const clientName = data.meta.client_name ?? 'brief'
  const title = `Brief · ${clientName}`
  const css = await loadBriefStyles()

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
${css}
  </style>
</head>
<body>
${briefHtml}
<script type="application/json" id="brief-source">
${json}
</script>
</body>
</html>`
}
