import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const DevLinks = props => (
  <Fragment>
    {props.dev ?
      <Fragment>
        <p className="dev-links-title">Dev Links</p>
        <div className="nav-container">
          <Link className="btn-link" to="/" role="button">Home</Link>
          <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
          <Link className="btn-link" to="/sales" role="button">Sales</Link>
          <Link className="btn-link" to="/courses" role="button">Courses</Link>
          {props.loggedIn ? (
            <Fragment>
              <Link className="btn-link" to="/cart" role="button">Cart</Link>
              <button className="btn-link" onClick={props.logout}>logout</button>
            </Fragment>
          ) : (
              <Fragment>
                <Link className="btn-link" to={{ pathname: "/signup", state: { from: props.location.pathname } }} role="button">Signup</Link>
                <Link className="btn-link" to="/login" role="button">Login</Link>
              </Fragment>
            )}
          <Link className="btn-link" to="/test" role="button">Test</Link>
          <Link className="btn-link" to="/testnick" role="button">TestNick</Link>
          <Link className="btn-link" to="/testben" role="button">TestBen</Link>
          <Link className="btn-link" to="/testbrandon" role="button">TestBrandon</Link>
          <Link className="btn-link" to="/testcorb" role="button">TestCorb</Link>
          <Link className="btn-link" to="/waiver" role="button">Waiver</Link>
          {props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
          {props.admin ? <Link className="btn-link" to="/adminkeith" role="button">AdminKeith</Link> : null}
          {props.admin ? <Link className="btn-link" to="/adminbrandon" role="button">AdminBrandon</Link> : null}
        </div>
      </Fragment > : null}

  </Fragment >
);

export default DevLinks;