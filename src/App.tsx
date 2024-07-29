import { useState } from "react";
import "./App.css";
import ResizableRectangle from "./ResizableRectangle";

const _getRandomPosition = (
  existingPositions: { top: number; left: number }[]
) => {
  let position = {
    top: 0,
    left: 0,
  };
  do {
    position = {
      top: Math.floor(Math.random() * 700), // Adjust based on container height
      left: Math.floor(Math.random() * 1000), // Adjust based on container width
    };
  } while (
    existingPositions.some(
      (pos) => pos.top === position.top && pos.left === position.left
    )
  );
  return position;
};

function App() {
  const [positions] = useState(() => {
    const pos1 = _getRandomPosition([]);
    const pos2 = _getRandomPosition([pos1]);
    const pos3 = _getRandomPosition([pos1, pos2]);
    return [pos1, pos2, pos3];
  });

  const onClickExecuteAutoLayout = () => {
    console.log("Execute Auto Layout");
  };

  return (
    <>
      <div style={{ width: 1200, height: 800, background: "white" }}>
        {positions.map((pos, index) => (
          <ResizableRectangle key={index} initialPosition={pos} />
        ))}
      </div>
      <div className="card">
        <button onClick={onClickExecuteAutoLayout}>Execute Auto Layout</button>
      </div>
    </>
  );
}

export default App;
