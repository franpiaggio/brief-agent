import type { BriefData } from '../types'
import { Hero } from './Hero'
import { Verdict } from './Verdict'
import { CoverageTiles } from './CoverageTiles'
import { Narrative } from './Narrative'
import { ConfigurationChecks } from './ConfigurationChecks'
import { ActionGrid } from './ActionGrid'
import { Block } from './Block'
import { NextMeeting } from './NextMeeting'

export function Brief({ data }: { data: BriefData }) {
  const pendingCount = data.blocks.reduce((sum, b) => sum + b.pending.length, 0)
  const customCount = data.custom?.items.length ?? 0
  const meetingDate = data.meta.meeting_date

  return (
    <article className="doc brief">
      <header className="brand-bar">
        <span className="brand-mark">EasyDocking</span>
        {meetingDate && <span className="brand-meta">Brief · {meetingDate}</span>}
      </header>

      <section className="hero">
        <Hero data={data} />
        <NextMeeting nextMeeting={data.next_meeting} />
        <Verdict
          verdict={data.verdict}
          pendingCount={pendingCount}
          customCount={customCount}
        />
        <CoverageTiles blocks={data.blocks} />
      </section>

      <Narrative narrative={data.narrative} />

      <ConfigurationChecks blocks={data.blocks} />

      <ActionGrid blocks={data.blocks} custom={data.custom} />

      {data.blocks.map((block, idx) => (
        <section key={block.id} className="section">
          <Block block={block} index={idx} />
        </section>
      ))}
    </article>
  )
}
