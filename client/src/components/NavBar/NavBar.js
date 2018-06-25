import React, { Component } from "react";
import { Link } from 'react-router-dom';
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
                        <button className="btn-link" role="button" onClick={this.props.logout}>logout</button>
                        ) : (
                        <React.Fragment>
                            <Link className="btn-link" to="/signup" role="button">Signup</Link>
                            <Link className="btn-link" to="/login" role="button">Login</Link>
                        </React.Fragment>
                    )}
                    <Link className="btn-link" to="/test" role="button">Test</Link>
                    {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
                </div>
            </nav>
        );
    }
}


export default NavBar;