import React from "react";
import { Link, Redirect } from 'react-router-dom';
import GreyBtn from "./../Buttons/GreyBtn";
import "./NavBar.css"

// Must pass in a relative or web url with an image in order for parallax to work

class NavBar extends React.Component {

    componentDidMount = () => {
        document.querySelector(".cross").style.display = 'none';
        document.querySelector(".menu").style.display = 'none';
    }

    hamburgerClick = () => {
        document.querySelector(".cross").style.display = 'flex';
        document.querySelector(".menu").style.display = 'flex';
        document.querySelector(".hamburger").style.display = 'none';
    }

    crossClick = () => {
        document.querySelector(".cross").style.display = 'none';
        document.querySelector(".menu").style.display = 'none';
        document.querySelector(".hamburger").style.display = '';
    }

    render() {
        return (
            <nav className='navbar'>

                <div className='brand-logo'>
                    <Link className="btn-link" to="/" role="button">VR</Link>
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
                                <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} role="button">Signup</Link>
                                <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} role="button">Login</Link>
                            </React.Fragment>
                        )}
                </div>
                <div className="hamburger-btns">
                    <button onClick={this.hamburgerClick} className="hamburger">&#9776;</button>
                    <button onClick={this.crossClick} className="cross">&#735;</button>
                </div>
                <div className="menu" id="menu">
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