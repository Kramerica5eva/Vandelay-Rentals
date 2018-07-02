import React, { Component } from "react";
import "./Modal.css";
import onClickOutside from "react-onclickoutside";

class ModalContent extends Component {

  handleClickOutside = () => {
    this.props.toggleModal();
  }

  render() {
    return (
      <div className="my-modal-content">
        <div className="my-modal-header">
          <span className="my-modal-close" onClick={this.props.toggleModal}>&times;</span>
          <h3>{this.props.header}</h3>
        </div>
        <div className="my-modal-body">
          {this.props.body}
        </div>
        <div className="my-modal-footer">
          <h3>{this.props.footer}</h3>
        </div>
      </div>
    )
  }

}

export default onClickOutside(ModalContent);