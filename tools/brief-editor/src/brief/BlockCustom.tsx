import type { CustomItem } from '../types'
import { Editable } from '../editor/Editable'

type Props = {
  items: CustomItem[]
}

export function BlockCustom({ items }: Props) {
  return (
    <div className="block-custom">
      {items.map((item, i) => (
        <div key={i} className="deliverable deliverable--custom">
          <svg className="deliverable-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>
          </svg>
          <div className="deliverable-body">
            <Editable as="span" path={`custom.items.${i}.description`} className="deliverable-title">{item.description}</Editable>
            {item.citation && (
              <span className="deliverable-cite">{item.citation}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
