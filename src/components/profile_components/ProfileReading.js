import React from 'react'

export default function ProfileWishList(props) {

    let currentBooks = [];
    let wantAnything = false;
    if (props.userReaderExperiences.length){
        currentBooks = props.userReaderExperiences.map((experience, key) => {
            if (experience.status === "started"){
                wantAnything = true;
                return(
                    <div key={key} value={experience._id}>
                        <p>
                            <a href={`/readerexperiences/${experience._id}/edit`}>{experience.book.title}</a> by {experience.book.author}
                        </p>
                    </div>
                )
            }
        })
    }
    if (!wantAnything){
        currentBooks = 
        <div>
            <p>I'm taking a break.</p>
        </div>
    }

    return(
        <div className="half-pane">
            <h2>Books I'm reading</h2>
            {currentBooks}
        </div>
    )
}