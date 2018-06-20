import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
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
    return (
      <div>
        <Jumbotron>
          <h1>Vandelay Outdoor Gear, Nomsayn?</h1>
          <h2>Git yo learn on</h2>
          <p className="lead">
            <Link className="btn btn-primary btn-lg" to="/" role="button">Home</Link>
            <Link className="btn btn-primary btn-lg" to="/rentals" role="button">Rentals</Link>
            <Link className="btn btn-primary btn-lg" to="/sales" role="button">Sales</Link>
            <Link className="btn btn-primary btn-lg" to="/signup" role="button">Signup</Link>
            <Link className="btn btn-primary btn-lg" to="/login" role="button">Login</Link>
          </p>
        </Jumbotron>
        <Container>
          <h2>Courses Available:</h2>
          <ul>
            {this.state.courses.map(course => (
              <li>
                <h3>{course.name}</h3>
                <h4>"{course.abstract}"</h4>
                <h5>Level: {course.level}</h5>
                <p>${parseFloat(course.price.$numberDecimal).toFixed(2)} per person</p>
                <p>"{course.detail}"</p>
                <h4>Topics covered:</h4>
                <ul>
                  {course.topics.map(topic => (
                    <li>{topic}</li>
                  ))}
                </ul>
                <p>spaces left: {course.slots - course.participants.length}</p>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    );
  }
}

export default Courses;
