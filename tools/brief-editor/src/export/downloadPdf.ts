import type { BriefData } from '../types'
import { toHtml } from './toHtml'

// Opens the rendered HTML in a new tab and triggers the browser's native print dialog.
// The browser renders the HTML with its full engine → vector PDF with selectable text.
export async function downloadPdf(data: BriefData): Promise<void> {
  const html = await toHtml(data)
  const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const win = window.open(url, '_blank')
  if (!win) {
    URL.revokeObjectURL(url)
    throw new Error(
      'El navegador bloqueó la ventana emergente. Habilitá los popups para este sitio y reintentá.'
    )
  }

  win.addEventListener('load', async () => {
    await win.document.fonts.ready
    await new Promise<void>(r => setTimeout(r, 300))
    win.print()
    URL.revokeObjectURL(url)
  })
}
