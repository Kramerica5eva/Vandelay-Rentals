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
    reservationsShow: false,
    registrations: [],
    registrationsShow: false,
    pastRentals: [],
    pastRentalsShow: false,
    waiversShow: false,
    formsShow: false,
    selection: [],
    selectedRow: {},
    runUnmount: false
  };

  componentWillMount() {
    this.getUserProfileData();
  }

  componentWillUnmount() {
    if (this.state.runUnmount) {
      this.getUserProfileData();
    }
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

  //  REACT-TABLE: SELECT TABLE HOC FUNCTIONS
  //  This toggles the selected (highlighted) row on or off by pushing/slicing it to/from the this.state.selection array
  toggleSelection = (key, shift, row) => {
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);

    if (keyIndex >= 0) {
      // it does exist so we will remove it
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection = [];
      selection.push(key);
    }

    //  set state with the selected row key, but also set selectedRow with the entire row object, making it available for db updates
    this.setState({ selection, selectedRow: row });
  };

  // Inside the render function, isSelected returns a true or false depending on if a row is selected
  isSelected = key => {
    return this.state.selection.includes(key);
  };

  //  logs the selected row and the selection array to the console
  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };
  //  END REACT-TABLE: SELECT TABLE HOC FUNCTIONS

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

  toggleReservations = () => {
    this.setState({
      reservationsShow: !this.state.reservationsShow,
    });
  }

  toggleRegistrations = () => {
    this.setState({
      registrationsShow: !this.state.registrationsShow,
    });
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

  cancelReservation = () => {
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    const row = this.state.selectedRow;
    console.log(_id);
    API.removeRentalReservation(_id, row)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reservation => (reservation._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled
        this.setState({
          reservations: newReservations,
          selection: [],
          selectedRow: {},
          runUnmount: true
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    const { toggleSelection, isSelected } = this;

    const { city, email, firstName, lastName, pastRentals, phone, registrations, reservations, state, street, username, zipcode } = this.state.userData;

    let telephone;
    if (phone) telephone = `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;

    const checkboxProps = {
      isSelected,
      toggleSelection,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        // If there are any empty rows ('r'), r.orignal will throw an error ('r' is undefined), so check for r:
        let selected;
        if (r) {
          selected = this.isSelected(r.original._id);
        }
        return {
          style: {
            backgroundColor: selected ? "yellow" : "inherit",
            color: selected ? '#000' : 'inherit',
          }
        };
      }
    };

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

            <div className="admin-btn-array">
              <button onClick={this.toggleReservations}>My Reservations</button>
              <button onClick={this.toggleRegistrations}>My Classes</button>
              <button onClick={this.togglePastRentals}>Past Rentals</button>
              <button onClick={this.toggleWaiver}>Waiver Stuff</button>
              <button onClick={this.toggleForms}>Edit My Info</button>
            </div>

            {this.state.reservationsShow ?
              <Fragment>
                <div className="table-btn-div">
                  <button disabled={this.state.selection.length === 0} onClick={this.cancelReservation}>Cancel Reservation</button>
                </div>
                <CheckboxTable
                  ref={r => (this.checkboxTable = r)}
                  data={this.state.reservations}
                  columns={[
                    {
                      Header: "Item Name",
                      accessor: "itemName"
                    },
                    {
                      Header: "Date From",
                      accessor: "date.from",
                      Cell: row => {
                        return dateFns.format(row.row["date.from"] * 1000, "MMM Do YYYY")
                      }
                    },
                    {
                      Header: "Date To",
                      accessor: "date.to",
                      Cell: row => {
                        return dateFns.format(row.row["date.to"] * 1000, "MMM Do YYYY")
                      }
                    },
                    {
                      Header: "Paid",
                      accessor: "hasPaid"
                    },
                    {
                      Header: "Amt Due",
                      accessor: "amtDue"
                    }

                  ]}
                  defaultPageSize={5}
                  className="-striped -highlight user-data-table"
                  {...checkboxProps}
                />
              </Fragment>
              : null}

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