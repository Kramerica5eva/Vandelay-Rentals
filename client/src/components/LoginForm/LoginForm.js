import React, { Component } from "react";
import { Input, FormBtn } from "../Form";
import API from "../../utils/API";

class LoginForm extends Component {
  state = {
    username: "",
    password: ""
  }

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
          // Once logged in, set this.state.redirect to true so the component will reload and trigger the if/else to redirect elsewhere
          this.props.setRedirect();
        }
      }).catch(err => console.log(err));
  };

  render() {
    return (
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
    )
  }


}

export default LoginForm;