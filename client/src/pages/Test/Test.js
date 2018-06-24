import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";
import Modal from "../../components/Modal";

class Test extends Component {
  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    rentals: []
  };

  componentDidMount() {
    this.getAllRentals();
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
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />
        <Header>
          <h1>Vandelay Test Page, Nomsayn?</h1>
          <h2>A Page for Testing Components</h2>
          <h2>(showing Rental results for dev purposes)</h2>
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
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
          </div>
        </Header>
        <div>
          <p>Welcome{this.props.firstName ? `, ${this.props.firstName}` : ""}</p>
          <button
            onClick={() => this.setModal({
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
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default Test;
