import React, { Component } from "react";
import "./Modal.css";
import onClickOutside from "react-onclickoutside";

class ModalContent extends Component {

  handleClickOutside = () => {
    this.props.closeModal();
  }

  render() {
    return (
      <div className="my-modal-content">
        <div className="my-modal-header">
          <span className="my-modal-close" onClick={this.props.closeModal}>&times;</span>
        </div>
        <div className="my-modal-body">
          {this.props.body}
          <div className="modal-btn-div">
            {this.props.buttons}
          </div>
        </div>
        <div className="my-modal-footer"></div>
      </div>
    )
  }

}

export default onClickOutside(ModalContent);