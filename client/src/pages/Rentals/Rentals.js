import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import { FormBtn } from "../../components/Elements/Form";
import Header from "../../components/Elements/Header";
import Modal from "../../components/Elements/Modal";
import ParallaxHero from "../../components/ParallaxHero";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import RentalCard from "./../../components/Cards/RentalCard";
import DevLinks from "../../components/DevLinks";
import API from "../../utils/API";
import Calendar from "../../components/Calendar";
import dateFns from "date-fns";
import "./Rentals.css";
// import "./../../App.css";


class Rentals extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: "",
      buttons: ""
    },
    rentals: [],
    unix: [],
    unavailable: [],
    name: "",
    loadingModalOpen: false,
  };

  componentDidMount() {
    this.getAllRentals();
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
        footer: modalInput.footer,
        buttons: modalInput.buttons
      }
    });
  };

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  };

  getAllRentals = () => {
    API.getAllRentals()
      .then(res => {
        this.setState({
          rentals: res.data
        });
      })
      .catch(err => console.log(err));
  }

  onChange = date => {
    this.getDays(date);
  }

  getDays = date => { //date is the array that is passed from the calendar when days are selected.
    let temp = [];
    let range = [];
    date.map(dates => temp.push(Date.parse(dates) / 1000)); //stores first and last day in temporary array
    let days = Math.floor((temp[1] - temp[0]) / 86400); //seconds in day = 86400  Calculates total number of days for rental.
    range.push(temp[0]); //store first day in range array.
    for (let i = 0; i < days; i++) { //adds each day (including last) to range array
      range.push(range[i] + 86400);
    }
    this.setState({ unix: range, date: date }); //sets state
  }

  checkAvailability = itemRes => { //passed all the reservations for a given item
    for (let i = 0; i < itemRes.length; i++) { //iterate through all individual reservations to compare to selected dates one at a time
      let range = []; //holds each individual day of a reservation
      let days = (itemRes[i].date.to - itemRes[i].date.from) / 86400; //determines total number of days for each reservation
      range.push(itemRes[i].date.from); //pushes the first day of the reservation
      for (let j = 0; j < days; j++) {//
        range.push(range[j] + 86400); //adds all days of a reservation to range for comparison
      };                              //
      for (let k = 0; k < this.state.unix.length; k++) { //compares each index in this.state.unix to each index in range
        if (range.includes(this.state.unix[k])) { //
          return false;                           //returns false if range include the index value of this.state.unix
        }                                         //
      }
    }
    return true; //returns true if no matches are found
  }

  markUnavailable = (itemRes, name) => {
    let unavailable = [];
    for (let i = 0; i < itemRes.length; i++) { //iterate through all individual reservations to compare to selected dates one at a time
      let temp = [];
      let days = (itemRes[i].date.to - itemRes[i].date.from) / 86400; //determines total number of days for each reservation
      temp.push(itemRes[i].date.from); //pushes the first day of the reservation
      for (let j = 0; j < days; j++) {//
        temp.push(temp[j] + 86400); //adds all days of a reservation to range for comparison
      };                              //
      for (let k = 0; k < temp.length; k++) {
        unavailable.push(temp[k]);
      }
    }
    this.setState({ unavailable: unavailable, name: name });
  }

  clearUnavailable = () => {
    this.setState({ unavailable: [], name: "" })
  }

  addReservationToCart = rental => {
    // Trigger the loading modal:
    this.toggleLoadingModal();
    //  Initialize date variables:
    let from;
    let to;
    //  Set date variables:
    if (this.state.unix.length > 1) {
      from = this.state.unix[0];
      to = this.state.unix[this.state.unix.length - 1];
    } else {
      from = this.state.unix[0];
      to = this.state.unix[0];
    }
    // Call the API function:
    API.addReservationToCart(from, to, rental)
      .then(response => {
        console.log(response);
        // this function searches the database for existing cart items that conflict with the chosen dates
        // if it finds such an item, it will return a message: "duplicate"
        if (response.data.message === "duplicate") {
          // close the loading modal:
          this.toggleLoadingModal();

          if (response.data.existingRes.length > 1) {
            this.setModal({
              body:
                <Fragment>
                  <h4>The dates you have chosen conflict with multiple reservations already in your cart. Please check your cart before proceeding.</h4>
                </Fragment>
            })
          } else {
            // assign existing cart item to a variable:
            const existingRes = response.data.existingRes[0];
            const changedFrom = existingRes.date.from;
            const changedTo = existingRes.date.to;
            console.log(`From: ${from}, To: ${to}`);
            console.log(`From: ${changedFrom}, To: ${changedTo}`);
            if (changedFrom === from && changedTo === to) {
              this.setModal({
                body:
                  <Fragment>
                    <h4>This item is already in your cart for the same date(s):</h4>
                    {from !== to ?
                      <div>
                        <h6>from: {dateFns.format(existingRes.date.from * 1000, "ddd, MMMM Do YYYY")}</h6>
                        <h6>to: {dateFns.format(existingRes.date.to * 1000, "ddd, MMMM Do YYYY")}</h6>
                      </div>
                      : <h6>{dateFns.format(existingRes.date.from * 1000, "ddd, MMMM Do YYYY")}</h6>
                    }
                  </Fragment>
              });
            } else {
              //  Add existing reservation dates to the rental object so they can be passed to the changeReservationInCart function if the user chooses to change dates:
              rental.oldFrom = existingRes.date.from;
              rental.oldTo = existingRes.date.to;
              //  Set modal to get user input:
              this.setModal({
                body:
                  <Fragment>
                    {changedFrom !== changedTo ?
                      <div>
                        <h4>This item is already in your cart for similar dates:</h4>
                        <h6>from: {dateFns.format(existingRes.date.from * 1000, "ddd, MMMM Do YYYY")}</h6>
                        <h6>to: {dateFns.format(existingRes.date.to * 1000, "ddd, MMMM Do YYYY")}</h6>
                      </div>
                      :
                      <div>
                        <h4>This item is already in your cart for one of your chosen dates:</h4>
                        <h6>{dateFns.format(existingRes.date.from * 1000, "ddd, MMMM Do YYYY")}</h6>
                      </div>
                    }
                    <h4>Would you like to keep the existing date(s) or change to your new selection?</h4>
                  </Fragment>,
                buttons:
                  <Fragment>
                    <button onClick={this.toggleModal}>Keep</button>
                    <button onClick={() => this.changeReservationInCart(from, to, rental)}>Change</button>
                  </Fragment>
              });
            }
          }
        } else {
          //  If the chosen rental parameters (item + dates) don't exist in the db,
          //  the reservation is added to the cart, and the loading modal closes.
          setTimeout(this.toggleLoadingModal, 500);
          console.log(rental)
          setTimeout(this.setModal, 500, {
            body: <h4>{rental.name} has been added to your cart.</h4>
          });
        }
      });
  }

  changeReservationInCart = (from, to, rental) => {
    this.toggleModal();
    this.toggleLoadingModal();
    API.changeReservationInCart(from, to, rental)
      .then(response => {
        setTimeout(this.toggleLoadingModal, 500);
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
          buttons={this.state.modal.buttons}
        />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1471074454408-f7db62d99254?ixlib=rb-0.3.5&s=510c5a89003b801af4a67b96353f118b&auto=format&fit=crop&w=1267&q=80)', backgroundPosition: "bottom" }}
            title=""
            pageClass={"rentalPage"}
          />
          <div className="calendar-container">
            <h1 className="calendar-head-title">Rentals</h1>
            <Calendar
              updateUnix={this.getDays}
              unavailable={this.state.unavailable}
              unavailableName={this.state.name}
              clearUnavailable={this.clearUnavailable}
            />
          </div>

          <div className='body-container rentals'>
            <Header>
              <DevLinks
                loggedIn={this.props.loggedIn}
                admin={this.props.admin}
                dev={this.props.dev}
                logout={this.props.logout}
                location={this.props.location}
              />
            </Header>

            <h2>Rentals Available:</h2>
            <div className='rental-card-container'>
              {this.state.rentals.map(rental => (
                <RentalCard
                  addReservationToCart={this.addReservationToCart}
                  category={rental.category}
                  clear={this.clearUnavailable}
                  displayImageUrl={rental.displayImageUrl}
                  id={rental._id}
                  key={rental._id}
                  maker={rental.maker}
                  markUnavailable={this.markUnavailable}
                  name={rental.name}
                  rate={parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}
                  rental={rental}
                  reservations={rental.reservations}
                  setAvailability={this.checkAvailability(rental.reservations)}
                  unix={this.state.unix}
                />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </Fragment >
    );
  }
}

export default Rentals;
