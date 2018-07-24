import React, { Component, Fragment } from "react";
import { Input, FormBtn, Label } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";
import dateFns from 'date-fns';

export class AddSaleItemForm extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    name: "",
    category: "",
    maker: "",
    sku: "",
    cost: "",
    price: "",
    dateAcquired: "",
    saleType: "",
    condition: "",
    status: ""
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
    const { name, category, maker, sku, cost, price, dateAcquired, saleType, condition, status } = this.state;

    //  The form will accept any text for a date, but if dateFns rejects it as invalid, it will return a modal with acceptable format examples - so a validation regex pattern for all possible acceptable date formats is unnecessary and would be extremely difficult to create
    const unixDate = dateFns.format(dateAcquired, "X");
    console.log(dateAcquired);
    
    //  length of 6 seems to be the shortest valid date
    //  (e.g. 1/1/18, Feb 4 16, or 9-5-13)
    if (dateAcquired.length < 6 || unixDate === "Invalid Date") {

      this.setModal({
        body:
          <Fragment>
            <h4>Please enter a valid date format</h4>
            <p>(e.g. '01/25/2016' or 'Dec 14 2012')</p>
          </Fragment>,
        buttons: <button onClick={this.toggleModal}>OK</button>
      })

    } else {

      const saleItemObject = {
        name: name,
        category: category,
        maker: maker,
        sku: sku,
        cost: cost,
        price: price,
        dateAcquired: unixDate,
        saleType: saleType,
        condition: condition,
        status: status
      }

      API.adminAddSaleItem(saleItemObject)
        .then(res => {
          console.log(res);
          if (res.data.message === "cost & price $ only") {
            this.setModal({
              body: <h4>You must enter a valid Cost and Asking Price.</h4>,
              buttons: <button onClick={this.toggleModal}>OK</button>
            })
          } else if (res.data.message === "cost $ only") {
            this.setModal({
              body: <h4>You must enter a valid Cost.</h4>,
              buttons: <button onClick={this.toggleModal}>OK</button>
            })
          } else if (res.data.message === "price $ only") {
            this.setModal({
              body: <h4>You must enter a valid Asking Price.</h4>,
              buttons: <button onClick={this.toggleModal}>OK</button>
            })
          } else {
            this.setModal({
              body: <h4>Your Sale Item has been added to the database.</h4>,
              buttons: <button onClick={this.toggleModal}>OK</button>
            });
            this.setState({
              name: "",
              category: "",
              maker: "",
              sku: "",
              cost: "",
              price: "",
              dateAcquired: "",
              saleType: "",
              condition: "",
              status: ""
            })
          }
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          body={this.state.modal.body}
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
          <div className="group group-select">
            <select
              value={this.state.category}
              onChange={this.handleInputChange}
              name="category"
            >
              <option></option>
              <option>Paddleboard</option>
              <option>Kayak</option>
            </select>
            <Label htmlFor="category">Category:</Label>
          </div>
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
            pattern="^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$"
            type="text"
            label="Our Cost:"
          />
          <Input
            value={this.state.price}
            onChange={this.handleInputChange}
            name="price"
            pattern="^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$"
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
          <div className="group group-select">
            <select
              value={this.state.saleType}
              onChange={this.handleInputChange}
              name="saleType"
            >
              <option></option>
              <option>New</option>
              <option>Used</option>
            </select>
            <Label htmlFor="saleType">Type of Sale:</Label>
          </div>
          <div className="group group-select">
            <select
              value={this.state.condition}
              onChange={this.handleInputChange}
              name="condition"
            >
              <option></option>
              <option>New</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
            <Label htmlFor="condition">Condition:</Label>
          </div>
          <div className="group group-select">
            <select
              value={this.state.status}
              onChange={this.handleInputChange}
              name="status"
            >
              <option></option>
              <option>Available</option>
              <option>Sold</option>
            </select>
            <Label htmlFor="status">Status:</Label>
          </div>
          <FormBtn
            disabled={
              !this.state.name ||
              !this.state.category ||
              !this.state.maker ||
              !this.state.sku ||
              (
                !this.state.cost || !/^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$/.test(this.state.cost)
              ) ||
              (
                !this.state.price || !/^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$/.test(this.state.price)
              ) ||
              !this.state.dateAcquired ||
              !this.state.saleType ||
              !this.state.condition ||
              !this.state.status
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