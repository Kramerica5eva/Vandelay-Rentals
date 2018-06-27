import React, { Component } from "react";
import "./SaleCard.css"

class SaleCard extends Component {

  render() {
    return (
      <div id="saleCard" className="saleCard">
        <li key={this.props.key}>
          <h3>{this.props.name}</h3>
          <h4>{this.props.category}</h4>
          <h5>Maker: {this.props.maker}</h5>
          <h5>Condition: {this.props.saleType}</h5>
          <p>Price: ${this.props.price}</p>
        </li>
      </div>
    )
  }
}

export default SaleCard;