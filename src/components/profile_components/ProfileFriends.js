import React, { useReducer } from 'react'
import { Link, Redirect } from 'react-router-dom'

export default function ProfileFriends(props) {

    const handleClick = (e) => {
        e.preventDefault()
        return (
            <Redirect to={`/users/${e.target.value}`} />
        )
    }

    let friends = [];
    if (props.userFriends.length){
        console.log(`USER FRIENDS: ${JSON.stringify(props.userFriends)}`);
        friends = props.userFriends.map((friend, key) => {
            console.log(friend);
            return (
                <div key={key} value={friends._id} onClick={handleClick}>
                    <p>{friend.first_name} {friend.last_name}</p>
                </div>
            )
        })
    }
    return (
        <div>
            <h2>User's Friends</h2>
            {friends}
        </div>
    )


}