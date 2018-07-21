import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Elements/Header";
import DevLinks from "../../components/DevLinks";
import API from "../../utils/API";
import ParallaxHero from "./../../components/ParallaxHero";
import HelloSignForm from "./../../components/Elements/HelloSignForm";
import { Input, Label, FormBtn } from "./../../components/Elements/Form";
import "./../../App.css";
import "./TestNick.css";

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

          {/* Navigation */}
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
        </Header>

        {/* Main Page Focus */}
        <ParallaxHero
          image={{ backgroundImage: 'url(https://images.pexels.com/photos/416676/pexels-photo-416676.jpeg?cs=srgb&dl=sea-person-beach-416676.jpg&fm=jpg)' }}
          title="SUP RENTALS"
        />
        {/* Component Testing Section */}

        <Input />
        <FormBtn>THis is aTESt</FormBtn>
        <Label />
        <HelloSignForm/>
        {/* Component Testing Section End  */}
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
            {/* Heading */}
          <div className='desc-heading'>
            <h2>Your One Stop Shop</h2>
          </div>
            {/* Checkboard Style */}
          <div className='main-card-expander'>
            <div className='top-row-container'>
              <div className="card1">
                <Link className="btn-link expander-card"  to="/sales" role="button">
                  <div className="expander-card-head">
                    <h4>Buy</h4><i className="fas fa-money-bill-alt icons"></i>
                  </div>

                  <p>View our wide selection of the latest and greatest stand up paddle boards and kayaks to purchase.</p>
                </Link>
              </div>
              <div className="card2">
                <Link className="btn-link expander-card"  to="/sales" role="button">
                  <div className="expander-card-head">
                    <h4>Rent</h4><i className="fas fa-exchange-alt icons"></i>
                  </div>

                  <p>Rent one of our boards or kayaks for the a single day or for multiple days in a row.</p>
                </Link>
              </div>
              <div className="card3">
                <Link className="btn-link expander-card"  to="/sales" role="button">
                  <div className="expander-card-head">
                    <h4>Learn</h4><i className="fab fa-leanpub icons"></i>
                  </div>

                  <p>Sign up for a class with our instructional staff to start your adventure in a new sport, or to sharpen your skills.</p>
                </Link>
              </div>
            </div>
          </div>
      </div>
    );
  }
}

export default Test;
