import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer'
import type { BriefData, Block } from '../types'
import { BLOCK_DEFS } from '../constants/blockDefs'
import { fieldLabel } from '../constants/fieldLabels'
import { groupLabel } from '../constants/groupLabels'

// ── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  brand:       '#3db27c',
  brandLight:  '#ecf9f3',
  warning:     '#c77c0a',
  warningBg:   '#fef8ec',
  blocked:     '#c53030',
  blockedBg:   '#fff2f2',
  text:        '#1a1a2e',
  muted:       '#6b6b80',
  faint:       '#b0b0c0',
  border:      '#e4e4ef',
  surface:     '#f6f6fb',
  white:       '#ffffff',
}

// ── Verdict config ────────────────────────────────────────────────────────────
const VERDICT_CFG: Record<string, { label: string; color: string; bg: string }> = {
  ready:              { label: 'Listo para implementar', color: C.brand,   bg: C.brandLight },
  ready_with_pending: { label: 'Listo con pendientes',   color: C.warning, bg: C.warningBg  },
  blocked:            { label: 'Bloqueado',               color: C.blocked, bg: C.blockedBg  },
}

// ── Block status config ───────────────────────────────────────────────────────
const BLOCK_STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  ok:      { label: 'ok',       color: C.brand,   bg: C.brandLight },
  warning: { label: 'aviso',    color: C.warning, bg: C.warningBg  },
  blocker: { label: 'bloqueo',  color: C.blocked, bg: C.blockedBg  },
}

const OPTION_LABEL: Record<string | 'null', string> = {
  true:  'Sí',
  false: 'No',
  null:  'Por definir',
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: C.text,
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 44,
    backgroundColor: C.white,
    lineHeight: 1.4,
  },

  // ── Header ──
  header: { marginBottom: 20 },
  accentBar: {
    width: 28,
    height: 3,
    backgroundColor: C.brand,
    marginBottom: 10,
    borderRadius: 2,
  },
  clientName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    marginBottom: 6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerDate: { fontSize: 8, color: C.muted, marginRight: 10 },
  verdictPill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 99,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Verdict box ──
  verdictBox: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 18,
  },
  verdictLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  verdictSummary: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  verdictDetail: { fontSize: 8, lineHeight: 1.5 },

  // ── Section title ──
  sectionTitle: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.faint,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },

  // ── Narrative ──
  narrativeCard: {
    backgroundColor: C.surface,
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: C.brand,
    borderLeftStyle: 'solid',
  },
  narrativeGroup: { marginBottom: 8 },
  narrativeLabel: {
    fontSize: 7,
    color: C.brand,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  narrativeText: { fontSize: 8.5, color: C.text, lineHeight: 1.55 },
  narrativeMissing: { fontSize: 8.5, color: C.faint, fontStyle: 'italic' },

  // ── Coverage ──
  coverageRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverageTile: {
    flex: 1,
    marginRight: 6,
    backgroundColor: C.surface,
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
  },
  coverageNum: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  coverageLabel: { fontSize: 7, color: C.muted, textAlign: 'center' },

  // ── Block ──
  block: {
    marginBottom: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'solid',
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  blockNum: {
    fontSize: 7,
    color: C.faint,
    marginRight: 6,
    fontFamily: 'Helvetica-Bold',
  },
  blockTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },
  blockStatusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  blockBody: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
    backgroundColor: C.white,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  blockStatusReason: {
    fontSize: 7.5,
    color: C.muted,
    marginBottom: 8,
    fontStyle: 'italic',
  },

  // ── Fields ──
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  fieldKey: {
    width: 130,
    fontSize: 7.5,
    color: C.muted,
    flexShrink: 0,
    paddingRight: 6,
  },
  fieldVal: { flex: 1, fontSize: 7.5, color: C.text, lineHeight: 1.45 },
  fieldMissing: {
    flex: 1,
    fontSize: 7.5,
    color: C.faint,
    fontStyle: 'italic',
  },
  fieldStateOk:      { color: C.brand   },
  fieldStateVague:   { color: C.warning },
  fieldStateMissing: { color: C.blocked },

  // ── Options ──
  optionsSection: { marginTop: 8 },
  optionGroupLabel: {
    fontSize: 7,
    color: C.muted,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2.5,
    paddingLeft: 6,
  },
  optionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 5,
    flexShrink: 0,
    marginTop: 1,
  },
  optionName: { fontSize: 7.5, flex: 1, color: C.text },
  optionBadge: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
  },

  // ── Pending ──
  pendingSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
    borderTopStyle: 'solid',
  },
  pendingLabel: {
    fontSize: 7,
    color: C.muted,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pendingItem: {
    fontSize: 7.5,
    color: C.text,
    marginBottom: 2.5,
    paddingLeft: 8,
  },

  // ── Divider ──
  divider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    borderTopStyle: 'solid',
    marginBottom: 16,
    marginTop: 4,
  },

  // ── Page number ──
  pageNum: {
    position: 'absolute',
    bottom: 20,
    right: 44,
    fontSize: 7,
    color: C.faint,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: C.faint },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function groupOptionsByGroup(options: Block['options']) {
  const map = new Map<string, Block['options']>()
  for (const opt of options) {
    const list = map.get(opt.group_name) ?? []
    list.push(opt)
    map.set(opt.group_name, list)
  }
  return map
}

// ── Sub-components ────────────────────────────────────────────────────────────
function BlockSection({ block, idx }: { block: Block; idx: number }) {
  const def = BLOCK_DEFS[idx]
  const statusCfg = BLOCK_STATUS_CFG[block.status]
  const groupedOptions = groupOptionsByGroup(block.options)

  return (
    <View style={s.block} wrap={false}>
      {/* Header */}
      <View
        style={[
          s.blockHeader,
          { backgroundColor: statusCfg.bg },
        ]}
      >
        <Text style={s.blockNum}>{String(block.id).padStart(2, '0')}</Text>
        <Text style={s.blockTitle}>{def?.label ?? block.name}</Text>
        <Text style={[s.blockStatusPill, { color: statusCfg.color, backgroundColor: C.white }]}>
          {statusCfg.label}
        </Text>
      </View>

      {/* Body */}
      <View style={s.blockBody}>
        {block.status_reason ? (
          <Text style={s.blockStatusReason}>{block.status_reason}</Text>
        ) : null}

        {/* Fields */}
        {block.fields.length > 0 && (
          <View>
            {block.fields.map((f) => (
              <View key={f.key} style={s.fieldRow}>
                <Text style={s.fieldKey}>{fieldLabel(f.key)}</Text>
                {f.answer ? (
                  <Text style={s.fieldVal}>{f.answer}</Text>
                ) : (
                  <Text style={s.fieldMissing}>
                    {f.state === 'vague' ? 'Respuesta vaga' : 'Sin dato'}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Options */}
        {groupedOptions.size > 0 && (
          <View style={s.optionsSection}>
            {Array.from(groupedOptions.entries()).map(([groupName, opts]) => (
              <View key={groupName}>
                <Text style={s.optionGroupLabel}>{groupLabel(groupName)}</Text>
                {opts.map((opt, oi) => {
                  const neededStr = opt.needed === null ? 'null' : String(opt.needed)
                  const dotColor =
                    opt.needed === true
                      ? C.brand
                      : opt.needed === false
                        ? C.faint
                        : C.warning
                  const badgeColor =
                    opt.needed === true
                      ? C.brand
                      : opt.needed === false
                        ? C.muted
                        : C.warning
                  return (
                    <View key={oi} style={s.optionRow}>
                      <View style={[s.optionDot, { backgroundColor: dotColor }]} />
                      <Text style={s.optionName}>{opt.label}</Text>
                      <Text style={[s.optionBadge, { color: badgeColor }]}>
                        {OPTION_LABEL[neededStr] ?? '—'}
                      </Text>
                    </View>
                  )
                })}
              </View>
            ))}
          </View>
        )}

        {/* Pending */}
        {block.pending.length > 0 && (
          <View style={s.pendingSection}>
            <Text style={s.pendingLabel}>Pendientes ({block.pending.length})</Text>
            {block.pending.map((p, pi) => (
              <Text key={pi} style={s.pendingItem}>· {p.description}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

// ── Main document ─────────────────────────────────────────────────────────────
export function BriefPdf({ data }: { data: BriefData }) {
  const verdictCfg = VERDICT_CFG[data.verdict.status] ?? VERDICT_CFG.ready
  const clientName = data.meta.client_name ?? 'Sin nombre'
  const date = data.meta.meeting_date ?? '—'

  const okCount = data.blocks.filter((b) => b.status === 'ok').length
  const warnCount = data.blocks.filter((b) => b.status === 'warning').length
  const blockCount = data.blocks.filter((b) => b.status === 'blocker').length
  const pendingTotal = data.blocks.reduce((sum, b) => sum + b.pending.length, 0)

  return (
    <Document title={`${clientName} — Brief de onboarding`} author="EasyDocking" language="es">
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.accentBar} />
          <Text style={s.clientName}>{clientName}</Text>
          <View style={s.headerRow}>
            <Text style={s.headerDate}>Reunión de onboarding · {date}</Text>
            <Text
              style={[
                s.verdictPill,
                { color: verdictCfg.color, backgroundColor: verdictCfg.bg },
              ]}
            >
              {verdictCfg.label}
            </Text>
          </View>
        </View>

        {/* ── Verdict box ── */}
        <View style={[s.verdictBox, { backgroundColor: verdictCfg.bg }]}>
          <Text style={[s.verdictLabel, { color: verdictCfg.color }]}>
            Verdict
          </Text>
          <Text style={[s.verdictSummary, { color: verdictCfg.color }]}>
            {data.verdict.summary}
          </Text>
          {data.verdict.detail ? (
            <Text style={[s.verdictDetail, { color: C.text }]}>{data.verdict.detail}</Text>
          ) : null}
        </View>

        {/* ── Narrative ── */}
        {(data.narrative.current_situation || data.narrative.what_they_want || data.narrative.closure) && (
          <>
            <Text style={s.sectionTitle}>Contexto</Text>
            <View style={s.narrativeCard}>
              {data.narrative.current_situation && (
                <View style={s.narrativeGroup}>
                  <Text style={s.narrativeLabel}>Situación actual</Text>
                  <Text style={s.narrativeText}>{data.narrative.current_situation}</Text>
                </View>
              )}
              {data.narrative.what_they_want && (
                <View style={s.narrativeGroup}>
                  <Text style={s.narrativeLabel}>Qué buscan</Text>
                  <Text style={s.narrativeText}>{data.narrative.what_they_want}</Text>
                </View>
              )}
              {data.narrative.closure && (
                <View>
                  <Text style={s.narrativeLabel}>Cierre</Text>
                  <Text style={s.narrativeText}>{data.narrative.closure}</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* ── Coverage summary ── */}
        <Text style={s.sectionTitle}>Cobertura de bloques</Text>
        <View style={s.coverageRow}>
          <View style={[s.coverageTile, { backgroundColor: C.brandLight }]}>
            <Text style={[s.coverageNum, { color: C.brand }]}>{okCount}</Text>
            <Text style={[s.coverageLabel, { color: C.brand }]}>Relevados</Text>
          </View>
          <View style={[s.coverageTile, { backgroundColor: C.warningBg }]}>
            <Text style={[s.coverageNum, { color: C.warning }]}>{warnCount}</Text>
            <Text style={[s.coverageLabel, { color: C.warning }]}>Con avisos</Text>
          </View>
          <View style={[s.coverageTile, { backgroundColor: C.blockedBg }]}>
            <Text style={[s.coverageNum, { color: C.blocked }]}>{blockCount}</Text>
            <Text style={[s.coverageLabel, { color: C.blocked }]}>Bloqueados</Text>
          </View>
          <View style={[s.coverageTile, { marginRight: 0 }]}>
            <Text style={[s.coverageNum, { color: C.muted }]}>{pendingTotal}</Text>
            <Text style={s.coverageLabel}>Pendientes</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Blocks ── */}
        <Text style={s.sectionTitle}>Bloques de relevamiento</Text>
        {data.blocks.map((block, idx) => (
          <BlockSection key={block.id} block={block} idx={idx} />
        ))}

        {/* ── Next meeting ── */}
        {data.next_meeting && (data.next_meeting.label || data.next_meeting.date) && (
          <View style={[s.narrativeCard, { marginTop: 8 }]}>
            <Text style={s.narrativeLabel}>Próxima reunión</Text>
            {data.next_meeting.label && (
              <Text style={[s.narrativeText, { fontFamily: 'Helvetica-Bold', marginBottom: 2 }]}>
                {data.next_meeting.label}
              </Text>
            )}
            {data.next_meeting.summary && (
              <Text style={s.narrativeText}>{data.next_meeting.summary}</Text>
            )}
            {(data.next_meeting.date || data.next_meeting.time) && (
              <Text style={[s.narrativeText, { color: C.muted, marginTop: 2 }]}>
                {[data.next_meeting.date, data.next_meeting.time].filter(Boolean).join(' · ')}
              </Text>
            )}
          </View>
        )}

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>EasyDocking · Brief de onboarding</Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
