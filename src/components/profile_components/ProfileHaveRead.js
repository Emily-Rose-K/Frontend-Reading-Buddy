import React from 'react'
import { NavLink } from 'react-router-dom'

//TO DO: This component's code structure is identical to ProfileReading and ProfileWishlist, and nearly identical to Profile Reviews.
//If we can think of variable names that are informative across all those component types, we should combine the components into one.

export default function ProfileHaveRead(props) {

    let readBooks = [];
    let anythingRead = false;
    if (props.userReaderExperiences.length){
        readBooks = props.userReaderExperiences.map((experience, key) => {
            if (experience.status === "finished"){
                anythingRead = true;
                return(
                    <div className="review" key={key} value={experience._id}>
                        <p>
                            <NavLink className="nav-link" to = {`/readerexperiences/edit?book=${experience.book._id}`}> {experience.book.title} </NavLink> by {experience.book.author}
                        </p>
                    </div>
                )
            }
        })
    }
    if (!anythingRead){
        readBooks = 
            <div>
                <p>I'm not much of a reader</p>
            </div>
    }

    return(
        <div className="lower-pane">
            <h3>Books I've read</h3>
            {readBooks}
        </div>
    )
}