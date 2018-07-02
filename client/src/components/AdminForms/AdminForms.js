import React, { Component, Fragment } from "react";
import Modal from "../../components/Modal";
import { AddCourseForm, AddRentalForm, AddSaleItemForm, AddUserForm } from "../../components/AdminForms";

export class AdminForms extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    forms: {
      addCourse: false,
      addRental: true,
      addSaleItem: false,
      addUser: false
    }
  };

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

  toggleCourseForm = () => {
    this.setState({
      forms: {
        addCourse: true,
        addRental: false,
        addSaleItem: false,
        addUser: false
      }
    });
  }

  toggleRentalForm = () => {
    this.setState({
      forms: {
        addCourse: false,
        addRental: true,
        addSaleItem: false,
        addUser: false
      }
    });
  }

  toggleSaleItemForm = () => {
    this.setState({
      forms: {
        addCourse: false,
        addRental: false,
        addSaleItem: true,
        addUser: false
      }
    });
  }

  toggleUserForm = () => {
    this.setState({
      forms: {
        addCourse: false,
        addRental: false,
        addSaleItem: false,
        addUser: true
      }
    });
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
        <div id="admin-forms-container">
          {this.state.forms.addCourse ? (
            <Fragment>
              <div className="admin-forms-toggle-div">
                <button className="admin-toggle-btn">Add Course</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleRentalForm}>Add Rental</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleSaleItemForm}>Add Sale Item</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleUserForm}>Add User</button>
              </div>
              <div className="admin-form-div">
                <h2>Add New Course</h2>
                <AddCourseForm />
              </div>
            </Fragment>
          ) : null}

          {this.state.forms.addRental ? (
            <Fragment>
              <div className="admin-forms-toggle-div">
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleCourseForm}>Add Course</button>
                <button className="admin-toggle-btn">Add Rental</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleSaleItemForm}>Add Sale Item</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleUserForm}>Add User</button>
              </div>
              <div className="admin-form-div">
                <h2>Add New Rental</h2>
                <AddRentalForm />
              </div>
            </Fragment>
          ) : null}

          {this.state.forms.addSaleItem ? (
            <Fragment>
              <div className="admin-forms-toggle-div">
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleCourseForm}>Add Course</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleRentalForm}>Add Rental</button>
                <button className="admin-toggle-btn">Add Sale Item</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleUserForm}>Add User</button>
              </div>
              <div className="admin-form-div">
                <h2>Add New Sale Item</h2>
                <AddSaleItemForm />
              </div>
            </Fragment>
          ) : null}

          {this.state.forms.addUser ? (
            <Fragment>
              <div className="admin-forms-toggle-div">
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleCourseForm}>Add Course</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleRentalForm}>Add Rental</button>
                <button className="admin-toggle-btn admin-toggle-btn-light" onClick={this.toggleSaleItemForm}>Add Sale Item</button>
                <button className="admin-toggle-btn">Add User</button>
              </div>
              <div className="admin-form-div">
                <h2>Add New User</h2>
                <AddUserForm />
              </div>
            </Fragment>
          ) : null}
        </div>
      </Fragment>
    );
  }
}