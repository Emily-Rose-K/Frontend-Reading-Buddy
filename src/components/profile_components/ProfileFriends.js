import React from 'react'
import { NavLink, Redirect } from 'react-router-dom'

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
                <div  className="review" key={key} value={friends._id} onClick={handleClick}>
                        <NavLink className="nav-link" to = {`/profile/${friend._id}`}>{friend.first_name} {friend.last_name}</NavLink>
                </div>
            )
        })
    }
    return (
        <div className="lower-pane">
            <h3>{props.userInfo.first_name}'s Buddies</h3>
            {friends}
        </div>
    )
}