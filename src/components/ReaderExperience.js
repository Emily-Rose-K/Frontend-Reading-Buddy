// TODO: Component should redirect backwards after form submission, but that looks like it will take more work in higher-level files
// TODO: Style
// TODO: Change update method to update CHANGED fields instead of TRUE fields.  
//       Right now, if a user mistakenly marks a book read and wants to erase it, they can't.  The new value reads as false and so is not updated.

import React , { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'axios';

export default function ReaderExperience() {

    const ratingOptions = ["1", "2", "3", "4", "5"];
    let [ rating, setRating ] = useState("");
    let [ review, setReview ] = useState("");
    let [ dateStarted, setDateStarted ] = useState("");
    let [ dateFinished, setDateFinished ] = useState("");
    let [ title, setTitle ] = useState("");
    let [ author, setAuthor ] = useState("");
    let [ description, setDescription ] = useState("");
    let { id } = useParams();

    const handleRating = (e) => {
        setRating(e.target.value)
    }
    const handleReview = (e) => {
        setReview(e.target.value)
    }
    const handleDateStarted = (e) => {
        setDateStarted(e.target.value)
    }
    const handleDateFinished = (e) => {
        console.log(`trying to set date finished to ${e.target.value}`)
        setDateFinished(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let status = "wishlist";
        if (review || dateFinished) {
            status = "finished"
        } else if (dateStarted) {
            status = "started"
        }
        const readerExperienceData = {status};
        if (rating) readerExperienceData.rating = rating;
        if (review) readerExperienceData.review = review;
        if (dateStarted) readerExperienceData.date_started = dateStarted;
        if (dateFinished) readerExperienceData.date_finished = dateFinished;
        console.log(`Sending update to backend: ${JSON.stringify(readerExperienceData)}`)
        Axios.put(`${process.env.REACT_APP_SERVER_URL}/readerexperiences/${id}`, readerExperienceData)
            .then(res => {
                console.log(`Update response from backend: ${JSON.stringify(res)}`)
            })
            .catch(err => {
                console.log(`error submitting update request: ${err}`)
            })
    }

    useEffect(() => {
        if (!title){    // only make db call if necessary
            Axios.get(`${process.env.REACT_APP_SERVER_URL}/readerexperiences/${id}`)
                .then(response => {
                    console.log(`response: ${JSON.stringify(response)}`);
                    if (response.status === 200){
                        if (response.data.rating) setRating(response.data.rating);
                        if (response.data.review) setReview(response.data.review);
                        if (response.data.date_started) setDateStarted(response.data.date_started.substring(0,10));
                        if (response.data.date_finished) setDateFinished(response.data.date_finished.substring(0,10));
                        setTitle(response.data.book.title);
                        setAuthor(response.data.book.author);
                        setDescription(response.data.book.description);
                    }
                })
        }
    })

    return (
        <>
            <div className="container left-panel">
                <h3>Current Book:</h3>
                <h4>{title}</h4>
                <p>Author: {author}</p>
                <p>Summary: {description}</p>
            </div>
            <div className="container right-panel">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="rating">Rating:</label>
                    <select id="rating"  name="rating" defaultValue={rating} onChange={handleRating}>
                        { ratingOptions.map(ratingOption => {
                                return <option key={ratingOption} value={ratingOption}>{ratingOption}</option>
                        })}
                    </select>
                    <label htmlFor="review">Review:</label>
                    <input type="text" id="review" name="review" defaultValue={review} onChange={handleReview} />
                    <label htmlFor="dateStarted">Date started:</label>
                    <input type="date" id="dateStarted" defaultValue={dateStarted} onChange={handleDateStarted} />
                    <label htmlFor="dateFinished">Date finished:</label>
                    <input type="date" id="dateFinished" defaultValue={dateFinished} onChange={handleDateFinished}/>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </>
    )
}