import React, { useState } from 'react'
import UserRow from './users_components/UserRow.js'
import Axios from 'axios';
import { Button, Form, Col } from 'react-bootstrap'

export default function FindFriends(props) {
    let [ userList, setUserList ] = useState([]);
    let [ firstName, setFirstName ] = useState("");
    let [ lastName, setLastName ] = useState("");

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }
    const handleLastName = (e) => {
        setLastName(e.target.value);
    }
    const searchUsers = (e) => {
        e.preventDefault();
        //create a query string that includes first_name and/or last_name, but only if first_name and/or last_name values exist.
        let query = "";
        if (firstName && lastName) {
            query = `first_name=${firstName}&last_name=${lastName}`;
        } else { //only one of the following two if statements will fire
            if (firstName) { query = `first_name=${firstName}` };
            if (lastName) { query = `last_name=${lastName}` };
        }
        if (query) {
            // find all users whose names match the query.  Then compare them to the user's friend list so we can put appropriate add/remove friend buttons by them
            // also remove the user from the search results entirely, if they happen to search for their own name
            // we sincerely hope the user is their own best friend, but that doesn't need to be part of the app
            Axios.get(`${process.env.REACT_APP_SERVER_URL}users?${query}`)
                .then(queryResponse => {
                    Axios.get(`${process.env.REACT_APP_SERVER_URL}users/${props.currentUser.id}`)
                    .then(currentUserReponse => {   // queryResponse is a list of search results.  currentUserReponse has user info that contains a list of their friends
                        let myFriends = currentUserReponse.data.user.friends.map(friend => {return friend._id});
                        queryResponse.data.searchResults.forEach((user, index) => {
                            if (myFriends.includes(user._id)){  // flag all search results who are already the current user's friends
                                user.isFriend = true;
                            } else if (user._id === props.currentUser.id){  // if the current user is themself in the search results, remove their entry
                                queryResponse.data.searchResults.splice(index, 1)
                            }
                        })
                        setUserList(queryResponse.data.searchResults);
                    })
                    .catch(err => {
                        console.log(`Error retrieving existing friend list: ${err}`)
                    })
                })
                .catch(err => {
                    console.log(`Error getting search results: ${err}`);
                })
        }
    }



    return(
        <>
            <div>
                <h2> Find New Friends: </h2>
                <Form className="friends-form" onSubmit={searchUsers}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="first_name">First Name:</Form.Label>
                            <Form.Control type="text" id="first_name" onChange={handleFirstName}/>   
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="last_name">Last Name:</Form.Label>
                            <Form.Control type="text" id="last_name" onChange={handleLastName}/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Button type="submit">Search</Button>
                    </Form.Group>
                </Form>
            </div>
            <div>
                {userList.length > 0 ? (<h3>Search Results</h3>) : (<></>)}
                {userList.map(user => {
                    return <UserRow currentUser={props.currentUser} user={user} key={user._id} />
                })}
            </div>
        </>
    )
}