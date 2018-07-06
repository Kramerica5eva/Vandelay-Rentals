import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import API from "../../utils/API";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

export class ReservationsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noWayDude: () => {
        console.log("No way, dude!");
      },
      reservations: props.reservations,
      selection: [],
      selectedRow: {}
    };
  }

  componentWillUnmount = () => {
    this.state.noWayDude();
    //  Why call get users on Unmount?
    //  Clicking cancelReservation runs all the necessary database functions to delete the reservation, but in this component it only filters it from the this.state.reservations array, meaning if you close the table and reopen it, the one you just deleted will still show. So by running the get user function when the component unmounts ensures this won't happen while also avoiding an extra database query with every deletion.
    const { reservations, rentals } = this.props;
    if (rentals && reservations.length > this.state.reservations.length) {
      this.props.adminGetAllRentals();
    } else if (reservations.length > this.state.reservations.length) {
      this.props.adminGetAllUsers();
    }
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
    const { from, to } = this.state.selectedRow.date;
    const { _id } = this.state.selectedRow;
    const row = this.state.selectedRow;

    API.removeRentalReservation(from, to, _id, row)
      .then(res => {
        console.log(res);
        //  filter the row from the reservations array in state and then setState to the filtered data.
        const newReservations = this.state.reservations.filter(reg => (reg._id !== _id));

        //  empty selection and selectedRow so the affected buttons revert to disabled 
        this.setState({
          reservations: newReservations,
          selection: [],
          selectedRow: {}
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
        //  86400 = # of seconds in a day
        const bill = ((parseInt(reservation.date.to) - parseInt(reservation.date.from)) / 86400) * reservation.dailyRate.$numberDecimal;
        reservation.amtDue = "$" + parseFloat(bill).toFixed(2);
        if (reservation.paid) reservation.hasPaid = "True";
        else reservation.hasPaid = "False";
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

        <h3>Rental Reservations for {this.props.forName}</h3>

        {/* if no rows have been selected, button remains disabled;
      otherwise, clicking the button without anything selected results in an error */}

        <div className="table-btn-div">
          <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
          <button disabled={this.state.selection.length === 0} onClick={this.payReservation}>Log Payment</button>
          <button disabled={this.state.selection.length === 0} onClick={this.recordRentalInUse}>Log Checkout</button>
          <button disabled={this.state.selection.length === 0} onClick={this.recordRentalReturn}>Log Turn-in</button>
          <button disabled={this.state.selection.length === 0} onClick={this.cancelReservation}>Cancel Reservation</button>
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
                  accessor: "date.from"
                },
                {
                  Header: "Date To",
                  accessor: "date.to"
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
          className="-striped -highlight reservations-table"
          {...checkboxProps}
        />

      </Fragment>
    )
  }
}