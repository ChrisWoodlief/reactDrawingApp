import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function RegisterPage(){

  const [state, setState] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [createdAccountEmail, setCreatedAccountEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  function handleInputChange(event) {
    const target = event.target;

    setState((lastState) => {
      let newObj = {
        ...lastState,
        [target.name]: target.value
      };
      return newObj;
    });
  }

  async function handleSubmit(event){
    event.preventDefault();
    const response = await fetch('/api/registerUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    });
    const data = await response.json();
    if(data.errorMessage){
      setErrorMessage(data.errorMessage);
      return;
    }
    setCreatedAccountEmail(state.email);
  }

  let formOrDoneArea = (
    <>
      <div>
        Account was created for email {createdAccountEmail}
      </div>
      <Button className='marginTop20' href='/api/auth/signin'>Sign in</Button>
    </>
  );
  let errorMessageDiv = '';
  if(errorMessage){
    errorMessageDiv = (
    <div>
      <Form.Text muted>
        {errorMessage}
      </Form.Text>
    </div>);
  }

  if(!createdAccountEmail){
    formOrDoneArea = (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Full name</Form.Label>
        <Form.Control onChange={handleInputChange} type="text" name='name' placeholder="Full name" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onChange={handleInputChange} type="email" name='email' placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onChange={handleInputChange} type="password" name='password' placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
      {errorMessageDiv}
    </Form>);
  }

  return (
    <div className="container marginTop20">
      <div className="row">
        <div className="col col-sm-10 offset-sm-1 col-md-6 offset-md-3">
          {formOrDoneArea}
        </div>
      </div>
    </div>
  );
}
