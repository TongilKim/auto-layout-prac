import "./App.css";
import ResizableRectangle from "./ResizableRectangle";

function App() {
  const onClickExecuteAutoLayout = () => {
    console.log("Execute Auto Layout");
  };

  return (
    <>
      <div style={{ width: 1200, height: 800, background: "white" }}>
        <ResizableRectangle />
      </div>
      <div className="card">
        <button onClick={onClickExecuteAutoLayout}>Execute Auto Layout</button>
      </div>
    </>
  );
}

export default App;
