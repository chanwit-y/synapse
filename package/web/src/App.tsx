import { Popover, PopoverContent, PopoverTrigger } from "./components"
import BlockEditor from "./components/Editor/BlockEditor"
import BlockInput from "./components/Editor/BlockInput"
import { DemoDnd } from "./components/Editor/demo-dnd"
import DemoRichTextInputStyler from "./components/Editor/DemoInputTextHighlightStyler"

function App() {

  return (
    <div className="mt-10 p-4">
      <BlockEditor id="1" />
    </div>
  )
}

export default App
