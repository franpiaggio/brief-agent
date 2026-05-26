import { BriefSchema } from '../schema'
import type { BriefData } from '../types'

export async function loadHtml(file: File): Promise<BriefData> {
  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })

  const doc = new DOMParser().parseFromString(text, 'text/html')
  const script = doc.querySelector('script#brief-source')
  if (!script) {
    throw new Error('No se encontró <script id="brief-source"> en el HTML')
  }

  let json: unknown
  try {
    json = JSON.parse(script.textContent ?? '')
  } catch {
    throw new Error('El contenido de <script id="brief-source"> no es JSON válido')
  }

  const result = BriefSchema.safeParse(json)
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.join('.')
    throw new Error(`Campo inválido: ${path} — ${issue.message}`)
  }

  return result.data
}
