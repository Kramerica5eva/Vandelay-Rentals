import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Header from "../../components/Header";
import ParallaxHero from "./../../components/ParallaxHero"
import API from "../../utils/API";
import "./Courses.css";

class Courses extends Component {
  state = {
    courses: []
  };

  componentDidMount() {
    this.getAllCourses();
  }

  getAllCourses = () => {
    API.getAllCourses()
      .then(res => {
        this.setState({
          courses: res.data
        });
        console.log(this.state.courses);
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
    if (this.state.redirect) {
      return <Redirect to={{
        pathname: "/login"
      }} />
    }
    return (
      <div className="main-container">
      <ParallaxHero
          image={{backgroundImage:'url(https://images.unsplash.com/photo-1503477742902-923d33a4d8cc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=62d2153b92eba59d1d60d72357929833&auto=format&fit=crop&w=1267&q=80)'}}
          title="LEARN"
          />

        <Header>
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
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
        </Header>

        <div className='body-container'>
          <h2>Courses Available:</h2>
          <ul>
            {this.state.courses.map(course => (
              <li key={course._id}>
                <h3>{course.name}</h3>
                <h4>"{course.abstract}"</h4>
                <h5>Level: {course.level}</h5>
                <p>${parseFloat(course.price.$numberDecimal).toFixed(2)} per person</p>
                <p>"{course.detail}"</p>
                <h4>Topics covered:</h4>
                <ul>
                  {course.topics.map((topic, index) => (
                    <li key={`${index}-${course._id}`}>{topic}</li>
                  ))}
                </ul>
                <p>spaces left: {course.slots}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Courses;
