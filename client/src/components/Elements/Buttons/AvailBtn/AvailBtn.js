import React from "react";
import "./AvailBtn.css"

const AvailBtn = props => (
  <div className={"buttonblock"}>
    <button className="btn-avail" onClick={props.name === props.unavailableName ? () => props.clear() : () => props.click()} />
    <span className={"mobiletext"}>Check availability</span>
    <span className={"tooltiptext"}>Check availability</span>
  </div>
)

export default AvailBtn;