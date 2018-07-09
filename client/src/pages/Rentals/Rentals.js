import React, { Component, Fragment } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Elements/Header";
import ParallaxHero from "../../components/ParallaxHero";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import RentalCard from "./../../components/Cards/RentalCard";
import DevLinks from "../../components/DevLinks";
import API from "../../utils/API";
import Calendar from "../../components/Calendar";
import "./Rentals.css";
import "./../../App.css";


class Rentals extends Component {
  state = {
    rentals: [],
    unix: [],
    unavailable: []
  };

  componentDidMount() {
    this.getAllRentals();
  }

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

  markUnavailable = itemRes => {
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
    this.setState({ unavailable: unavailable });
  }

  clearUnavailable = () => {
    this.setState({ unavailable: [] })
  }

  addReservationToCart = rental => {
    let from;
    let to;

    if (this.state.unix.length > 1) {
      from = this.state.unix[0];
      to = this.state.unix[this.state.unix.length - 1];
    } else {
      from = this.state.unix[0];
      to = this.state.unix[0];
    }

    API.addReservationToCart(from, to, rental)
      .then(response => console.log(response));
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
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1471074454408-f7db62d99254?ixlib=rb-0.3.5&s=510c5a89003b801af4a67b96353f118b&auto=format&fit=crop&w=1267&q=80)' }}
            title="RENT"
          />
          <Header>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
          </Header>
          <Calendar
            updateUnix={this.getDays}
            unavailable={this.state.unavailable}
            clearUnavailable={this.clearUnavailable}
          />
          <h2>Rentals Available:</h2>
          <div className='rentals'>
            {this.state.rentals.map(rental => (
              <RentalCard
                unix={this.state.unix}
                key={rental._id}
                id={rental._id}
                name={rental.name}
                category={rental.category}
                maker={rental.maker}
                rental={rental}
                reservations={rental.reservations}
                addReservationToCart={this.addReservationToCart}
                setAvailability={this.checkAvailability(rental.reservations)}
                rate={parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}
                markUnavailable={this.markUnavailable}
              />
            ))}
          </div>
          <Footer />
        </div>
      </Fragment >
    );
  }
}

export default Rentals;
