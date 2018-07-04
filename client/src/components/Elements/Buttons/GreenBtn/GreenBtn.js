import React from "react";
import "./GreenBtn.css"


class GreenBtn extends React.Component {

    render() {
        return (
            <button className="btn-green" onClick={this.props.logout}>{this.props.children}</button>
        );
    }
}


export default GreenBtn;