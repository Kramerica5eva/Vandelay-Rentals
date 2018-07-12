import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import DevLinks from "../../components/DevLinks";
import "./ShoppingCart.css";
import dateFns from "date-fns"

class ShoppingCart extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    loadingModalOpen: false,
    tempRegistrations: [],
    tempReservations: []
  }

  componentWillMount() {
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
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
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
    this.toggleLoadingModal();
    API.removeRegistrationFromCart(id)
      .then(res => {
        console.log(res)
        this.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  confirmRegistration = course => {
    this.toggleLoadingModal();
    const { _id } = course;
    API.reserveCourse(_id, course)
      .then(res => {
        console.log(res)
        this.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  removeReservationFromCart = id => {
    this.toggleLoadingModal();
    API.removeReservationFromCart(id)
      .then(res => {
        console.log(res)
        this.getUserShoppingCart();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  confirmReservation = rental => {
    this.toggleLoadingModal();

    // to and from will be adjusted later to match with the calendar
    const from = 1533168000;
    const to = 1537727200;

    API.reserveRental(rental)
      .then(response => {
        console.log(response);
        this.getUserShoppingCart();
        this.toggleLoadingModal();
      });
  }

  render() {
    // if left in still - take out this console log before production
    console.log(this.state.tempRegistrations);
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(./static/assets/images/long_pier.jpeg)' }}
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
                  <p>From: {dateFns.format(res.date.from * 1000, "ddd MMM Do YYYY")}</p>
                  <p>To: {dateFns.format(res.date.to * 1000, "ddd MMM Do YYYY")}</p>
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
          <Footer />

        </div>
      </Fragment>
    )
  }
}

export default ShoppingCart;