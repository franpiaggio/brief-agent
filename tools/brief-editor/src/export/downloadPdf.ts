import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { PDFDocument } from 'pdf-lib'
import type { BriefData } from '../types'
import { toHtml } from './toHtml'
import { buildFilename } from './downloadHtml'

// A4 at 96 DPI: 210mm × 25.4 = ~794px
const A4_WIDTH_PX = 794
const CANVAS_SCALE = 1

export async function downloadPdf(data: BriefData): Promise<void> {
  const html = await toHtml(data)

  const iframe = document.createElement('iframe')
  iframe.style.cssText = `position:fixed;top:-10000px;left:0;width:${A4_WIDTH_PX}px;height:1px;border:none;`
  document.body.appendChild(iframe)

  try {
    await new Promise<void>((resolve, reject) => {
      iframe.addEventListener('load', async () => {
        try {
          const doc = iframe.contentDocument!
          await doc.fonts.ready
          iframe.style.height = doc.body.scrollHeight + 'px'
          resolve()
        } catch (e) { reject(e) }
      }, { once: true })
      iframe.srcdoc = html
    })

    const body = iframe.contentDocument!.body
    const canvas = await html2canvas(body, {
      scale: CANVAS_SCALE,
      useCORS: true,
      allowTaint: false,
      windowWidth: A4_WIDTH_PX,
      scrollX: 0,
      scrollY: 0,
    })

    // Convert to A4 PDF, splitting into pages as needed
    const imgData = canvas.toDataURL('image/jpeg', 0.88)
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const imgH = (canvas.height / canvas.width) * pageW

    let remaining = imgH
    let yOffset = 0
    pdf.addImage(imgData, 'JPEG', 0, yOffset, pageW, imgH)
    remaining -= pageH

    while (remaining > 0) {
      yOffset -= pageH
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, yOffset, pageW, imgH)
      remaining -= pageH
    }

    // Embed the source JSON so the PDF can be reimported into the editor
    const pdfDoc = await PDFDocument.load(pdf.output('arraybuffer'))
    const jsonBytes = new TextEncoder().encode(JSON.stringify(data, null, 2))
    await pdfDoc.attach(jsonBytes, 'brief-source.json', {
      mimeType: 'application/json',
      description: 'Brief source data — drag this PDF back into Brief Editor to continue editing',
      creationDate: new Date(),
      modificationDate: new Date(),
    })

    const finalBytes = await pdfDoc.save()
    const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = buildFilename(data).replace(/\.html$/, '.pdf')
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    document.body.removeChild(iframe)
  }
}
