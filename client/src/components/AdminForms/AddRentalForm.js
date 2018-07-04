import React, { Component, Fragment } from "react";
import { Input, FormBtn, Select, Option } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";
import './AdminForms.css';

export class AddRentalForm extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    name: "",
    category: "",
    maker: "",
    sku: "",
    dailyRate: "",
    dateAcquired: "",
    condition: ""
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
    const { name, category, maker, sku, dailyRate, timesRented, dateAcquired, condition } = this.state;

    const rentalObject = {
      name: name,
      category: category,
      maker: maker,
      sku: sku,
      dailyRate: dailyRate,
      reservations: [],
      pastRentals: [],
      timesRented: timesRented,
      dateAcquired: dateAcquired,
      condition: condition,
      images: []
    }

    API.adminAddNewRental(rentalObject)
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
        />
        <form>
          <Input
            value={this.state.name}
            onChange={this.handleInputChange}
            name="name"
            type="text"
            label="Item Name:"
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
            value={this.state.dailyRate}
            onChange={this.handleInputChange}
            name="dailyRate"
            type="text"
            label="Daily Rate:"
          />
          <Input
            value={this.state.timesRented}
            onChange={this.handleInputChange}
            name="timesRented"
            type="text"
            label="# Times Rented:"
          />
          <Input
            value={this.state.dateAcquired}
            onChange={this.handleInputChange}
            name="dateAcquired"
            type="text"
            label="Date Acquired:"
          />
          <Select
            value={this.state.condition}
            onChange={this.handleInputChange}
            name="condition"
            className="form-select"
            label="Condition:"
          >
            <Option></Option>
            <Option>New</Option>
            <Option>Good</Option>
            <Option>Working</Option>
            <Option>Disrepair</Option>
          </Select>
          <FormBtn
            disabled={
              !this.state.name ||
              !this.state.maker ||
              !this.state.sku ||
              !this.state.dailyRate ||
              !this.state.timesRented ||
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