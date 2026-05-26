import { use } from 'react'
import type { Block, BriefData } from '../types'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { Editable } from '../editor/Editable'
import { AddZone } from '../editor/AddZone'
import { BriefContext } from '../state/BriefContext'

type Props = {
  blocks: Block[]
  custom?: BriefData['custom']
}

const BLOCK_DEF_BY_ID = Object.fromEntries(BLOCK_DEFS.map((d) => [d.id, d]))

function sourceLabel(blockId: number): string {
  const def = BLOCK_DEF_BY_ID[blockId]
  if (!def) return String(blockId).padStart(2, '0')
  return `${String(def.id).padStart(2, '0')} · ${def.label}`
}

export function ActionGrid({ blocks, custom }: Props) {
  const inEditor = use(BriefContext) !== null
  const pending = blocks.flatMap((block, blockIndex) =>
    block.pending.map((item, itemIdx) => ({ ...item, blockId: block.id, blockIndex, itemIdx })),
  )
  const customItems = custom?.items ?? []

  if (!inEditor && pending.length === 0 && customItems.length === 0) return null

  return (
    <section className="section">
      <div className="action-grid">
        {pending.length > 0 && (
          <div className="action-box action-box--pending">
            <div className="action-box-h">
              Cliente debe enviar
              <span className="action-box-h-badge">{pending.length}</span>
            </div>
            {pending.map((entry, i) => (
              <Editable
                key={i}
                as="div"
                editType="pending"
                blockIdx={entry.blockIndex}
                itemIdx={entry.itemIdx}
                className="deliverable"
              >
                <svg className="deliverable-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                  <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                </svg>
                <div className="deliverable-body">
                  <span className="deliverable-title">{entry.description}</span>
                  {entry.citation && <span className="deliverable-cite">{entry.citation}</span>}
                </div>
                <span className="deliverable-source">{sourceLabel(entry.blockId)}</span>
              </Editable>
            ))}
          </div>
        )}
        {(customItems.length > 0 || inEditor) && (
          <div className="action-box action-box--custom">
            <div className="action-box-h">
              Requerimientos custom
              <span className="action-box-h-badge">{customItems.length}</span>
            </div>
            {customItems.map((entry, i) => (
              <Editable
                key={i}
                as="div"
                editType="custom"
                itemIdx={i}
                className="deliverable deliverable--custom"
              >
                <svg className="deliverable-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
                </svg>
                <div className="deliverable-body">
                  <span className="deliverable-title">{entry.description}</span>
                  {entry.citation && <span className="deliverable-cite">{entry.citation}</span>}
                </div>
              </Editable>
            ))}
            {customItems.length > 0 && (
              <div className="action-box-note">
                Fuera del estándar de EasyDocking. Producto debe evaluar costo de implementación.
              </div>
            )}
            <AddZone kind="custom" />
          </div>
        )}
      </div>
    </section>
  )
}
