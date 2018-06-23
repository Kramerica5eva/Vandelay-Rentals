import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";
import ParallaxHero from "./../../components/ParallaxHero";
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
      <div className="main-container">

        <Header>
          <h1>NICKS TEST PAGE</h1>
          <h2>A Page for Testing Components</h2>
          <h2>(showing Rental results for dev purposes)</h2>
          <div className="nav-container">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            {this.props.loggedIn ? (
              <button className="btn-link" role="button" onClick={this.props.logout}>logout</button>
            ) : (
                <React.Fragment>
                  <Link className="btn-link" to="/signup" role="button">Signup</Link>
                  <Link className="btn-link" to="/login" role="button">Login</Link>
                </React.Fragment>
              )}
            <Link className="btn-link" to="/test" role="button">Test</Link>
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
        </Header>
        <ParallaxHero
          image={{backgroundImage:'url(https://images.pexels.com/photos/416676/pexels-photo-416676.jpeg?cs=srgb&dl=sea-person-beach-416676.jpg&fm=jpg)'}}
          title="SUP RENTAaAAAaaAAAaaals"
          />
        <div>
          <p>Welcome{this.props.firstName ? `, ${this.props.firstName}` : ""}</p>
          <button
            onClick={() => this.props.setModal({
              header: "Kramer's Modal",
              body:
                <img src="https://pbs.twimg.com/profile_images/966923121482645507/qtpVrqVn_400x400.jpg" alt="Kramer" />,
              footer: "Kramer's Modal Footer"
            })}
          >
            Kramer!
              </button>
          <h2>Rentals Available:</h2>
          <ul>
            {this.state.rentals.map(rental => (
              <li key={rental._id}>
                <h3>{rental.name}</h3>
                <button onClick={() => this.props.setModal({
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
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Test;
