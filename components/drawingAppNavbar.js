import React from 'react';
import { useState, useEffect } from 'react';
import { signIn, signOut, getCsrfToken, useSession, getSession } from 'next-auth/react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export function DrawingAppNavbar() {
  const { data: session } = useSession();
  let [navbarTitleText, setNavbarTitleText] = useState('');
  let [pathname, setPathname] = useState('');
  useEffect(() => {
    if(window.location.pathname == '/DrawingFeed'){
      setNavbarTitleText('Drawing Feed 🎨');
    }else if(window.location.pathname == '/Create'){
      setNavbarTitleText('Create 🖌');
    }else{
      setNavbarTitleText('Drawing App');
    }
    setPathname(window.location.pathname);
  }, []);

  let userAuthSection = (<>
    <Navbar.Text className='italic'>Not signed in</Navbar.Text>
    <Nav.Link><Button onClick={() => signIn()}>Sign in</Button></Nav.Link>
    <Nav.Link href="/Register">Register</Nav.Link>
  </>);

  if(session){
    userAuthSection = (<>
      <Navbar.Text className='italic'>Signed in as {session.user.email}</Navbar.Text>
      <Nav.Link><Button onClick={() => signOut()}>Sign out</Button></Nav.Link>
    </>);
  }

  //Hide nav item for current page
  const feedLink = pathname == '/DrawingFeed' ? '' : <Nav.Link href="/DrawingFeed">Feed</Nav.Link>;
  let createLink = pathname == '/Create' ? '' : <Nav.Link href="/Create">Create drawing</Nav.Link>;

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>{navbarTitleText}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {feedLink}
            {createLink}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          {userAuthSection}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
