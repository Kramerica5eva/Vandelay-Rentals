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
    tempRegistrations: null,
    tempReservations: null
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
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />

        {this.state.tempReservations ? (
          this.state.tempReservations.map(res => (
            <div key={res._id} className="cart-res-container">
              <h3>{res.itemName}</h3>
              <h4>Reservation Dates:</h4>
              <p>From: {res.date.from}</p>
              <p>To: {res.date.to}</p>
              <p>Daily Rate: ${parseFloat(res.dailyRate.$numberDecimal).toFixed(2)}</p>
              <h4>Total cost: ${parseFloat(((res.date.to - res.date.from) / 86400) * parseFloat(res.dailyRate.$numberDecimal)).toFixed(2)}</h4>
            </div>
          ))
        ) : null}

        {this.state.tempRegistrations ? (
          this.state.tempRegistrations.map(reg => (
            <div key={reg._id} className="cart-reg-container">
              <h3>{reg.courseName}</h3>
              <h4>Class Date: {reg.date}</h4>
              <h4>Price per person: ${parseFloat(reg.price.$numberDecimal).toFixed(2)}</h4>
            </div>
          ))
        ) : null}

      </Fragment>
    )
  }









}

export default ShoppingCart;