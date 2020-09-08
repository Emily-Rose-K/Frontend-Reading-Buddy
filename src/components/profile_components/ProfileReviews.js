import React from 'react'
import { NavLink } from 'react-router-dom'

export default function ProfileReviews(props) {

    let reviews = [];
    let anythingReviewed = false;
    if (props.userReaderExperiences.length){
        reviews = props.userReaderExperiences.map((experience, key) => {
            if (experience.review || experience.rating){
                anythingReviewed = true;
                return (
                    <div className="review" key={key} value={reviews._id}>
                        <p>
                            <NavLink className="nav-link" to = {`/readerexperiences/edit?book=${experience.book._id}`}> {experience.book.title} </NavLink> by {experience.book.author}
                        </p>
                        <p>{experience.rating} out of 5 stars</p>
                        <p>{experience.review}</p>
                    </div>
                )
            }
        })
    }
    if (!anythingReviewed){
        reviews =
            <div>
                <p>I prefer reading words over writing them</p>
            </div>
    } 

    return(
        <div className="half-pane">
            <h2>My book reviews</h2>
            {reviews}
        </div>
    )
}