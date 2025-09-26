import { EllipsisVertical } from "lucide-react"
import BlockEditor from "./components/Editor/BlockEditor"
import PanelPopover from "./components/PanelPopover"

function App() {

  return (
    <div className="mt-10 p-4">
      <BlockEditor id="1" />
      <hr />
      <div className="p-2 flex items-center justify-center">
        <PanelPopover>
          <EllipsisVertical />
        </PanelPopover>
      </div>
    </div>
  )
}

export default App
