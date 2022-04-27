import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';
import {DRAW_AREA_ERASER_STRING, distanceBetweenTwoPoints} from '../helpers/frontEndHelpers';

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

  function deleteLinesTouchingPoint(x, y){
    const updatedStrokes = props.strokes.filter((currentStroke) => {
      //Returns true if at least one of the points in the stoke is the stroke width away from the eraser point
      return !currentStroke.points.some((currentPoint) => {
        const pointX = currentPoint.get('x');
        const pointY = currentPoint.get('y');
        const pixelsBetween = distanceBetweenTwoPoints(x, y, pointX, pointY);
        console.log(`pixelsBetween: ${pixelsBetween} - currentStroke.width/2: ${currentStroke.width/2}`);
        if(pixelsBetween <= (currentStroke.width/2) + 1){ //plus one pixel to add a little extra room to erase
          return true;
        }
      });
    });
    props.updateStrokes(updatedStrokes)
  }

  function handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = relativeCoordinatesForEvent(mouseEvent);
    setIsDrawing(true);
    if(props.currentColor == DRAW_AREA_ERASER_STRING){
      deleteLinesTouchingPoint(point.get('x'), point.get('y'));
      return;
    }

    if(props.strokes.size == 0){
      props.firstStrokeTimeUpdated(Date.now());
    }
    props.updateStrokes(props.strokes.push({points: new Immutable.List([point]), color: props.currentColor, width: props.currentWidth}));
  }

  function handleMouseMove(mouseEvent) {
    if (!isDrawing) {
      return;
    }

    const point = relativeCoordinatesForEvent(mouseEvent);
    if(props.currentColor == DRAW_AREA_ERASER_STRING){
      deleteLinesTouchingPoint(point.get('x'), point.get('y'));
      return;
    }

    props.updateStrokes(props.strokes.updateIn([props.strokes.size - 1], (line) => {
      line.points = line.points.push(point);
      return line;
    }));
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
