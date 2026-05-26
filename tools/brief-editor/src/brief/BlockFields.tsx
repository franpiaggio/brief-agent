import type { Field } from '../types'
import { Editable } from '../editor/Editable'
import { fieldLabel } from '../constants/fieldLabels'
import { IdentityIcon } from './IdentityIcon'

type Props = {
  fields: Field[]
  variant: 'identity' | 'bullets'
  blockIndex: number
}

function stateModifier(state: Field['state'], base: 'bullet-a' | 'identity-card'): string {
  if (state === 'missing') return ` ${base}--missing`
  if (state === 'vague') return ` ${base}--vague`
  return ''
}

export function BlockFields({ fields, variant, blockIndex }: Props) {
  if (variant === 'identity') {
    return (
      <div className="identity-grid">
        {fields.map((field, fidx) => (
          <Editable
            key={field.key}
            as="div"
            editType="field"
            blockIdx={blockIndex}
            fieldIdx={fidx}
            className={`identity-card identity-card--scalar${stateModifier(field.state, 'identity-card')}`}
          >
            <IdentityIcon fieldKey={field.key} />
            <div className="identity-body">
              <span className="identity-label">{fieldLabel(field.key)}</span>
              <span className="identity-value">{field.answer ?? '—'}</span>
            </div>
          </Editable>
        ))}
      </div>
    )
  }

  return (
    <ul className="bullets">
      {fields.map((field, fidx) => (
        <Editable
          key={field.key}
          as="li"
          editType="field"
          blockIdx={blockIndex}
          fieldIdx={fidx}
          className="bullet"
        >
          <span className="bullet-q">{fieldLabel(field.key)}</span>
          <span className={`bullet-a${stateModifier(field.state, 'bullet-a')}`}>{field.answer ?? '—'}</span>
        </Editable>
      ))}
    </ul>
  )
}
