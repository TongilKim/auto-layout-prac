import { useState } from "react";
import "./App.css";
import ResizableRectangle from "./ResizableRectangle";
import { useDefaultStore } from "./store/useDefaultStore";

// This function will generate a random position for the rectangle.
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
  const parentElement = useDefaultStore((state) => state.parentElement);
  const childElements = useDefaultStore((state) => state.childElements);
  const savedLowestRightMargin = useDefaultStore(
    (state) => state.lowestRightMargin
  );
  const savedLowestLeftMargin = useDefaultStore(
    (state) => state.lowestLeftMargin
  );
  const setParentElement = useDefaultStore((state) => state.setParentElement);
  const setLowestRightMargin = useDefaultStore(
    (state) => state.setLowestRightMargin
  );
  const setLowestLeftMargin = useDefaultStore(
    (state) => state.setLowestLeftMargin
  );

  const [positions] = useState(() => {
    const pos1 = _getRandomPosition([]);
    // pos1 is passed to the second rectangle to avoid overlapping.
    const pos2 = _getRandomPosition([pos1]);
    // pos1 and pos2 are passed to the third rectangle to avoid overlapping.
    const pos3 = _getRandomPosition([pos1, pos2]);
    return [pos1, pos2, pos3];
  });

  const onClickExecuteAutoLayout = () => {
    console.log({ childElements });
    let minLeftMargin = savedLowestLeftMargin;
    let minRightMargin = savedLowestRightMargin;

    childElements.forEach((item) => {
      if (item.leftMargin < minLeftMargin) {
        minLeftMargin = item.leftMargin;
      }
      if (item.rightMargin < minRightMargin) {
        minRightMargin = item.rightMargin;
      }
    });
    console.log({ minLeftMargin, minRightMargin });

    setLowestRightMargin(minRightMargin);
    setLowestLeftMargin(minLeftMargin);
    setParentElement(1200, 800);
  };

  return (
    <>
      <div
        style={{
          width: parentElement.width,
          height: parentElement.height,
          background: "white",
        }}
      >
        {positions.map((pos, index) => (
          <ResizableRectangle key={index} initialPosition={pos} uId={index} />
        ))}
      </div>
      <div className="card">
        <button onClick={onClickExecuteAutoLayout}>Execute Auto Layout</button>
      </div>
    </>
  );
}

export default App;
