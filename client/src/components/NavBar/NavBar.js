import React from "react";
import { Link } from 'react-router-dom';
import GreyBtn from "./../Buttons/GreyBtn";
import "./NavBar.css"

// Must pass in a relative or web url with an image in order for parallax to work

class NavBar extends React.Component {

    render() {
        return (
            <nav className='navbar'>

                <div className='brand-logo'>
                <Link className="btn-link" to="/" role="button">Logo</Link>
                </div>
                <div className='links'>
                    <Link className="btn-link" to="/" role="button">Home</Link>
                    <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
                    <Link className="btn-link" to="/sales" role="button">Sales</Link>
                    <Link className="btn-link" to="/courses" role="button">Courses</Link>
                    {this.props.loggedIn ? (
                        <GreyBtn logout={this.props.logout}>Logout</GreyBtn>
                        ) : (
                        <React.Fragment>
                            <Link className="btn-link" to="/signup" role="button">Signup</Link>
                            <Link className="btn-link" to="/login" role="button">Login</Link>
                        </React.Fragment>
                    )}
                </div>
            </nav>
        );
    }
}


export default NavBar;