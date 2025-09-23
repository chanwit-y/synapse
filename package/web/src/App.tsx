import { Popover, PopoverContent, PopoverTrigger } from "./components"
import BlockEditor from "./components/Editor/BlockEditor"
import BlockInput from "./components/Editor/BlockInput"
import { DemoDnd } from "./components/Editor/demo-dnd"
import DemoRichTextInputStyler from "./components/Editor/DemoInputTextHighlightStyler"

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <h1>Hi</h1>
      <hr />
      {/* <div className="m-4">
        <BlockInput />
      </div> */}
      <hr />
      {/* <DemoRichTextInputStyler /> */}
      {/* <DemoDnd /> */}
      <BlockEditor id="1" />
      <hr />
      <div className="p-2 flex items-center justify-center">
        <Popover>
          <PopoverTrigger>
            Click me
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <h3>Popover Title</h3>
              <p>This is the popover content.</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}

export default App
