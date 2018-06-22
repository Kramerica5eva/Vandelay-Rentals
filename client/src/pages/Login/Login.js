import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { Input, FormBtn } from "../../components/Form";
import API from "../../utils/API";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault()

    API.login({
      username: this.state.username,
      password: this.state.password
    })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            username: res.data.username,
            firstName: res.data.firstName,
            admin: res.data.admin
          });
          // go back to the page the user was on before login
          this.props.history.goBack();
        }
      }).catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <Header>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Sign in</h2>
          <p className="lead">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            <Link className="btn-link" to="/signup" role="button">Signup</Link>
            <Link className="btn-link" to="/login" role="button">Login</Link>
          </p>
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
