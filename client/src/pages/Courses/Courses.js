import React, { Component, Fragment } from "react";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
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
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    loadingModalOpen: false,
    courses: []
  };

  componentWillMount() {
    this.getAllCourses();
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  getAllCourses = () => {
    API.getAllCourses()
      .then(res => {
        console.log(res);
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

  // Creates document in tempRegistrations and adds the tempRegistration to the user's shopping cart
  addCourseToCart = course => {
    this.toggleLoadingModal();
    const { _id } = course;
    API.addRegistrationToCart(_id, course)
      .then(response => {
        console.log(response);
        if (response.data.message === "duplicate") {
          console.log("Duplicate")
          this.toggleLoadingModal();
          this.setModal({
            body: <h4>That Course is already in your cart.</h4>
          })
        } else {
          this.setModal({
            body: <h4>{course.name} has been added to your cart.</h4>
          })
          this.getAllCourses();
          this.toggleLoadingModal();
        }
      });
  }

  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
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



          <div className='body-container courses'>
          <Header>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
          </Header>
            <h2>Courses Available:</h2>
            <ul>
              {this.state.courses.map(course => (
                <CourseCard
                  id={course._id}
                  course={course}
                  name={course.name}
                  abstract={course.abstract}
                  addCourseToCart={this.addCourseToCart}
                  level={course.level}
                  price={parseFloat(course.price.$numberDecimal).toFixed(2)}
                  detail={course.detail}
                  slots={course.slots}
                  displayImageUrl={course.displayImageUrl}>
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
