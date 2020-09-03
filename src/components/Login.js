import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { Redirect } from 'react-router-dom'

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
      console.log(`Posting to ${process.env.REACT_APP_SERVER_URL}users/login`)
      axios.post(`${process.env.REACT_APP_SERVER_URL}users/login`, userData)
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

    let handleClear = (e) => {
      setEmail('')
      setPassword('')
    }
  
    if (props.user) return <Redirect to= {`profile/${props.user.id}`} user={props.user} />

    return (
        <div>
            <form onSubmit ={handleSubmit}>
                <label>
                    Email:
                    <input type="email" name="email" value={email} onChange={handleEmail} className="form-control" required />
                </label>
                <br></br>
                <label>
                    Password:
                    <input type="password" name="password" value={password} onChange={handlePassword} className="form-control" required />
                </label>
                <br></br>
                <input type="submit" value="Submit" />
                <button onClick={handleClear}>Clear</button>
            </form>
            <h3>Need an Account?</h3>
            <NavLink className="nav-link" to = "/register">Sign up</NavLink>
        </div>
    )
}

export default Login;