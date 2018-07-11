import React, { Component } from "react";
import "./SaleCard.css"

class SaleCard extends Component {

  render() {
    return (
      <div id="saleCard" className="saleCard">
        <div className="salecard-display-img-container">
          <img src={this.props.displayImageUrl} alt="" className="salecard-display-image"/>
        </div>
        <div className="rentalcard-content-container">
          <li key={this.props.id}>
            <h3>{this.props.name}</h3>
            <h4>{this.props.category}</h4>
            <h5>Maker: {this.props.maker}</h5>
            <h5>Condition: {this.props.saleType}</h5>
            <p>Price: ${this.props.price}</p>
          </li>
        </div>
      </div>
    )
  }
}

export default SaleCard;