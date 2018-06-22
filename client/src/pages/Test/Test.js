import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";

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
      <div>
        <Header>
          <h1>Vandelay Test Page, Nomsayn?</h1>
          <h2>A Page for Testing Components</h2>
          <h2>(showing Rental results for dev purposes)</h2>
          <div className="lead">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            {this.props.loggedIn ?
            (
              <Link className="btn-link" to="#" role="button" onClick={this.props.logout}>logout</Link>
            ) : (
                <div style={{ "display": "inline-block" }}>
                  <Link className="btn-link" to="/signup" role="button">Signup</Link>
                  <Link className="btn-link" to="/login" role="button">Login</Link>
                </div>
              )}
            {this.props.admin ? (
              <Link className="btn-link" to="/admin" role="button">Admin</Link>
            ) : ""}
          </div>
        </Header>
        {this.props.admin ? (
          <div>
            <h2>Hello, Admin {this.props.firstName}</h2>
            <h4>If this is showing, you have admin privileges</h4>
            <p>This page of admin functions could be set up a number of ways</p>
            <p>This could be an array of buttons that triggers forms to display</p>
            <p>Forms could already be displayed</p>
            <p>Or we could use the React-Table npm package</p>
          </div>
        ) : (
          <div>
            <h2>{this.props.firstName ? `Hello, ${this.props.firstName}` : "Hello"}</h2>
            <h4>If this text is showing, you do not have admin privileges</h4>
          </div>
        )} 
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
