import React, { useEffect, useState } from "react";
import { getSession, useSession} from "next-auth/react"
import {AuthButton} from './Login.js'

export default class DrawingFeed extends React.Component {

  async componentDidMount(){
    try{
      console.log(`this.props ${JSON.stringify(this.props.user)}`)
      if(this.props.user){
        console.log('was a session');
      }else{
        console.log('no session');
      }
      const response = await fetch('/api/hello');
      const data = await response.json();
      console.log(`data: ${JSON.stringify(data)}`);
    }
    catch(error){
        console.log(`componentDidMount error ${error}`);
    }
  }

  render() {
    return (
      <>
        <AuthButton/>
        <div>Drawing Feed</div>
      </>
    )
  }
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
