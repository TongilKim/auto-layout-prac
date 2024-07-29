import React, { useState, useRef, useEffect, MouseEvent } from "react";

const ResizableRectangle: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 150 });
  const [isResizing, setIsResizing] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const rectangleRef = useRef<HTMLDivElement | null>(null);

  const resizeRectangleWidth = (currentX: number) => {
    // "deltaX" and "deltaY" are the distances of the difference between current mouse position and the last mouse position.
    // So basically, calculating deltaX and deltaY will give us the distance how much we want to resize the rectangle.
    const deltaX = currentX - lastMousePosition.x;

    return dimensions.width + deltaX;
  };

  const resizeRectangleHeight = (currentY: number) => {
    const deltaY = currentY - lastMousePosition.y;

    return dimensions.height + deltaY;
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    console.log("MOUSE DOWN");
    setIsResizing(true);
    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // This event listener is fired when the mouse cursor is being moved in the rectangle area ONLY.
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    // Adds deltaX and deltaY to the previous width and height of the rectangle to resize it.
    setDimensions({
      width: resizeRectangleWidth(currentX),
      height: resizeRectangleHeight(currentY),
    });

    setLastMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    // This event listener is fired when the mouse button is clicked & released anywhere on the window
    const handleWindowMouseUp = () => {
      console.log("WINDOW MOUSE UP");
      setIsResizing(false);
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
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "lightblue",
        resize: "both",
        overflow: "hidden",
      }}
      ref={rectangleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
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
        onPointerDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default ResizableRectangle;
