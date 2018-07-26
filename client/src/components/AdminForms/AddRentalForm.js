import React, { Component, Fragment } from "react";
import { Input, FormBtn, Label } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";
import dateFns from 'date-fns';
import './AdminForms.css';

export class AddRentalForm extends Component {
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
    timesRented: "",
    dailyRate: "",
    dateAcquired: "",
    condition: ""
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
    const { name, category, maker, sku, dailyRate, timesRented, dateAcquired, condition } = this.state;

    //  The form will accept any text for a date, but if dateFns rejects it as invalid, it will return a modal with acceptable format examples - so a validation regex pattern for all possible acceptable date formats is unnecessary and would be extremely difficult to create
    const unixDate = dateFns.format(dateAcquired, "X");

    //  length of 6 seems to be the shortest valid date
    //  (e.g. 1/1/18, Feb 4 16, or 9-5-13)
    if (dateAcquired.length < 6 || unixDate === "Invalid Date") {

      this.setModal({
        body:
          <Fragment>
            <h4>Please enter a valid date format</h4>
            <p>(e.g. '01/25/2016' or 'Dec 14 2012')</p>
          </Fragment>,
        buttons: <button onClick={this.closeModal}>OK</button>
      })

    } else {

      const rentalObject = {
        name: name,
        category: category,
        maker: maker,
        sku: sku,
        dailyRate: dailyRate,
        reservations: [],
        pastRentals: [],
        timesRented: timesRented,
        dateAcquired: unixDate,
        condition: condition,
        images: [],
        type: "rental"
      }

      API.adminAddNewRental(rentalObject)
        .then(res => {
          console.log(res);
          if (res.data.message === "$ only") {
            this.setModal({
              body: <h4>You must enter a valid Daily Rate.</h4>,
              buttons: <button onClick={this.closeModal}>OK</button>
            })
          } else {
            this.setState({
              name: "",
              category: "",
              maker: "",
              sku: "",
              dailyRate: "",
              timesRented: "",
              dateAcquired: "",
              condition: ""
            })
            this.setModal({
              body: <h4>Your Rental has been added to the database.</h4>,
              buttons: <button onClick={this.closeModal}>OK</button>
            });
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
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <form>
          <Input
            value={this.state.name}
            onChange={this.handleInputChange}
            name="name"
            type="text"
            label="Item Name:"
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
            value={this.state.dailyRate}
            onChange={this.handleInputChange}
            name="dailyRate"
            pattern="^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$"
            type="text"
            label="Daily Rate:"
          />
          <Input
            value={this.state.timesRented}
            onChange={this.handleInputChange}
            name="timesRented"
            pattern="^[0-9]+$"
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
          <div className="group group-select">
            <select
              value={this.state.condition}
              onChange={this.handleInputChange}
              name="condition"
            >
              <option></option>
              <option>New</option>
              <option>Good</option>
              <option>Working</option>
              <option>Disrepair</option>
            </select>
            <Label htmlFor="condition">Condition:</Label>
          </div>
          <FormBtn
            disabled={
              !this.state.name ||
              !this.state.category ||
              !this.state.maker ||
              !this.state.sku ||
              (
                !this.state.dailyRate ||
                !/^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$/.test(this.state.dailyRate)
              ) ||
              (
                !this.state.timesRented ||
                !/^[0-9]+$/.test(this.state.timesRented)
              ) ||
              !this.state.dateAcquired ||
              !this.state.condition
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