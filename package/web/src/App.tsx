import { EllipsisVertical } from "lucide-react"
import BlockEditor from "./components/Editor/BlockEditor"
import BlockInput from "./components/Editor/BlockInput"
import PanelPopover from "./components/PanelPopover"

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <h1>Hi</h1>
      <hr />
      <div className="m-4">
        <BlockInput />
      </div>
      <hr />
      {/* <DemoRichTextInputStyler /> */}
      {/* <DemoDnd /> */}
      <BlockEditor id="1" />
      <hr />
      <div className="p-2 flex items-center justify-center">
        <PanelPopover>
          <EllipsisVertical />
        </PanelPopover>
      </div>
    </>
  )
}

export default App
