import { useState } from "react";
import "./App.css";
import ResizableRectangle from "./ResizableRectangle";
import { ChildElement, useDefaultStore } from "./store/useDefaultStore";
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
      top: Math.floor(Math.random() * 400), // Adjust based on container height
      left: Math.floor(Math.random() * 700), // Adjust based on container width
    };
  } while (
    existingPositions.some(
      (pos) => pos.top === position.top && pos.left === position.left
    )
  );
  return position;
};

function App() {
  const [isReducedFromRight, setIsReducedFromRight] = useState(false);

  const parentElement = useDefaultStore((state) => state.parentElement);
  const childElements: ChildElement[] = useDefaultStore(
    (state) => state.childElements
  );

  const setParentElementDimension = useDefaultStore(
    (state) => state.setParentElementDimension
  );
  const setParentElementWidthPadding = useDefaultStore(
    (state) => state.setParentElementWidthPadding
  );

  const [positions] = useState(() => {
    const pos1 = _getRandomPosition([]);
    // pos1 is passed to the second rectangle to avoid overlapping.
    const pos2 = _getRandomPosition([pos1]);
    // pos1 and pos2 are passed to the third rectangle to avoid overlapping.
    const pos3 = _getRandomPosition([pos1, pos2]);
    return [pos1, pos2, pos3];
  });

  // This function will returns the closest element from the left and right side.
  const _findClosestElements = () => {
    let minRightMargin = DEFAULT_PARENT_WIDTH;
    let minLeftMargin = DEFAULT_PARENT_HEIGHT;
    let closetLeftElement: ChildElement = null;
    let closetRightElement: ChildElement = null;

    childElements.forEach((item) => {
      if (item.leftMargin < minLeftMargin) {
        minLeftMargin = item.leftMargin;
        closetLeftElement = item;
        // setLeftClosestElementId(item.id);
      }
      if (item.rightMargin < minRightMargin) {
        minRightMargin = item.rightMargin;
        closetRightElement = item;
        // setRightClosestElementId(item.id);
      }
    });

    return { closetLeftElement, closetRightElement };
  };

  const onClickExecuteAutoLayout = () => {
    console.log({ childElements });

    const closetElements = _findClosestElements();
    if (closetElements.closetLeftElement && closetElements.closetRightElement) {
      const { closetLeftElement, closetRightElement } = closetElements;

      const paddingForBothSide = Math.min(
        closetLeftElement.leftMargin,
        closetRightElement.rightMargin
      );

      const isWidthReducedFromRight =
        closetRightElement.rightMargin === paddingForBothSide;

      setIsReducedFromRight(isWidthReducedFromRight);

      const minimumWidth =
        closetRightElement.leftMargin +
        closetRightElement.width -
        closetLeftElement.leftMargin;
      // const finalWidth = minimumWidth + paddingForBothSide * 2;

      console.log({ paddingForBothSide });
      console.log({ closetElements });
      // this will give us the minimum margin for both sides (left and right).

      setParentElementDimension(minimumWidth, DEFAULT_PARENT_HEIGHT);
      setTimeout(() => {
        setParentElementWidthPadding(paddingForBothSide);
      }, 3000);
    }
  };

  return (
    <>
      <div
        style={{
          width: parentElement.width,
          height: parentElement.height,
          paddingLeft: parentElement.widthPadding,
          paddingRight: parentElement.widthPadding,
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
