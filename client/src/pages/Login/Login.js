import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Header from "../../components/Header";
import { Input, FormBtn } from "../../components/Form";
import API from "../../utils/API";


class Login extends Component {
  state = {
    username: "",
    password: "",
    redirect: false
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    API.login({
      username: this.state.username,
      password: this.state.password
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          // update App.js state
          this.props.updateUser({
            auth: true,
            admin: res.data.admin,
            state: {
              loggedIn: true,
              username: res.data.username,
              firstName: res.data.firstName,
              admin: res.data.admin
            }
          });
          // go back to the page the user was on before login
          this.setState({ redirect: true });
        }
      }).catch(err => console.log(err));
  };

  render() {
    console.log(this.props.location.state);
    const { from } = this.props.location.state || { from: null };
    const { redirect } = this.state;

    if (redirect) {
      if (from) {
        return <Redirect to={from} />
      } else {
        this.props.history.goBack();
      }
    }

    return (
      <div>
        <Header>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Sign in</h2>
          <div className="nav-container">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            {this.props.loggedIn ? (
              <button className="btn-link" onClick={this.props.logout}>logout</button>
            ) : (
                <React.Fragment>
                  <Link className="btn-link" to="/signup" role="button">Signup</Link>
                  <Link className="btn-link" to="/login" role="button">Login</Link>
                </React.Fragment>
              )}
            <Link className="btn-link" to="/test" role="button">Test</Link>
            <Link className="btn-link" to="/testnick" role="button">TestNick</Link>
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
        </Header>
        <div>
          <form>
            <Input
              value={this.state.username}
              onChange={this.handleInputChange}
              name="username"
              type="text"
              label="Username"
            />
            <Input
              value={this.state.password}
              onChange={this.handleInputChange}
              name="password"
              type="password"
              label="Password"
            />
            <FormBtn
              disabled={!this.state.username || !this.state.password}
              onClick={this.handleFormSubmit}
            >
              Submit
              </FormBtn>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
