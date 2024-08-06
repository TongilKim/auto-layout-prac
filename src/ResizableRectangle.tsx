import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { useDefaultStore } from "./store/useDefaultStore";

type ResizableRectangleProps = {
  initialPosition: { top: number; left: number };
  uId: number;
};
const ResizableRectangle: React.FC<ResizableRectangleProps> = ({
  initialPosition,
  uId,
}) => {
  const parentElement = useDefaultStore((state) => state.parentElement);
  const setChildElements = useDefaultStore((state) => state.setChildElements);

  const [dimensions, setDimensions] = useState({ width: 200, height: 150 });
  const [position, setPosition] = useState(initialPosition);
  const [isResizing, setIsResizing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const rectangleRef = useRef<HTMLDivElement | null>(null);

  const _getResizedRectangleWidth = (currentX: number) => {
    // "deltaX" and "deltaY" are the distances of the difference between current mouse position and the last mouse position.
    // So basically, calculating deltaX and deltaY will give us the distance how much we want to resize the rectangle.
    const deltaX = currentX - lastMousePosition.x;

    return dimensions.width + deltaX;
  };

  const _getResizedRectangleHeight = (currentY: number) => {
    const deltaY = currentY - lastMousePosition.y;

    return dimensions.height + deltaY;
  };

  const _setMarginInfo = () => {
    const rightMargin =
      parentElement.width - (position.left + dimensions.width);
    // Left margin = Rectangle left position
    const leftMargin = parentElement.width - (dimensions.width + rightMargin);

    setChildElements(uId, leftMargin, rightMargin);
    // // Right margin = Parent width - (Rectangle left position + Rectangle width)
  };

  const handleMouseDown = (
    event: MouseEvent<HTMLDivElement>,
    isResizing: boolean
  ) => {
    setLastMousePosition({ x: event.clientX, y: event.clientY });

    if (isResizing) {
      setIsResizing(true);
    } else {
      setIsMoving(true);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsMoving(false);
  };

  // This event listener is fired when the mouse cursor is being moved in the rectangle area ONLY.
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const currentX = event.clientX;
    const currentY = event.clientY;

    if (isResizing) {
      // Adds deltaX and deltaY to the previous width and height of the rectangle to resize it.
      setDimensions({
        width: _getResizedRectangleWidth(currentX),
        height: _getResizedRectangleHeight(currentY),
      });
    } else if (isMoving) {
      const deltaX = currentX - lastMousePosition.x;
      const deltaY = currentY - lastMousePosition.y;

      setPosition({
        top: position.top + deltaY,
        left: position.left + deltaX,
      });
    }

    _setMarginInfo();
    setLastMousePosition({ x: currentX, y: currentY });
  };

  useEffect(() => {
    // This event listener is fired when the mouse button has released anywhere on the window
    const handleWindowMouseUp = () => {
      setIsResizing(false);
      setIsMoving(false);
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        top: position.top,
        left: position.left,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "lightblue",
        resize: "both",
        overflow: "hidden",
      }}
      ref={rectangleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseDown={(e) => handleMouseDown(e, false)}
    >
      {/* Resizing button */}
      <div
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          bottom: "0",
          right: "0",
          backgroundColor: "blue",
          cursor: "nwse-resize",
        }}
        onMouseDown={(e) => handleMouseDown(e, true)}
      />
    </div>
  );
};

export default ResizableRectangle;
