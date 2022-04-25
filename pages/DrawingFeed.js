import React, { useEffect, useState } from "react";
import { getSession, useSession} from "next-auth/react"
import {AuthButton} from './Login.js'
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'
import {msToTime} from '../helpers/frontEndHelpers'
import Moment from 'react-moment';
import 'moment-timezone';

export default function DrawingFeed(props) {
  const [drawings, setDrawings] = useState([]);

  useEffect(async () => {
    const response = await fetch('/api/getDrawings', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setDrawings(data.drawings);
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
    return (
      <DrawingFeedItem drawing={drawing} deleteClicked={deleteClicked}/>
    )
  });

  return (
    <>
      <AuthButton/>
      <div>Drawing Feed</div>
      <ListGroup>
        {drawingFeedItems}
      </ListGroup>
    </>
  );
}

function DrawingFeedItem(props){
  return (
    <ListGroup.Item>
      <p>Creation Date and Time:&nbsp;
        <Moment format="MMMM do, yyyy h:mmA">
          {props.drawing.createdAt}
        </Moment>
      </p>
      <p>Draw Time: {msToTime(props.drawing.drawTimeMS)}</p>
      <p>User Name: {props.drawing.user.name}</p>
      <p>User Email: {props.drawing.user.email}</p>
      <Button variant="danger" value={props.drawing.id} onClick={(event) => {props.deleteClicked(event.target.value)}}>Delete Drawing</Button>
    </ListGroup.Item>
  )
}



export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session) {
    return {
      props: {}
    }
  }
  const { user } = session;
  return {
    props: { user },
  }
}
