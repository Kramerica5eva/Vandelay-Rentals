import React, { Component, Fragment } from "react";
import Header from "../../components/Elements/Header";
import ParallaxHero from "../../components/ParallaxHero";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import API from "../../utils/API";
import "./About.css";

class About extends Component {

  render() {
    return (
      <Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
          dev={this.props.dev}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499936324534-c3e0da6694eb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c3766361d47840f16392e54c4ea7cbb2&auto=format&fit=crop&w=800&q=80)' }}
            title="CONTACT"
          />
          <div className='body-container contact-page'>
            <div className='contact-boxes'>
              <i className="fas fa-warehouse"></i>
              <h3>Come visit us</h3>
              <h4>10000 Nowhere Lane</h4>
              <h4>Whoknowsville, ZZ 24680</h4>
            </div>
            <div className='contact-boxes'>
              <i className="fas fa-mobile"></i>
              <h3>Give us a call</h3>
              <h4>(801) 123-4567</h4>
              <h4>Mon-Fri | 8 AM - 4 PM</h4>
              <h4>Sat | 7 AM - 6 PM</h4>
            </div>
            <div className='contact-boxes'>
              <i className="fas fa-envelope-open"></i>
              <h3>Send us an email</h3>
              <h4>vandelayrentals.contact@gmail.com</h4>
            </div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default About;
