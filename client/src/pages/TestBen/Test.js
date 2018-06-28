import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";
// import Calendar from "../../components/Calendar";
import Calendar from "react-calendar";
import "./../../App.css";
let moment = require("moment");

let date = new Date();
// let dateWrapper = moment(date);

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
    event.preventDefault(); //<-----Keith, you know what this does right? 
    //  blah blah blah
  };

  onChange = date => {
    this.getDays(date);
  }

  getDays = date => { //date is the array that is passed from the calendar when days are selected. 
    let temp = [];
    let range = [];
    date.map(dates => temp.push(Date.parse(dates) / 1000)); //stores first and last day in temporary array
    let days = Math.floor((temp[1] - temp[0]) / 86400); //seconds in day = 86400  Calculates total number of days for rental.
    range.push(temp[0]); //store first day in range array.
    for (let i = 0; i < days; i++) { //adds each day (including last) to range array
      range.push(range[i] + 86400);
    }
    this.setState({ unix: range, date: date }); //sets state
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
          className={"calendar"}
        />
        <div style={{ position: 'relative', top: 50 + 'px', left: 25 + 'px' }}>{this.state.unix.join(" ")}</div>
      </div>
    );
  }
}

export default Test;
