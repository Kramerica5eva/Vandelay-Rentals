import React, { Component, Fragment } from "react";
import NavBar from "../../components/Elements/NavBar";
import FixedFooter from "../../components/Elements/FixedFooter";
import "./NoMatch.css"


class NoMatch extends Component {
  render() {
    return (
      <Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container" >
          <div className='body-container page-not-found'>
            <h1>
              404 Error: I think we are lost.
      </h1>
            <h2>
              The page you are looking for does not exist.
      </h2>
          </div>
          <FixedFooter />
        </div>
      </Fragment>
    )
  }
};

export default NoMatch;
