import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";
// import Calendar from "../../components/Calendar";
import Calendar from "react-calendar";
import "./../../App.css";
let moment = require("moment");

let date = new Date();
let dateWrapper = moment(date);

class Test extends Component {

  state = {
    rentals: [],
    date: new Date(),
    unix: []
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

  onChange = date => {
    let range = [];
    date.map(dates => range.push(Date.parse(dates) / 1000))
    this.setState({ unix: range, date: date });
    console.log(range);
  }

  render() {
    return (
      <div className="main-container">

        <Header>
          <h1>BEN'S TEST PAGE</h1>
          <h2>A Page for Testing Components</h2>
          <h2>(CALENDAR STUFF)</h2>

          {/* Navigation */}
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
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null}
          </div>
        </Header>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          calendarType={"US"}
          selectRange={true}
          returnValue={"range"}
        />
        <div>{this.state.unix.join(" ")}</div>
        {/* {console.log(this.state.unix)} */}
      </div>
    );
  }
}

export default Test;
