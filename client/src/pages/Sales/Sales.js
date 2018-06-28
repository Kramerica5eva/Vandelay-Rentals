import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import ParallaxHero from "../../components/ParallaxHero";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SaleCard from "./../../components/SaleCard";
import DevLinks from "../../components/DevLinks";
import API from "../../utils/API";
import "./Sales.css";

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
      <Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499936324534-c3e0da6694eb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c3766361d47840f16392e54c4ea7cbb2&auto=format&fit=crop&w=800&q=80)' }}
            title="PURCHASE"
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
            <h2>Purchase Items:</h2>
            <ul>
              {this.state.saleItems.filter(saleItem => saleItem.status === 'Available').map(item => (
                <SaleCard
                  key={item._id}
                  name={item.name}
                  category={item.category}
                  maker={item.maker}
                  saleType={item.saleType}
                  price={parseFloat(item.price.$numberDecimal).toFixed(2)}>
                </SaleCard>
              ))}
            </ul>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default Sales;
