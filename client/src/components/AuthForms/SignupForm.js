import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";

export class SignupForm extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
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
        console.log(res);
        if (res.data.error) {
          switch (res.data.error) {
            case "username taken":
              this.setModal({
                header: "Error",
                body: <h4>That username is already taken</h4>
              });
              break;
            case "email taken":
              this.setModal({
                header: "Error",
                body: <h4>That email already exists in our database</h4>
              });
              break;
            case "did not validate":
              this.setModal({
                header: "Error",
                body: <h4>Please correct highlighted items</h4>
              });
              break;
          }
        }
        //  'errmsg' seems to be standard MongoDB terminology...
        else if (!res.data.errmsg) {

          console.log("Creating user:")
          console.log(res);
          // update App.js state
          this.props.updateUser({
            auth: true,
            state: {
              loggedIn: true,
              username: res.data.username,
              firstName: res.data.firstName
            }
          });
          // Once signed up, set this.state.redirect to true so the component will reload and trigger the if/else to redirect elsewhere
          this.props.setRedirect();
        } else {
          console.log('username already taken');
        }
      }).catch(error => {
        console.log('signup error: ');
        console.log(error);
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
            pattern="^[a-zA-Z0-9]+$"
            label="Create a Username:"
          />
          <Input
            value={this.state.password}
            onChange={this.handleInputChange}
            name="password"
            type="password"
            pattern="^[\S]{4,}$"
            label="Create a Password:"
          />
          <Input
            value={this.state.confirmPassword}
            onChange={this.handleInputChange}
            name="confirmPassword"
            type="password"
            pattern={this.state.password}
            label="Confirm your password:"
          />
          <Input
            value={this.state.firstName}
            onChange={this.handleInputChange}
            name="firstName"
            type="text"
            pattern="^[a-zA-Z]+$"
            label="First Name:"
          />
          <Input
            value={this.state.lastName}
            onChange={this.handleInputChange}
            name="lastName"
            type="text"
            pattern="^[a-zA-Z0-9]+$"
            label="Last Name:"
          />
          <Input
            value={this.state.email}
            onChange={this.handleInputChange}
            name="email"
            type="email"
            pattern="^[a-zA-Z0-9.!#$%&amp;'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
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
            value={this.state.state.toUpperCase()}
            onChange={this.handleInputChange}
            name="state"
            type="text"
            maxLength="2"
            pattern="^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$"
            label="State:"
          />
          <Input
            value={this.state.zipcode}
            onChange={this.handleInputChange}
            name="zipcode"
            pattern="^\d{5}(-\d{4})?$"
            label="Zip Code:"
            placeholder="xxxxx or xxxxx-xxxx"
          />
          <Input
            value={this.state.phone}
            onChange={this.handleInputChange}
            name="phone"
            type="tel"
            pattern="^\d{3}[\-]\d{3}[\-]\d{4}"
            label="Phone Number:"
            placeholder="e.g. xxx-xxx-xxxx"
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
      </Fragment>
    )
  }

}