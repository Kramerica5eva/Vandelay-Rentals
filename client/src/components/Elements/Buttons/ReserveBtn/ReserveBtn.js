import React from "react";
import "./ReserveBtn.css"


class ReserveBtn extends React.Component {

  render() {
    return (
      <button className={`btn-reserve ${this.props.availability ? "available" : "unavailable"}`} onClick={this.props.availability ? () => this.props.addReservationToCart(this.props.rental) : null}><span className={"tooltiptext"}>Reserve</span></button>
    );
  }
}


export default ReserveBtn;