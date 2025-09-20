import BlockEditor from "./components/Editor/BlockEditor"
import { DemoDnd } from "./components/Editor/demo-dnd"

function App() {

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <hr />
      {/* <DemoDnd /> */}
      <BlockEditor id="1" />
    </>
  )
}

export default App
