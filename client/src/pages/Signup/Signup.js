import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { Input, FormBtn } from "../../components/Form";
import API from "../../utils/API";

class Signup extends Component {
  state = {
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    phone: ""
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    //request to server to add a new username/password
    API.signup({
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zipcode: this.state.zipcode,
      phone: this.state.phone
    })
      .then(res => {
        if (!res.data.errmsg) {
          // update App.js state
          this.props.updateUser({
            auth: true,
            state: {
              loggedIn: true,
              username: res.data.username,
              firstName: res.data.firstName
            }
          });
          // go back to the page the user was on before signup
          this.props.history.goBack();
        } else {
          console.log('username already taken');
        }
      }).catch(error => {
        console.log('signup error: ');
        console.log(error);

      })
  };


  render() {
    return (
      <div>
        <Header>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Create an account</h2>
          <div className="nav-container">
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
              label="Create a Username:"
            />
            <Input
              value={this.state.password}
              onChange={this.handleInputChange}
              name="password"
              type="password"
              label="Create a Password:"
            />
            <Input
              value={this.state.confirmPassword}
              onChange={this.handleInputChange}
              name="confirmPassword"
              type="password"
              label="Confirm your password:"
            />
            <Input
              value={this.state.firstName}
              onChange={this.handleInputChange}
              name="firstName"
              type="text"
              label="First Name:"
            />
            <Input
              value={this.state.lastName}
              onChange={this.handleInputChange}
              name="lastName"
              type="text"
              label="Last Name:"
            />
            <Input
              value={this.state.email}
              onChange={this.handleInputChange}
              name="email"
              type="email"
              label="Email:"
            />
            <Input
              value={this.state.street}
              onChange={this.handleInputChange}
              name="street"
              type="text"
              label="Street Address:"
            />
            <Input
              value={this.state.city}
              onChange={this.handleInputChange}
              name="city"
              type="text"
              label="City:"
            />
            <Input
              value={this.state.state}
              onChange={this.handleInputChange}
              name="state"
              type="text"
              label="State:"
            />
            <Input
              value={this.state.zipcode}
              onChange={this.handleInputChange}
              name="zipcode"
              type="text"
              label="Zip Code:"
            />
            <Input
              value={this.state.phone}
              onChange={this.handleInputChange}
              name="phone"
              type="Number"
              label="Phone Number:"
            />
            <FormBtn
              disabled={(
                !this.state.username ||
                !this.state.password ||
                !this.state.confirmPassword ||
                !this.state.username ||
                !this.state.password ||
                !this.state.firstName ||
                !this.state.lastName ||
                !this.state.email ||
                !this.state.street ||
                !this.state.city ||
                !this.state.state ||
                !this.state.zipcode ||
                !this.state.phone
              ) || (this.state.password !== this.state.confirmPassword)}
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

export default Signup;