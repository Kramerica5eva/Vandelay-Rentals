import React, { Component } from "react";
import { Input } from "./../Form";
import API from "../../../utils/API";
import HelloSign from 'hellosign-embedded';
import "./HelloSignForm.css"

// Must add in script to bottom of page (before the last closing element) for HelloSign to work
// <script type="text/javascript" src="https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js"></script>

class HelloSignForm extends Component {

  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    rentals: [],
    images: [],
    rentalId: "",
    selectedFile: null,
    image: null,
    rent_from: "",
    rent_to: "",
    rental_id: "",
    unix: [],
    userEmail: "",
    userName: "John Smith",
    fullName: "",
    waiverEmail: ""
  };

  componentDidMount() {
    this.init();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  init = () => {
    // Stop the form from submitting
    document.querySelector("#formTest").addEventListener('submit', (evt) => {
      evt.preventDefault();

      // Disable the submit button temporarily.
      document.querySelector("#waiverUpdateBtn").setAttribute('disabled', true);

      // Save the config and create the signature request.
      this.createRequest();
    });
  }

  createRequest = () => {
    API.createSignatureRequest(this.state.waiverEmail, this.state.userName)
      .then((response) => {
        console.log("REESPONSE1 AFTER AXIOS:");
        console.log(response);
        if (response.data.success) {
          this.openRequest(response.data.data.signUrl);
        }
        else {
          alert(
            'Something went wrong. Did you enter your ' +
            'API Key and Client ID correctly?'
          );
        }

        // Re-enable submit button.
        document.querySelector("#waiverUpdateBtn").removeAttribute('disabled');
      });
  }

  openRequest = (signUrl) => {
    HelloSign.init("aaad4deadb45633d2cc5ebe07ed2eff2");

    const options = {
      clientId: "aaad4deadb45633d2cc5ebe07ed2eff2",
      url: signUrl,
      allowCancel: true,
      debug: true,
      skipDomainVerification: true,
      uxVersion: 2,
      messageListener(evt) {
      }

    };

    HelloSign.open(options);

  }

  render() {
      return (
          <div className="form-style">
            <form action="" id="formTest">
              <div className="waiver-input-container">
                <Input
                  value={this.state.fullName}
                  onChange={this.handleInputChange}
                  name="fullName"
                  type="text"
                  //pattern="^[a-zA-Z0-9]"
                  label="Full Legal Name:"
                />
                <Input
                  value={this.state.waiverEmail}
                  onChange={this.handleInputChange}
                  name="waiverEmail"
                  type="email"
                  label="Email:"
                />
              </div>
              <button type="submit" id="waiverUpdateBtn" >Update Waiver</button>
            </form>
          </div>
      );
  }
}


export default HelloSignForm;