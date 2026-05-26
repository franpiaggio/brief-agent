import type { Block } from '../types'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { BlockIcon } from './BlockIcon'
import { BlockFields } from './BlockFields'
import { BlockPending } from './BlockPending'
import { Editable } from '../editor/Editable'
import { AddZone } from '../editor/AddZone'

const STATUS_LABEL: Record<Block['status'], string> = {
  ok: 'ok',
  warning: 'aviso',
  blocker: 'bloqueo',
}

type Props = {
  block: Block
  index: number
}

export function BlockComponent({ block, index }: Props) {
  const blockDef = BLOCK_DEFS.find((d) => d.id === block.id) ?? BLOCK_DEFS[index]

  const num = String(block.id).padStart(2, '0')
  const isIdentity = block.id === 1

  return (
    <div className={`block block--${block.status}`} data-block-id={block.id}>
      <div className="block-h">
        <span className="block-h-num">{num}</span>
        <span className="block-h-icon">
          <BlockIcon name={blockDef?.iconName ?? ''} />
        </span>
        <span className="block-h-title">{blockDef?.label ?? ''}</span>
        <Editable
          as="span"
          editType="block-status"
          blockIdx={index}
          className={`block-h-status block-h-status--${block.status}`}
        >
          {STATUS_LABEL[block.status]}
        </Editable>
      </div>

      {block.status_reason !== '' && (
        <Editable
          as="div"
          editType="block-status"
          blockIdx={index}
          className={`block-reason block-reason--${block.status}`}
        >
          <svg className="block-reason-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
            <path d="M12 9v4"/>
            <path d="M12 17h.01"/>
          </svg>
          <div className="block-reason-content">
            <span className="block-reason-label">{STATUS_LABEL[block.status]}</span>
            <span className="block-reason-text">{block.status_reason}</span>
          </div>
        </Editable>
      )}

      {block.fields.length > 0 && (
        <BlockFields
          fields={block.fields}
          variant={isIdentity ? 'identity' : 'bullets'}
          blockIndex={index}
        />
      )}

      {block.pending.length > 0 && (
        <BlockPending pending={block.pending} blockIndex={index} />
      )}
      <AddZone kind="pending" blockIdx={index} />
    </div>
  )
}

export { BlockComponent as Block }
