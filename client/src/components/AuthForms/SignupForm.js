import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";

export class SignupForm extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
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
        body: modalInput.body,
        buttons: modalInput.buttons
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
        if (res.data.error) {
          switch (res.data.error) {
            case "username taken":
              this.setModal({
                body: <h4>That username is already taken</h4>
              });
              break;
            case "email taken":
              this.setModal({
                body: <h4>That email already exists in our database</h4>
              });
              break;
            default:
              this.setModal({
                body: <h4>Please correct highlighted items</h4>
              });
          }
        }
        //  'errmsg' seems to be standard MongoDB terminology...
        else if (!res.data.errmsg) {

          //  If signup was successful, log the user in and setRedirect, which will send them either back where they came from, or to where they were going (the 'to' part of this is currently irrelevant, but may again be relevant if there are any links to protected routes that show to non-logged in users - such as cart functionality that requires a login before checkout)
          API.login({
            username: this.state.username.toLowerCase(),
            password: this.state.password
          }).then(response => {
            // update App.js state
            this.props.updateUser({
              auth: true,
              admin: res.data.admin,
              state: {
                loggedIn: true,
                username: res.data.username,
                firstName: res.data.firstName,
                admin: res.data.admin,
                dev: res.data.dev
              }
            });
            // Once logged in, set call this.props.redirect to setState on the login page so the component will reload and trigger the if/else to redirect elsewhere
            this.props.setRedirect();

          })
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
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
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