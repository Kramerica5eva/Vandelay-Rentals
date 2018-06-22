import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";

class Admin extends Component {
  state = {
    rentals: []
  };

  componentDidMount() {
    this.getAllRentals();
  }

  getAllRentals = () => {
    API.getAllRentals()
      .then(res => {
        this.setState({
          rentals: res.data
        });
        console.log(this.state.rentals);
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
    if (!this.props.admin) {
      return (
        <div>
          <Header>
            <h1>Vandelay Admin Page, Nomsayn?</h1>
            <h2>You are not an authorized user</h2>
            <h2>(Are you lost?)</h2>
            <p className="lead">
              <Link className="btn-link" to="/" role="button">Home</Link>
            </p>
          </Header>
        </div>
      )
    }
    return (
      <div>
        <Header>
          <h1>Vandelay Test Page, Nomsayn?</h1>
          <h2>Admin Page</h2>
          <h3>This page will only load if "this.props.admin" is true</h3>
          <div className="nav-container">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
          </div>
        </Header>
        <div>
          <p>Admin functions can go here</p>
          <p>forms for creating new inventory, modifying existing inventory, etc.</p>
        </div>
      </div >
    );
  }
}

export default Admin;
