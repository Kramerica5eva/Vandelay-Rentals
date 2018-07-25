import React, { Component, Fragment } from "react";
import { Input, FormBtn, Label } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";

export class AddUserForm extends Component {
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
    phone: "",
    admin: false
  }

  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: false,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = event.target;
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
      phone: this.state.phone,
      admin: this.state.admin
    })
      .then(res => {
        console.log(res);
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
                body: <h4>Something went wrong - please try again</h4>
              });
          }
        }
        //  'errmsg' seems to be standard MongoDB terminology...
        else if (!res.data.errmsg) {
          console.log("Creating user:")
          console.log(res);
          this.setModal({
            body: <h4>New User has been added to the  database.</h4>,
            buttons: <button onClick={this.closeModal}>OK</button>
          })
          this.setState({
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
            phone: "",
            admin: false
          })
        };
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
          closeModal={this.closeModal}
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
            placeholder="e.g. 'UT' or 'CA'"
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
          <Fragment>
            <Input
              checked={this.state.admin}
              onChange={this.handleInputChange}
              name="admin"
              label="Admin:"
              type="checkbox"
              style={{ display: "inline-block", width: "20px" }}
              barclass="no-bar"
            />
          </Fragment>
          <FormBtn
            disabled={(
              (
                !this.state.username ||
                !/^[a-zA-Z0-9]+$/.test(this.state.username)
              ) || (
                !this.state.password ||
                !/^[\S]{4,}$/.test(this.state.password)
              ) || (
                !this.state.firstName ||
                !/^[a-zA-Z]+$/.test(this.state.firstName)
              ) || (
                !this.state.lastName ||
                !/^[a-zA-Z]+$/.test(this.state.lastName)
              ) || (
                !this.state.email ||
                !/^[a-zA-Z0-9.!#$%&amp;'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email)
              ) || (
                !this.state.street
              ) || (
                !this.state.city
              ) || (
                !this.state.state ||
                !/^(?:A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|PA|RI|S[CD]|T[NX]|UT|V[AT]|W[AIVY])*$/.test(this.state.state)
              ) || (
                !this.state.zipcode ||
                !/^\d{5}(-\d{4})?$/.test(this.state.zipcode)
              ) || (
                !this.state.phone ||
                !/^\d{3}[\-]\d{3}[\-]\d{4}/.test(this.state.phone)
              )
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