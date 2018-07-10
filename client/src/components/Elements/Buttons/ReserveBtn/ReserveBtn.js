import React from "react";
import "./ReserveBtn.css"


class ReserveBtn extends React.Component {

  render() {
    return (
      <button className="btn-reserve" onClick={() => this.props.addReservationToCart(this.props.rental)}>Add to Cart</button>
    );
  }
}


export default ReserveBtn;