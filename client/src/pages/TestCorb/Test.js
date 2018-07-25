import React, { Component, Fragment } from "react";
import Header from "./../../components/Elements/Header";
import NavBar from "../../components/Elements/NavBar";
import RentalCard from "./../../components/Cards/RentalCard";
import API from "../../utils/API";
// import ParallaxHero from "./../../components/ParallaxHero";
// import { Input, Label, FormBtn } from "./../../components/Elements/Form";
import "./../../App.css";

class Test extends Component {
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
            <h1>CORBINS'S TEST PAGE</h1>
            <h2>A Page for Testing Components</h2>
            <h2>(SIGNTYPE)</h2>
          </Header>
          <div className='body-container'>
            <h2>Rentals Available:</h2>
            <ul>
              {this.state.rentals.map(rental => (
                <RentalCard
                  key={rental._id}
                  name={rental.name}
                  unix="narf"
                  category={rental.category}
                  maker={rental.maker}
                  rate={parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}>
                </RentalCard>
              ))}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Test;
