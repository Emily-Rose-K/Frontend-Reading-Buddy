import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import Axios from 'axios';

function ControlledCarusel() {
    const [index, setIndex] = useState(0)

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex)
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJh3Kh0YwpZVdb0iSd9xcXSmdjzyCeED63uA&usqp=CAU"
                alt="First slide"
                />
                <Carousel.Caption>
                    <h3>Connect With Friends!</h3>
                    <p>Find your friends and see what books interest them as well as reviews they have written!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJh3Kh0YwpZVdb0iSd9xcXSmdjzyCeED63uA&usqp=CAU"
                alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Keep Track of Your Reads!</h3>
                    <p>Keep track of the books you have read and find new ones based on your friends recommendations!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-100"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJh3Kh0YwpZVdb0iSd9xcXSmdjzyCeED63uA&usqp=CAU"
                alt="Third slide"
                />

                <Carousel.Caption>
                    <h3>Share Your Opinions and Start A Discussion!</h3>
                    <p>Read reviews written by the Reading Buddy community of books and write your own to join the conversation!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}


export default function Home() {
    const handleSeed = (e) => {
        e.preventDefault();
        Axios.post(`${process.env.REACT_APP_SERVER_URL}books`)
            .then(result => {
                console.log(`Seed request sent with no errors: ${JSON.stringify(result)}`)
            })
            .catch(err => {
                console.log(`Error submitting seed request: ${JSON.stringify(err)}`)
            })
    }
    return (
        <>
            <ControlledCarusel />
            <div className="title">
                <h1>Welcome to Reading Buddy</h1>
            </div>
            <form onSubmit={handleSeed}>
                <input type='submit' value="Seed DB" />
            </form> 
        </>
    )
}
