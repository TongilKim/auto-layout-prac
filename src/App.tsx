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

// This function will return the minimum padding from the left and right side.
const _getMinimumPadding = (leftPadding: number, rightPadding: number) => {
  return Math.min(leftPadding, rightPadding);
};

// This function will return the minimum width for the parent element.
const _getMinimumWidthForParentElement = (
  leftPaddingOfClosetRightElement: number,
  widthOfClosetRightElement: number,
  leftPaddingOfClosestLeftElement: number
) => {
  return (
    leftPaddingOfClosetRightElement +
    widthOfClosetRightElement -
    leftPaddingOfClosestLeftElement
  );
};

function App() {
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
  const findClosestElements = () => {
    // for the width
    let minRightPadding = DEFAULT_PARENT_WIDTH;
    let minLeftPadding = DEFAULT_PARENT_HEIGHT;
    let closetLeftElement: ChildElement = null;
    let closetRightElement: ChildElement = null;

    // for the height
    const minBottomPadding = DEFAULT_PARENT_HEIGHT;
    const minTopPadding = DEFAULT_PARENT_HEIGHT;
    const closetTopElement: ChildElement = null;
    const closetBottomElement: ChildElement = null;

    childElements.forEach((item) => {
      if (item.leftPadding < minLeftPadding) {
        minLeftPadding = item.leftPadding;
        closetLeftElement = item;
      }
      if (item.rightPadding < minRightPadding) {
        minRightPadding = item.rightPadding;
        closetRightElement = item;
      }
    });

    return { closetLeftElement, closetRightElement };
  };

  const onClickExecuteAutoLayout = () => {
    console.log({ childElements });

    const closetElements = findClosestElements();
    if (closetElements.closetLeftElement && closetElements.closetRightElement) {
      const { closetLeftElement, closetRightElement } = closetElements;

      const paddingForWidth = _getMinimumPadding(
        closetLeftElement.leftPadding,
        closetRightElement.rightPadding
      );
      const minimumWidth = _getMinimumWidthForParentElement(
        closetRightElement.leftPadding,
        closetRightElement.width,
        closetLeftElement.leftPadding
      );

      // const finalWidth = minimumWidth + paddingForWidth * 2;

      console.log({ paddingForWidth });
      console.log({ closetElements });

      setParentElementDimension(minimumWidth, DEFAULT_PARENT_HEIGHT);
      setTimeout(() => {
        setParentElementWidthPadding(paddingForWidth);
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
