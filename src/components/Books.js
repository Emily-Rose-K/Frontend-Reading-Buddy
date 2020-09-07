import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Col, ListGroup } from 'react-bootstrap'

export default function Books() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [searchTitle, setSearchTitle] = useState("")
    const [searchAuthor, setSearchAuthor] = useState("")

    const handleTitle = (e) => {
        console.log(e.target.value)
        setSearchTitle(e.target.value)
    }    
    const handleAuthor = (e) => {
        console.log(e.target.value)
        setSearchAuthor(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get(`${process.env.REACT_APP_SERVER_URL}/books?title=${encodeURIComponent(searchTitle)}&author=${encodeURIComponent(searchAuthor)}`)
        //axios.get(`https://www.googleapis.com/books/v1/volumes?key=${process.env.REACT_APP_API_KEY}&q=${searchParam}`)
            .then(response => {
                // check the response is good
                if (response.status === 200) {
                    // set books equal to 
                    console.log("Hitting the search data now", response.data)
                    console.log("data.books", response.data.books)
                    setBooks(response.data.books) 
                } else {
                    setError(response.statusText)
                }
                console.log(response)
                console.log("🎯🎯🎯🎯🎯")
            })
            .catch(err => {
                setError(err.message)
            })
    }

    const handleClear = (e) => {
        e.preventDefault()
        setBooks([])
        setSearchTitle("")
        setSearchAuthor("")
    }

    let displayBooks = books.map((book, key) => {
        //let authors = book.author.map((author, key) => {
        //    return (
        //        <span> {author} &nbsp;&nbsp; </span>
        //        )
        //})
        return (
            <div>
                <Link to={`/book/${book._id}`}>
                {/* Do not display book covers here since openlibrary api has a rate limit of just 100 per 5 minutes */}
                Title: {book.title} &nbsp;&nbsp;
                Authors: {book.author} &nbsp;&nbsp;
                {/*Published: {book.volumeInfo.publishedDate} */}
                </Link>
            </div>
        )
    })

    return (
        <div>
            <h2>Search for Books:</h2>
            <Form className="books-form" onSubmit={handleSubmit} >
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label htmlFor="search_title">Title:</Form.Label>
                        <Form.Control type="search" id="search_title" placeholder="Search Parameter" value={searchTitle} onChange={handleTitle} />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label htmlFor="search_author">Author:</Form.Label>
                        <Form.Control type="search" id="search_author" placeholder="Search Parameter" value={searchAuthor} onChange={handleAuthor} />
                    </Form.Group>
                </Form.Row>
                <Button type="submit">Search</Button>
            </Form>
            <br></br>
            {displayBooks.length > 0 ? <p>----- Click a selection below to view more details -----</p> : <></>}
            <div>
                {displayBooks}
            </div>
            <br></br>
            {displayBooks.length > 0 ? <Button variant="secondary" size="sm" onClick={handleClear}>Clear</Button> : <></>}      
        </div>
        
    )
}