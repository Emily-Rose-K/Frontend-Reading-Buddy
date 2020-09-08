import React from 'react'
import { NavLink } from 'react-router-dom'

export default function ProfileWishList(props) {

    let wishedBooks = [];
    let wantAnything = false;
    if (props.userReaderExperiences.length){
        wishedBooks = props.userReaderExperiences.map((experience, key) => {
            if (experience.status === "wishlist"){
                wantAnything = true;
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
    if (!wantAnything){
        wishedBooks = 
        <div>
            <p>I've already read enough thanks</p>
        </div>
    }

    return(
        <div className="half-pane">
            <h2>Books I'd like to read</h2>
            {wishedBooks}
        </div>
    )
}