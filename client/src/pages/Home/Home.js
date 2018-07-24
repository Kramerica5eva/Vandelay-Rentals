import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import ParallaxHero from "./../../components/ParallaxHero";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import "./Home.css";

class Home extends Component {
  state = {
    topic: "",
    begin_date: "",
    end_date: "",
    toResults: false,
    results: []
  };

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
          dev={this.props.dev}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(./static/assets/images/kayak_on_lake_mountain.jpeg)' }}
            title="Vandelay Rentals"
          />

          <div className='body-container'>
            {/* Heading */}
            <div className='desc-heading'>
              <span className="desc-img mobile"><img src="http://i1174.photobucket.com/albums/r619/vandelay-rentals/surftech-logo-cut_zpsjfsrag0g.png" alt="" /></span>
              <span className="desc-img"><img src="http://i1174.photobucket.com/albums/r619/vandelay-rentals/delta-kayak-logo-cut_zpshnuws6l8.png" alt="" /></span>
              <span className="desc-img"><img src="http://i1174.photobucket.com/albums/r619/vandelay-rentals/oru-kayak-logo-cut_zps8nslgyfw.png" alt="" /></span>
              <span className="desc-img"><img src="http://i1174.photobucket.com/albums/r619/vandelay-rentals/pau-hana-logo-cut_zpslbmc0ggc.png" alt="" /></span>
              <span className="desc-img mobile"><img src="http://i1174.photobucket.com/albums/r619/vandelay-rentals/BOTE-logo-cut_zps2tqj9ofm.png" alt="" /></span>
            </div>
            {/* Checkboard Style */}
            <div className='main-card-expander'>
              <div className='top-row-container'>
                <div className="card1">
                  <Link className="btn-link expander-card" to="/sales" role="button">
                    <div className="expander-card-head">
                      <h4>Buy</h4><i className="fas fa-money-bill-alt icons"></i>
                    </div>

                    <p>View our wide selection of the latest and greatest stand up paddle boards and kayaks to purchase.</p>
                  </Link>
                </div>
                <div className="card2">
                  <Link className="btn-link expander-card" to="/rentals" role="button">
                    <div className="expander-card-head">
                      <h4>Rent</h4><i className="fas fa-exchange-alt icons"></i>
                    </div>

                    <p>Rent one of our boards or kayaks for the a single day or for multiple days in a row.</p>
                  </Link>
                </div>
                <div className="card3">
                  <Link className="btn-link expander-card" to="/courses" role="button">
                    <div className="expander-card-head">
                      <h4>Learn</h4><i className="fab fa-leanpub icons"></i>
                    </div>

                    <p>Sign up for a class with our instructional staff to start your adventure in a new sport, or to sharpen your skills.</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <ParallaxHero
            image={{ backgroundImage: 'url(./static/assets/images/overhead_paddleboarder_zoomed_out.jpeg)' }}
            title=""
          /> */}

          <div className='body-container'>
            {/* <h1 id="about-us-para-header">About Our Company</h1> */}
            <div className='about-us'>
              <h3>Designed and Built for your Business</h3>
              <p>This website started as a proof of concept for a local water sports rental shop. Their problem was they needed a website that allowed their users the ability to shop and rent items from home, but also provide a useful in-store interface.</p>
              <p>As a team of Web Developers and outdoor enthusiasts we decided to help. To do this we created a website that not only provided the user interface requested, but also has a proprietary built in inventory management interface. This allows for a seamless experience for both the users and employees that interact with the website.</p>
              <p>Our hope is to make it easier for people to get out and experience the outdoors while also helping outdoor rental companies grow their business. As a proof of concept this website is not actually active with any current companies, though it is a template that our company, Vandelay Rentals, can use to create your company's website. Are you interested? Contact US! </p>

              <div className="contact-email">
                <input id="contactEmail" value="vandelayrentals.contact@gmail.com" readOnly />
                <button className="clipboard-btn" data-clipboard-target="#contactEmail">
                  <i className="fas fa-copy"></i>
                </button>
                <div className="clipboard-icon">
                  {/* <button className="clipboard-btn" data-clipboard-target="#contactEmail">
                      <i className="fas fa-copy"></i>
                    </button> */}
                  {/* <p>Copy to Clipboard</p> */}
                </div>
              </div>

            </div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default Home;
