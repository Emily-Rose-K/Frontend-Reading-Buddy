import React, { useEffect, useReducer, useRefresh, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Profile(props) {
    const [error, setError] = useState(null)
    const [refresh, setRefresh] = useState(false)
    let readThisWeek = 0;
    let readThisMonth = 0;
    let { id } = useParams()

    useEffect(() => {
        setRefresh(false)
        axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${id}`)
            .then(response => {
                if (response.status === 200) {
                    // rearrange backend response into shallower objects & pass to props
                    props.setUserInfo({
                        _id: response.data.user._id,
                        first_name: response.data.user.first_name,
                        last_name: response.data.user.last_name,
                        user_name: response.data.user.user_name,
                        email: response.data.user.email
                    })
                    props.setUserReaderExperiences(response.data.user.readerExperiences)
                    props.setUserFriends(response.data.user.friends)
                    let theseUserBooks = response.data.user.readerExperiences.map(readerExperience => {
                        return readerExperience.book;
                    });
                    props.setUserBooks(theseUserBooks)
                } else {
                    setError(response.statusText)
                }
            })
            .catch (err => {
                setError(err.message)
            })
    }, [id]) 
    if (!props.userInfo){ // do not proceed past this point if db response has not arrived.
        return null;
    }
    // determine time since finishing all books for display on profile page
    if (props.userReaderExperiences){
        let rightNow = new Date();
        props.userReaderExperiences.forEach(experience => {
            let dateFinished = new Date(experience.date_finished);
            if ((rightNow - dateFinished) < (1000*60*60*24*7)){ // if the book was finished less than a week ago
                readThisWeek++;
            }
            if ((rightNow - dateFinished) < (1000*60*60*24*30)) { // "read this month" can mean many things.  Here it is calculated as "within the last 30 days"
                readThisMonth++;
            }
        })
    }
    return (
        <div className="top-pane">
            <h2>{props.userInfo.first_name} {props.userInfo.last_name}'s Profile</h2>
            <p>Number of books read this week: {readThisWeek} </p>
            <p>Number of books read this month: {readThisMonth}  </p>
            <NavLink className="profile-link" to = {`/profile/${id}/friends`}> Friends </NavLink>
            <NavLink className="profile-link" to = {`/profile/${id}/reviews`}> Reviews </NavLink>
            <NavLink className="profile-link" to = {`/profile/${id}/wishlist`}> Wishlist </NavLink>
            <NavLink className="profile-link" to = {`/profile/${id}/reading`}> Currently reading </NavLink>
            <NavLink className="profile-link" to = {`/profile/${id}/haveread`}> Books I've Read </NavLink>
        </div>
    )
}