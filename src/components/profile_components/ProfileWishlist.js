import React from 'react'

export default function ProfileWishList(props) {
    let wishedBooks = [];
    let wantAnything = false;
    if (props.userReaderExperiences.length){
        wishedBooks = props.userReaderExperiences.map((experience, key) => {
            if (experience.status === "wishlist"){
                wantAnything = true;
                return(
                    <div key={key} value={experience.book._id}>
                        <p>{experience.book.title} by {experience.book.author}</p>
                    </div>
                )
            }
        })
        if (!wantAnything){
            wishedBooks = 
            <div>
                <p>I've already read enough thanks</p>
            </div>
        }
    }
    return(
        <div className="half-pane">
            <h2>Books I'd like to read</h2>
            {wishedBooks}
        </div>
    )
}