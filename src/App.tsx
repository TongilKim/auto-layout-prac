import { useState } from "react";
import "./App.css";
import ResizableRectangle from "./ResizableRectangle";
import { useDefaultStore } from "./store/useDefaultStore";
import { DEFAULT_PARENT_HEIGHT, DEFAULT_PARENT_WIDTH } from "./constants";

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
  const parentElementDimension = useDefaultStore(
    (state) => state.parentElementDimension
  );
  const childElements = useDefaultStore((state) => state.childElements);

  const setParentElement = useDefaultStore((state) => state.setParentElement);

  const [positions] = useState(() => {
    const pos1 = _getRandomPosition([]);
    // pos1 is passed to the second rectangle to avoid overlapping.
    const pos2 = _getRandomPosition([pos1]);
    // pos1 and pos2 are passed to the third rectangle to avoid overlapping.
    const pos3 = _getRandomPosition([pos1, pos2]);
    return [pos1, pos2, pos3];
  });

  const _findMinMargin = () => {
    let minRightMargin = DEFAULT_PARENT_WIDTH;
    let minLeftMargin = DEFAULT_PARENT_HEIGHT;

    childElements.forEach((item) => {
      if (item.leftMargin < minLeftMargin) {
        minLeftMargin = item.leftMargin;
      }
      if (item.rightMargin < minRightMargin) {
        minRightMargin = item.rightMargin;
      }
    });
    console.log({ minLeftMargin, minRightMargin });
    return Math.min(minLeftMargin, minRightMargin);
  };
  const onClickExecuteAutoLayout = () => {
    console.log({ childElements });

    // this will give us the minimum margin for both sides (left and right).
    const marginForBothSide = _findMinMargin();

    console.log({ marginForBothSide });
    setParentElement(
      parentElementDimension.width - marginForBothSide,
      parentElementDimension.height
    );
  };

  return (
    <>
      <div
        style={{
          width: parentElementDimension.width,
          height: parentElementDimension.height,
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
