import React, { useReducer } from 'react'
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
                <div key={key} value={friends._id} onClick={handleClick}>
                    <button>
                        <NavLink className="nav-link" to = {`/profile/${friend._id}`}>{friend.first_name} {friend.last_name}</NavLink>
                    </button>
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