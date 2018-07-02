import React from "react";
import "./GreyBtn.css"


class GreyBtn extends React.Component {

    render() {
        return (
            <button className="btn-grey" onClick={this.props.logout}>{this.props.children}</button>
        );
    }
}


export default GreyBtn;