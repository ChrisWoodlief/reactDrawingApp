import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';
import {AuthButton} from './Login.js'
import ColorSelector from '../components/colorSelector'


export default function DrawPage(){

  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [currentColor, setCurrentColor] = useState('black');
  const [firstStrokeTime, setFirstStrokeTime] = useState(null);
  const [strokes, setStrokes] = useState(new Immutable.List());

  async function saveDrawing(){
    const drawTimeMS = new Date() - firstStrokeTime;

    //Translate strokes into format for db
    const strokesForDb = strokes.map((currentStroke) => {
      const pointsString = '';
      currentStroke.points.forEach((currentPoint) => {
        if(pointsString != ''){
          pointsString += ';';
        }
        pointsString += `${currentPoint.get('x')},${currentPoint.get('y')}`;
      });
      return {
        //color: currentStroke.color, todochris add back when this is on db
        lineData: pointsString
      };
    });
    const response = await fetch('/api/saveDrawing', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({drawTimeMS, strokes: strokesForDb})
    });
    const data = await response.json();
    setCurrentDrawing(data.drawing);
  }

  function addStroke(newStroke){
    setStrokes((prevStrokes) => {
      return prevStrokes.push(newStroke);
    });
  }

  function addPoint(newPoint){
    setStrokes((prevStrokes) => {
      return prevStrokes.updateIn([prevStrokes.size - 1], (line) => {
        line.points = line.points.push(newPoint);
        return line;
      });
    });
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
      <DrawArea currentColor={currentColor} strokes={strokes} addStroke={addStroke} addPoint={addPoint} firstStrokeTime={firstStrokeTime} firstStrokeTimeUpdated={firstStrokeTimeUpdated} />
      <div className="drawPageActionsArea">
        <ColorSelector colorUpdated={colorUpdated}/>
        <button onClick={saveDrawing}>Save Drawing</button>
        {currentDrawingInfo}
      </div>
    </>
  )
}


/** strokes
{
  points,
  color
}
**/
function DrawArea(props) {
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
