import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import { Input, FormBtn } from "../../components/Elements/Form";
import DevLinks from "../../components/DevLinks";
import RentalCard from "../../components/Cards/RentalCard";
import "./ShoppingCart.css";
import Calendar from "react-calendar";

class ShoppingCart extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    tempRegistrations: [],
    tempReservations: []
  }

  componentDidMount() {
    // Functionality to retrieve items from tempReservations
    //  And also from tempRegistrations once that's in place
    this.getUserShoppingCart();
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


  getUserShoppingCart = () => {
    API.getUserShoppingCart()
      .then(cart => {
        console.log(cart);
        this.setState({
          tempRegistrations: cart.data.tempRegistrations,
          tempReservations: cart.data.tempReservations
        })
      })
  }

  removeRegistrationFromCart = id => {
    API.removeRegistrationFromCart(id)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  confirmRegistration = course => {
    const { _id } = course;
    API.reserveCourse(_id, course)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  removeReservationFromCart = id => {
    API.removeReservationFromCart(id)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  confirmReservation = rental => {
    console.log(rental);

    // to and from will be adjusted later to match with the calendar
    const from = 1533168000;
    const to = 1537727200;

    API.reserveRental(from, to, rental)
      .then(response => console.log(response));
  }



  render() {
    console.log(this.state.tempRegistrations);
    console.log(this.state.tempReservations);
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/uploads/1412701079442fffb7c1a/6b7a62a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63428fdde80191f1d2299d803dfe61c3&auto=format&fit=crop&w=1350&q=80)' }}
            title="Shopping Cart"
          />
          <div className='body-container'>
            <h2>Welcome{this.props.firstName ? `, ${this.props.firstName}` : ""}</h2>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />

            {this.state.tempRegistrations.length === 0 && this.state.tempReservations.length === 0 ?
              <h3>Your Shopping Cart is Empty</h3> : null}

            {this.state.tempReservations ? (
              this.state.tempReservations.map(res => (
                <div key={res._id} className="cart-res-container">
                  <h2>Rentals</h2>
                  <h3>{res.itemName}</h3>
                  <h4>Reservation Dates:</h4>
                  <p>From: {res.date.from}</p>
                  <p>To: {res.date.to}</p>
                  <p>Daily Rate: ${parseFloat(res.dailyRate.$numberDecimal).toFixed(2)}</p>
                  <h4>Total cost: ${parseFloat(((((res.date.to - res.date.from) / 86400) + 1) * parseFloat(res.dailyRate.$numberDecimal)).toFixed(2))}</h4>
                  <button onClick={() => this.confirmReservation(res)}>Confirm</button>
                  <button onClick={() => this.removeReservationFromCart(res._id)}>Cancel</button>
                </div>
              ))
            ) : null}

            {this.state.tempRegistrations ? (
              this.state.tempRegistrations.map(reg => (
                <div key={reg._id} className="cart-reg-container">
                  <h2>Classes</h2>
                  <h3>{reg.courseName}</h3>
                  <h4>Class Date: {reg.date}</h4>
                  <h4>Price per person: ${parseFloat(reg.price.$numberDecimal).toFixed(2)}</h4>
                  <button onClick={() => this.confirmRegistration(reg)}>Confirm</button>
                  <button onClick={() => this.removeRegistrationFromCart(reg._id)}>Cancel</button>
                </div>
              ))
            ) : null}
          </div>


          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499858476316-343e284f1f67?ixlib=rb-0.3.5&s=4985c13dbbf85d7d0f5b90df50ea8695&auto=format&fit=crop&w=1350&q=80)' }}
            title="About our Company"
          />

          <div className='body-container'>


            <button
              onClick={() => this.setModal({
                header: "Kramer's Modal",
                body:
                  <img src="https://pbs.twimg.com/profile_images/966923121482645507/qtpVrqVn_400x400.jpg" alt="Kramer" />,
                footer: "Kramer's Modal Footer"
              })}
            >
              Kramer!
              </button>

          </div>
          <Footer />


        </div>























      </Fragment>
    )
  }









}

export default ShoppingCart;