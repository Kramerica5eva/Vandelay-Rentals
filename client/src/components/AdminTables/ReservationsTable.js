import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import API from "../../utils/API";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import dateFns from "date-fns";
const CheckboxTable = checkboxHOC(ReactTable);

export class ReservationsTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    fromUsers: this.props.fromUsers,
    runUnmount: false,
    reservations: this.props.reservations,
    selection: [],
    selectedRow: {}
  };

  componentWillUnmount = () => {
    //  Why call get Users or get Rentals on Unmount?
    //  Clicking cancelReservation runs all the necessary database functions to delete the reservation, but in this component it only filters it from the this.state.reservations array, meaning if you close the table and reopen it, the one you just deleted will still show. So by running the get user function when the component unmounts ensures this won't happen while also avoiding an extra database query with every deletion.
    if (this.state.runUnmount) {
      console.log("Registrations Unmount Running!");
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
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
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

  //  Cancel function works - Deletes reservation and removes the reference from User and Rental
  cancelReservation = () => {
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    const row = this.state.selectedRow;

    API.removeRentalReservation(_id, row)
      .then(res => {
        console.log(res);
        this.toggleLoadingModal();
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reg => (reg._id !== _id));

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

  //  If reservation is paid: false, flips it to true, and vice-versa
  toggleReservationPaid = () => {
    this.toggleLoadingModal();
    const { _id, paid } = this.state.selectedRow;
    API.adminUpdateReservation(_id, { paid: !paid })
      .then(res => {
        this.toggleLoadingModal();
        console.log(res)
        this.state.reservations.map(res => {
          if (res._id === _id) {
            res.paid = !paid
          }
          this.setState({
            selection: [],
            selectedRow: {},
            runUnmount: true
          })
        })

      })
      .catch(err => console.log(err));
  }

  recordRentalReturn = () => {
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    const row = this.state.selectedRow;
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
            body: <h4>Don't forget to take pictures and upload them to the database</h4>
          },
          reservations: newReservations,
          selection: [],
          selectedRow: {},
          runUnmount: true
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    //  destructure from 'this' because the props object doesn't like 'this.anything' unless it's in a key:value pair
    const { toggleSelection, isSelected } = this;
    // console.log(this.state.reservations);

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
        reservation.date.formattedTo = dateFns.format(reservation.date.to * 1000, "MMM Do YYYY");
        reservation.date.formattedFrom = dateFns.format(reservation.date.from * 1000, "MMM Do YYYY");
      })
    }

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

        <h3>Rental Reservations for {this.props.forName}</h3>

        {/* if no rows have been selected, button remains disabled;
      otherwise, clicking the button without anything selected results in an error */}

        <div className="table-btn-div">
          <h4>Reservations Table Options</h4>
          <button disabled={this.state.selection.length === 0} onClick={this.toggleReservationPaid}>Record Payment</button>
          {/* <button disabled={this.state.selection.length === 0} onClick={this.recordRentalInUse}>Record Checkout</button> */}
          <button disabled={this.state.selection.length === 0} onClick={this.recordRentalReturn}>Record Turn-in</button>
          <button disabled={this.state.selection.length === 0} onClick={this.cancelReservation}>Cancel Reservation</button>
          <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
        </div>
        <CheckboxTable
          // this ref prop is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object
          ref={r => (this.checkboxTable = r)}
          data={this.state.reservations}
          columns={[
            {
              Header: "Customer",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName"
                },
                {
                  Header: "Last Name",
                  accessor: "lastName"
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
                  accessor: "date.formattedFrom"
                },
                {
                  Header: "Date To",
                  accessor: "date.formattedTo"
                },
                {
                  Header: "Paid",
                  accessor: "hasPaid"
                },
                {
                  Header: "Amt Due",
                  accessor: "amtDue"
                }
              ]
            },
          ]}
          defaultPageSize={5}
          className="-striped -highlight sub-table"
          {...checkboxProps}
        />

      </Fragment>
    )
  }
}