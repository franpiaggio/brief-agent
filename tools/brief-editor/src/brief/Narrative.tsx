import type { Narrative as NarrativeType } from '../types'
import { Editable } from '../editor/Editable'

type Props = {
  narrative: NarrativeType
}

export function Narrative({ narrative }: Props) {
  return (
    <section className="narrative">
      <div className="narrative-shell">
        <article className="narrative-card">
          <header className="narrative-header">
            <span className="narrative-eyebrow">Resumen ejecutivo</span>
          </header>
          <ol className="narrative-list">
            <li className="narrative-item">
              <h3 className="narrative-label">Brief</h3>
              <Editable
                as="p"
                editType="text"
                path="narrative.current_situation"
                label="Brief"
                multiline
                className="narrative-text"
              >
                {narrative.current_situation ?? '—'}
              </Editable>
            </li>
            <li className="narrative-item">
              <h3 className="narrative-label">Qué buscan</h3>
              <Editable
                as="p"
                editType="text"
                path="narrative.what_they_want"
                label="Qué buscan"
                multiline
                className="narrative-text"
              >
                {narrative.what_they_want ?? '—'}
              </Editable>
            </li>
            <li className="narrative-item">
              <h3 className="narrative-label">Cierre de la reunión</h3>
              <Editable
                as="p"
                editType="text"
                path="narrative.closure"
                label="Cierre de la reunión"
                multiline
                className="narrative-text"
              >
                {narrative.closure ?? '—'}
              </Editable>
            </li>
          </ol>
        </article>
      </div>
    </section>
  )
}
