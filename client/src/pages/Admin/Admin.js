import React, { Component } from "react";
import Header from "../../components/Elements/Header";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import DevLinks from "../../components/DevLinks";
import { RentalsTable, CoursesTable, SalesTable, UsersTable } from "../../components/AdminTables";
import { AdminForms } from "../../components/AdminForms";
import "./Admin.css";

class Admin extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    loadingModalOpen: false,
    showForms: false,
    courses: false,
    rentals: true,
    sales: false,
    users: false,
    test: false,
    brandonTest: false
  };

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
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

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }
  // END Test Pages

  toggleForms = () => {
    this.setState({
      showForms: true,
      courses: false,
      rentals: false,
      sales: false,
      users: false,
      test: false,
      brandonTest: false
    });
  }

  toggleTables = () => {
    this.setState({
      showForms: false,
      courses: false,
      rentals: true,
      sales: false,
      users: false,
      test: false,
      brandonTest: false
    });
  }

  toggleCourses = () => {
    this.setState({
      courses: !this.state.courses,
      showForms: false
    });
  };

  toggleRentals = () => {
    this.setState({
      rentals: !this.state.rentals,
      showForms: false
    });
  };

  toggleSaleItems = () => {
    this.setState({
      sales: !this.state.sales,
      showForms: false
    });
  };

  toggleUsers = () => {
    this.setState({
      users: !this.state.users,
      showForms: false
    });
  };

  hideAllTables = () => {
    this.setState({
      courses: false,
      rentals: false,
      sales: false,
      users: false,
      test: false,
      brandonTest: false
    });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <div className="tables-page-container">
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
          dev={this.props.dev}
        />
        <Header>
          <h1>Vandelay Admin Page</h1>
          <DevLinks
            loggedIn={this.props.loggedIn}
            admin={this.props.admin}
            dev={this.props.dev}
            logout={this.props.logout}
            location={this.props.location}
          />
        </Header>
        <div>

          <div className="admin-btn-array">
            <h2>Admin Options</h2>
            <button onClick={this.toggleCourses}>See Courses</button>
            <button onClick={this.toggleRentals}>See Rentals</button>
            <button onClick={this.toggleSaleItems}>See Sale Items</button>
            <button onClick={this.toggleUsers}>See Users</button>
            <button onClick={this.hideAllTables}>Clear Tables</button>
            {this.state.showForms ? (
              <button onClick={this.toggleTables}>Show Tables</button>
            ) : (
                <button onClick={this.toggleForms}>Show Forms</button>
              )}
          </div>

          {this.state.courses ? (
            <CoursesTable
              toggleCourses={this.toggleCourses}
            />
          ) : null}

          {this.state.rentals ? (
            <RentalsTable
              toggleRentals={this.toggleRentals}
              categories={this.props.categories}
            />
          ) : null}

          {this.state.sales ? (
            <SalesTable
              toggleSaleItems={this.toggleSaleItems}
              categories={this.props.categories}
            />
          ) : null}

          {this.state.users ? (
            <UsersTable
              updateUser={this.props.updateUser}
              toggleUsers={this.toggleUsers}
            />
          ) : null}

          {this.state.showForms ? (
            <AdminForms
              updateUser={this.props.updateUser}
              setCategories={this.props.setCategories}
            />
          ) : null}


        </div>
      </div>
    );
  }
}

export default Admin;
