import React, { Component } from "react";
import "./RentalCard.css";
import ReserveBtn from "../../Elements/Buttons/ReserveBtn/ReserveBtn.js";
import AvailBtn from "../../Elements/Buttons/AvailBtn/AvailBtn.js";

class RentalCard extends Component {


  render() {
    return (
      <div id={this.props.id} className="rentalCard">
        <div className="rentalcard-display-img-container">
          <img src={this.props.displayImageUrl} alt="" className="rentalcard-display-image" />
        </div>
        <div className="rentalcard-content-container">
          <h3>{this.props.name}</h3>
          <h4>{this.props.category}</h4>
          <h5>Maker: {this.props.maker}</h5>
          <p>Daily rate: ${this.props.rate}</p>
          <div className={"buttons"}>
            <ReserveBtn
              rental={this.props.rental}
              addReservationToCart={this.props.addReservationToCart}
              availability={this.props.setAvailability}
            />
            <AvailBtn
              click={() => this.props.markUnavailable(this.props.reservations, this.props.name)}
              clear={() => this.props.clear}
              // name={this.props.name}
              view={() => this.props.view(this.props.name)}
            />
          </div>
        </div>

      </div>
    )
  }
}

export default RentalCard;