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
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
        </Header>

        <div className='body-container'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
        </div>
        <ParallaxHero
          image={{backgroundImage:'url(https://images.unsplash.com/photo-1499858476316-343e284f1f67?ixlib=rb-0.3.5&s=4985c13dbbf85d7d0f5b90df50ea8695&auto=format&fit=crop&w=1350&q=80)'}}
          title="About our Company"
          />
        <div className='body-container'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, totam veritatis. Vitae ducimus recusandae nobis aperiam dolores necessitatibus, iusto in nesciunt maiores facere ratione ab ipsum. Vel minus quo illo!</p>
        </div>
      </div>
    );
  }
}

export default Home;
