import React, { Component } from "react";
import ModalContent from "./ModalContent";
import "./Modal.css";

class Modal extends Component {

  render() {
    if(!this.props.show) {
      return null;
    }
    return (
      <div id="my-modal" className="my-modal">
        <ModalContent
          body={this.props.body}
          buttons={this.props.buttons}
          closeModal={this.props.closeModal}
        />
      </div>
    )
  }

}

export default Modal;