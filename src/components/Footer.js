import React from 'react';
// import { withTheme } from 'styled-components';

// TO DO: This is the only component that contains its own css
// Also, styled-components (see import above) looks like it could be really cool, but we're not using it atm
// Do we want to expand either kind of css to the rest of the app?

export default function Footer() {
    const footerstyle = {
        position: "fixed",
        backgroundColor: "white",
        borderTop: "1px solid black",
        padding: "5px",
        left:0,
        bottom:0,
        right:0
    }
    return (
        <footer style={footerstyle}>
            'Tis A Fire Upon the Hobbit TAFUH ©2020
        </footer>
    )
}