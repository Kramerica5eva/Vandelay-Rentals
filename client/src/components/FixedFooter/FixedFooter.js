import React from "react";
import { Link } from 'react-router-dom';
import "./FixedFooter.css"

// Must pass in a relative or web url with an image in order for parallax to work

class FixedFooter extends React.Component {

    render() {
        return (
            <footer className='fixed-footer'>
                <a href="###">GitHub</a>
                <p>Copyright 2018</p>
                <Link className="btn-link" to="##########" role="button">Contact</Link>
            </footer>
        );
    }
}


export default FixedFooter;