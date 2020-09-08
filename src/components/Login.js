import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { NavLink, Redirect } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'

const Login = (props) => {  
    console.log(props)
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
  
    let handleEmail = (e) => {
      setEmail(e.target.value)
    }
  
    let handlePassword = (e) => {
      setPassword(e.target.value)
    }
  
    let handleSubmit = (e) => {
      e.preventDefault();
      const userData = {
        email: email,
        password: password
      }
      axios.post(`${process.env.REACT_APP_SERVER_URL}/users/login`, userData)
        .then(res => {
          const { token } = res.data;
          // Save to LocalStorage
          localStorage.setItem('jwtToken', token);
          // Set token to Auth Header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          props.nowCurrentUser(decoded);
        })
        .catch(err => console.log(err));
    }
  
    if (props.user) return <Redirect to= {`profile/${props.user.id}`} user={props.user} />

    return (
        <div>
            <h2>Log in</h2>
            <Form className="login-form" onSubmit ={handleSubmit}>
                <Form.Group as={Col} xs="auto" >
                  <Form.Label htmlFor="email">Email:</Form.Label>
                  <Form.Control type="email" id="email" value={email} onChange={handleEmail} required />                
                </Form.Group>
                <Form.Group  as={Col} xs="auto" >
                  <Form.Label htmlFor="password">Password:</Form.Label>
                  <Form.Control type="password" id="password" value={password} onChange={handlePassword} required />
                </Form.Group>
                <Form.Group>
                  <Button type="submit">Submit</Button>
                </Form.Group>
            </Form>
            <h3>Need an Account?</h3>
            <NavLink className="nav-link" to = "/register">Sign up</NavLink>
        </div>
    )
}

export default Login;