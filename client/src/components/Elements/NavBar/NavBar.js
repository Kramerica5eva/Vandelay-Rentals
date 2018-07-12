import React, { Fragment } from "react";
import { Link } from 'react-router-dom';
import GreyBtn from "../Buttons/GreyBtn";
import "./NavBar.css"

// Must pass in a relative or web url with an image in order for parallax to work

class NavBar extends React.Component {

  componentDidMount = () => {
    document.querySelector(".cross").style.display = 'none';
    // document.querySelector(".menu").style.display = 'none';
    document.querySelector(".menu").style.visibility = 'none';
    document.querySelector(".menu").style.opacity = '0';
  }

  hamburgerClick = () => {
    document.querySelector(".cross").style.display = 'flex';
    document.querySelector(".menu").style.visibility = 'visible';
    document.querySelector(".menu").style.opacity = '1';
    document.querySelector(".hamburger").style.display = 'none';
  }

  crossClick = () => {
    document.querySelector(".cross").style.display = 'none';
    // document.querySelector(".menu").style.display = 'none';
    document.querySelector(".menu").style.visibility = 'none';
    document.querySelector(".menu").style.opacity = '0';
    document.querySelector(".hamburger").style.display = '';
  }

  //  wanted to call both functions from an onClick event, so this function calls them both
  multiClick = () => {
    this.props.toggleForm();
    this.crossClick();
  }

  render() {
    return (
      <nav className='navbar'>

        <div className='brand-logo'>
          <Link className="btn-link logofont" to="/" role="button"><img className="logo-fmt" src="./static/assets/images/logosolid.png" />andelay</Link>
        </div>
        <div className='links'>
          <Link className="btn-link" to="/" role="button">Home</Link>
          <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
          <Link className="btn-link" to="/sales" role="button">Sales</Link>
          <Link className="btn-link" to="/courses" role="button">Courses</Link>
          {this.props.loggedIn ? (
            <Fragment>
              {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
              <Link className="btn-link" to="/profile" role="button">My Info</Link>
              <Link className="btn-link" to="/cart" role="button">Cart</Link>
              <GreyBtn logout={this.props.logout}>Logout</GreyBtn>
            </Fragment>
          ) : (
              <Fragment>
                {this.props.loginShow ? (
                  <Fragment>
                    <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} onClick={this.props.toggleForm} role="button">Signup</Link>
                    <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} role="button">Login</Link>
                  </Fragment>
                ) : (
                    <Fragment>
                      <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} role="button">Signup</Link>
                      <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} onClick={this.props.toggleForm} role="button">Login</Link>
                    </Fragment>
                  )
                }
              </Fragment>
            )
          }
        </div>
        <div className="hamburger-btns">
          <button onClick={this.hamburgerClick} className="hamburger"><i className="fas fa-bars"></i></button>
          <button onClick={this.crossClick} className="cross"><i className="fas fa-times 2x"></i></button>
        </div>
        <div className="menu" id="menu">
          <Link className="btn-link" to="/" role="button">Home</Link>
          <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
          <Link className="btn-link" to="/sales" role="button">Sales</Link>
          <Link className="btn-link" to="/courses" role="button">Courses</Link>
          {this.props.loggedIn ? (
            <Fragment>
              {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
              <Link className="btn-link" to="/profile" role="button">My Info</Link>
              <Link className="btn-link" to="/cart" role="button">Cart</Link>
              <GreyBtn logout={this.props.logout}>Logout</GreyBtn>
            </Fragment>
          ) : (
              <Fragment>
                {this.props.loginShow ? (
                  <Fragment>
                    <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} onClick={this.multiClick} role="button">Signup</Link>
                    <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} role="button">Login</Link>
                  </Fragment>
                ) : (
                    <Fragment>
                      <Link className="btn-link" to={{ pathname: "/signup", state: { from: this.props.location.pathname } }} role="button">Signup</Link>
                      <Link className="btn-link" to={{ pathname: "/login", state: { from: this.props.location.pathname } }} onClick={this.multiClick} role="button">Login</Link>
                    </Fragment>
                  )
                }
              </Fragment>
            )
          }
        </div>
      </nav>
    );
  }
}


export default NavBar;