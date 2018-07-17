import React from "react";
import "./SaleCard.css"

const SaleCard = props => (
  <div id="saleCard" className="saleCard">
    <div className="salecard-display-img-container">
      <img src={props.displayImageUrl} alt="" className="salecard-display-image" />
    </div>
    <div className="rentalcard-content-container">
      <li key={props.id}>
        <h3>{props.name}</h3>
        <h4>{props.category}</h4>
        <h5>Maker: {props.maker}</h5>
        <h5>Condition: {props.saleType}</h5>
        <p>Price: ${props.price}</p>
      </li>
    </div>
  </div>
)

export default SaleCard;