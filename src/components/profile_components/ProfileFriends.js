import React, { useReducer } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { propTypes } from 'react-bootstrap/esm/Image'

export default function ProfileFriends(props) {

    const handleClick = (e) => {
        e.preventDefault()
        return (
            <Redirect to={`/users/${e.target.value}`} />
        )
    }

    let friends = [];
    if (props.userFriends.length){
        friends = props.userFriends.map((friend, key) => {
            return (
                <div key={key} value={friends._id} onClick={handleClick}>
                        <NavLink className="nav-link" to = {`/profile/${friend._id}`}>{friend.first_name} {friend.last_name}</NavLink>
                </div>
            )
        })
    }
    return (
        <div className="half-pane">
            <h2>{props.userInfo.user_name}'s Buddies</h2>
            {friends}
        </div>
    )
}