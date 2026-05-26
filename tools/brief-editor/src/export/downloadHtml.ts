import type { BriefData } from '../types'

export function buildFilename(data: BriefData): string {
  const name = (data.meta.client_name ?? 'brief').toLowerCase().replace(/\s+/g, '-')
  const date = data.meta.meeting_date ?? new Date().toISOString().slice(0, 10)
  return `${name}-onboarding-${date}.html`
}

export function downloadHtml(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
