import React, { Component, Fragment } from "react";
import { Link, Redirect } from 'react-router-dom';
import Header from "../../components/Elements/Header";
import ParallaxHero from "./../../components/ParallaxHero";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import CourseCard from "./../../components/Cards/CourseCard";
import API from "../../utils/API";
import DevLinks from "../../components/DevLinks";
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
      <Fragment>
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <div className="main-container">
          <ParallaxHero
            image={{ backgroundImage: 'url(./static/assets/images/group_in_kayaks.jpeg)' }}
            title="LEARN"
          />

          <Header>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
          </Header>

          <div className='body-container courses'>
            <h2>Courses Available:</h2>
            <ul>
              {this.state.courses.map(course => (
                <CourseCard
                  id={course._id}
                  name={course.name}
                  abstract={course.abstract}
                  level={course.level}
                  price={parseFloat(course.price.$numberDecimal).toFixed(2)}
                  detail={course.detail}
                  slots={course.slots}>
                  {course.topics.map((topic, index) => (
                    <li key={`${index}-${course._id}`}>{topic}</li>
                  ))}
                </CourseCard>
              ))}
            </ul>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default Courses;
