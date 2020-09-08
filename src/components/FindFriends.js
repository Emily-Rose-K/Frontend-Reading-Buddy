import React, { useState } from 'react'
import UserRow from './users_components/UserRow.js'
import Axios from 'axios';
import { Button, Form, Col } from 'react-bootstrap'

export default function FindFriends(props) {
    //let sampleData = [{first_name: "bob", last_name: "brown", id:  "0294r2r", key:"0294r2r"}, {first_name: "Erika", last_name: "Svensworth", id: "2490fds", key: "2490fds"}];
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
        let query = "";
        if (firstName && lastName) {
            query = `first_name=${firstName}&last_name=${lastName}`;
        } else {
            if (firstName) { query = `first_name=${firstName}` };
            if (lastName) { query = `last_name=${lastName}` };
        }
        if (query) {
            console.log(`Sending axios call to ${process.env.REACT_APP_SERVER_URL}users?${query}`)
            // find all users whose names match the query.  Then compare them to the user's friend list so we can put appropriate add/remove friend buttons by them
            // also remove the user from the search results entirely, if they happen to search for their own name
            Axios.get(`${process.env.REACT_APP_SERVER_URL}users?${query}`)
                .then(queryResponse => {
                    Axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${props.currentUser.id}`)
                    .then(friendListResponse => {
                        let myFriends = friendListResponse.data.user.friends.map(friend => {return friend._id});
                        queryResponse.data.searchResults.forEach((user, index) => { // queryResponse is the list of search results.  friendListResponse is the user's friends
                            if (myFriends.includes(user._id)){
                                user.isFriend = true;
                            } else if (user._id === props.currentUser.id){
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
                            <Form.Control type="text" id="first_name" name="first_name" onChange={handleFirstName}/>   
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="last_name">Last Name:</Form.Label>
                            <Form.Control type="text" id="last_name" name="last_name" onChange={handleLastName}/>
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