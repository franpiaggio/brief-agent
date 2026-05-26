import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { BriefSchema } from '../schema'
import type { BriefData } from '../types'

// Configure worker once (module-level, idempotent)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

export async function loadPdf(file: File): Promise<BriefData> {
  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDoc = await loadingTask.promise

  const attachments = await pdfDoc.getAttachments() as Record<string, { content: Uint8Array; filename: string }> | null
  if (!attachments || !attachments['brief-source.json']) {
    throw new Error(
      'Este PDF no contiene datos editables. Exportá primero desde Brief Editor para generar un PDF con el JSON embebido.'
    )
  }

  const content = attachments['brief-source.json'].content
  const jsonText = new TextDecoder().decode(content)

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('El adjunto brief-source.json no es JSON válido')
  }

  const result = BriefSchema.safeParse(parsed)
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.join('.')
    throw new Error(`Campo inválido en el adjunto: ${path} — ${issue.message}`)
  }

  return result.data
}
