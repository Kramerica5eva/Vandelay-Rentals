import React from "react";
import "./AvailBtn.css"

class AvailBtn extends React.Component {

  state = {
    flag: false
  }

  show = () => {
    this.props.click();
    // this.setState({
    //   flag: true
    // });
  }

  hide = () => {
    this.props.clear();
    // this.setState({
    //   flag: false
    // });
  }

  render() {
    return (
      <div className={"buttonblock"}>
        <button className="btn-avail" onClick={this.props.view() ? this.hide : this.show} />
        <span className={"mobiletext"}>Check availability</span>
        <span className={"tooltiptext"}>Check availability</span>
      </div>
    );
  }
}

export default AvailBtn;