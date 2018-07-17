import React from "react";
import "./RentalCard.css";
import ReserveBtn from "../../Elements/Buttons/ReserveBtn/ReserveBtn.js";
import AvailBtn from "../../Elements/Buttons/AvailBtn/AvailBtn.js";

const RentalCard = props => (
  <div id={props.id} className="rentalCard">
    <div className="rentalcard-display-img-container">
      <img src={props.displayImageUrl} alt="" className="rentalcard-display-image" />
    </div>
    <div className="rentalcard-content-container">
      <h3>{props.name}</h3>
      <h4>{props.category}</h4>
      <h5>Maker: {props.maker}</h5>
      <p>Daily rate: ${props.rate}</p>
      <div className={"buttons"}>
        <ReserveBtn
          rental={props.rental}
          addReservationToCart={props.addReservationToCart}
          availability={props.setAvailability}
          unix={props.unix}
        />
        <AvailBtn
          click={() => props.markUnavailable(props.reservations, props.name)}
          clear={props.clear}
          name={props.name}
          unavailableName={props.unavailableName}
        />
      </div>
    </div>
  </div>
)

export default RentalCard;