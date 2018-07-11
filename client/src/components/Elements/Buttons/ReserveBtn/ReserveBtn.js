import React from "react";
import "./ReserveBtn.css"


class ReserveBtn extends React.Component {

  render() {
    return (
      <div className={"buttonblock"}>
        <button className={`btn-reserve ${this.props.availability ? "btn-available" : "btn-unavailable"}`} onClick={this.props.availability ? () => this.props.addReservationToCart(this.props.rental) : null} />
        {this.props.availability ? <span className={"mobiletext"}>Reserve</span> : <span className={"mobiletextNA"}>Not available</span>}
        {this.props.availability ? <span className={"tooltiptext"}>Reserve</span> : <span className={"tooltiptextNA"}>Not available</span>}
      </div>
    );
  }
}


export default ReserveBtn;