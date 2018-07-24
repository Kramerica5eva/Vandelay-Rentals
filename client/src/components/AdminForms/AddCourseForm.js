import React, { Component, Fragment } from "react";
import { Input, FormBtn, Textarea, Label } from "../Elements/Form";
import Modal from "../../components/Elements/Modal";
import API from "../../utils/API";
import dateFns from 'date-fns';

export class AddCourseForm extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    name: '',
    price: '',
    summary: '',
    description: '',
    topics: '',
    level: '',
    date: '',
    slots: ''
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
    const { name, price, summary, description, topics, level, date, slots } = this.state;
    const topicsArray = topics.split(',').map(topic => topic.trim());

    //  The form will accept any text for a date, but if dateFns rejects it as invalid, it will return a modal with acceptable format examples - so a validation regex pattern for all possible acceptable date formats is unnecessary and would be extremely difficult to create
    const unixDate = dateFns.format(date, "X");
    
    //  length of 6 seems to be the shortest valid date
    //  (e.g. 1/1/18, Feb 4 16, or 9-5-13)
    if (date.length < 6 || unixDate === "Invalid Date") {

      this.setModal({
        body:
          <Fragment>
            <h4>Please enter a valid date format</h4>
            <p>(e.g. '01/25/2016' or 'Dec 14 2012')</p>
          </Fragment>,
        buttons: <button onClick={this.toggleModal}>OK</button>
      })

      //  The form also validates price loosely, allowing for a dollar sign because users may enter one by habit or preference. It also validates for a single decimal and only two decimal places.
      //  Price is further validated on the backend, removing all but numbers and decimals.
    } else {

      const courseObject = {
        name: name,
        price: price,
        summary: summary,
        description: description,
        topics: topicsArray,
        level: level,
        date: unixDate,
        slots: slots,
        registrations: [],
        type: "course"
      }

      API.adminAddNewCourse(courseObject)
        .then(res => {
          console.log(res);
          if (res.data.message === "$ only") {
            this.setModal({
              body: <h4>You must enter a valid price.</h4>,
              buttons: <button onClick={this.toggleModal}>OK</button>
            })
          } else {
            this.setModal({
              body: <h4>Your Course has been added to the database.</h4>,
              buttons: <button onClick={this.toggleModal}>OK</button>
            });
            this.setState({
              name: '',
              price: '',
              summary: '',
              description: '',
              topics: '',
              level: '',
              date: '',
              slots: ''
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
            label="Course Name:"
          />
          <Input
            value={this.state.price}
            onChange={this.handleInputChange}
            name="price"
            pattern="^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$"
            type="text"
            label="Price:"
          />
          <Textarea
            value={this.state.summary}
            onChange={this.handleInputChange}
            name="summary"
            label="Summary:"
          />
          <Textarea
            value={this.state.description}
            onChange={this.handleInputChange}
            name="description"
            label="Detailed Description:"
          />
          <Textarea
            value={this.state.topics}
            onChange={this.handleInputChange}
            name="topics"
            label="Topics Covered:"
            placeholder="Separate topics with a comma"
          />
          <div className="group group-select">
            <select
              value={this.state.level}
              onChange={this.handleInputChange}
              name="level"
            >
              <option></option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <Label htmlFor="level">Difficulty:</Label>
          </div>
          <Input
            value={this.state.date}
            onChange={this.handleInputChange}
            name="date"
            type="text"
            label="Date:"
          />
          <Input
            value={this.state.slots}
            onChange={this.handleInputChange}
            name="slots"
            pattern="^[0-9]+$"
            type="text"
            label="Number of Slots:"
          />
          <FormBtn
            disabled={
              !this.state.name ||
              (
                !this.state.price || !/^(-?\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?|\(\$?([1-9]\d{0,2}(,\d{3})*|[1-9]\d*|0|)(.\d{1,2})?\))$/.test(this.state.price)
              ) ||
              !this.state.summary ||
              !this.state.description ||
              !this.state.topics ||
              !this.state.level ||
              !this.state.date ||
              !this.state.slots
            }
            // disabled="true"
            onClick={this.handleFormSubmit}
          >
            Submit
          </FormBtn>
        </form>

      </Fragment>
    )
  }
}