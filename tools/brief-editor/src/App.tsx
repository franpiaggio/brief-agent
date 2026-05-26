import { BriefProvider, useBrief } from './state/BriefContext'
import { ModalProvider } from './modal/ModalContext'
import { ModalRoot } from './modal/ModalRoot'
import { Dropzone } from './editor/Dropzone'
import { Preview } from './editor/Preview'
import { Toolbar } from './editor/Toolbar'

function EditorShell() {
  const { state } = useBrief()

  if (!state) return <Dropzone />

  return (
    <div className="app-shell">
      <Toolbar />
      <section className="preview-pane">
        <Preview />
        <div className="preview-edge-hint" aria-hidden="true">
          <span className="dot" />
          Click cualquier dato del brief para editar
        </div>
      </section>
      <ModalRoot />
    </div>
  )
}

export function App() {
  return (
    <BriefProvider>
      <ModalProvider>
        <EditorShell />
      </ModalProvider>
    </BriefProvider>
  )
}
