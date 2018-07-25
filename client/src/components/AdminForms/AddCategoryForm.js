import React, { Component, Fragment } from "react";
import { Input, FormBtn, Textarea } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";

export class AddCategoryForm extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    category: "",
    description: ""
  }

  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
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
    const { category, description } = this.state;

    const categoryObject = {
      category: category,
      description: description
    }

    API.adminAddNewCategory(categoryObject)
      .then(res => {
        console.log(res);
        this.props.setCategories();
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <form>
          <Input
            value={this.state.category}
            onChange={this.handleInputChange}
            name="category"
            type="text"
            label="Category:"
          />
          <Textarea
            value={this.state.description}
            onChange={this.handleInputChange}
            name="description"
            label="Description:"
          />
          <FormBtn
            disabled={
              !this.state.category ||
              !this.state.description
            }
            onClick={this.handleFormSubmit}
          >
            Submit
          </FormBtn>
        </form>

      </Fragment>
    )
  }
}