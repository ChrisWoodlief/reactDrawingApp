import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';

/** strokes
{
  points,
  color,
  width
}
**/
export default function DrawArea(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPointCount, setCurrentPointCount] = useState(0);
  const drawAreaRef = useRef(null);

  function handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = relativeCoordinatesForEvent(mouseEvent);

    if(props.strokes.size == 0){
      props.firstStrokeTimeUpdated(Date.now());
    }
    setIsDrawing(true);
    props.addStroke({points: new Immutable.List([point]), color: props.currentColor, width: props.currentWidth});
  }

  function handleMouseMove(mouseEvent) {
    if (!isDrawing) {
      return;
    }

    const point = relativeCoordinatesForEvent(mouseEvent);

    props.addPoint(point);
    setCurrentPointCount((lastPointCount) => {
      return lastPointCount + 1;
    })
  }

  function handleMouseUp() {
    setIsDrawing(false);
  }

  function relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = drawAreaRef.current.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top
    });
  }

  useEffect(() => {
    if(props.isThumbnail){ //thumbnails do not need mouse events since they are not editable
      return;
    }
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  //thumbnails do not need mouse events since they are not editable
  const mouseEventProps = !props.isThumbnail ? {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove
  }: {};

  return (
    <div
      className="drawArea"
      ref={drawAreaRef}
      {...mouseEventProps}
    >
      <Drawing
        key={currentPointCount}
        strokes={props.strokes}
        isThumbnail={props.isThumbnail}
      />
    </div>
  );
}

function Drawing({ strokes, isThumbnail, sideLength}) {
  //The svg gets certain props to change the size correctly if it is a thumbnail
  const svgProps = isThumbnail ? {
    viewBox: "0 0 300 300", //update these numbers if the original image size were to change in .innerDrawing css
    preserveAspectRatio: "xMidYMid meet"
  } : {};
  return (
    <svg className={`innerDrawing ${isThumbnail ? 'isThumbnail': ''}`} {...svgProps}>
      {strokes.map((stroke, index) => (
        <DrawingLine key={index} stroke={stroke} />
      ))}
    </svg>
  );
}

function DrawingLine({ stroke, color }) {
  const pathData =
    "M " +
    stroke.points
      .map((p) => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");
  return <path className="path" d={pathData} stroke={stroke.color} strokeWidth={stroke.width} />;
}
