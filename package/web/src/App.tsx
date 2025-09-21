import BlockEditor from "./components/Editor/BlockEditor"
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
      <DemoRichTextInputStyler />
      {/* <DemoDnd /> */}
      <BlockEditor id="1" />
    </>
  )
}

export default App
