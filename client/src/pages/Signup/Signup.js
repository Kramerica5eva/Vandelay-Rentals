import React, { Component } from "react";
import { Link } from "react-router-dom";
import Jumbotron from "../../components/Jumbotron";
import { Container } from "../../components/Grid";
import { Input, FormBtn } from "../../components/Form";

class Signup extends Component {
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
    event.preventDefault();
    //  blah blah blah    
  };


  render() {
    return (
      <div>
      <Jumbotron>
        <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
        <h2>Create an account</h2>
        <p className="lead">
          <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
          <Link className="btn btn-primary btn-lg" to="/rentals" role="button">Rentals</Link>
          <Link className="btn btn-primary btn-lg" to="/sales" role="button">Sales</Link>
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
              label="Create a username"
            />
            <Input
              value={this.state.begin_date}
              onChange={this.handleInputChange}
              name="password"
              type="password"
              label="create a password"
            />
            <Input
              value={this.state.end_date}
              onChange={this.handleInputChange}
              name="confirm-password"
              type="password"
              label="Confirm your password"
            />
            <FormBtn
              disabled={!(this.state.username)}
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

export default Signup;