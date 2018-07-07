import React, { Component, Fragment } from "react";
import HelloSign from 'hellosign-embedded';
import API from "../../utils/API";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import { Input, Label, FormBtn } from "../../components/Elements/Form";
import DevLinks from "../../components/DevLinks";
import "./Waiver.css";

class Waiver extends Component {
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
    fullName: ""
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
    API.createSignatureRequest(this.state.userEmail, this.state.userName)
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

    console.log(signUrl);
    HelloSign.open(options);

  }

  render() {
    return (
      <Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/uploads/1412701079442fffb7c1a/6b7a62a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63428fdde80191f1d2299d803dfe61c3&auto=format&fit=crop&w=1350&q=80)' }}
            title="Rental Agreement"
          />
          <div className='body-container'>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
            <div className="form-style">
              <form action="" id="formTest">
                <Input
                  value={this.state.fullName}
                  onChange={this.handleInputChange}
                  name="fullName"
                  type="text"
                  pattern="^[a-zA-Z0-9]"
                  label="Full Legal Name:"
                />
                <Input
                  value={this.state.userEmail}
                  onChange={this.handleInputChange}
                  name="email"
                  type="email"
                  label="Email:"
                />
                <button type="submit" id="waiverUpdateBtn" >Update Waiver</button>
              </form>
            </div>

          </div>
          <Footer />
        </div>
        <script type="text/javascript" src="https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js"></script>
      </Fragment>
    );
  }
}

export default Waiver;
