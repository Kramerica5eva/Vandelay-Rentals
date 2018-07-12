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
          header={this.props.header}
          body={this.props.body}
          footer={this.props.footer}
          buttons={this.props.buttons}
          toggleModal={this.props.toggleModal}
        />
      </div>
    )
  }

}

export default Modal;