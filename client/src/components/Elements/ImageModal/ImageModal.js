import React, { Component } from "react";
import ImageModalContent from "./ImageModalContent";
import "./ImageModal.css";

class ImageModal extends Component {

  render() {
    if(!this.props.show) {
      return null;
    }
    return (
      <div id="image-modal" className="image-modal">
        <ImageModalContent
          header={this.props.header}
          body={this.props.body}
          footer={this.props.footer}
          buttons={this.state.modal.buttons}
          toggleImageModal={this.props.toggleImageModal}
        />
      </div>
    )
  }

}

export default ImageModal;