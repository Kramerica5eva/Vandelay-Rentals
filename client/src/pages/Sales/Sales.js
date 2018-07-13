import React, { Component, Fragment } from "react";
import Header from "../../components/Elements/Header";
import ParallaxHero from "../../components/ParallaxHero";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import SaleCard from "./../../components/Cards/SaleCard";
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
            image={{ backgroundImage: 'url(./static/assets/images/boats_on_beach.jpeg)' }}
            //image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499936324534-c3e0da6694eb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c3766361d47840f16392e54c4ea7cbb2&auto=format&fit=crop&w=800&q=80)' }}
            title="PURCHASE"
          />
          <div className='body-container sales'>
            {/* developer links */}
            <Header>
              <DevLinks
                loggedIn={this.props.loggedIn}
                admin={this.props.admin}
                dev={this.props.dev}
                logout={this.props.logout}
                location={this.props.location}
              />
            </Header>
            <h2>Purchase Items:</h2>
            <ul>
              {this.state.saleItems.filter(saleItem => saleItem.status === 'Available').map(item => (
                <SaleCard
                  id={item._id}
                  name={item.name}
                  category={item.category}
                  maker={item.maker}
                  saleType={item.saleType}
                  price={parseFloat(item.price.$numberDecimal).toFixed(2)}
                  displayImageUrl={item.displayImageUrl}>
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
