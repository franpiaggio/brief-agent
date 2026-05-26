import { use } from 'react'
import type { NextMeeting as NextMeetingType } from '../types'
import { IconCalendarDaysFull } from './icons'
import { Editable } from '../editor/Editable'
import { BriefContext } from '../state/BriefContext'

type Props = {
  nextMeeting: NextMeetingType | null | undefined
}

export function NextMeeting({ nextMeeting }: Props) {
  const inEditor = use(BriefContext) !== null
  const hasMeeting = !!nextMeeting && (nextMeeting.date || nextMeeting.label || nextMeeting.summary)

  if (!hasMeeting) {
    if (!inEditor) return null
    return (
      <Editable as="button" editType="next-meeting" className="next-meeting next-meeting--empty">
        <div className="next-meeting-stamp" aria-hidden="true">
          <IconCalendarDaysFull className="next-meeting-icon" />
        </div>
        <div className="next-meeting-body">
          <span className="next-meeting-label">Próxima reunión</span>
          <span className="next-meeting-text">Agregar próxima reunión con fecha</span>
        </div>
      </Editable>
    )
  }

  return (
    <Editable as="div" editType="next-meeting" className="next-meeting">
      <div className="next-meeting-stamp" aria-hidden="true">
        <IconCalendarDaysFull className="next-meeting-icon" />
      </div>
      <div className="next-meeting-body">
        <span className="next-meeting-label">{nextMeeting!.label ?? '—'}</span>
        <span className="next-meeting-text">{nextMeeting!.summary ?? '—'}</span>
      </div>
      <div>
        <div className="next-meeting-date">{nextMeeting!.date ?? '—'}</div>
        <div className="next-meeting-time">{nextMeeting!.time ?? ''}</div>
      </div>
    </Editable>
  )
}
