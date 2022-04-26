import React, { useEffect, useState, useRef } from "react";
import Immutable from 'Immutable';
import {AuthButton} from './Login.js';
import ColorSelector from '../components/colorSelector';
import WidthSelector from '../components/widthSelector';
import DrawArea from '../components/drawArea';

export default function DrawPage(){

  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [currentColor, setCurrentColor] = useState('black');
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
      <AuthButton/>
      <DrawArea currentColor={currentColor} currentWidth={currentWidth} strokes={strokes} addStroke={addStroke} addPoint={addPoint} firstStrokeTime={firstStrokeTime} firstStrokeTimeUpdated={firstStrokeTimeUpdated} />
      <div className="drawPageActionsArea">
        <ColorSelector colorUpdated={colorUpdated} currentColor={currentColor}/>
        <WidthSelector widthUpdated={widthUpdated} currentWidth={currentWidth}/>
        <button onClick={saveDrawing}>Save Drawing</button>
        {currentDrawingInfo}
      </div>
    </>
  )
}
