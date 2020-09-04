import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        axios.get(`${process.env.REACT_APP_SERVER_URL}books?title=${encodeURIComponent(searchTitle)}&author=${encodeURIComponent(searchAuthor)}`)
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

            <form onSubmit={handleSubmit} >
                <br></br>
                <div>
                    <p>Search for books:</p>
                    <label>
                        title:
                        <input type="search" placeholder="Search Parameter" onChange={handleTitle} />
                    </label>
                    <label>
                        author:
                        <input type="search" placeholder="Search Parameter" onChange={handleAuthor} />
                    </label>
                </div>
                <br></br>
                <input type="submit" value="Submit" />
            </form>
            <p>----- Click a selection below to view more details -----</p>
            <div>
            {displayBooks}
            </div>
            <button onClick={handleClear}>Clear</button>      
        </div>
        
    )
}