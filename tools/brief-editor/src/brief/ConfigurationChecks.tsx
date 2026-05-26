import type { Block, Option } from '../types'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { groupLabel } from '../constants/groupLabels'
import { Editable } from '../editor/Editable'

type Props = { blocks: Block[] }

type ChipClass = 'chk-chip--yes' | 'chk-chip--no' | 'chk-chip--unknown'

function chipClass(needed: Option['needed']): ChipClass {
  if (needed === true) return 'chk-chip--yes'
  if (needed === false) return 'chk-chip--no'
  return 'chk-chip--unknown'
}

export function ConfigurationChecks({ blocks }: Props) {
  const sectionsWithOptions = blocks
    .map((block, blockIdx) => ({ block, blockIdx }))
    .filter(({ block }) => block.options.length > 0)

  if (sectionsWithOptions.length === 0) return null

  return (
    <section className="checks">
      <div className="checks-shell">
        <div className="checks-head">
          <span className="checks-eyebrow">Configuración elegida</span>
          <div className="checks-legend">
            <span className="chk-chip chk-chip--yes">activo</span>
            <span className="chk-chip chk-chip--no">descartado</span>
            <span className="chk-chip chk-chip--unknown">por definir</span>
          </div>
        </div>

        {sectionsWithOptions.map(({ block, blockIdx }) => {
          const def = BLOCK_DEFS[blockIdx]
          const groups = block.options.reduce<Map<string, Option[]>>((map, opt) => {
            const list = map.get(opt.group_name) ?? []
            list.push(opt)
            map.set(opt.group_name, list)
            return map
          }, new Map())

          return (
            <div key={block.id} className="chk-section">
              <div className="chk-section-head">
                <span className="chk-section-num">{String(block.id).padStart(2, '0')}</span>
                <span className="chk-section-name">{def?.label ?? block.name}</span>
              </div>

              {Array.from(groups.entries()).map(([groupName, items]) => (
                <div key={groupName} className="chk-row">
                  <Editable
                    as="span"
                    editType="option-group"
                    blockIdx={blockIdx}
                    groupName={groupName}
                    className="chk-row-label"
                  >
                    {groupLabel(groupName)}
                  </Editable>
                  <div className="chk-row-chips">
                    {items.map((item) => (
                      <Editable
                        key={item.label}
                        as="span"
                        editType="option-cycle"
                        blockIdx={blockIdx}
                        groupName={groupName}
                        label={item.label}
                        className={`chk-chip ${chipClass(item.needed)}`}
                      >
                        {item.label}
                      </Editable>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
