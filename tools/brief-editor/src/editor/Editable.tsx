import React, { use } from 'react'
import { BriefContext } from '../state/BriefContext'

export type EditTargetType =
  | 'text'
  | 'field'
  | 'block-status'
  | 'verdict'
  | 'option-group'
  | 'option-cycle'
  | 'pending'
  | 'custom'
  | 'next-meeting'

type EditMeta = {
  editType: EditTargetType
  path?: string
  label?: string
  multiline?: boolean
  citationPath?: string
  blockIdx?: number
  fieldIdx?: number
  itemIdx?: number | null
  groupName?: string
}

type EditableProps<T extends keyof React.JSX.IntrinsicElements> = EditMeta & {
  as: T
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, keyof EditMeta>

export function Editable<T extends keyof React.JSX.IntrinsicElements>({
  as: Tag,
  editType,
  path,
  label,
  multiline,
  citationPath,
  blockIdx,
  fieldIdx,
  itemIdx,
  groupName,
  children,
  ...props
}: EditableProps<T>) {
  const ctx = use(BriefContext)
  const Tag_ = Tag as React.ElementType

  if (!ctx) {
    return <Tag_ {...(props as Record<string, unknown>)}>{children}</Tag_>
  }

  const dataAttrs: Record<string, string> = {
    'data-edit-type': editType,
  }
  if (path !== undefined) dataAttrs['data-edit-path'] = path
  if (label !== undefined) dataAttrs['data-edit-label'] = label
  if (multiline) dataAttrs['data-edit-multiline'] = 'true'
  if (citationPath !== undefined) dataAttrs['data-edit-citation-path'] = citationPath
  if (blockIdx !== undefined) dataAttrs['data-edit-block-idx'] = String(blockIdx)
  if (fieldIdx !== undefined) dataAttrs['data-edit-field-idx'] = String(fieldIdx)
  if (itemIdx !== undefined && itemIdx !== null) dataAttrs['data-edit-item-idx'] = String(itemIdx)
  if (groupName !== undefined) dataAttrs['data-edit-group-name'] = groupName

  return (
    <Tag_ {...(props as Record<string, unknown>)} {...dataAttrs}>
      {children}
    </Tag_>
  )
}
