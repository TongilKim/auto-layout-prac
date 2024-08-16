import { useState } from "react";
import "./App.css";
import ResizableRectangle from "./ResizableRectangle";
import { ChildElement, useDefaultStore } from "./store/useDefaultStore";
import { DEFAULT_PARENT_HEIGHT, DEFAULT_PARENT_WIDTH } from "./constants";

// This function will generate a random position for the rectangle.
const getRandomPosition = (
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

// This function will return the minimum padding between two padding values
const getMinimumPadding = (paddingOne: number, paddingTwo: number) => {
  return Math.min(paddingOne, paddingTwo);
};

// This function will return the minimum width for the parent element.
const getMinimumWidthForParentElement = (
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

const getMinimumHeightForParentElement = (
  parentHeight: number,
  closestTopPaddingVal: number,
  closestBottomPaddingVal: number
) => {
  return parentHeight - (closestTopPaddingVal + closestBottomPaddingVal);
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
  const setParentElementHeightPadding = useDefaultStore(
    (state) => state.setParentElementHeightPadding
  );

  const [positions] = useState(() => {
    const pos1 = getRandomPosition([]);
    // pos1 is passed to the second rectangle to avoid overlapping.
    const pos2 = getRandomPosition([pos1]);
    // pos1 and pos2 are passed to the third rectangle to avoid overlapping.
    const pos3 = getRandomPosition([pos1, pos2]);
    return [pos1, pos2, pos3];
  });

  // This function will returns the closest element from the left and right side.
  const findClosestElements = () => {
    // for the WIDTH
    let minRightPadding = DEFAULT_PARENT_WIDTH;
    let minLeftPadding = DEFAULT_PARENT_HEIGHT;
    let closetLeftElement: ChildElement = null;
    let closetRightElement: ChildElement = null;

    // for the HEIGHT
    let minBottomPadding = DEFAULT_PARENT_HEIGHT;
    let minTopPadding = DEFAULT_PARENT_HEIGHT;
    let closetTopElement: ChildElement = null;
    let closetBottomElement: ChildElement = null;

    const _compareWidthPaddingValues = (item: ChildElement) => {
      if (item.leftPadding < minLeftPadding) {
        minLeftPadding = item.leftPadding;
        closetLeftElement = item;
      }
      if (item.rightPadding < minRightPadding) {
        minRightPadding = item.rightPadding;
        closetRightElement = item;
      }
    };

    const _compareHeightPaddingValues = (item: ChildElement) => {
      if (item.topPadding < minTopPadding) {
        minTopPadding = item.topPadding;
        closetTopElement = item;
      }
      if (item.bottomPadding < minBottomPadding) {
        minBottomPadding = item.bottomPadding;
        closetBottomElement = item;
      }
    };

    childElements.forEach((item) => {
      _compareWidthPaddingValues(item);
      _compareHeightPaddingValues(item);
    });

    return {
      closetLeftElement,
      closetRightElement,
      closetTopElement,
      closetBottomElement,
    };
  };

  const onClickExecuteAutoLayout = () => {
    console.log({ childElements });

    const closetElements = findClosestElements();
    if (
      closetElements.closetLeftElement &&
      closetElements.closetRightElement &&
      closetElements.closetTopElement &&
      closetElements.closetBottomElement
    ) {
      const {
        closetLeftElement,
        closetRightElement,
        closetBottomElement,
        closetTopElement,
      } = closetElements;

      const paddingForWidth = getMinimumPadding(
        closetLeftElement.leftPadding,
        closetRightElement.rightPadding
      );

      const paddingForHeight = getMinimumPadding(
        closetTopElement.topPadding,
        closetBottomElement.bottomPadding
      );

      const minimumWidth = getMinimumWidthForParentElement(
        closetRightElement.leftPadding,
        closetRightElement.width,
        closetLeftElement.leftPadding
      );

      const minimumHeight = getMinimumHeightForParentElement(
        parentElement.height,
        closetTopElement.topPadding,
        closetBottomElement.bottomPadding
      );

      console.log({ closetElements });
      console.log({ paddingForWidth });
      console.log({ paddingForHeight });
      console.log({ minimumWidth }, { minimumHeight });

      setParentElementDimension(minimumWidth, minimumHeight);
      setTimeout(() => {
        setParentElementWidthPadding(paddingForWidth);
        setParentElementHeightPadding(paddingForHeight);
      }, 3000);
    }
  };

  return (
    <>
      <div
        style={{
          width: parentElement.width,
          height: parentElement.height,
          padding: `${parentElement.heightPadding}px ${parentElement.widthPadding}px`,
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
