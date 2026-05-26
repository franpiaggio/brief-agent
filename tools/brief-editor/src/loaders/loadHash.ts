import { BriefSchema } from '../schema'
import type { BriefData } from '../types'

const PREFIX = '#brief='

export function hasBriefHash(hash: string): boolean {
  return hash.startsWith(PREFIX)
}

export function loadFromHash(hash: string): BriefData {
  if (!hasBriefHash(hash)) {
    throw new Error('El link no contiene un brief')
  }
  const payload = hash.slice(PREFIX.length)
  if (!payload) {
    throw new Error('El link no contiene un brief')
  }

  let decoded: string
  try {
    decoded = decodeURIComponent(payload)
  } catch {
    throw new Error('El link está mal codificado')
  }

  let json: unknown
  try {
    json = JSON.parse(decoded)
  } catch {
    throw new Error('El brief incluido en el link no es JSON válido')
  }

  const result = BriefSchema.safeParse(json)
  if (!result.success) {
    const issue = result.error.issues[0]
    const path = issue.path.join('.')
    throw new Error(`Campo inválido: ${path} — ${issue.message}`)
  }

  return result.data
}
