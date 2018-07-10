import React from "react";
import "./ReserveBtn.css"


class ReserveBtn extends React.Component {

  render() {
    return (
      <div className="btn-reserve" role="button" onClick={() => this.props.addReservationToCart(this.props.rental)} style={{ background: 'url(./static/assets/images/reserve.png) no-repeat center center' }} />
    );
  }
}


export default ReserveBtn;