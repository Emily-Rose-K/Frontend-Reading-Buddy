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


const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = localStorage.getItem(`jwtToken`);
  return user
    ? <Route {...rest} render={(props) => <Component {...rest} {...props} /> } />
    : <Redirect to='/login' />
//  return <Route {...rest} render={(props) => (
//      user
//          ? <Component {...rest} {...props} />
//          : <Redirect to='/login' />
//      )} 
//  />
}

function App() {
  let [currentUser, setCurrentUser] = useState("")
  let [isAuthenticated, setIsAuthenticated] = useState(true)
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

          <PrivateRoute exact path='/readerexperiences/edit'>
            {/* 
              I left id out of this url because if we instead search by book id and currentUser id, we can ensure user never gets to edit other people's reviews
              The bookId + currentUser id search will return no results, and we can then redirect the user to the general book detail page
              so this route will instead be passed book id as a query string, and be passed currentUser as a prop 
            */}
            <ReaderExperience 
              currentUser = {currentUser}
            />
          </PrivateRoute>
  
          <PrivateRoute exact path='/users'>
            <FindFriends currentUser={currentUser}/>
          </PrivateRoute>

          <PrivateRoute path='/books' component = {Books} />
          
          <PrivateRoute exact path='/book/:id'>
            <SearchBookDetails
              currentUser = {currentUser} 
            />
          </PrivateRoute>

          <PrivateRoute exact path='/profile/:id'>
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
          </PrivateRoute>

          <Route path='/register' component = {Register} />

          <Route path='/login' render ={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser} /> } />
          {/* <PrivateRoute path='/profile' render = {(props) => <Profile {...props} user={currentUser} /> }/> */}

          <PrivateRoute path={`/profile/:id/friends`}>
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
          </PrivateRoute>

          <PrivateRoute path={`/profile/:id/reviews`}>
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
          </PrivateRoute>

          <PrivateRoute path={`/profile/:id/wishlist`}>
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
          </PrivateRoute>

          <PrivateRoute path={`/profile/:id/reading`}>
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
          </PrivateRoute>

          <PrivateRoute path={`/profile/:id/haveread`}>
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
          </PrivateRoute>

          <Route path='/' exact component={Home} />

        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
