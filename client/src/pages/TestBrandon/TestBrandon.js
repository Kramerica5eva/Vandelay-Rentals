import React, { Component, Fragment } from "react";
import NavBar from "../../components/Elements/NavBar";
import Header from "../../components/Elements/Header";
import API from "../../utils/API";
import "./../../App.css";

class TestBrandon extends Component {
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
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
          dev={this.props.dev}
        />
        <div className="main-container">
          <Header>
            <h1>BRANDON'S TEST PAGE</h1>
            <h2>A Page for Testing Components</h2>
            <h2>(Inventory Stuff)</h2>
          </Header>
        </div>
      </Fragment>
    );
  }
}

export default TestBrandon;
