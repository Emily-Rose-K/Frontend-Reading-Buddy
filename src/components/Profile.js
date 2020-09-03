import React, { useEffect, useReducer, useRefresh, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
// import ProfileFriends from '../components/profile_components/ProfileFriends'
import axios from 'axios'

export default function Profile(props) {
    //const [friends, setFriends] = useState([])
    const [error, setError] = useState(null)
    const [refresh, setRefresh] = useState(false)
    let readThisWeek = 0;
    let readThisMonth = 0;
    let { id } = useParams()

    useEffect(() => {
        setRefresh(false)
        axios.get(`${process.env.REACT_APP_SERVER_URL}users/${id}`)
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
            //console.log(`rightNow: ${rightNow}`)
            //console.log(`dateFinished: ${dateFinished}`)
            console.log(`${experience.book.title} was read ${rightNow.getTime()-dateFinished.getTime()} milliseconds ago`)
            if ((rightNow - dateFinished) < (1000*60*60*24*7)){ // if the book was finished less than a week ago
                readThisWeek++;
            }
            if ((rightNow - dateFinished) < (1000*60*60*24*30)) { // "read this month" can mean many things.  Here it is calculated as "within the last 30 days"
                readThisMonth++;
            }
        })
    }
    return (
        <div className="half-pane">
            <h2>{props.userInfo.user_name}'s Profile</h2>
            <p>Number of books read this week: {readThisWeek} </p>
            <p>Number of books read this month: {readThisMonth}  </p>
            <NavLink className="nav-link" to = {`/profile/friends/${id}`}> Navlink friends </NavLink>
            <a href={`/profile/friends/${id}`}>Friends</a><br></br>
            <a href={`/profile/${id}/reviews`}>Reviews</a><br></br>
            <a href={`/profile/${id}/wishlist`}>Wishlist</a><br></br>
            <a href={`/profile/${id}/reading`}>Currently reading</a><br></br>
            <a href={`/profile/${id}/haveread`}>Books I've Read</a><br></br>
        </div>
    )
}