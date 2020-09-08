import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap'

export default function Books() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [searchTitle, setSearchTitle] = useState("")
    const [searchAuthor, setSearchAuthor] = useState("")

    const handleTitle = (e) => {
        setSearchTitle(e.target.value)
    }    
    const handleAuthor = (e) => {
        setSearchAuthor(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.get(`${process.env.REACT_APP_SERVER_URL}/books?title=${encodeURIComponent(searchTitle)}&author=${encodeURIComponent(searchAuthor)}`)
            .then(response => {
                // check the response is good
                if (response.status === 200) {
                    setBooks(response.data.books) 
                } else {
                    setError(response.statusText)
                }
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
        return (
            <div>
                <Link to={`/book/${book._id}`}>
                {/* Do not display book covers here since openlibrary api has a rate limit of just 100 per 5 minutes */}
                Title: {book.title} &nbsp;&nbsp;
                Authors: {book.author} &nbsp;&nbsp;
                {/*Published: {book.volumeInfo.publishedDate}  This is not currently a database field but would be reasonable to add */}
                </Link>
            </div>
        )
    })

    return (
        <div className="top-pane">
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
                <Form.Group>
                    <Button type="submit">Search</Button>
                </Form.Group>
            </Form>
            <br></br>
            {displayBooks.length > 0 
                ? <>
                    <p>----- Click a selection below to view more details -----</p>
                    <div>
                        {displayBooks}
                    </div>
                    <br></br>
                    <Button id="bottom-button" variant="secondary" size="sm" onClick={handleClear}>Clear</Button> 
                </>
                : <></>}
        </div>
        
    )
}