import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import API from "../../utils/API";
import "react-table/react-table.css";
import "./AdminTables.css";
import dateFns from "date-fns";

export class ReservationsTable extends Component {
  state = {
    modal: {
      isOpen: false,
      body: '',
      buttons: ''
    },
    loadingModalOpen: false,
    fromUsers: this.props.fromUsers,
    runUnmount: false,
    reservations: this.props.reservations,
    note: ''
  };

  componentWillUnmount = () => {
    //  Why call get Users or get Rentals on Unmount?
    //  Clicking cancelReservation runs all the necessary database functions to delete the reservation, but in this component it only filters it from the this.state.reservations array, meaning if you close the table and reopen it, the one you just deleted will still show. So by running the get user function when the component unmounts ensures this won't happen while also avoiding an extra database query with every deletion.
    if (this.state.runUnmount) {
      console.log("Reservations Unmount Running!");
      if (this.state.fromUsers) {
        this.props.adminGetAllUsers();
      } else {
        this.props.adminGetAllRentals();
      }
    }
  }

  // MODAL TOGGLE FUNCTIONS
  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = modalInput => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }
  // END MODAL TOGGLE FUNCTIONS

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoing
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  //  Cancel function works - Deletes reservation and removes the reference from User and Rental
  cancelReservation = row => {
    this.toggleLoadingModal();
    const { _id } = row._original;

    API.removeRentalReservation(_id, row)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reg => (reg._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled
        this.setState({
          reservations: newReservations,
          runUnmount: true
        })
      })
      .catch(err => console.log(err));
  }

  //  If reservation is paid: false, flips it to true, and vice-versa
  toggleReservationPaid = row => {
    this.toggleLoadingModal();
    const { _id, paid } = row._original;
    API.adminUpdateReservation(_id, { paid: !paid })
      .then(res => {
        this.toggleLoadingModal();
        console.log(res)
        this.state.reservations.forEach(res => {
          if (res._id === _id) {
            res.paid = !paid
          }
          this.setState({
            runUnmount: true
          })
        })

      })
      .catch(err => console.log(err));
  }

  recordRentalReturn = row => {
    this.toggleLoadingModal();
    const { _id } = row._original;
    API.adminRecordRentalReturn(_id, row)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reg => (reg._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled
        this.setState({
          modal: {
            isOpen: true,
            header: "Success!",
            body: <h4>Don't forget to take pictures and upload them to the database</h4>,
            buttons: <button onClick={this.toggleModal}>OK</button>
          },
          reservations: newReservations,
          runUnmount: true
        })
      })
      .catch(err => console.log(err));
  }

  noteModal = row => {
    const { _id, note } = row._original;
    console.log(row);
    this.setModal({
      body:
        <Fragment>
          <textarea name="note" onChange={this.handleInputChange} rows="10" cols="80" defaultValue={note}></textarea>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={() => this.submitNote(_id)}>Submit</button>
          <button onClick={this.toggleModal}>Nevermind</button>
        </Fragment>
    })
  }

  submitNote = id => {
    this.toggleModal();
    this.toggleLoadingModal();
    API.adminUpdateReservation(id, { note: this.state.note })
      .then(response => {
        console.log(response);
        setTimeout(this.toggleLoadingModal, 500);
        this.state.reservations.forEach(pr => {
          if (pr._id === id) pr.note = this.state.note;
          this.setState({ runUnmount: true })
        });
      })
      .catch(err => console.log(err));
  }

  render() {

    if (this.state.reservations.length > 0) {
      this.state.reservations.forEach(reservation => {
        if (reservation.paid) {
          reservation.hasPaid = "True";
        }
        else {
          reservation.hasPaid = "False";
        }
      })
    }

    console.log(this.state.reservations)


    return (

      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />

        <h3>Rental Reservations for {this.props.forName}</h3>

        <ReactTable
          data={this.state.reservations}
          columns={[
            {
              Header: 'Actions',
              columns: [
                {
                  Header: 'Item',
                  id: 'item',
                  width: 140,
                  Cell: row => {
                    // return console.log(row);
                    return (
                      <div className="table-icon-div">
                        <div className="fa-trash-alt-div table-icon-inner-div">
                          <i onClick={() => this.cancelReservation(row.row)} className="table-icon fas fa-trash-alt fa-lg"></i>
                          <span className="fa-trash-alt-tooltip table-tooltip">cancel reservation</span>
                        </div>
                        <div className="fa-dollar-sign-div table-icon-inner-div">
                          <i onClick={() => this.toggleReservationPaid(row.row)} className="table-icon fas fa-dollar-sign fa-lg"></i>
                          <span className="fa-dollar-sign-tooltip table-tooltip">record payment</span>
                        </div>
                        {row.row.hasPaid === "True" ?
                          (
                            <div className="fa-check-circle-div table-icon-inner-div">
                              <i onClick={() => this.recordRentalReturn(row.row)} className="table-icon far fa-check-circle fa-lg"></i>
                              <span className="fa-check-circle-tooltip table-tooltip">record turnin</span>
                            </div>
                          ) : (
                            <div className="fa-check-circle-div table-icon-inner-div">
                              <i onClick={() => this.setModal({
                                body: <h3>Payment must be recorded before the rental can be turned in</h3>,
                                buttons: <button onClick={this.toggleModal}>OK</button>
                              })} className="table-icon far fa-check-circle fa-lg"></i>
                              <span className="fa-check-circle-tooltip table-tooltip">record turnin</span>
                            </div>
                          )}
                        <div className="fa-sticky-note-div table-icon-inner-div">
                          <i onClick={() => this.noteModal(row.row)} className="table-icon far fa-sticky-note fa-lg"></i>
                          <span className="fa-sticky-note-tooltip table-tooltip">see/edit notes</span>
                        </div>
                      </div>
                    )
                  }
                }
              ]
            },
            {
              Header: "Customer",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName",
                  width: 100
                },
                {
                  Header: "Last Name",
                  accessor: "lastName",
                  width: 100
                }
              ]
            },
            {
              Header: "Reservation Data",
              columns: [
                {
                  Header: "Item Name",
                  accessor: "itemName"
                },
                {
                  Header: "Date From",
                  accessor: "date.from",
                  width: 110,
                  Cell: row => {
                    return dateFns.format(row.value * 1000, "MMM Do YYYY")
                  }
                },
                {
                  Header: "Date To",
                  accessor: "date.to",
                  width: 110,
                  Cell: row => {
                    return dateFns.format(row.value * 1000, "MMM Do YYYY")
                  }
                },
                {
                  Header: "Paid",
                  accessor: "hasPaid",
                  width: 60
                },
                {
                  Header: "Total",
                  accessor: "total.$numberDecimal",
                  width: 80,
                  Cell: row => {
                    return `$${parseFloat(row.value).toFixed(2)}`
                  }
                }
              ]
            },
          ]}
          defaultPageSize={5}
          className="-striped -highlight sub-table"
        />

      </Fragment>
    )
  }
}