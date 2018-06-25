import React, { Component } from "react";
import { Link } from 'react-router-dom';
import "./Footer.css"

// Must pass in a relative or web url with an image in order for parallax to work

class Footer extends React.Component {

    render() {
        return (
            <footer className='footer'>
                <p>Copyright 2018</p>
            </footer>
        );
    }
}


export default Footer;