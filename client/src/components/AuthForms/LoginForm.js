import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Form";
import Modal from "../../components/Modal";
import API from "../../utils/API";

export class LoginForm extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    username: "",
    password: ""
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
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
      }).catch(err => {
        this.setModal({
          header: "Error",
          body: <h4>Username and/or password do not match anything in our database</h4>
        })
      });
  };

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
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
      </Fragment>
    )
  }

}