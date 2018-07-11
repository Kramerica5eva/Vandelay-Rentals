import React from "react";
import "./AvailBtn.css"


class AvailBtn extends React.Component {

    render() {
        return (
            <button className="btn-avail" onClick={this.props.click}><span className={"tooltiptext"}>Check availability</span></button>
        );
    }
}


export default AvailBtn;