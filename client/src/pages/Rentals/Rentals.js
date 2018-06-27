import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import ParallaxHero from "../../components/ParallaxHero";
import RentalCard from "./../../components/RentalCard";
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
      <div className="main-container">
      <ParallaxHero
          image={{backgroundImage:'url(https://images.unsplash.com/photo-1471074454408-f7db62d99254?ixlib=rb-0.3.5&s=510c5a89003b801af4a67b96353f118b&auto=format&fit=crop&w=1267&q=80)'}}
          title="RENT"
          />
        <Header>

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
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
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
              rate= {parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}>
              </RentalCard>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Rentals;
