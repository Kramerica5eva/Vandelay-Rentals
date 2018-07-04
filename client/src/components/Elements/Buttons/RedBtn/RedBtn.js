import React from "react";
import "./RedBtn.css"


class RedBtn extends React.Component {

    render() {
        return (
            <button className="btn-red" onClick={this.props.logout}>{this.props.children}</button>
        );
    }
}


export default RedBtn;