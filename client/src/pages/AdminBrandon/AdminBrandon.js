import React, { Component, Fragment } from "react";
import Header from "../../components/Elements/Header";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import DevLinks from "../../components/DevLinks";
import { BrandonTestTable, RentalsTable, CoursesTable, SalesTable, UsersTable, TestTable } from "../../components/AdminTables";

class Admin extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    courses: false,
    rentals: false,
    sales: false,
    users: false,
    test: false,
    brandonTest: false
  };

  componentDidMount() {
    this.showRentals();
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

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  setTestTrue = () => {
    this.setState({
      test: true
    });
  };

  hideTest = () => {
    this.setState({
      test: false
    })
  };

  setBrandonTestTrue = () => {
    this.setState({
      brandonTest: true
    });
  };

  hideBrandonTest = () => {
    this.setState({
      brandonTest: false
    })
  };

  showCourses = () => {
    this.setState({
      courses: true
    });
  };

  hideCourses = () => {
    this.setState({
      courses: false
    })
  };

  showRentals = () => {
    this.setState({
      rentals: true
    });
  };

  hideRentals = () => {
    this.setState({
      rentals: false
    })
  };

  showSaleItems = () => {
    this.setState({
      sales: true
    });
  };

  hideSaleItems = () => {
    this.setState({
      sales: false
    })
  };

  showUsers = () => {
    this.setState({
      users: true
    });
  };

  hideUsers = () => {
    this.setState({
      users: false
    })
  };

  hideAllTables = () => {
    this.setState({
      courses: false,
      rentals: false,
      sales: false,
      users: false,
      test: false
    })
  }

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
        <LoadingModal show={this.state.loadingModalOpen} />
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
            dev={this.props.dev}
            logout={this.props.logout}
            location={this.props.location}
          />
        </Header>
        <div>

          <div className="admin-btn-array">
            <button onClick={this.showCourses}>See All Courses</button>
            <button onClick={this.showRentals}>See All Rentals</button>
            <button onClick={this.showSaleItems}>See All Items For Sale</button>
            <button onClick={this.showUsers}>See All Users</button>
            <button onClick={this.setTestTrue}>Test</button>
            <button onClick={this.setBrandonTestTrue}>BrandonTest</button>
            <button onClick={this.hideAllTables}>Clear All</button>
          </div>

          {this.state.courses ? (
            <CoursesTable
              hideCourses={this.hideCourses}
            />
          ) : null}

          {this.state.rentals ? (
            <RentalsTable
              hideRentals={this.hideRentals}
            />
          ) : null}

          {this.state.sales ? (
            <SalesTable
              hideSaleItems={this.hideSaleItems}
            />
          ) : null}

          {this.state.users ? (
            <UsersTable
              hideUsers={this.hideUsers}
            />
          ) : null}

          {this.state.test ? (
            <TestTable
              hideTest={this.hideTest}
            />
          ) : null}

          {this.state.brandonTest ? (
            <BrandonTestTable
              hideBrandonTest={this.hideBrandonTest}
            />
          ) : null}

        </div>
        <Footer />
      </Fragment>
    );
  }
}

export default Admin;
