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
          toggleModal={this.props.toggleModal}
          style={this.props.style}
          buttonStyle={this.props.buttonStyle}
        />
      </div>
    )
  }

}

export default Modal;