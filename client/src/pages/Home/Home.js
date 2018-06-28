import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import ParallaxHero from "./../../components/ParallaxHero"
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
      <div className="main-container">
      <ParallaxHero
          image={{backgroundImage:'url(https://images.unsplash.com/uploads/1412701079442fffb7c1a/6b7a62a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63428fdde80191f1d2299d803dfe61c3&auto=format&fit=crop&w=1350&q=80)'}}
          title="Vandelay Rentals"
          />

        <Header>
          {/* <h1>Vandelay Outdoor Gear, Nomsayn?</h1> */}
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
            <Link className="btn-link" to="/testben" role="button">TestBen</Link>
            <Link className="btn-link" to="/testcorb" role="button">TestCorb</Link>
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
        </Header>

        <div className='body-container'>
          {/* Heading */}
          <div className='desc-heading'>
            <h2>Your One Stop Shop</h2>
          </div>
          {/* Checkboard Style */}
          <div className='main-catch'>
            <div className='row-top'>
              <div className='black-box'>
                <h4>Buy</h4>
                <p>View our wide selection of the latest and greatest stand up paddle boards and kayaks to purchase.</p>
              </div>
              <div className='image-box'>
                <i className="fas fa-money-bill-alt icons"></i>
              </div>
            </div>
            <div className='row-middle'>
            <div className='image-box'>
              <i className="fas fa-exchange-alt icons"></i>
            </div>
            <div className='black-box'>
                <h4>Rent</h4>
                <p>Rent one of our boards or kayaks for the a single day or for multiple days in a row.</p>
            </div>
            </div>
            <div className='row-bottom'>
              <div className='black-box'>
                <h4>Learn</h4>
                <p>Sign up for a class with our instructional staff to start your adventure in a new sport, or to sharpen your skills.</p>
              </div>
              <div className='image-box'>
                <i className="fab fa-leanpub icons"></i>
              </div>
            </div>
          </div>
        </div>
        <ParallaxHero
          image={{backgroundImage:'url(https://images.unsplash.com/photo-1499858476316-343e284f1f67?ixlib=rb-0.3.5&s=4985c13dbbf85d7d0f5b90df50ea8695&auto=format&fit=crop&w=1350&q=80)'}}
          title="About our Company"
          />
        <div className='body-container'>
          <div className='about-us'>
            <h3>Designed and Built for your Business</h3>
            <p>This website stated as a proof of concept for a local water sports rental shop. Their problem was they needed a website that allowed their users the ability to shop and rent items from home, but also provide a useful in-store interface.</p>
            <p>As a team of Web Developers and outdoor enthusiasts we decided to help. To do this we created a website that not only provided the user interface requested, but also has a proprietary built in inventory management interface. This allows for a seamless experience for both the users and employees that interact with the website.</p>
            <p>Our hope is to make it easier for people to get out and experience the outdoors while also helping outdoor rental companies grow their business. As a proof of concept this website is not actually active with any current companies, though it is a template that our company, Vandelay Rentals, can use to create your company's website. Are you interested? Contact US! </p>

            <p>---------CONTACT INFO------------</p>

          </div>
        </div>
      </div>
    );
  }
}

export default Home;
