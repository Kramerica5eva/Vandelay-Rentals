import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
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
          <Jumbotron>
            <h1>Vandelay Admin Page, Nomsayn?</h1>
            <h2>You are not an authorized user</h2>
            <h2>(Are you lost?)</h2>
            <p className="lead">
              <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
            </p>
          </Jumbotron>
          <Container>
          </Container>
        </div>
      )
    }
    return (
      <div>
        <Jumbotron>
          <h1>Vandelay Test Page, Nomsayn?</h1>
          <h2>Admin Page</h2>
          <div className="lead">
            <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
            <Link className="btn btn-primary btn-lg" to="/sales" role="button">Sales</Link>
            <Link className="btn btn-primary btn-lg" to="/courses" role="button">Courses</Link>
          </div>
        </Jumbotron>
        <Container>
          <p>{this.props.user}</p>
          {this.props.user ? (
            <Link to="#" onClick={this.props.logout}>logout</Link>
          ) : ""}
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
        </Container>
      </div>
    );
  }
}

export default Admin;
