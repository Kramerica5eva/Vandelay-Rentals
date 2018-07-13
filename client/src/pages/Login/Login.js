import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Header from "../../components/Elements/Header";
import DevLinks from "../../components/DevLinks";
import NavBar from "../../components/Elements/NavBar";
import FixedFooter from "../../components/Elements/FixedFooter";
import { LoginForm, SignupForm } from "../../components/AuthForms";
import "./Login.css";


class Login extends Component {

  state = {
    redirect: false,
    redirectLogin: false,
    loginShow: true
  }

  setRedirect = () => {
    this.setState({ redirect: true });
  }

  setRedirectLogin = () => {
    this.setState({ loginShow: true });
  }

  componentDidMount() {
    //  'loginShow' is a referrer derived from clicking a link to a protected route prior to login
    const { loginShow } = this.props.location.state || { loginShow: false };

    //  the loginShow prop is passed in as 'false' if the login page is accessed via the 'Signup' link
    this.setState({
      loginShow: this.props.loginShow || loginShow
    })
  }

  toggleForm = () => {
    this.setState({
      loginShow: !this.state.loginShow
    });
  }

  render() {
    //  'from' is set as a referrer either:
    //    a) when login is arrived at due to a redirect caused by trying to access a protected route prior to signing in
    //    b) when the login page is arrived at from the signup page - this allows us to prevent sending a user back to signup after logging in
    console.log(this.props.location.state);
    const { from } = this.props.location.state || { from: null };
    if (this.state.redirect) {
      if (from) {
        return <Redirect to={from} />
      } else {
        this.props.history.goBack();
      }
    }

    return (

      <div className="login-container">
        <div className="sticky-footer-div">
          <NavBar
            loggedIn={this.props.loggedIn}
            admin={this.props.admin}
            logout={this.props.logout}
            location={this.props.location}
            toggleForm={this.toggleForm}
            loginShow={this.state.loginShow}
          />
          <div className="login-content-container">
          <Header>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
          </Header>
            <div id="login-forms-container">

            {this.state.loginShow ? (
              <Fragment>
                <div className="login-toggle-div">
                  <button className="login-toggle-btn login-toggle-btn-light" onClick={this.toggleForm} >Signup</button>
                  <button className="login-toggle-btn">Login</button>
                </div>
                <div className="login-form-div">
                  <h2>Log in</h2>
                  <LoginForm
                    setRedirect={this.setRedirect}
                    updateUser={this.props.updateUser}
                  />
                </div>
              </Fragment>
            ) : (
                <Fragment>
                  <div className="login-toggle-div">
                    <button className="login-toggle-btn">Signup</button>
                    <button className="login-toggle-btn login-toggle-btn-light" onClick={this.toggleForm} >Login</button>
                  </div>
                  <div className="login-form-div">
                    <h2>Sign Up</h2>
                    <SignupForm
                      setRedirectLogin={this.setRedirectLogin}
                      updateUser={this.props.updateUser}
                    />
                  </div>
                </Fragment>
              )}

            </div>
          </div>

        </div>

        {/* <footer className='footer'> */}
          {/* <a href="https://github.com/Kramerica5eva/Vandelay-Rentals" target="_blank">GitHub</a> */}
          {/* <p>&#9400;Copyright 2018 Kramerica Industries</p> */}
          {/* <Link className="btn-link" to="##########" role="button">Contact</Link> */}
        {/* </footer> */}
        <FixedFooter/>
      </div>
    );
  }
}

export default Login;
