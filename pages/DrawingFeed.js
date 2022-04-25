import React, { useEffect, useState } from "react";
import { getSession, useSession} from "next-auth/react"
import {AuthButton} from './Login.js'
import ListGroup from 'react-bootstrap/ListGroup';
import {msToTime} from '../helpers/frontEndHelpers'

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

  const drawingFeedItems = drawings.map((drawing) => {
    return (
      <DrawingFeedItem drawing={drawing}/>
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
      <p>Creation Date and Time: {props.drawing.createdAt}</p>
      <p>Draw Time: {msToTime(props.drawing.drawTimeMS)}</p>
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
