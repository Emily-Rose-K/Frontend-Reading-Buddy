import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

import Navbar from './components/Navbar';
import Books from './components/Books';
import Home from './components/Home';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import ReaderExperience from './components/ReaderExperience';

import FindFriends from './components/FindFriends';

import Footer from './components/Footer';
import SearchBookDetails from './components/SearchBookDetails';
import ProfileFriends from './components/profile_components/ProfileFriends';
import ProfileReviews from './components/profile_components/ProfileReviews';
import ProfileHaveRead from './components/profile_components/ProfileHaveRead';
import ProfileReading from './components/profile_components/ProfileReading';
import ProfileWishlist from './components/profile_components/ProfileWishlist';
import Axios from 'axios';
import { Link } from 'react-router-dom'


const PrivateRoute = ({ component: Component, ...rest }) => {

  const user = localStorage.getItem(`jwtToken`);
  return <Route {...rest} render={(props) => (
      user
          ? <Component {...rest} {...props} />
          : <Redirect to='/login' />
      )} 
  />
}

function App() {
  let [currentUser, setCurrentUser] = useState("")
  let [isAuthenticated, setIsAuthenticated] = useState(true)
  let [profileInfo, setProfileInfo] = useState({})  // phase this out
  let [userInfo, setUserInfo] = useState({})
  let [userReaderExperiences, setUserReaderExperiences] = useState([])
  let [userBooks, setUserBooks] = useState([])
  let [userFriends, setUserFriends] = useState([])

  useEffect(() => {
    let token;
    if(localStorage.getItem('jwtToken') === null) {
      setIsAuthenticated(false)
    } else {
      token = jwt_decode(localStorage.getItem('jwtToken'));
      setAuthToken(localStorage.jwtToken);
      setCurrentUser(token);
      setIsAuthenticated(true);
    }
  }, [])

  let nowCurrentUser = (userData) => {
    console.log("oh hey this is even running")
    setCurrentUser(userData);
    setIsAuthenticated(true)
  }

  let handleLogout = () => {
    if(localStorage.getItem('jwtToken') !== null) {
      localStorage.removeItem('jwtToken');
      setCurrentUser("");
      setIsAuthenticated(false);
    }
  }

  console.log('Current User = ', currentUser);
  console.log('Authenticated = ', isAuthenticated);

  return (
    <div className="App">
      <Router>
        <Navbar  handleLogout={handleLogout} isAuthed={isAuthenticated} currentUser={currentUser}/>
        <Switch>
          <Route exact path='/readerexperiences/:id/edit'>
            <ReaderExperience />
          </Route>
  
          <Route exact path='/users'>
            <FindFriends currentUser={currentUser}/>
          </Route>

          <Route path='/books' component = {Books} />
          <Route exact path='/book/:id' component = {SearchBookDetails} />
          <Route exact path='/profile/:id'>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              userReaderExperiences={userReaderExperiences}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              userFriends={userFriends}
              setUserFriends={setUserFriends}
              currentUser={currentUser} 
              userBooks={userBooks}
            />
          </Route>
          <Route path='/register' component = {Register} />
          <Route path='/login' render ={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser} /> } />
          {/* <PrivateRoute path='/profile' render = {(props) => <Profile {...props} user={currentUser} /> }/> */}

          <Route exact path={`/profile/:id/friends`}>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              userReaderExperiences={userReaderExperiences}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              setUserFriends={setUserFriends}
              currentUser={currentUser} 
            />
            <ProfileFriends
              userInfo={userInfo} 
              userFriends={userFriends}
              currentUser={currentUser}
            />
          </Route>

          <Route path={`/profile/:id/reviews`}>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              userReaderExperiences={userReaderExperiences}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              setUserFriends={setUserFriends}
              currentUser={currentUser}
            /> 
            <ProfileReviews 
              userReaderExperiences={userReaderExperiences}
            />
          </Route>

          <Route path={`/profile/:id/wishlist`}>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              userReaderExperiences={userReaderExperiences}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              setUserFriends={setUserFriends}
              currentUser={currentUser}
            /> 
            <ProfileWishlist 
              userReaderExperiences={userReaderExperiences}
            /> 
          </Route>

          <Route path={`/profile/:id/reading`}>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              userReaderExperiences={userReaderExperiences}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              setUserFriends={setUserFriends}
              currentUser={currentUser}
            /> 
            <ProfileReading 
              userReaderExperiences={userReaderExperiences}
            /> 
          </Route>

          <Route path={`/profile/:id/haveread`}>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              userReaderExperiences={userReaderExperiences}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              setUserFriends={setUserFriends}
              currentUser={currentUser} 
            />
            <ProfileHaveRead 
              userReaderExperiences={userReaderExperiences}
            />
          </Route>

          <Route path='/' exact component={Home} />

        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
