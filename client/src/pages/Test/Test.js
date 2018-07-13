import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import Footer from "../../components/Elements/Footer";
import ParallaxHero from "../../components/ParallaxHero"
import DevLinks from "../../components/DevLinks";
import RentalCard from "../../components/Cards/RentalCard";
import "./Test.css";
import { CategoryCard } from "../../components/Cards/CategoryCard/CategoryCard";
import Calendar from "react-calendar";

class Test extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: "",
      buttons: ""
    },
    categories: null,
    rentals: null,
    courses: null,
    unix: [],
    unavailable: []
  };

  componentDidMount() {
    API.getAllCategories()
      .then(categories => {
        this.setState({
          categories: categories.data
        })
      })
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
        footer: modalInput.footer,
        buttons: modalInput.buttons
      }
    });
  }

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  getAllCourses = () => {
    API.getAllCourses()
      .then(courses => {
        this.setState({
          courses: courses.data
        })
        console.log(this.state.courses);
      })
      .catch(err => console.log(err));
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

  getRentalsByCategory = category => {
    API.getRentalsByCategory(category)
      .then(res => {
        this.setState({
          rentals: res.data
        })
        console.log(this.state.rentals);
      })
      .catch(err => console.log(err));
  }

  //  CALENDAR FUNCTIONS
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

  checkAvailability = itemRes => { //passed all the reservations for a given item
    for (let i = 0; i < itemRes.length; i++) { //iterate through all individual reservations to compare to selected dates one at a time
      let range = []; //holds each individual day of a reservation
      let days = (itemRes[i].to - itemRes[i].from) / 86400; //determines total number of days for each reservation
      range.push(itemRes[i].from); //pushes the first day of the reservation
      for (let j = 0; j < days; j++) {//
        range.push(range[j] + 86400); //adds all days of a reservation to range for comparison
      };                              //
      for (let k = 0; k < this.state.unix.length; k++) { //compares each index in this.state.unix to each index in range
        if (range.includes(this.state.unix[k])) { //
          return false;                           //returns false if range include the index value of this.state.unix
        }                                         //
      }
    }
    return true; //returns true if no matches are found
  }

  markUnavailable = itemRes => {
    let unavailable = [];
    for (let i = 0; i < itemRes.length; i++) { //iterate through all individual reservations to compare to selected dates one at a time
      let days = (itemRes[i].date.to - itemRes[i].date.from) / 86400; //determines total number of days for each reservation
      unavailable.push(itemRes[i].date.from); //pushes the first day of the reservation
      for (let j = 0; j < days; j++) {//
        unavailable.push(unavailable[j] + 86400); //adds all days of a reservation to range for comparison
      };                              //
    }
    this.setState({ unavailable: unavailable })
  }
  // END CALENDAR FUNCTIONS

  //  This function gets passed to the Rental Card, which then passes it to the 'Reserve' button
  addReservationToCart = rental => {
    // to and from will be adjusted later to match with the calendar
    const from = 1532498400;
    const to = 1532757600;
    API.addReservationToCart(from, to, rental)
      .then(response => console.log(response));
  }

  //  This function gets passed to the Course Card, which will then need to pass it to whatever button.
  //  Right now, in this page, I'm not using a Course Card, so the function is just called here.
  addCourseToCart = course => {
    const { _id } = course;
    API.addRegistrationToCart(_id, course)
      .then(response => console.log(response));
  }


  render() {
    console.log(this.state.categories);
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
          buttons={this.state.modal.buttons}
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
            image={{ backgroundImage: 'url(https://images.unsplash.com/uploads/1412701079442fffb7c1a/6b7a62a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63428fdde80191f1d2299d803dfe61c3&auto=format&fit=crop&w=1350&q=80)' }}
            title="Vandelay Rentals"
          />

          <div className='body-container'>
            <h1>Keith's Admin Test Page</h1>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />

            <div className="category-btn-container">
              {this.state.categories ? this.state.categories.map(category => (
                <Fragment>
                  <CategoryCard
                    key={category._id}
                    onClick={() => this.getRentalsByCategory(category.category)}
                    category={category.category}
                    description={category.description}
                  />
                </Fragment>
              )) : null}
              <CategoryCard
                category="See All"
                description="See all of our rentals"
                onClick={this.getAllRentals}
              />
            </div>

            <button onClick={this.getAllCourses}>Get Courses</button>

            <Calendar
              onChange={this.onChange}
              // value={this.state.date}
              calendarType={"US"}
              selectRange={true}
              returnValue={"range"}
              className={"calendar"}
            />
            <div style={{ position: 'relative', top: 50 + 'px', left: 25 + 'px' }}>{this.state.unix.join(" ")}</div>


            <div className='rentals'>
              <h2>Rentals Available:</h2>
              {this.state.rentals ? this.state.rentals.map(rental => (
                <RentalCard
                  unix={this.state.unix}
                  key={rental._id}
                  id={rental._id}
                  rental={rental}
                  name={rental.name}
                  category={rental.category}
                  maker={rental.maker}
                  reservations={rental.reservations}
                  addReservationToCart={this.addReservationToCart}
                  // className={!this.checkAvailability(rental.reservations) ? "unavailable rentalCard" : "rentalCard"}
                  setAvailability={this.checkAvailability(rental.reservations)}
                  rate={parseFloat(rental.dailyRate.$numberDecimal).toFixed(2)}
                  markUnavailable={this.markUnavailable}
                />
              )) : null}

              {this.state.courses ? this.state.courses.map(course => (
                <Fragment>
                  <h3>{course.name}</h3>
                  <button onClick={() => this.addCourseToCart(course)}>Add to Cart</button>
                </Fragment>
              )) : null}
            </div>
          </div>


          <ParallaxHero
            image={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499858476316-343e284f1f67?ixlib=rb-0.3.5&s=4985c13dbbf85d7d0f5b90df50ea8695&auto=format&fit=crop&w=1350&q=80)' }}
            title="About our Company"
          />

          <div className='body-container'>
            <p>Welcome{this.props.firstName ? `, ${this.props.firstName}` : ""}</p>
            <button
              onClick={() => this.setModal({
                body:
                  <img src="https://pbs.twimg.com/profile_images/966923121482645507/qtpVrqVn_400x400.jpg" alt="Kramer" />,
                footer: "Kramer's Modal Footer"
              })}
            >
              Kramer!
              </button>
          </div>
          <Footer />

        </div>
      </Fragment>
    );
  }
}

export default Test;
