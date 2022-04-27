import React from 'react'
import { useState, useEffect } from 'react';
import { signIn, signOut, getCsrfToken, useSession, getSession } from 'next-auth/react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';


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

export function DrawingAppNavbar() {
  const { data: session } = useSession();
  let [navbarTitleText, setNavbarTitleText] = useState('');
  useEffect(() => {
    if(window.location.pathname == '/DrawingFeed'){
      setNavbarTitleText('Drawing Feed 🎨');
    }else if(window.location.pathname == '/Create'){
      setNavbarTitleText('Create 🖌');
    }else{
      setNavbarTitleText('Drawing App');
    }
  }, []);

  let userAuthSection = (<>
    <Navbar.Text className='italic'>Not signed in</Navbar.Text>
    <Nav.Link><Button onClick={() => signIn()}>Sign in</Button></Nav.Link>
    <Nav.Link href="/Register">Register</Nav.Link>
  </>);

  if(session){
    userAuthSection = (<>
      <Navbar.Text className='italic'>Signed in as {session.user.email}</Navbar.Text>
      <Nav.Link><button onClick={() => signOut()}>Sign out</button></Nav.Link>
    </>);
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>{navbarTitleText}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/DrawingFeed">Feed</Nav.Link>
            <Nav.Link href="/Create">Create drawing</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {userAuthSection}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


export default class Login extends React.Component {
  static async getInitialProps() {
    return {}
  }
  render() {
    return (
      <>
        <DrawingAppNavbar/>
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
