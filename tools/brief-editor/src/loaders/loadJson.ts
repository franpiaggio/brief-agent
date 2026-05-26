import { BriefSchema } from '../schema'
import type { BriefData } from '../types'

export async function loadJson(file: File): Promise<BriefData> {
  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('El archivo no contiene JSON válido')
  }

  const result = BriefSchema.safeParse(json)
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.join('.')
    throw new Error(`Campo inválido: ${path} — ${issue.message}`)
  }

  return result.data
}
