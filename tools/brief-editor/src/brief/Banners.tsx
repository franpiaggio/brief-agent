import type { Verdict } from '../types'

type Props = {
  verdict: Verdict
}

export function Banners({ verdict }: Props) {
  if (verdict.status !== 'blocked') return null

  return (
    <section className="section">
      <div className="block-reason block-reason--blocker">
        <svg className="block-reason-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        </svg>
        <div className="block-reason-content">
          <span className="block-reason-label">bloqueado</span>
          <span className="block-reason-text">{verdict.detail}</span>
        </div>
      </div>
    </section>
  )
}
