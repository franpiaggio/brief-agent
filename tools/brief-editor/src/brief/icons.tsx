type IconProps = { className?: string }

function Svg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconBuilding({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 12h4"/>
      <path d="M10 8h4"/>
      <path d="M14 21v-3a2 2 0 0 0-4 0v3"/>
      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/>
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
    </Svg>
  )
}

export function IconLayers({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/>
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>
    </Svg>
  )
}

export function IconWorkflow({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect width="8" height="8" x="3" y="3" rx="2"/>
      <path d="M7 11v4a2 2 0 0 0 2 2h4"/>
      <rect width="8" height="8" x="13" y="13" rx="2"/>
    </Svg>
  )
}

export function IconUsers({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <path d="M16 3.128a4 4 0 0 1 0 7.744"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <circle cx="9" cy="7" r="4"/>
    </Svg>
  )
}

export function IconCalendarDays({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 2v4"/>
      <path d="M16 2v4"/>
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <path d="M3 10h18"/>
    </Svg>
  )
}

export function IconPackage({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
      <path d="M12 22V12"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <path d="m7.5 4.27 9 5.15"/>
    </Svg>
  )
}

export function IconListChecks({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13 5h8"/>
      <path d="M13 12h8"/>
      <path d="M13 19h8"/>
      <path d="m3 17 2 2 4-4"/>
      <path d="m3 7 2 2 4-4"/>
    </Svg>
  )
}

export function IconMail({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
      <rect x="2" y="4" width="20" height="16" rx="2"/>
    </Svg>
  )
}

export function IconSlidersHorizontal({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 17H5"/>
      <path d="M19 7h-9"/>
      <circle cx="17" cy="17" r="3"/>
      <circle cx="7" cy="7" r="3"/>
    </Svg>
  )
}

export function IconCircleCheck({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </Svg>
  )
}

export function IconCalendarDaysFull({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 2v4"/>
      <path d="M16 2v4"/>
      <rect width="18" height="18" x="3" y="4" rx="2"/>
      <path d="M3 10h18"/>
      <path d="M8 14h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 18h.01"/>
      <path d="M12 18h.01"/>
      <path d="M16 18h.01"/>
    </Svg>
  )
}

export function IconTriangleAlert({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </Svg>
  )
}

export function IconOctagonX({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688A2 2 0 0 1 15.312 22H8.688a2 2 0 0 1-1.414-.586z"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </Svg>
  )
}

const BLOCK_ICON_MAP: Record<string, (props: IconProps) => React.ReactElement> = {
  building: IconBuilding,
  layers: IconLayers,
  workflow: IconWorkflow,
  users: IconUsers,
  'calendar-days': IconCalendarDays,
  package: IconPackage,
  'list-checks': IconListChecks,
  mail: IconMail,
  'sliders-horizontal': IconSlidersHorizontal,
  'circle-check': IconCircleCheck,
}

export function BlockIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = BLOCK_ICON_MAP[iconName]
  if (!Icon) return null
  return <Icon className={className} />
}
