import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Redirect, useParams, NavLink } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

export default function SearchBookDetails({ currentUser }) {
    const [book, setBook] = useState({})
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState("");
    

    let { id } = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/books/${id}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(JSON.stringify(response.data.bookInfo))
                    setBook(response.data.bookInfo)
                    setReviews(response.data.bookInfo.readerExperiences)
                    const bookDescriptionRequest = axios.create(); // change default headers from setAuthToken.js into ones acceptable to the OpenLibrary API
                    bookDescriptionRequest.defaults.headers.common = {};
                    bookDescriptionRequest.defaults.headers.common.accept = 'application/json';
                    bookDescriptionRequest.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${response.data.bookInfo.api_id}&jscmd=details&format=json`)
                        .then(openLibraryResponse => {
                            let rawDescription = JSON.parse(JSON.stringify(openLibraryResponse.data[`ISBN:${response.data.bookInfo.api_id}`].details.description.value))
                            setDescription(rawDescription)  // OpenLibrary does not have descriptions for most books, but it does for a few
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    console.error(response.statusText)
                }
            })
            .catch(err => {
                setError(err.message)
                console.error(err)
            })
    }, [])

    let displayReviews = reviews.map((review, key) => {
        if (review.rating || review.review){
            return (
                <div className="review" key={key}>
                    {review.rating ? <p>{review.rating} stars </p> : <></>}
                    <p>{review.review}</p>
                    <p>-<NavLink to={`/profile/${review.user._id}/reviews`}>{review.user.first_name}</NavLink></p>
                </div>
            )
        }
    })

    if (!status){   // check whether this user has an experience with this book.  If so, make it the default selection on radio buttons
        reviews.forEach(experience => {
            if (experience.user._id === currentUser.id){
                setStatus(experience.status);
            }
        })
    }

    let handleWishlist = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/readerExperiences`, {status: "wishlist", book: book._id, user: currentUser.id})
            .then(response => {
                if (response.data.status){
                    setStatus(response.data.status)
                }
            })
    }
    let handleCurrentlyReading = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/readerExperiences`, {status: "started", book: book._id, user: currentUser.id})
        .then(response => {
            if (response.data.status){
                setStatus(response.data.status)
            }
        })
    }
    let handleHaveRead = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}/readerExperiences`, {status: "finished", book: book._id, user: currentUser.id})
        .then(response => {
            if (response.data.status){
                setStatus(response.data.status)
            }
        })
    }

    if (!book) {
        console.log("Waiting for server response");
        return null;
    }
    return (
        <div>
            <h2>Book Detail</h2>
            <div>
                <img className="large-cover" src={`http://covers.openlibrary.org/b/isbn/${book.api_id}-L.jpg`} alt={`cover of ${book.title}`} />
                <h2>{book.title}</h2>
                <h4>By {book.author}</h4>
                {/*<p>Publisher: {book.volumeInfo.publisher}</p>    // db does not currently have publisher, date, or page count fields, but these could be added
                <p>Published on: {book.volumeInfo.publishedDate}</p>*/}
                <p>{description}</p>
                <p><a href={`http://covers.openlibrary.org/b/isbn/${book.api_id}-L.jpg`}>Photo</a> from <a href={`http://openlibrary.org/isbn/${book.api_id}`}>Open Library</a></p>
                {/*<p>Page Count: {book.volumeInfo.pageCount}</p>
                <p>Average Rating: {book.volumeInfo.averageRating}</p> // we could get average ratings from API or from our own users */}
                <Form>
                    <Form.Check 
                        onClick={handleWishlist} 
                        inline 
                        name="status" 
                        label="Wishlist" 
                        type="radio" 
                        checked={status === "wishlist"}>
                    </Form.Check>
                    <Form.Check 
                        onClick={handleCurrentlyReading} 
                        inline 
                        name="status" 
                        label="Currently Reading" 
                        type="radio" 
                        checked={status === "started"}>
                    </Form.Check>
                    <Form.Check 
                        onClick={handleHaveRead} 
                        inline 
                        name="status" 
                        label="Have Read" 
                        type="radio" 
                        checked={status === "finished"}>
                    </Form.Check>
                    {status === "finished" 
                        ? <NavLink to={`/readerexperiences/edit?book=${book._id}`}><Button size="sm">Write a review!</Button></NavLink>
                        : ""
                    }
                </Form>
            </div>
            <div>
                {displayReviews}
            </div>
        </div>
        
    )
}
