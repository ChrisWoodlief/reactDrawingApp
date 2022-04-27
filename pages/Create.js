import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';
import {DrawingAppNavbar} from './Login.js';
import ColorSelector from '../components/colorSelector';
import WidthSelector from '../components/widthSelector';
import DrawArea from '../components/drawArea';
import Button from 'react-bootstrap/Button';

export default function DrawPage(){

  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [currentColor, setCurrentColor] = useState();
  const [currentWidth, setCurrentWidth] = useState();
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
        strokeColor: currentStroke.color,
        strokeWidth: currentStroke.width,
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

  function updateStrokes(updatedStrokes){
    setStrokes(updatedStrokes);
  }

  function colorUpdated(updatedColor){
    setCurrentColor(updatedColor);
  }

  function widthUpdated(updatedWidth){
    setCurrentWidth(updatedWidth);
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
      <DrawingAppNavbar/>
      <DrawArea currentColor={currentColor} currentWidth={currentWidth} strokes={strokes} updateStrokes={updateStrokes} firstStrokeTime={firstStrokeTime} firstStrokeTimeUpdated={firstStrokeTimeUpdated} />
      <div className="drawPageActionsArea">
        <ColorSelector colorUpdated={colorUpdated} currentColor={currentColor}/>
        <WidthSelector widthUpdated={widthUpdated} currentWidth={currentWidth}/>
        <Button onClick={saveDrawing}>Save Drawing</Button>
        {currentDrawingInfo}
      </div>
    </>
  )
}
