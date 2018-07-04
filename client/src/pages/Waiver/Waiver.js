import React, { Component, Fragment } from "react";
import HelloSign from 'hellosign-embedded';
// import HelloSign from 'hellosign-sdk';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from "../../utils/API";
// import Modal from "../../components/Modal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import { Input, Label, FormBtn } from "../../components/Elements/Form";
import DevLinks from "../../components/DevLinks";
import RentalCard from "../../components/Cards/RentalCard";
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
    userEmail:"test@email.com",
    userName:"John Smith"
  };

  componentDidMount() {
    // this.loadConfig();
    this.init();
  }

  // toggleModal = () => {
  //   this.setState({
  //     isOpen: !this.state.isOpen
  //   });
  // }

  // setModal = (modalInput) => {
  //   this.setState({
  //     isOpen: !this.state.isOpen,
  //     header: modalInput.header,
  //     body: modalInput.body,
  //     footer: modalInput.footer
  //   });
  // }


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
      document.querySelector("#thisIsATest").setAttribute('disabled', true);

      // Save the config and create the signature request.
      // this.saveConfig();
      this.createRequest();
    });
  }

  createRequest = () => {
    API.createSignatureRequest()
       .then((response) => {
        console.log("REESPONSE1 AFTER AXIOS:");
        console.log(response);
        if (response.data.success) {
          // this.openRequest(response.data);
          this.openRequest(response.data.data.signUrl);
        }
        // return response.json(); // rtns typeError response.json() is not a func,
        // })
      //   .then((response) => {
      //   // commented out lines starting ate 82---- are following the hellosign-embeded npm pkg demo app instructions
      // // if (response.status === 200) {
      // if (response.success) {
      //   // this.openRequest(response.data);
      //   this.openRequest(response.data.signUrl);
      // }
      else {
        alert(
          'Something went wrong. Did you enter your ' +
          'API Key and Client ID correctly?'
        );
      }

      // Re-enable submit button.
      document.querySelector("#thisIsATest").removeAttribute('disabled');
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
        // console.log("EVNT====="+evt);
      }
    };

    console.log(signUrl);
    HelloSign.open(options);
    // HelloSign.open({
    // url: signUrl,
    // uxVersion: 2,
    // allowCancel: true,
    // messageListener: function(eventData) {
    //   console.log(111111111);

    // }
// });

    // Set the redirect URL, if defined by the user.
    // if (redirectUrlElement.value.length) {
      // options.redirectUrl = redirectUrlElement.value;
    // }
    // console.log(options);

    // HelloSign.open(options);
  }

  //  saveConfig = () => {
  //   try {
  //     window.localStorage.setItem('config', (
  //       JSON.stringify({
  //         // apiKey: apiKeyElement.value,
  //         // clientId: clientIdElement.value,
  //         // redirectUrl: redirectUrlElement.value
  //       })
  //     ));
  //   } catch (err) {
  //     // User may have private browsing enabled.
  //     // Fail silently.
  //   }
  // }

  //  loadConfig = () => {
  //   try {
  //     const config = window.localStorage.getItem('config');

  //     if (config) {
  //       const { apiKey, clientId, redirectUrl } = JSON.parse(config);

  //       // apiKeyElement.value = apiKey;
  //       // clientIdElement.value = clientId;
  //       // redirectUrlElement.value = redirectUrl;
  //     }
  //   } catch (err) {
  //     // User may have private browsing enabled.
  //     // Fail silently.
  //   }
  // }

  render() {
    return (
      <Fragment>
        {/* <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        /> */}
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
              logout={this.props.logout}
              location={this.props.location}
            />

            <form action="" id="formTest">
              <button type="submit" id="thisIsATest" >test Waiver btn</button>
            </form>

          </div>
          <Footer />
        </div>
        <script type="text/javascript" src="https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js"></script>
      </Fragment>
    );
  }
}

export default Waiver;
