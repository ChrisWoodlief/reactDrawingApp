import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';
import {AuthButton} from './Login.js'
import ColorSelector from '../components/colorSelector'


export default function DrawPage(){

  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [currentColor, setCurrentColor] = useState('black');
  const [firstStrokeTime, setFirstStrokeTime] = useState(null);

  async function saveDrawing(){
    const drawTimeMS = new Date() - firstStrokeTime;
    const response = await fetch('/api/saveDrawing', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({drawTimeMS})
    });
    const data = await response.json();
    setCurrentDrawing(data.drawing);
  }

  function colorUpdated(updatedColor){
    setCurrentColor(updatedColor);
  }

  function firstStrokeTimeUpdated(updatedFirstStrokeTime){
    setFirstStrokeTime(updatedFirstStrokeTime);
  }

  let currentDrawingInfo;
  if(currentDrawing){
    currentDrawingInfo = <div>Drawing is on server. ID: {currentDrawing.id}</div>;
  }else{
    currentDrawingInfo = <div>Drawing is not uploaded to server</div>;
  }
  return (
    <>
      <AuthButton/>
      <DrawArea currentColor={currentColor} firstStrokeTime={firstStrokeTime} firstStrokeTimeUpdated={firstStrokeTimeUpdated} />
      <div className="drawPageActionsArea">
        <ColorSelector colorUpdated={colorUpdated}/>
        <button onClick={saveDrawing}>Save Drawing</button>
        {currentDrawingInfo}
      </div>
    </>
  )
}


/** lines
{
  points,
  color
}
**/
function DrawArea(props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('black');
  const [lines, setLines] = useState(new Immutable.List());
  const [currentPointCount, setCurrentPointCount] = useState(0);
  const drawAreaRef = useRef(null);

  function handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = relativeCoordinatesForEvent(mouseEvent);

    if(lines.size == 0){
      props.firstStrokeTimeUpdated(Date.now());
    }
    setIsDrawing(true);
    setLines((prevLines) => {
      return prevLines.push({points: new Immutable.List([point]), color: props.currentColor});
    });
  }

  function handleMouseMove(mouseEvent) {
    if (!isDrawing) {
      return;
    }

    const point = relativeCoordinatesForEvent(mouseEvent);

    setLines((prevLines) => {
      return prevLines.updateIn([prevLines.size - 1], (line) => {
        line.points = line.points.push(point);
        return line;
      });
    });
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
        lines={lines}
      />
    </div>
  );
}

function Drawing({ lines }) {
  return (
    <svg className="innerDrawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} />
      ))}
    </svg>
  );
}

function DrawingLine({ line, color }) {
  const pathData =
    "M " +
    line.points
      .map((p) => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");
  //console.log(`pathData ${pathData}`);
  return <path className="path" d={pathData} stroke={line.color} />;
}
