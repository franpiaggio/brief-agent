import type { Block } from '../types'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { BlockIcon } from './icons'
import { Editable } from '../editor/Editable'

type Props = {
  blocks: Block[]
}

function tileModifier(status: Block['status']): string {
  if (status === 'warning') return 'coverage-tile--warning'
  if (status === 'blocker') return 'coverage-tile--blocker'
  return 'coverage-tile--ok'
}

export function CoverageTiles({ blocks }: Props) {
  const okCount = blocks.filter((b) => b.status === 'ok').length
  const warningCount = blocks.filter((b) => b.status === 'warning').length
  const blockerCount = blocks.filter((b) => b.status === 'blocker').length

  return (
    <div className="coverage">
      <div className="coverage-h">
        <span className="coverage-label">Cobertura · {blocks.length} bloques</span>
        <div className="coverage-legend">
          <span className="coverage-legend--ok">{okCount} ok</span>
          <span className="coverage-legend--warning">{warningCount} aviso</span>
          <span className="coverage-legend--blocker">{blockerCount} bloqueo</span>
        </div>
      </div>
      <div className="coverage-tiles">
        {blocks.map((block, idx) => {
          const def = BLOCK_DEFS.find((d) => d.id === block.id)
          if (!def) return null
          const num = String(block.id).padStart(2, '0')
          return (
            <Editable
              key={block.id}
              as="div"
              editType="block-status"
              blockIdx={idx}
              className={`coverage-tile ${tileModifier(block.status)}`}
            >
              <BlockIcon iconName={def.iconName} className="coverage-tile-icon" />
              <span className="coverage-tile-num">{num}</span>
              <span className="coverage-tile-name">{def.shortName}</span>
            </Editable>
          )
        })}
      </div>
    </div>
  )
}
