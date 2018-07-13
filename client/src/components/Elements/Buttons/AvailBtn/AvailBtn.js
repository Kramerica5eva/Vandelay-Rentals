import React from "react";
import "./AvailBtn.css"

class AvailBtn extends React.Component {

  render() {
    return (
      <div className={"buttonblock"}>
        <button className="btn-avail" onClick={this.props.name === this.props.unavailableName ? () => this.props.clear() : () => this.props.click()} />
        <span className={"mobiletext"}>Check availability</span>
        <span className={"tooltiptext"}>Check availability</span>
      </div>
    );
  }
}

export default AvailBtn;