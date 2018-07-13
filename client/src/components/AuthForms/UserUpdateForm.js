import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Elements/Form";
import API from "../../utils/API";

export class UserUpdateForm extends Component {
  state = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    phone: ""
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    //request to server to change user info
    API.updateUserInfo({
      username: this.state.username,
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
          this.setModal({
            body: <h3>Info updated successfully.</h3>
          })
          this.props.getUserProfileData();
        }
      }).catch(error => {
        console.log('signup error: ');
        console.log(error);
      });
  };

  render() {
    return (
      <Fragment>
        <form>
          <h3>Edit Your Info</h3>
          <Input
            value={this.state.username}
            onChange={this.handleInputChange}
            name="username"
            type="text"
            pattern="^[a-zA-Z0-9]+$"
            label="Create a Username:"
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
              !this.state.firstName ||
              !this.state.lastName ||
              !this.state.email ||
              !this.state.street ||
              !this.state.city ||
              !this.state.state ||
              !this.state.zipcode ||
              !this.state.phone
            )}
            onClick={this.handleFormSubmit}
          >
            Submit
        </FormBtn>
        </form>
      </Fragment>
    )
  }

}