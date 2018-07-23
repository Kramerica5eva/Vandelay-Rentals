import React, { Component } from "react";
import "./ImageModal.css";
import onClickOutside from "react-onclickoutside";

class ImageModalContent extends Component {

  handleClickOutside = () => {
    this.props.toggleImageModal();
  }

  render() {
    return (
      <div className="image-modal-content">
        <div className="image-modal-header">
          <span className="image-modal-close" onClick={this.props.toggleImageModal}>&times;</span>
        </div>
        <div className="image-modal-body">
          {this.props.body}
        </div>
        <div className="image-modal-footer"></div>
      </div>
    )
  }

}

export default onClickOutside(ImageModalContent);