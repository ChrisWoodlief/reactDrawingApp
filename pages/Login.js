import React from 'react'
import { useState } from 'react';
import { signIn, signOut, getCsrfToken, useSession, getSession } from 'next-auth/react';

async function loginClicked(){
  try{
    const res = await signIn('credentials', {
      redirect: false,
      username: 'cwoodlief6@gmail.com', //todoChris get from page
      password: 'password', //todoChris get from page
      callbackUrl: `${window.location.origin}`
    });
    console.log(`res ${JSON.stringify(res)}`);
  }catch(err){
    console.log(err);
  }
}

async function logoutClicked(){
  try{
    const res = await signOut('credentials', {
      redirect: false,
      email: 'cwoodlief6@gmail.com', //todoChris get from page
      password: 'password', //todoChris get from page
      callbackUrl: `${window.location.origin}`
    });
    console.log(`res ${JSON.stringify(res)}`);
  }catch(err){
    console.log(err);
  }
}

function AuthButton() {
  const { data: session } = useSession();
  if(session) {
    return <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    Not signed in <br/>
    <button onClick={() => signIn()}>Sign in</button>
  </>
}


export default class Login extends React.Component {
  static async getInitialProps() {
    return {}
  }
  render() {
    return (
      <>
        <AuthButton/>
        <button onClick={loginClicked}>
          Login
        </button>

        <button onClick={logoutClicked}>
          Logout
        </button>
      </>
    )
  }
}
