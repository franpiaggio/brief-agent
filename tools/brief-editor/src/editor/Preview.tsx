import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBrief } from '../state/BriefContext'
import { useModal } from '../modal/ModalContext'
import type { ModalState } from '../modal/ModalContext'
import { Brief } from '../brief/Brief'

const NATIVE_WIDTH = 920

const EDITOR_OVERLAY_CSS = `
  html, body { margin: 0; padding: 0; overflow: hidden; }
  body { width: ${NATIVE_WIDTH}px; }
  [data-edit-type] {
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 120ms ease, box-shadow 120ms ease;
  }
  [data-edit-type]:hover {
    background-color: rgba(61, 178, 124, 0.10);
    box-shadow: 0 0 0 4px rgba(61, 178, 124, 0.10);
  }
  span[data-edit-type="block-status"] { display: inline-flex; }
  div[data-edit-type="block-status"].block-reason { display: flex; width: 100%; }
  [data-edit-type="verdict"] { cursor: pointer; }
  .doc { box-shadow: none !important; }
  .add-zone {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    padding: 6px 12px 6px 10px;
    background: transparent;
    border: 1px dashed #c4ebd6;
    color: #2f8c61;
    border-radius: 999px;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease;
  }
  .add-zone:hover {
    background: #ecf9f3;
    border-color: #2f8c61;
  }
  .add-zone-icon { width: 12px; height: 12px; flex: 0 0 auto; }
  .action-box .add-zone { margin-left: 0; align-self: flex-start; }
  .brand-bar .brand-mark {
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #2f8c61;
  }
  .next-meeting--empty {
    width: 100%;
    background: transparent;
    border: 1px dashed #c4ebd6;
    color: #2f8c61;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
    opacity: 0.85;
  }
  .next-meeting--empty:hover { opacity: 1; background: #f1faf5; }
`

function parseEditTarget(el: HTMLElement): ModalState | null {
  const type = el.dataset.editType
  const path = el.dataset.editPath ?? ''
  if (!type) return null

  switch (type) {
    case 'text': {
      const label = el.dataset.editLabel ?? 'Editar texto'
      const multiline = el.dataset.editMultiline === 'true'
      const citationPath = el.dataset.editCitationPath
      return { type: 'text', path, label, multiline, citationPath }
    }
    case 'field': {
      const blockIdx = Number(el.dataset.editBlockIdx)
      const fieldIdx = Number(el.dataset.editFieldIdx)
      if (Number.isNaN(blockIdx) || Number.isNaN(fieldIdx)) return null
      return { type: 'field', blockIdx, fieldIdx }
    }
    case 'block-status': {
      const blockIdx = Number(el.dataset.editBlockIdx)
      if (Number.isNaN(blockIdx)) return null
      return { type: 'block-status', blockIdx }
    }
    case 'verdict':
      return { type: 'verdict' }
    case 'option-group': {
      const blockIdx = Number(el.dataset.editBlockIdx)
      const groupName = el.dataset.editGroupName ?? ''
      if (Number.isNaN(blockIdx) || !groupName) return null
      return { type: 'option-group', blockIdx, groupName }
    }
    case 'option-cycle': {
      // handled separately, not a modal
      return null
    }
    case 'pending': {
      const blockIdx = Number(el.dataset.editBlockIdx)
      const itemAttr = el.dataset.editItemIdx
      const itemIdx = itemAttr === undefined || itemAttr === '' ? null : Number(itemAttr)
      if (Number.isNaN(blockIdx)) return null
      return { type: 'pending', blockIdx, itemIdx: itemIdx === null || Number.isNaN(itemIdx) ? null : itemIdx }
    }
    case 'custom': {
      const itemAttr = el.dataset.editItemIdx
      const itemIdx = itemAttr === undefined || itemAttr === '' ? null : Number(itemAttr)
      return { type: 'custom', itemIdx: itemIdx === null || Number.isNaN(itemIdx) ? null : itemIdx }
    }
    case 'next-meeting':
      return { type: 'next-meeting' }
    default:
      return null
  }
}

export function Preview() {
  const { state, dispatch, actions } = useBrief()
  const { openModal } = useModal()
  const paneRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [portalTarget, setPortalTarget] = useState<Element | null>(null)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(0)

  function handleLoad() {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return

    fetch(`${import.meta.env.BASE_URL}brief-styles.css`)
      .then((r) => r.text())
      .then((css) => {
        const baseStyle = doc.createElement('style')
        baseStyle.textContent = css
        doc.head.appendChild(baseStyle)

        const editorStyle = doc.createElement('style')
        editorStyle.textContent = EDITOR_OVERLAY_CSS
        doc.head.appendChild(editorStyle)

        setPortalTarget(doc.body)
      })
  }

  useLayoutEffect(() => {
    const pane = paneRef.current
    if (!pane) return

    const recalcScale = () => {
      const styles = window.getComputedStyle(pane)
      const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
      const available = pane.clientWidth - horizontalPadding
      const next = Math.min(1, available / NATIVE_WIDTH)
      setScale(next > 0 ? next : 1)
    }

    recalcScale()
    const ro = new ResizeObserver(recalcScale)
    ro.observe(pane)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!portalTarget) return
    const target = portalTarget as HTMLElement

    const recalcHeight = () => {
      setContentHeight(target.scrollHeight)
    }

    recalcHeight()
    const ro = new ResizeObserver(recalcHeight)
    ro.observe(target)
    return () => ro.disconnect()
  }, [portalTarget, state])

  useEffect(() => {
    if (!portalTarget) return
    const target = portalTarget as HTMLElement

    function handleClick(e: MouseEvent) {
      const path = e.composedPath() as Array<EventTarget & { nodeType?: number; dataset?: DOMStringMap }>
      const el = path.find(
        (node) => node && node.nodeType === 1 && node.dataset?.editType,
      ) as HTMLElement | undefined
      if (!el) return

      e.preventDefault()
      e.stopPropagation()

      if (el.dataset.editType === 'option-cycle') {
        const blockIdx = Number(el.dataset.editBlockIdx)
        const groupName = el.dataset.editGroupName ?? ''
        const label = el.dataset.editLabel ?? ''
        if (!Number.isNaN(blockIdx) && groupName && label) {
          dispatch(actions.toggleChip(blockIdx, groupName, label))
        }
        return
      }

      const modal = parseEditTarget(el)
      if (modal) openModal(modal)
    }

    target.addEventListener('click', handleClick)
    return () => target.removeEventListener('click', handleClick)
  }, [portalTarget, dispatch, actions, openModal])

  return (
    <div ref={paneRef} className="preview-pane-inner">
      <div
        className="preview-scaler"
        style={{
          width: NATIVE_WIDTH * scale,
          height: contentHeight * scale,
        }}
      >
        <iframe
          ref={iframeRef}
          className="preview-iframe"
          srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
          onLoad={handleLoad}
          title="Preview del brief"
          style={{
            width: NATIVE_WIDTH,
            height: contentHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
      {portalTarget && state && createPortal(<Brief data={state} />, portalTarget)}
    </div>
  )
}
