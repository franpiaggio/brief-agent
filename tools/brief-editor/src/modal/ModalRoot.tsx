import { useModal } from './ModalContext'
import { EditTextDialog } from './EditTextDialog'
import { EditFieldDialog } from './EditFieldDialog'
import { EditBlockStatusDialog } from './EditBlockStatusDialog'
import { EditVerdictDialog } from './EditVerdictDialog'
import { EditOptionsGroupDialog } from './EditOptionsGroupDialog'
import { EditPendingDialog } from './EditPendingDialog'
import { EditCustomDialog } from './EditCustomDialog'
import { EditNextMeetingDialog } from './EditNextMeetingDialog'

export function ModalRoot() {
  const { modal } = useModal()
  if (!modal) return null

  switch (modal.type) {
    case 'text':
      return (
        <EditTextDialog
          path={modal.path}
          label={modal.label}
          multiline={modal.multiline}
          citationPath={modal.citationPath}
          placeholder={modal.placeholder}
        />
      )
    case 'field':
      return <EditFieldDialog blockIdx={modal.blockIdx} fieldIdx={modal.fieldIdx} />
    case 'block-status':
      return <EditBlockStatusDialog blockIdx={modal.blockIdx} />
    case 'verdict':
      return <EditVerdictDialog />
    case 'option-group':
      return <EditOptionsGroupDialog blockIdx={modal.blockIdx} groupName={modal.groupName} />
    case 'pending':
      return <EditPendingDialog blockIdx={modal.blockIdx} itemIdx={modal.itemIdx} />
    case 'custom':
      return <EditCustomDialog itemIdx={modal.itemIdx} />
    case 'next-meeting':
      return <EditNextMeetingDialog />
  }
}
