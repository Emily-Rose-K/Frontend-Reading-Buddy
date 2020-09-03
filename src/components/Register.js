import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'

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
        <form method="post" onSubmit={handleSubmit}>
            <label>
                First name:
                <input type="text" name="first_name" value={first_name} onChange={handleFirstName} />
            </label>
            <br></br>
            <label>
                Last name:
                <input type="text" name="last_name" value={last_name} onChange={handleLastName} />
            </label>
            <br></br>
            <label>
                Username:
                <input type="text" name="user_name" name="user_name" value={user_name} onChange={handleUserName} />
            </label>
            <br></br>
            <label>
                Email:
                <input type="email" name="email" value={email} onChange={handleEmail} />
            </label>
            <br></br>
            <label>
                Password:
                <input type="password" name="password" value={password} onChange={handlePassword} />
            </label>
            <br></br>
            <label>
                Re-enter Password:
                <input type="password" name="password" value={password2} onChange={handlePassword2} />
            </label>
            <br></br>
            <input type="submit" value="Submit" />
            <button onClick={handleClear}>Clear</button>
            <h3>Already have an Account?</h3>
            <a href="/login">Sign-in</a>
        </form>
    )
}

export default Register