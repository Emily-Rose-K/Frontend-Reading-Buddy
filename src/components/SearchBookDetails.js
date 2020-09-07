import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Redirect, useParams } from 'react-router-dom'

export default function SearchBookDetails({ currentUser }) {
    const [book, setBook] = useState({})
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('')
    

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
                    /*console.log(`About to call https://openlibrary.org/api/books?bibkeys=ISBN:${response.data.bookInfo.api_id}&jscmd=details`)
                    axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${response.data.bookInfo.api_id}&jscmd=details`, {
                        headers: {'Content-Type': 'text/plain'}
                    })
                        .then(openLibraryResponse => {
                            console.log(`working with ${JSON.stringify(openLibraryResponse)}`)
                            setDescription(JSON.stringify(openLibraryResponse[`ISBN:0439358078"`]))
                        })
                        .catch(err => {
                            console.log(err)
                        })*/
                    const bookDescriptionRequest = axios.create();
                    bookDescriptionRequest.defaults.headers.common = {};
                    bookDescriptionRequest.defaults.headers.common.accept = 'application/json';
                    bookDescriptionRequest.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${response.data.bookInfo.api_id}&jscmd=details&format=json`)
                        .then(openLibraryResponse => {
                            console.log(`working with ${JSON.stringify(openLibraryResponse.data[`ISBN:${response.data.bookInfo.api_id}`].details.description.value)}`)
                            let rawDescription = JSON.parse(JSON.stringify(openLibraryResponse.data[`ISBN:${response.data.bookInfo.api_id}`].details.description.value))
                            //rawDescription = rawDescription.replace(/\\r/, "blah")
                            //rawDescription = rawDescription.replace(/\\n/, "bleh")
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
        return (
            <div key={key}>
                <p>{review.user.user_name} rates this book: {review.rating}</p>
                <p>{review.review}</p>
            </div>
        )
    })
    let handleWishlist = (e) => {
        e.preventDefault()
        setStatus('wishlist')
        axios.post(`${process.env.REACT_APP_SERVER_URL}readerExperiences`, {status: "wishlist", book: book._id, user: currentUser.id})
    }
    let handleCurrentlyReading = (e) => {
        e.preventDefault()
        setStatus('started')
        axios.post(`${process.env.REACT_APP_SERVER_URL}readerExperiences`, {status: "started", book: book._id, user: currentUser.id})
    }
    let handleHaveRead = (e) => {
        e.preventDefault()
        setStatus('finished')
        axios.post(`${process.env.REACT_APP_SERVER_URL}readerExperiences`, {status: "finished", book: book._id, user: currentUser.id})
    }

    if (!book) {
        console.log("Waiting for server response");
        return null;
    }
    return (
        <div>
            <div>
                <img src={`http://covers.openlibrary.org/b/isbn/${book.api_id}-L.jpg`} alt={`cover of ${book.title}`} />
                <h1>{book.title}</h1>
                <p>By: {book.author}</p>
                {/*<p>Publisher: {book.volumeInfo.publisher}</p>
                <p>Published on: {book.volumeInfo.publishedDate}</p>*/}
                <p>{description}</p>
                <p><a href={`http://covers.openlibrary.org/b/isbn/${book.api_id}-L.jpg`}>Photo</a> from <a href={`http://openlibrary.org/isbn/${book.api_id}`}>Open Library</a></p>
                {/*<p>Page Count: {book.volumeInfo.pageCount}</p>
                <p>Average Rating: {book.volumeInfo.averageRating}</p>*/}
                <form>
                    <button onClick={handleWishlist}>Wishlist</button>
                    <button onClick={handleCurrentlyReading}>Currently Reading</button>
                    <button onClick={handleHaveRead}>Have Read</button>
                </form>
            </div>
            <div>
                {displayReviews}
            </div>
        </div>
        
    )
}
