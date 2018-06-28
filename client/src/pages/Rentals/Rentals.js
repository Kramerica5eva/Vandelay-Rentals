import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import ParallaxHero from "../../components/ParallaxHero";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import RentalCard from "./../../components/RentalCard";
import DevLinks from "../../components/DevLinks";
import API from "../../utils/API";
import "./Rentals.css";

class Rentals extends Component {
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
      <React.Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1471074454408-f7db62d99254?ixlib=rb-0.3.5&s=510c5a89003b801af4a67b96353f118b&auto=format&fit=crop&w=1267&q=80)' }}
            title="RENT"
          />
          <Header>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              logout={this.props.logout}
              location={this.props.location}
            />
          </Header>
          <div className='body-container'>
            <h2>Rentals Available:</h2>
            <ul>
              {this.state.rentals.map(rental => (
                <RentalCard
                  key={rental._id}
                  name={rental.name}
                  category={rental.category}
                  maker={rental.maker}
                  rate={parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}>
                </RentalCard>
              ))}
            </ul>
          </div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default Rentals;
