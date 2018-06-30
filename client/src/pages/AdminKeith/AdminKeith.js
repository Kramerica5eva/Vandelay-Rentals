import React, { Component, Fragment } from "react";
import Header from "../../components/Header";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import NavBar from "../../components/NavBar";
import DevLinks from "../../components/DevLinks";
import { RentalsTable, CoursesTable, SalesTable, UsersTable } from "../../components/AdminTables";

class Admin extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    courses: null,
    rentals: null,
    sales: null,
    users: null,
    title: ""
  };

  componentDidMount() {
    this.adminGetAllRentals();
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

  adminGetAllCourses = () => {
    this.setState({
      courses: true,
      rentals: null,
      sales: null,
      users: null,
      title: "All Courses"
    });
  };

  adminGetAllRentals = () => {
    this.setState({
      courses: null,
      rentals: true,
      sales: null,
      users: null,
      title: "All Rentals"
    });
  };

  adminGetAllSaleItems = () => {
    this.setState({
      courses: null,
      rentals: null,
      sales: true,
      users: null,
      title: "All Sale Items"
    });
  };

  adminGetAllUsers = () => {
    this.setState({
      courses: null,
      rentals: null,
      sales: null,
      users: true,
      title: "All Users"
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <Header>
          <h1>Vandelay Admin Page, Nomsayn?</h1>
          <h2>Admin Page</h2>
          <DevLinks
            loggedIn={this.props.loggedIn}
            admin={this.props.admin}
            logout={this.props.logout}
            location={this.props.location}
          />
        </Header>
        <div>

          <div className="admin-btn-array">
            <button onClick={this.adminGetAllUsers}>See All Users</button>
            <button onClick={this.adminGetAllRentals}>See All Rentals</button>
            <button onClick={this.adminGetAllSaleItems}>See All Items For Sale</button>
            <button onClick={this.adminGetAllCourses}>See All Courses</button>
          </div>

          {this.state.courses ? (
            <Fragment>
              <h2>{this.state.title}</h2>
              <CoursesTable />
            </Fragment>
          ) : null}

          {this.state.rentals ? (
            <Fragment>
              <h2>{this.state.title}</h2>
              <RentalsTable />
            </Fragment>
          ) : null}

          {this.state.sales ? (
            <Fragment>
              <h2>{this.state.title}</h2>
              <SalesTable />
            </Fragment>
          ) : null}

          {this.state.users ? (
            <Fragment>
              <h2>{this.state.title}</h2>
              <UsersTable />
            </Fragment>
          ) : null}

        </div>
      </Fragment>
    );
  }
}

export default Admin;
