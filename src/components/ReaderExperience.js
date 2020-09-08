// TODO: Component should redirect backwards after form submission, but that looks like it will take more work in higher-level files
// TODO: Style
// TODO: Change update method to update CHANGED fields instead of TRUE fields.  
//       Right now, if a user mistakenly marks a book read and wants to erase it, they can't.  The new value reads as false and so is not updated.

import React , { useEffect, useState } from 'react'
import { Redirect, useLocation , NavLink } from 'react-router-dom'
import Axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap'

export default function ReaderExperience({ currentUser }) {

    const ratingOptions = ["1", "2", "3", "4", "5"];
    const [ rating, setRating ] = useState("");
    const [ review, setReview ] = useState("");
    const [ dateStarted, setDateStarted ] = useState("");
    const [ dateFinished, setDateFinished ] = useState("");
    const [ title, setTitle ] = useState("");
    const [ author, setAuthor ] = useState("");
    const [ apiId, setApiId ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ shouldRedirect, setShouldRedirect ] = useState(false);
    const [ readerExperienceId, setReaderExperienceId ] = useState("");
    const [ updateSuccessful, setUpdateSuccessful ] = useState(false);

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
        if ([review, rating, dateFinished].some((item) => {return item})) { // is true if review || rating || dateFinished
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
        Axios.put(`${process.env.REACT_APP_SERVER_URL}readerexperiences/${readerExperienceId}`, readerExperienceData)
            .then(response => {
                if (response.data.updatedReaderExperience){
                    setUpdateSuccessful(true);
                }
                console.log(`Update response from backend: ${JSON.stringify(response)}`)
            })
            .catch(err => {
                console.log(`error submitting update request: ${err}`)
            })
    }

    //const useQuery = () => {
    //    return new URLSearchParams(useLocation().search);
    //}
    let queryParams = new URLSearchParams(useLocation().search);

    useEffect(() => {
        if (!title){    // only make db call if necessary
            Axios.get(`${process.env.REACT_APP_SERVER_URL}readerexperiences?book=${queryParams.get("book")}&user=${currentUser.id}`, )
                .then(response => {
                    console.log(`response: ${JSON.stringify(response)}`);
                    if (response.status === 200){
                        if (!response.data.user){ // if there is no readerExperience between the reader & this book, redirect to book detail page
                            console.log(`Redirecting because this user has no relationship to this book`);
                            setShouldRedirect(true);
                        }
                        if (response.data._id) setReaderExperienceId(response.data._id);
                        if (response.data.rating) setRating(response.data.rating);
                        if (response.data.review) setReview(response.data.review);
                        if (response.data.date_started) setDateStarted(response.data.date_started.substring(0,10));
                        if (response.data.date_finished) setDateFinished(response.data.date_finished.substring(0,10));
                        if (response.data.book) setApiId(response.data.book.api_id);
                        if (response.data.book) setTitle(response.data.book.title);
                        if (response.data.book) setAuthor(response.data.book.author);
                        if (response.data.book) setDescription(response.data.book.description);
                    }
                })
        }
    })
    if (shouldRedirect){
        return ( <Redirect to={`/book/${queryParams.get("book")}`} /> )
    }
    return (
        <>
            <div className="container left-panel">
                <h3>Update Reader Experience</h3>
                <Container className="readerExperienceBookInfo">
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <img className="small-cover" src={`http://covers.openlibrary.org/b/isbn/${apiId}-M.jpg`} alt={`cover of ${title}`} />
                        </Col>
                        <Col xs="auto">
                            <h4>
                                <NavLink className="nav-link" to = {`/book/${queryParams.get("book")}`}> {title} </NavLink>
                            </h4>
                            <p>by {author}</p>
                            <p>
                                <a href={`http://covers.openlibrary.org/b/isbn/${apiId}-L.jpg`}>Photo</a> from <a href={`http://openlibrary.org/isbn/${apiId}`}>Open Library</a>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className="container right-panel">
                <Form onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} xs="auto">
                            <Form.Label htmlFor="dateStarted">Date started:</Form.Label>
                            <Form.Control type="date" id="dateStarted" defaultValue={dateStarted} onChange={handleDateStarted} />
                        </Form.Group>
                        <Form.Group as={Col} xs="auto">
                            <Form.Label htmlFor="dateFinished">Date finished:</Form.Label>
                            <Form.Control type="date" id="dateFinished" defaultValue={dateFinished} onChange={handleDateFinished}/>
                        </Form.Group>
                        <Form.Group as={Col} xs="auto">
                            <Form.Label htmlFor="rating">Rating:</Form.Label>
                            <Form.Control as="select" id="rating" name="rating" value={rating} onChange={handleRating}>
                                { ratingOptions.map(ratingOption => {
                                        return <option key={ratingOption} value={ratingOption}>{ratingOption}</option>
                                })}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="review">Review:</Form.Label>
                            <Form.Control as="textarea" id="review" name="review" defaultValue={review} onChange={handleReview} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form.Group>
                </Form>
                {updateSuccessful ? <p>Update Successful!</p> : <></>}
            </div>
        </>
    )
}