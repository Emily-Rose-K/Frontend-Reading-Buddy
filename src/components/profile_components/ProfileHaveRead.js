import React from 'react'

export default function ProfileHaveRead(props) {
    let readBooks = [];
    let anythingRead = false;
    if (props.userReaderExperiences.length){
        readBooks = props.userReaderExperiences.map((experience, key) => {
            if (experience.status === "finished"){
                anythingRead = true;
                return(
                    <div key={key} value={experience.book._id}>
                        <p>{experience.book.title} by {experience.book.author}</p>
                    </div>
                )
            }
        })
        if (!anythingRead){
            readBooks = 
                <div>
                    <p>None yet</p>
                </div>
        }
    }
    return(
        <div className="half-pane">
            <h2>Books I've read</h2>
            {readBooks}
        </div>
    )
}