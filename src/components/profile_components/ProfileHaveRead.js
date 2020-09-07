import React from 'react'
import { NavLink } from 'react-router-dom'

export default function ProfileHaveRead(props) {

    let readBooks = [];
    let anythingRead = false;
    if (props.userReaderExperiences.length){
        readBooks = props.userReaderExperiences.map((experience, key) => {
            if (experience.status === "finished"){
                anythingRead = true;
                return(
                    <div key={key} value={experience._id}>
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
        <div className="half-pane">
            <h2>Books I've read</h2>
            {readBooks}
        </div>
    )
}