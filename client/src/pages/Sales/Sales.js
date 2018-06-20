import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";

class Sales extends Component {
  state = {
    saleItems: []
  };

  componentDidMount() {
    this.getSaleItems();
  }

  getSaleItems = () => {
    API.getAllSaleItems()
      .then(res => {
        this.setState({
          saleItems: res.data
        });
        console.log(this.state.saleItems);
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
        <Jumbotron>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Buy some stuff</h2>
          <p className="lead">
            <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
            <Link className="btn btn-primary btn-lg" to="/rentals" role="button">Rentals</Link>
            <Link className="btn btn-primary btn-lg" to="/courses" role="button">Courses</Link>
            <Link className="btn btn-primary btn-lg" to="/signup" role="button">Signup</Link>
            <Link className="btn btn-primary btn-lg" to="/login" role="button">Login</Link>
          </p>
        </Jumbotron>
        <Container>
          <h2>Purchase Items:</h2>
          <ul>
            {this.state.saleItems.filter(saleItem => saleItem.status === 'Available').map(item => (
              <li>
                <h3>{item.name}</h3>
                <h4>{item.category}</h4>
                <h5>Maker: {item.maker}</h5>
                <h5>Condition: {item.saleType}</h5>
                <p>Price: ${parseFloat(item.price.$numberDecimal).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    );
  }
}

export default Sales;
