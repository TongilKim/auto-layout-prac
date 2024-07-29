import "./App.css";

function App() {
  const onClickExecuteAutoLayout = () => {
    console.log("Execute Auto Layout");
  };

  return (
    <>
      <div className="card">
        <button onClick={onClickExecuteAutoLayout}>Execute Auto Layout</button>
      </div>
    </>
  );
}

export default App;
