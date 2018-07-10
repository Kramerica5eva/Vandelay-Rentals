import React, { Component } from "react";
import "./RentalCard.css";
import ReserveBtn from "../../Elements/Buttons/ReserveBtn/ReserveBtn.js";
import AvailBtn from "../../Elements/Buttons/AvailBtn/AvailBtn.js";

class RentalCard extends Component {


  render() {
    return (
      <div id={this.props.id} className="rentalCard">
        <h3>{this.props.name}</h3>
        <h4>{this.props.category}</h4>
        <h5>Maker: {this.props.maker}</h5>
        <p>Daily rate: ${this.props.rate}</p>
        {this.props.unix.length === 0 ? null
          : this.props.setAvailability
            ? <ReserveBtn
              rental={this.props.rental}
              addReservationToCart={this.props.addReservationToCart}
              image={{ backgroundImage: 'url(./../static/assets/images/reserve.png)' }}
            />
            : <AvailBtn
              onClick={this.props.markUnavailable.bind(this, this.props.reservations)}
            />}
      </div>
    )
  }
}

export default RentalCard;