import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

class Admin extends Component {
  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    courses: [],
    rentals: [],
    sales: [],
    users: [],
    title: ''
  };

  componentDidMount() {
    this.adminGetAllRentals();
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setModal = (modalInput) => {
    this.setState({
      isOpen: !this.state.isOpen,
      header: modalInput.header,
      body: modalInput.body,
      footer: modalInput.footer
    });
  }

  adminGetAllCourses = () => {
    API.adminGetAllCourses()
      .then(res => {
        this.setState({
          courses: res.data,
          rentals: [],
          sales: [],
          users: [],
          title: "All Courses"
        });
        console.log(this.state.courses);
      })
      .catch(err => console.log(err));
  }

  adminGetAllRentals = () => {
    API.adminGetAllRentals()
      .then(res => {
        this.setState({
          courses: [],
          rentals: res.data,
          sales: [],
          users: [],
          title: "All Rentals"
        });
        console.log(this.state.rentals);
      })
      .catch(err => console.log(err));
  }

  adminGetAllSaleItems = () => {
    API.adminGetAllSaleItems()
      .then(res => {
        this.setState({
          courses: [],
          rentals: [],
          sales: res.data,
          users: [],
          title: "All Sales"
        });
        console.log(this.state.sales);
      })
      .catch(err => console.log(err));
  }

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        this.setState({
          courses: [],
          rentals: [],
          sales: [],
          users: res.data,
          title: "All Users"
        });
        console.log(this.state.users);
      })
      .catch(err => console.log(err));
  }

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
      <React.Fragment>
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />
        <NavBar
            toggleModal={this.props.toggleModal}
            setModal={this.props.setModal}
            updateUser={this.props.updateUser}
            loggedIn={this.props.loggedIn}
            firstName={this.props.firstName}
            admin={this.props.admin}
            logout={this.props.logout}
            location={this.props.location}
          />
        <Header>
          <h1>Vandelay Admin Page, Nomsayn?</h1>
          <h2>Admin Page</h2>
          <div className="nav-container">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            {this.props.loggedIn ? (
              <button className="btn-link" onClick={this.props.logout}>logout</button>
            ) : (
                <React.Fragment>
                  <Link className="btn-link" to="/signup" role="button">Signup</Link>
                  <Link className="btn-link" to="/login" role="button">Login</Link>
                </React.Fragment>
              )}
            <Link className="btn-link" to="/test" role="button">Test</Link>
            <Link className="btn-link" to="/testnick" role="button">TestNick</Link>
            <Link className="btn-link" to="/testben" role="button">TestBen</Link>
            <Link className="btn-link" to="/testcorb" role="button">TestCorb</Link>
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
          </div>
        </Header>
        <div>
          <div className="admin-btn-array">
            <button onClick={this.adminGetAllUsers}>See All Users</button>
            <button onClick={this.adminGetAllRentals}>See All Rentals</button>
            <button onClick={this.adminGetAllSaleItems}>See All Items For Sale</button>
            <button onClick={this.adminGetAllCourses}>See All Courses</button>
          </div>


          <h2>{this.state.title}</h2>
          <ul>

            {this.state.courses ? this.state.courses.map(course => (
              <li key={course._id}>
                <h3>{course.name}</h3>
                <button onClick={() => this.setModal({
                  header: course.name,
                  body:
                    <div>
                      <h3>{course.name}</h3>
                      <h4>"{course.abstract}"</h4>
                      <h5>Level: {course.level}</h5>
                      <p>${parseFloat(course.price.$numberDecimal).toFixed(2)} per person</p>
                      <p>"{course.detail}"</p>
                      <h4>Topics covered:</h4>
                      <ul>
                        {course.topics.map((topic, index) => (
                          <li key={`${index}-${course._id}`}>{topic}</li>
                        ))}
                      </ul>
                      <p>spaces left: {course.slots}</p>
                    </div>,
                  footer: course.name
                })}>
                  see details
                    </button>

              </li>
            )) : null}

            {this.state.rentals ? this.state.rentals.map(rental => (
              <li key={rental._id}>
                <h3>{rental.name}</h3>
                <button onClick={() => this.setModal({
                  header: rental.name,
                  body:
                    <div>
                      <h4>{rental.category}</h4>
                      <h5>Maker: {rental.maker}</h5>
                      <p>Daily rate: ${parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}</p>
                    </div>,
                  footer: rental.name
                })}>
                  see details
                    </button>
              </li>
            )) : null}

            {this.state.sales ? this.state.sales.map(sale => (
              <li key={sale._id}>
                <h3>{sale.name}</h3>
              </li>
            )) : null}

            {this.state.users ? this.state.users.map(user => (
              <li key={user._id}>
                <h3>{user.username}</h3>
              </li>
            )) : null}

          </ul>
          <Footer />
        </div>
      </React.Fragment >
    );
  }
}

export default Admin;
