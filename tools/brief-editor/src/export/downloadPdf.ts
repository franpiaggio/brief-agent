import { createElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import type { ReactElement } from 'react'
import { PDFDocument } from 'pdf-lib'
import type { BriefData } from '../types'
import { BriefPdf } from './BriefPdf'
import { buildFilename } from './downloadHtml'

export async function downloadPdf(data: BriefData): Promise<void> {
  // 1. Render PDF with @react-pdf/renderer
  // Cast through unknown: pdf() expects a Document-typed element; BriefPdf wraps Document but TS can't verify
  const element = createElement(BriefPdf, { data }) as unknown as ReactElement<DocumentProps>
  const blob = await pdf(element).toBlob()
  const rawBytes = await blob.arrayBuffer()

  // 2. Open with pdf-lib to embed the source JSON as an attachment
  const pdfDoc = await PDFDocument.load(rawBytes)
  const jsonBytes = new TextEncoder().encode(JSON.stringify(data, null, 2))
  await pdfDoc.attach(jsonBytes, 'brief-source.json', {
    mimeType: 'application/json',
    description: 'Brief source data — drag this PDF back into Brief Editor to continue editing',
    creationDate: new Date(),
    modificationDate: new Date(),
  })

  // 3. Save and trigger download
  const finalBytes = await pdfDoc.save()
  const finalBlob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(finalBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = buildFilename(data).replace(/\.html$/, '.pdf')
  a.click()
  URL.revokeObjectURL(url)
}
