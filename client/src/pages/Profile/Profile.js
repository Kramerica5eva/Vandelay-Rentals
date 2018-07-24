import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import NavBar from "../../components/Elements/NavBar";
import { ChangePwForm } from "./../../components/AuthForms";
import { UserUpdateForm } from "./../../components/AuthForms";
import HelloSignForm from "./../../components//Elements/HelloSignForm";
import Footer from "../../components/Elements/Footer";
import dateFns from "date-fns";
import "./Profile.css"

class Profile extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    loadingModalOpen: false,
    userData: [],
    reservations: [],
    registrations: [],
    pastRentals: [],
    formsShow: false,
    pastRentalsShow: false,
    userPwForm: false,
    userDataForm: false,
    userWaiverForm: false
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
        body: modalInput.body,
        buttons: modalInput.buttons
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

  toggleFormsShow = () => {
    this.setState({
      formsShow: false,
      userPwForm: false,
      userDataForm: false,
      userWaiverForm: false

    })
  }

  toggleEditUserInfoForm = () => {
    this.setState({
      formsShow: true,
      userPwForm: false,
      userDataForm: true,
      userWaiverForm: false
    });
  }

  toggleChangePwForm = () => {
    this.setState({
      formsShow: true,
      userPwForm: true,
      userDataForm: false,
      userWaiverForm: false
    });
  }

  toggleWaiverForm = () => {
    this.setState({
      formsShow: true,
      userPwForm: false,
      userDataForm: false,
      userWaiverForm: true
    });
  }

  togglePastRentals = () => {
    this.setState({
      pastRentalsShow: !this.state.pastRentalsShow,
    });
  }

  cancelReservationModal = reservation => {
    this.setModal({
      body:
        <Fragment>
          <h4>Are you sure?</h4>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={() => this.cancelReservation(reservation)}>Yes. Delete it.</button>
          <button onClick={this.toggleModal}>No. Keep it.</button>
        </Fragment>
    })
  }

  cancelReservation = reservation => {
    this.toggleModal();
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
                <img src={res.data.displayImageUrl} alt={`${res.data.category}`} />
              </div>
            </div>
        })
      })
  }

  cancelRegistrationModal = registration => {
    this.setModal({
      body:
        <Fragment>
          <h4>Are you sure?</h4>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={() => this.cancelRegistration(registration)}>Yes. Delete it.</button>
          <button onClick={this.toggleModal}>No. Keep it.</button>
        </Fragment>
    })
  }

  cancelRegistration = registration => {
    this.toggleModal();
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
                  <img src={reg.data.displayImageUrl} alt={`${reg.data.name}`} />
                </div>
                <h3>{reg.data.name}</h3>
                <h4>{reg.data.summary}</h4>
                <h4>Difficulty: {reg.data.level}</h4>
                <h5>Price per person: {`$${parseFloat(reg.data.price.$numberDecimal).toFixed(2)}`}</h5>
                <p>{reg.data.description}</p>
                <ul>
                  <p>Topics include:</p>
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
      this.state.reservations.forEach(reservation => {
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
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
          dev={this.props.dev}
        />

        <div className="page-container">
          <div className="content-container">
            <h1>{this.state.userData.firstName}'s Info Page</h1>

            <div className="user-info-div">
              <h3>{firstName} {lastName}</h3>
              <h3>Username: {username}</h3>
              <h4>{street}</h4>
              <h4>{city}, {state} {zipcode}</h4>
              <h4>{email}</h4>
              <h4>{telephone}</h4>
            </div>

            {this.state.formsShow ? (
              <div className="user-info-btn-div">
                <button onClick={this.toggleFormsShow}>Show Reservations</button>
              </div>
            ) : (
                <div className="user-info-btn-div">
                  <button onClick={this.toggleEditUserInfoForm}>edit info</button>
                  <button onClick={this.toggleChangePwForm}>change pw</button>
                  <button onClick={this.toggleWaiverForm}>update waiver</button>
                </div>
              )
            }


            {this.state.formsShow ? null : (
              <div className="reservations-container">
                <h2>My Reservations</h2>

                {this.state.reservations.length > 0 ?
                  <Fragment>
                    {this.state.reservations.sort((a, b) => {
                      let keyA = new Date(a.date.from);
                      let keyB = new Date(b.date.from);
                      if (keyA < keyB) return -1;
                      if (keyA > keyB) return 1;
                      return 0;
                    }).map(res => (
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
                        <i onClick={() => this.cancelReservationModal(res)} className="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                        <i onClick={() => this.getRentalDetails(res)} className="far fa-images fa-2x" aria-hidden="true"></i>
                      </div>
                    ))}
                  </Fragment>
                  : <h4>You have no rentals reserved.</h4>}
              </div>
            )}

            {this.state.formsShow ? null : (
              <div className="registrations-container">
                <h2>My Classes</h2>
                {this.state.registrations.length > 0 ?
                  <Fragment>
                    {this.state.registrations.sort((a, b) => {
                      let keyA = new Date(a.date.from);
                      let keyB = new Date(b.date.from);
                      if (keyA < keyB) return -1;
                      if (keyA > keyB) return 1;
                      return 0;
                    }).map(reg => (
                      <div key={reg._id} className="course-card">
                        <h5>Date {dateFns.format(reg.date * 1000, "MMM Do YYYY")}</h5>
                        <h4>{reg.courseName}</h4>
                        <p>Amount due: {parseFloat(reg.price.$numberDecimal).toFixed(2)}</p>
                        <i onClick={() => this.cancelRegistrationModal(reg)} className="fas fa-trash-alt fa-lg" aria-hidden="true"></i>
                        <i onClick={() => this.getCourseDetails(reg)} className="far fa-images fa-2x" aria-hidden="true"></i>
                      </div>
                    ))}
                  </Fragment>
                  : <h4>You are not signed up for any classes.</h4>}
              </div>
            )}

            {this.state.pastRentalsShow ?
              <div className="reservations-container past-reservations">
                <h2>My Reservations</h2>
                {this.state.pastRentals ? this.state.pastRentals.map(res => (
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
              : null}

            {this.state.userPwForm ?
              <div className="user-forms-container">
                <div className="user-forms-toggle-div">
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleEditUserInfoForm}>Edit Info</button>
                  <button className="user-toggle-btn">Change PW</button>
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleWaiverForm}>Update Waiver</button>
                </div>
                <div className="user-form-div">
                  <ChangePwForm
                    getUserProfileData={this.getUserProfileData}
                    badLogout={this.props.badLogout}
                  />
                </div>
              </div>
              : null}

            {this.state.userDataForm ?
              <div className="user-forms-container">
                <div className="user-forms-toggle-div">
                  <button className="user-toggle-btn">Edit Info</button>
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleChangePwForm}>Change PW</button>
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleWaiverForm}>Update Waiver</button>
                </div>
                <div className="user-form-div">
                  <UserUpdateForm
                    getUserProfileData={this.getUserProfileData}
                  />
                </div>
              </div>
              : null}

            {this.state.userWaiverForm ?
              <div className="user-forms-container">
                <div className="user-forms-toggle-div">
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleEditUserInfoForm}>Edit Info</button>
                  <button className="user-toggle-btn user-toggle-btn-light" onClick={this.toggleChangePwForm}>Change PW</button>
                  <button className="user-toggle-btn">Update Waiver</button>
                </div>
                <div className="user-form-div">
                  <HelloSignForm
                    getUserProfileData={this.getUserProfileData}
                  />
                </div>
              </div>
              : null}

          </div>
          <Footer />
        </div>
      </Fragment >
    )
  }
}

export default Profile;