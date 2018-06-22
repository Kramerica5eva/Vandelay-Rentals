import React, { Component } from "react";
import { Link } from "react-router-dom";
import Jumbotron from "../../components/Jumbotron";
import { Container } from "../../components/Grid";
import { Input, FormBtn } from "../../components/Form";
import axios from 'axios';

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
    console.log('handleSubmit')

    axios
      .post('/user/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log('login response: ')
        console.log(response)
        if (response.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            username: response.data.username
          });
          // go back to the page the user was on before login
          this.props.history.goBack();
        }
      }).catch(error => {
        console.log('login error: ')
        console.log(error);

      })
  };

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Sign in</h2>
          <p className="lead">
            <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
            <Link className="btn btn-primary btn-lg" to="/rentals" role="button">Rentals</Link>
            <Link className="btn btn-primary btn-lg" to="/sales" role="button">Sales</Link>
            <Link className="btn btn-primary btn-lg" to="/courses" role="button">Courses</Link>
            <Link className="btn btn-primary btn-lg" to="/signup" role="button">Signup</Link>
            <Link className="btn btn-primary btn-lg" to="/login" role="button">Login</Link>
          </p>
        </Jumbotron>
        <Container>
          <form>
            <Input
              value={this.state.topic}
              onChange={this.handleInputChange}
              name="username"
              type="text"
              label="Username"
            />
            <Input
              value={this.state.begin_date}
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
        </Container>
      </div>
    );
  }
}

export default Login;
