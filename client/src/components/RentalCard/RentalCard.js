import React, { Component } from "react";
import "./RentalCard.css";
let moment = require("moment");

class RentalCard extends Component {

  state = {
    // availability:
  };

  render() {
    return (
      <div id={this.props.id} className={this.props.setAvailability ? "rentalCard" : "unavailable rentalCard"}>
        {/* <li> */}
        <h3>{this.props.name}</h3>
        <h4>{this.props.category}</h4>
        <h5>Maker: {this.props.maker}</h5>
        <p>Daily rate: ${this.props.rate}</p>
        {/* ***Used for dev purposes*** */}
        <h5>Reserved:</h5>
        {this.props.reservations.map(reservation => (
          <p style={{ padding: 0 + 'px' }} key={Math.floor(Math.random() * 10000000)}>{moment.unix(reservation.from).format('dd MMM Do YY')} - {moment.unix(reservation.to).format('dd MMM Do YY')}</p>
        ))}
        <h2>{this.props.availability}</h2>
        {/* ***End*** */}
        {/* </li> */}
      </div>
    )
  }
}

export default RentalCard;