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
        // Call the server
        // https://www.googleapis.com/books/v1/volumes/iJgu5v1CJ8gC
        /*axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
            .then(response => {
                // check the response is good
                if (response.status === 200) {
                    // set books equal to 
                    console.log("Something different on SearchTerm", response.data)
                    console.log("🌵🌵🌵",response.data.volumeInfo.title)
                    setBook(response.data) 
                } else {
                    setError(response.statusText)
                }
                    console.log("🥔🥔🥔🥔🥔")
            })
            .catch(err => {
                setError(err.message)
            })*/
        axios.get(`${process.env.REACT_APP_SERVER_URL}books/${id}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(JSON.stringify(response.data.bookInfo))
                    setBook(response.data.bookInfo)
                    setReviews(response.data.bookInfo.readerExperiences)
                    const bookDescriptionRequest = axios.create();
                    bookDescriptionRequest.defaults.headers.common = {};
                    bookDescriptionRequest.defaults.headers.common.accept = 'application/json';
                    bookDescriptionRequest.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${response.data.bookInfo.api_id}&jscmd=details&format=json`)
                        .then(openLibraryResponse => {
                            //console.log(`working with ${JSON.stringify(openLibraryResponse.data[`ISBN:${response.data.bookInfo.api_id}`].details.description.value)}`)
                            let rawDescription = JSON.parse(JSON.stringify(openLibraryResponse.data[`ISBN:${response.data.bookInfo.api_id}`].details.description.value))
                            setDescription(rawDescription)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    //const { data } = await instance.get(generatedUrl);
                } else {
                    console.error(response.statusText)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    /*let authors = book.volumeInfo.authors.map((author, key) => {
        return (
            <span>{author}</span>
        )
    })*/

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

    if (!status){
        reviews.forEach(experience => {
            if (experience.user._id === currentUser.id){
                setStatus(experience.status);
            }
        })
    }

    let handleWishlist = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}readerExperiences`, {status: "wishlist", book: book._id, user: currentUser.id})
            .then(response => {
                if (response.data.status){
                    setStatus(response.data.status)
                }
            })
    }
    let handleCurrentlyReading = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}readerExperiences`, {status: "started", book: book._id, user: currentUser.id})
        .then(response => {
            if (response.data.status){
                setStatus(response.data.status)
            }
        })
    }
    let handleHaveRead = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_SERVER_URL}readerExperiences`, {status: "finished", book: book._id, user: currentUser.id})
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
                {/*<p>Publisher: {book.volumeInfo.publisher}</p>
                <p>Published on: {book.volumeInfo.publishedDate}</p>*/}
                <p>{description}</p>
                <p><a href={`http://covers.openlibrary.org/b/isbn/${book.api_id}-L.jpg`}>Photo</a> from <a href={`http://openlibrary.org/isbn/${book.api_id}`}>Open Library</a></p>
                {/*<p>Page Count: {book.volumeInfo.pageCount}</p>
                <p>Average Rating: {book.volumeInfo.averageRating}</p>*/}
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
