import React, { Component, Fragment } from "react";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import NavBar from "../../components/NavBar";
import DevLinks from "../../components/DevLinks";
import { BrandonTestTable, RentalsTable, CoursesTable, SalesTable, UsersTable, TestTable } from "../../components/AdminTables";
import { AdminForms } from "../../components/AdminForms";

class Admin extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
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
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  //  Test Pages - remove these functiosn from the final version
  toggleTest = () => {
    this.setState({
      test: !this.state.test,
      showForms: false
    });
  };

  toggleBrandonTest = () => {
    this.setState({
      brandonTest: !this.state.brandonTest,
      showForms: false
    });
  };
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
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <Header>
          <h1>Vandelay Admin Page</h1>
          <DevLinks
            loggedIn={this.props.loggedIn}
            admin={this.props.admin}
            logout={this.props.logout}
            location={this.props.location}
          />
        </Header>
        <div>

          <div className="admin-btn-array">
            <button onClick={this.toggleCourses}>See All Courses</button>
            <button onClick={this.toggleRentals}>See All Rentals</button>
            <button onClick={this.toggleSaleItems}>See All Items For Sale</button>
            <button onClick={this.toggleUsers}>See All Users</button>
            <button onClick={this.toggleTest}>Test</button>
            <button onClick={this.toggleBrandonTest}>BrandonTest</button>
            <button onClick={this.hideAllTables}>Clear Tables</button>
            {this.state.showForms ? (
              <button onClick={this.toggleTables}>Show Tables</button>
            ) : (
                <button onClick={this.toggleForms}>Show Forms</button>
              )}
          </div>

          {this.state.courses ? (
            <CoursesTable
              hideCourses={this.toggleCourses}
            />
          ) : null}

          {this.state.rentals ? (
            <RentalsTable
              hideRentals={this.toggleRentals}
            />
          ) : null}

          {this.state.sales ? (
            <SalesTable
              hideSaleItems={this.toggleSaleItems}
            />
          ) : null}

          {this.state.users ? (
            <UsersTable
              hideUsers={this.toggleUsers}
            />
          ) : null}

          {this.state.test ? (
            <TestTable
              hideTest={this.toggleTest}
            />
          ) : null}

          {this.state.brandonTest ? (
            <BrandonTestTable
              hideBrandonTest={this.toggleBrandonTest}
            />
          ) : null}

          {this.state.showForms ? (
            <AdminForms
              updateUser={this.props.updateUser}
            />
          ) : null}


        </div>
      </Fragment>
    );
  }
}

export default Admin;
