import React, { useEffect, useState, useRef } from "react";
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Immutable from 'Immutable';
import {DrawingAppNavbar} from '../components/drawingAppNavbar.js';
import FullScreenPageText from '../components/fullScreenPageText';
import ColorSelector from '../components/colorSelector';
import WidthSelector from '../components/widthSelector';
import DrawArea from '../components/drawArea';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import {translateServerStrokesToFrontEnd} from '../helpers/frontEndHelpers'


export default function DrawPage(props){

  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [currentColor, setCurrentColor] = useState();
  const [currentWidth, setCurrentWidth] = useState();
  const [firstStrokeTime, setFirstStrokeTime] = useState(null);
  const [disableDrawing, setDisableDrawing] = useState(false);
  const [privateChecked, setPrivateChecked] = useState(false);
  const [strokes, setStrokes] = useState(new Immutable.List());
  const router = useRouter();

  useEffect(() => {
    async function fetchDrawing(){
      if(router.query.drawingId){
        const response = await fetch('/api/getDrawing', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({drawingId: router.query.drawingId})
        });
        const data = await response.json();
        setCurrentDrawing(data.drawing);
        let frontEndStrokes = translateServerStrokesToFrontEnd(data.drawing.strokes);
        setStrokes(frontEndStrokes);
        setDisableDrawing(true);
      }
    }
    fetchDrawing();
  }, []);

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
      body: JSON.stringify({drawTimeMS, strokes: strokesForDb, isPrivate: privateChecked})
    });
    const data = await response.json();
    setCurrentDrawing(data.drawing);
    setDisableDrawing(true);
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

  function privateChanged(){
    setPrivateChecked((oldChecked) => {
      return !oldChecked;
    });
  }

  let contentArea = <FullScreenPageText pageText='Please sign in or register in the navigation bar to create drawings'></FullScreenPageText>;

  if(props.user || currentDrawing){
    let currentDrawingInfo = '';
    let actionsOrInfoArea = (<>
      <div>Select brush:</div>
      <ColorSelector colorUpdated={colorUpdated} currentColor={currentColor}/>
      <div>Select brush width (In pixels):</div>
      <WidthSelector widthUpdated={widthUpdated} currentWidth={currentWidth}/>

      <div className='saveAsPrivateCheckboxArea'>
        <label>
          <input type="checkbox" checked={privateChecked} onChange={privateChanged} />{' '}
          Save drawing as private
        </label>
      </div>
      <Button onClick={saveDrawing}>Save Drawing</Button>
    </>);

    if(currentDrawing){
      const drawingStatusText = currentDrawing.isPrivate ? <div>This drawing is private and will not appear in the feed.</div> : <div>This drawing is public and will appear in the feed. </div>;
      actionsOrInfoArea = (<div>
        {drawingStatusText}
        This drawing can be shared with the link: <a href={`/Create?drawingId=${currentDrawing.id}`}>{`http://localhost:3000/Create?drawingId=${currentDrawing.id}`}</a>
        <Button className='marginTop20' href='/Create'>Create new drawing</Button>
      </div>);
    }

    contentArea = (<>
      <DrawArea disableDrawing={disableDrawing} currentColor={currentColor} currentWidth={currentWidth} strokes={strokes} updateStrokes={updateStrokes} firstStrokeTime={firstStrokeTime} firstStrokeTimeUpdated={firstStrokeTimeUpdated} />
      <div className="drawPageActionsArea">
        {actionsOrInfoArea}
      </div>
    </>);
  }

  return (
    <>
      <DrawingAppNavbar/>
      {contentArea}
    </>
  )
}

//passing in props about the session from the server side
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session) {
    return {
      props: {}
    }
  }
  const { user, userId } = session;
  return {
    props: { user, signedInUserId: userId },
  }
}
