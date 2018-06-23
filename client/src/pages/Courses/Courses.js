import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Header from "../../components/Header";
import API from "../../utils/API";

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
      <div>
        <Header>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Git yo learn on</h2>
          <div className="nav-container">
            <Link className="btn-link" to="/" role="button">Home</Link>
            <Link className="btn-link" to="/rentals" role="button">Rentals</Link>
            <Link className="btn-link" to="/sales" role="button">Sales</Link>
            <Link className="btn-link" to="/courses" role="button">Courses</Link>
            {this.props.loggedIn ? (
              <button className="btn-link" role="button" onClick={this.props.logout}>logout</button>
            ) : (
                <React.Fragment>
                  <Link className="btn-link" to="/signup" role="button">Signup</Link>
                  <Link className="btn-link" to="/login" role="button">Login</Link>
                </React.Fragment>
              )}
            <Link className="btn-link" to="/test" role="button">Test</Link>
            {this.props.admin ? <Link className="btn-link" to="/admin" role="button">Admin</Link> : null }
          </div>
        </Header>
        <div>
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
                <p>spaces left: {course.slots - course.participants.length}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Courses;
