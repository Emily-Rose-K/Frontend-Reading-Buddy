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
  let [userReaderExperiences, setUserReaderExperiences] = useState({})
  let [userBooks, setUserBooks] = useState({})
  let [userFriends, setUserFriends] = useState({})

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
            <ReaderExperience 
              bookInfo={{title: "The Fellowship of the Ring", author: "JRR Tolkien", genre: "nonfiction", summary: "a teenager goes on a walk barefoot"}} 
              readerExperienceInfo={{rating: "3", review: "That was a dreadful idea", date_started: "2020-04-02", date_finished: "2020-04-20"}}
            />
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
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              userFriends={userFriends}
              setUserFriends={setUserFriends}
              currentUser={currentUser} 
            />
          </Route>
          <Route path='/register' component = {Register} />
          <Route path='/login' render ={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser} /> } />
          {/* <PrivateRoute path='/profile' render = {(props) => <Profile {...props} user={currentUser} /> }/> */}

          <Route exact path={`/profile/:id/friends`}>
            <Profile 
              userInfo={userInfo} 
              setUserInfo={setUserInfo}
              setUserReaderExperiences={setUserReaderExperiences}
              setUserBooks={setUserBooks}
              setUserFriends={setUserFriends}
              currentUser={currentUser} 
            />
            <ProfileFriends 
              userFriends={userFriends}
              currentUser={currentUser}
            />
          </Route>

          <Route path={`/profile/${currentUser.id}/reviews`}>
            <Profile setProfileInfo={setProfileInfo} profileInfo={profileInfo} currentUser={currentUser} /> 
            <ProfileReviews profileInfo={profileInfo} />
          </Route>

          <Route path={`/profile/${currentUser.id}/wishlist`}>
            <Profile setProfileInfo={setProfileInfo} profileInfo={profileInfo} currentUser={currentUser}/> 
            <ProfileHaveRead profileInfo={profileInfo} /> 
          </Route>

          <Route path={`/profile/${currentUser.id}/haveread`}>
            <Profile setProfileInfo={setProfileInfo} profileInfo={profileInfo} currentUser={currentUser} />
            <ProfileWishlist profileInfo={profileInfo} />
          </Route>

          <Route path='/' exact component={Home} />

        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
