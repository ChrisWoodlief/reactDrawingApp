import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';

/** strokes
{
  points,
  color
}
**/
export default function DrawArea(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('black');
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
    props.addStroke({points: new Immutable.List([point]), color: props.currentColor});
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
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    setCurrentColor(props.color);
  }, [props.currentColor]);

  return (
    <div
      className="drawArea"
      ref={drawAreaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <Drawing
        key={currentPointCount}
        strokes={props.strokes}
      />
    </div>
  );
}

function Drawing({ strokes }) {
  return (
    <svg className="innerDrawing">
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
  //console.log(`pathData ${pathData}`);
  return <path className="path" d={pathData} stroke={stroke.color} />;
}
