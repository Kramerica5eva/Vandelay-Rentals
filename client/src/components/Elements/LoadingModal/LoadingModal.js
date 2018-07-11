import React, { Component } from "react";
import "./LoadingModal.css";

class LoadingModal extends Component {

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="loading-modal">
        <div className="loading-modal-content">
          <img src="./../../../../loading2.gif" alt="spinning gears" />
        </div>
      </div>
    )
  }

}

export default LoadingModal;