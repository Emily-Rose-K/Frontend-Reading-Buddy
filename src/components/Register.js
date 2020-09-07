import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, Redirect } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'

const Register = () => {
  let [first_name, setFirstName] = useState('')
  let [last_name, setLastName] = useState('')
  let [user_name, setUserName] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [password2, setPassword2] = useState('')
  let [redirect, setRedirect] = useState(false)

  let handleFirstName = (e) => {
    setFirstName(e.target.value)
  }

  let handleLastName = (e) => {
    setLastName(e.target.value)
  }

  let handleUserName = (e) => {
    setUserName(e.target.value)
  }

  let handleEmail = (e) => {
    setEmail(e.target.value)
  }

  let handlePassword = (e) => {
    setPassword(e.target.value)
  }

  let handlePassword2 = (e) => {
    setPassword2(e.target.value)
  }

  let handleSubmit = (e) => {
    e.preventDefault();
    if (password === password2) {
      const newUser = {
        first_name: first_name,
        last_name: last_name,
        user_name: user_name,
        email: email,
        password: password,
      }

      axios.post(`${process.env.REACT_APP_SERVER_URL}/users/register`, newUser)
        // .then(res => console.log(res.data))
    .then(res => {
      setRedirect(true)
    })
      .catch(err => console.log(err));
    }
  }

  let handleClear = (e) => {
    setFirstName('')
    setLastName('')
    setUserName('')
    setEmail('')
    setPassword('')
    setPassword2('')
  }

  if (redirect) return <Redirect to="/login" />

    return (
      <>
        <h2>Register</h2>
        <Form className="register-form"  dmethod="post" onSubmit={handleSubmit}>
            <Form.Group as={Row}> 
                <Form.Label className="register-label" as={Col} xs="4"> First name:</Form.Label>
                <Col xs="8">
                  <Form.Control type="text" name="first_name" value={first_name} onChange={handleFirstName} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}> 
                <Form.Label className="register-label" as={Col} xs="4"> Last name:</Form.Label>
                <Col>
                  <Form.Control type="text" name="last_name" value={last_name} onChange={handleLastName} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}> 
                <Form.Label className="register-label" as={Col} xs="4"> Username:</Form.Label>
                <Col>
                  <Form.Control type="text" name="user_name" name="user_name" value={user_name} onChange={handleUserName} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}> 
                <Form.Label className="register-label" as={Col} xs="4"> Email:</Form.Label>
                <Col>
                  <Form.Control type="email" name="email" value={email} onChange={handleEmail} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}> 
                <Form.Label className="register-label" as={Col} xs="4"> Password:</Form.Label>
                <Col>
                  <Form.Control type="password" name="password" value={password} onChange={handlePassword} />
                </Col>
            </Form.Group>
            <Form.Group as={Row}> 
                <Form.Label className="register-label" as={Col} xs="4"> Re-enter Password:</Form.Label>
                <Col>
                  <Form.Control type="password" name="password" value={password2} onChange={handlePassword2} />
                </Col>
            </Form.Group>
            <Button className="register-button" type="submit">Submit</Button>
            <Button className="register-button" onClick={handleClear}>Clear</Button>
        </Form>
        <h3>Already have an Account?</h3>
        <NavLink className="nav-link" to="/login">Sign in</NavLink>
      </>
    )
}

export default Register