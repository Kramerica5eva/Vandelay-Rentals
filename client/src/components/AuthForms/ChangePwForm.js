import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Form";
import Modal from "../../components/Modal";
import API from "../../utils/API";

export class ChangePwForm extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    API.checkPassword(this.state.newPassword)
      .then(res => {
        console.log(res);
      })
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
        <form>
          <Input
            value={this.state.currentPassword}
            onChange={this.handleInputChange}
            name="currentPassword"
            type="text"
            label="Current Password:"
          />
          <Input
            value={this.state.newPassword}
            onChange={this.handleInputChange}
            name="newPassword"
            type="text"
            label="New Password:"
          />
          <Input
            value={this.state.confirmPassword}
            onChange={this.handleInputChange}
            name="confirmPassword"
            type="text"
            label="Confirm New Password:"
          />
          <FormBtn
            disabled={(
              !this.state.currentPassword ||
              !this.state.newPassword ||
              !this.state.confirmPassword
            ) || (this.state.newPassword !== this.state.confirmPassword)}
            onClick={this.handleFormSubmit}
          >
            Submit
        </FormBtn>
        </form>
      </Fragment>
    )
  }

}