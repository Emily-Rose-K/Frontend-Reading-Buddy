import React, { useState } from 'react'
import Axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-bootstrap'


/* 
This component expects props in the form of 
    user: {_id: blah, first_name: blah, last_name: blah, isFriend: boolean}
    currentUser: {id: blah}
The component returns a div with the user's name along with a button.
Clicking on the user's name links to that user's profile.
Clicking on the button adds or removes the user as a friend, depending on whether they currently are one.
*/

export default function UserRow(props) {
    let [ isFriend, setIsFriend ] = useState(props.user.isFriend);
    let buttonLabel = isFriend ? "Remove Friend" : "Add Friend";

    const handleClick = () => {
        let removeFlag = isFriend ? "?remove=true" : "";
        Axios.put(`${process.env.REACT_APP_SERVER_URL}users/${props.currentUser.id}/update${removeFlag}`, {friendId: props.user._id})
            .then(updateResult => {
                setIsFriend(!isFriend);
            })
            .catch(err => {
                console.log(`Error adding friend: ${err}`);
            })
    }
    return(
        <div>
            <NavLink className="friend-result-link" to={`/profile/${props.user._id}`}>{props.user.first_name} {props.user.last_name}</NavLink>
            <Button variant="secondary" size="sm" onClick={handleClick}>{buttonLabel}</Button>
        </div>
    )
}
