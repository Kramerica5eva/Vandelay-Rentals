import React from "react";
import "./AvailBtn.css"

class AvailBtn extends React.Component {

  state = {
    flag: false
  }

  show = () => {
    this.props.click();
    this.setState({
      flag: true
    });
  }

  hide = () => {
    this.props.clear();
    this.setState({
      flag: false
    });
  }

  render() {
    return (
      <div className={"buttonblock"}>
        <button className="btn-avail" onClick={!this.state.flag ? this.show : this.hide} />
        <span className={"mobiletext"}>Check availability</span>
        <span className={"tooltiptext"}>Check availability</span>
      </div>
    );
  }
}


export default AvailBtn;