import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import ParallaxHero from "./../../components/ParallaxHero";
import Footer from "../../components/Elements/Footer";
import ReactTable from "react-table";
import "react-table/react-table.css";
import dateFns from "date-fns";
import DevLinks from "../../components/DevLinks";
import "./Profile.css"
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

class Profile extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    userChanges: {

    },
    pwData: {
      ogPw: "",
      newPw: "",
      confirmPw: ""
    },
    loadingModalOpen: false,
    userData: [],
    reservations: [],
    registrations: [],
    pastRentals: [],
    pastRentalsShow: false,
  };

  componentWillMount() {
    this.getUserProfileData();
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  };

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  };

  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  };

  getUserProfileData = () => {
    API.getUserProfileData()
      .then(user => {
        console.log(user);
        this.setState({
          userData: user.data,
          reservations: user.data.reservations,
          registrations: user.data.registrations,
          pastRentals: user.data.pastRentals
        });
      });
  }

  editUserInfo = () => {

  }

  changePassword = () => {

  }

  togglePastRentals = () => {
    this.setState({
      pastRentalsShow: !this.state.pastRentalsShow,
    });
  }

  toggleWaiver = () => {
    this.setState({
      reservationsShow: false,
      registrationsShow: false,
      pastRentalsShow: false,
      waiversShow: !this.state.waiversShow,
    });
  }

  toggleForms = () => {
    this.setState({
      reservationsShow: false,
      registrationsShow: false,
      pastRentalsShow: false,
      waiversShow: false,
      formsShow: !this.state.formsShow
    });
  }

  cancelReservation = reservation => {
    this.toggleLoadingModal();
    const { _id } = reservation;
    console.log(_id);
    API.removeRentalReservation(_id, reservation)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reservation => (reservation._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled
        this.setState({
          reservations: newReservations
        })
      })
      .catch(err => console.log(err));
  }

  getRentalDetails = reservation => {
    const { category, itemId } = reservation;
    // console.log(reservation);
    API.getRentalById(category, itemId)
      .then(res => {
        console.log(res);
        this.setModal({
          body:
            <div className="reservation-modal-div">
              <div className="reservation-modal-data">
                <h2>{res.data.name}</h2>
                <h4>by {res.data.maker}</h4>
                <h5>Daily Rate: {`$${parseFloat(res.data.dailyRate.$numberDecimal).toFixed(2)}`}</h5>
              </div>
              <div className="reservation-modal-image">
                <img src={res.data.displayImageUrl} alt={`${res.data.category} photo`} />
              </div>
            </div>
        })
      })
  }

  cancelRegistration = registration => {
    this.toggleLoadingModal();
    const { _id } = registration;
    console.log(_id);
    API.removeCourseRegistration(_id, registration)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the registrations array in state and then setState to the filtered data.
        const newRegistrations = this.state.registrations.filter(registration => (registration._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled
        this.setState({
          registrations: newRegistrations
        })
      })
      .catch(err => console.log(err));
  }

  getCourseDetails = registration => {
    const { courseId } = registration;
    console.log(registration);
    API.getCourseById(courseId)
      .then(reg => {
        console.log(reg);
        this.setModal({
          body:
            <div className="registration-modal-div">
              <div className="registration-modal-data">
                <div className="registration-modal-image">
                  <img src={reg.data.displayImageUrl} alt={`${reg.data.name} photo`} />
                </div>
                <h2>{reg.data.name}</h2>
                <h4>{reg.data.abstract}</h4>
                <h4>Difficulty: {reg.data.level}</h4>
                <h5>Price per person: {`$${parseFloat(reg.data.price.$numberDecimal).toFixed(2)}`}</h5>
                <p>{reg.data.detail}</p>
                <p>Topics include:</p>
                <ul>
                  {reg.data.topics ? reg.data.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  )) : null}
                </ul>
                <p>Spaces left: {reg.data.slots - reg.data.registrations.length}</p>
              </div>
            </div>
        })
      })
  }

  render() {

    const { city, email, firstName, lastName, phone, state, street, username, zipcode } = this.state.userData;

    let telephone;
    if (phone) telephone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;

    if (this.state.reservations.length > 0) {
      this.state.reservations.map(reservation => {
        if (reservation.paid) {
          reservation.hasPaid = "True";
          reservation.amtDue = "$0.00"
        }
        else {
          reservation.hasPaid = "False";
          //  86400 = # of seconds in a day
          const bill = (((parseInt(reservation.date.to) - parseInt(reservation.date.from)) / 86400) + 1) * reservation.dailyRate.$numberDecimal;
          reservation.amtDue = "$" + parseFloat(bill).toFixed(2);
        }
      })
    }

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

        <div className="page-container">
          <div className="content-container">
            <h1>{this.state.userData.firstName}'s Info Page</h1>
            <DevLinks
              loggedIn={this.props.loggedIn}
              admin={this.props.admin}
              dev={this.props.dev}
              logout={this.props.logout}
              location={this.props.location}
            />
            <div className="user-info-div">
              <h3>{firstName} {lastName}</h3>
              <h3>Username: {username}</h3>
              <h4>{street}</h4>
              <h4>{city}, {state} {zipcode}</h4>
              <h4>{email}</h4>
              <h4>{telephone}</h4>
            </div>

            {/* itemName, date.from, date.to, hasPaid, amtDue */}
            <div className="reservations-container">
              <h2>My Reservations</h2>
              {this.state.reservations ? this.state.reservations.map(res => (
                <div key={res._id} className="reservation-card">
                  {res.date.from === res.date.to ? (
                    <h5>{dateFns.format(res.date.from * 1000, "MMM Do YYYY")}</h5>
                  ) : (
                      <h5>{dateFns.format(res.date.from * 1000, "MMM Do YYYY")} - {dateFns.format(res.date.to * 1000, "MMM Do YYYY")}</h5>
                    )
                  }
                  <h4>{res.itemName}</h4>
                  <h3>{res.category}</h3>
                  <p>Amt due at pick up: {res.amtDue}</p>
                  <i onClick={() => this.cancelReservation(res)} className="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                  <i onClick={() => this.getRentalDetails(res)} className="far fa-images fa-2x" aria-hidden="true"></i>
                </div>
              )) : null}
            </div>

            <div className="registrations-container">
              <h2>My Classes</h2>
              {this.state.registrations ? this.state.registrations.map(reg => (
                <div key={reg._id} className="course-card">
                  <h5>Date {dateFns.format(reg.date * 1000, "MMM Do YYYY")}</h5>
                  <h4>{reg.courseName}</h4>
                  <p>Amount due: {parseFloat(reg.price.$numberDecimal).toFixed(2)}</p>
                  <i onClick={() => this.cancelRegistration(reg)} className="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                  <i onClick={() => this.getCourseDetails(reg)} className="far fa-images fa-2x" aria-hidden="true"></i>
                </div>
              )) : null}
            </div>

            {this.state.registrationsShow ?
              <Fragment>
              </Fragment>
              : null}

            {this.state.pastRentalsShow ?
              <Fragment>
              </Fragment>
              : null}

            {this.state.waiversShow ?
              <Fragment>
              </Fragment>
              : null}

            {this.state.formsShow ?
              <Fragment>
              </Fragment>
              : null}



          </div>
          <Footer />
        </div>
      </Fragment >
    )
  }
}

export default Profile;