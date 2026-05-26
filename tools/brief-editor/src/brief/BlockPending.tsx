import type { PendingItem } from '../types'
import { Editable } from '../editor/Editable'

type Props = {
  pending: PendingItem[]
  blockIndex: number
}

export function BlockPending({ pending, blockIndex }: Props) {
  return (
    <div className="block-pending">
      {pending.map((item, i) => (
        <Editable
          key={i}
          as="div"
          editType="pending"
          blockIdx={blockIndex}
          itemIdx={i}
          className="deliverable"
        >
          <svg className="deliverable-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
          </svg>
          <div className="deliverable-body">
            <span className="deliverable-title">{item.description}</span>
            {item.citation && <span className="deliverable-cite">{item.citation}</span>}
          </div>
        </Editable>
      ))}
    </div>
  )
}
