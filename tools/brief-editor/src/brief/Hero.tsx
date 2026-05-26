import type { BriefData } from '../types'
import { VERDICT_BY_STATUS } from '../constants/verdictDefs'
import { Editable } from '../editor/Editable'

export function Hero({ data }: { data: BriefData }) {
  const verdictDef = VERDICT_BY_STATUS[data.verdict.status]
  const industry = data.meta.industry ?? null
  const country = data.meta.country ?? null

  return (
    <>
      <div className="hero-eyebrow">Cliente · Onboarding</div>
      <div className="hero-top">
        <Editable
          as="h1"
          editType="text"
          path="meta.client_name"
          label="Nombre del cliente"
          className="hero-h1"
        >
          {data.meta.client_name ?? '—'}
        </Editable>
        <Editable
          as="span"
          editType="verdict"
          className={`verdict-pill verdict-pill--${verdictDef?.cssClass ?? 'ready'}`}
        >
          {verdictDef?.label ?? data.verdict.status}
        </Editable>
      </div>
      <div className="hero-meta">
        {industry && (
          <Editable as="span" editType="text" path="meta.industry" label="Industria">
            {industry}
          </Editable>
        )}
        {industry && country && <span className="sep"></span>}
        {country && (
          <Editable as="span" editType="text" path="meta.country" label="País">
            {country}
          </Editable>
        )}
        {(industry || country) && data.meta.meeting_date && <span className="sep"></span>}
        {data.meta.meeting_date && (
          <span>
            Reunión{' '}
            <Editable
              as="span"
              editType="text"
              path="meta.meeting_date"
              label="Fecha de reunión"
              className="meta-date"
            >
              {data.meta.meeting_date}
            </Editable>
          </span>
        )}
      </div>
    </>
  )
}
