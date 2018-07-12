import React, { Component, Fragment } from "react";
import { Input, FormBtn, Select, Option } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";

export class AddSaleItemForm extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: "",
      buttons: ""
    },
    name: "",
    price: "",
    abstract: "",
    detail: "",
    topics: "",
    level: "",
    date: "",
    slots: ""
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
        footer: modalInput.footer,
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
    const { name, category, maker, sku, cost, price, dateAcquired, saleType, condition, status, finalSale } = this.state;

    const saleItemObject = {
      name: name,
      category: category,
      maker: maker,
      sku, sku,
      cost: cost,
      price: price,
      dateAcquired: dateAcquired,
      saleType: saleType,
      condition: condition,
      images: [],
      status: status,
      finalSale: finalSale
    }

    API.adminAddSaleItem(saleItemObject)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
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
          buttons={this.state.modal.buttons}
        />
        <form>
          <Input
            value={this.state.name}
            onChange={this.handleInputChange}
            name="name"
            type="text"
            label="Sale Item Name:"
          />
          <Select
            value={this.state.category}
            onChange={this.handleInputChange}
            name="category"
            className="form-select"
            label="Category:"
          >
            <Option></Option>
            <Option>Paddleboard</Option>
            <Option>Kayak</Option>
          </Select>
          <Input
            value={this.state.maker}
            onChange={this.handleInputChange}
            name="maker"
            type="text"
            label="Manufacturer:"
          />
          <Input
            value={this.state.sku}
            onChange={this.handleInputChange}
            name="sku"
            type="text"
            label="SKU:"
          />
          <Input
            value={this.state.cost}
            onChange={this.handleInputChange}
            name="cost"
            type="text"
            label="Our Cost:"
          />
          <Input
            value={this.state.price}
            onChange={this.handleInputChange}
            name="price"
            type="text"
            label="Asking Price:"
          />
          <Input
            value={this.state.dateAcquired}
            onChange={this.handleInputChange}
            name="dateAcquired"
            type="text"
            label="Date Acquired:"
          />
          <Select
            value={this.state.saleType}
            onChange={this.handleInputChange}
            name="saleType"
            className="form-select"
            label="Type of Sale:"
          >
            <Option></Option>
            <Option>New</Option>
            <Option>Used</Option>
          </Select>
          <Select
            value={this.state.condition}
            onChange={this.handleInputChange}
            name="condition"
            className="form-select"
            label="Condition:"
          >
            <Option></Option>
            <Option>New</Option>
            <Option>Excellent</Option>
            <Option>Good</Option>
            <Option>Fair</Option>
            <Option>Poor</Option>
          </Select>
          <Select
            value={this.state.status}
            onChange={this.handleInputChange}
            name="status"
            className="form-select"
            label="Status:"
          >
            <Option></Option>
            <Option>Available</Option>
            <Option>Sold</Option>
          </Select>
          <Input
            value={this.state.finalSale}
            onChange={this.handleInputChange}
            name="finalSale"
            type="text"
            label="Actual Sale Price:"
          />
          <FormBtn
            disabled={
              !this.state.name ||
              !this.state.maker ||
              !this.state.sku ||
              !this.state.cost ||
              !this.state.price ||
              !this.state.dateAcquired
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