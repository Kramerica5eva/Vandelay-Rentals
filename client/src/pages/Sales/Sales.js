import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
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
        <Header>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Buy some stuff</h2>
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
          <h2>Purchase Items:</h2>
          <ul>
            {this.state.saleItems.filter(saleItem => saleItem.status === 'Available').map(item => (
              <li key={item._id}>
                <h3>{item.name}</h3>
                <h4>{item.category}</h4>
                <h5>Maker: {item.maker}</h5>
                <h5>Condition: {item.saleType}</h5>
                <p>Price: ${parseFloat(item.price.$numberDecimal).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sales;
