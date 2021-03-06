import React, { useEffect, useState } from "react";
import { getSession, useSession} from 'next-auth/react';
import {DrawingAppNavbar} from '../components/drawingAppNavbar.js';
import FullScreenPageText from '../components/fullScreenPageText.js';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import {msToTime, translateServerStrokesToFrontEnd} from '../helpers/frontEndHelpers';
import Moment from 'react-moment';
import 'moment-timezone';
import DrawArea from '../components/drawArea';
import Immutable from 'Immutable';

export default function DrawingFeed(props) {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    async function getData(){
      const response = await fetch('/api/getDrawings', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setDrawings(data.drawings);
    }
    getData();
  }, []);

  async function deleteClicked(drawingToDeleteId){
    const response = await fetch('/api/deleteDrawing', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({drawingId: drawingToDeleteId})
    });
    const data = await response.json();

    //filter is nice here to filter out the deleted drawing since it returns a new object, so react will pickup on the change
    setDrawings(drawings.filter((currentDrawing) => {
      return currentDrawing.id !== drawingToDeleteId;
    }));
  };

  const drawingFeedItems = drawings.map((drawing) => {
    const showDeleteButton = (props.signedInUserId == drawing.userId);
    return (
      <DrawingFeedItem key={drawing.id} drawing={drawing} deleteClicked={deleteClicked} showDeleteButton={showDeleteButton}/>
    )
  });

  let contentArea = <FullScreenPageText pageText='No drawings currently exist'></FullScreenPageText>;
  if(drawingFeedItems.length){
    contentArea = (<ListGroup>
      {drawingFeedItems}
    </ListGroup>);
  }

  return (
    <>
      <DrawingAppNavbar/>
      {contentArea}
    </>
  );
}

function DrawingFeedItem(props){
  let frontEndStrokes = translateServerStrokesToFrontEnd(props.drawing.strokes);
  let deleteButton;
  if(props.showDeleteButton){
    deleteButton = <div className='marginTop20'><Button variant="danger" value={props.drawing.id} onClick={(event) => {props.deleteClicked(event.target.value)}}>Delete Drawing</Button></div>;
  }

  return (
    <ListGroup.Item>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <p>Creation Date & Time:&nbsp;
              <Moment format="MMMM do, yyyy h:mmA">
                {props.drawing.createdAt}
              </Moment>
            </p>
            <p>Draw Time: {msToTime(props.drawing.drawTimeMS)}</p>
            <p>User Name: {props.drawing.user.name}</p>
            <p>User Email: {props.drawing.user.email}</p>
            View url: <a href={`/Create?drawingId=${props.drawing.id}`}>Click here</a>
            {deleteButton}
          </div>
          <div className="col-sm-12 col-md-6">
            <DrawArea strokes={frontEndStrokes} isThumbnail={true}/>
          </div>
        </div>
      </div>
    </ListGroup.Item>
  )
}


// Passing in props about the session from the server side
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
