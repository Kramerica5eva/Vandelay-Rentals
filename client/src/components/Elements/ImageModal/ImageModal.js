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
          body={this.props.body}
          buttons={this.props.buttons}
          toggleImageModal={this.props.toggleImageModal}
        />
      </div>
    )
  }

}

export default ImageModal;