import type { BriefData } from '../types'
import { toHtml } from './toHtml'

export async function downloadPdf(data: BriefData): Promise<void> {
  const html = await toHtml(data)

  const win = window.open('about:blank', '_blank')
  if (!win) {
    throw new Error(
      'El navegador bloqueó la ventana emergente. Habilitá los popups para este sitio y reintentá.'
    )
  }

  win.document.open()
  win.document.write(html)
  win.document.close()

  win.document.fonts.ready.then(async () => {
    await new Promise<void>(r => setTimeout(r, 300))
    win.print()
  })
}
