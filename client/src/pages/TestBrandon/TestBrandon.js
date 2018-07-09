import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Elements/Header";
import API from "../../utils/API";
import ParallaxHero from "./../../components/ParallaxHero";
import { Input, Label, FormBtn } from "./../../components/Elements/Form";
import "./../../App.css";
import DevLinks from "../../components/DevLinks";

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
      <div className="main-container">
        <Header>
          <h1>BRANDON'S TEST PAGE</h1>
          <h2>A Page for Testing Components</h2>
          <h2>(Inventory Stuff)</h2>

            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
        </Header>
      </div>
    );
  }
}

export default TestBrandon;
