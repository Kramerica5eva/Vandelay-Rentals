import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import API from "../../utils/API";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

export class RegistrationsTable extends Component {
  state = {
    registrations: this.props.registrations,
    selection: [],
    selectedRow: {}
  };


  componentWillUnmount = () => {
    // the cancelRegistration method deletes the registration from the database, and it also filters the deleted data from this.props.registrations and then sets state. But without querying the database, when the component reloads this.state.registrations would still contain the ones that were deleted. So, if there has been a change (props.registrations.length is > state.registrations.length), the adminGetAllUsers() method is called on the parent component. 
    const { registrations } = this.props;
    if (registrations.length > this.state.registrations.length) {
      console.log("Registrations Unmount Running!");
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

  //  Cancel function works - Deletes registration and removes the reference from User and Rental
  cancelRegistration = () => {
    const { _id } = this.state.selectedRow;
    const row = this.state.selectedRow;
    console.log(row);

    API.removeCourseRegistration(_id, row)
      .then(res => {
        console.log(res);
        //  filter the row from the registrations array in state and then setState to the filtered data.
        const newRegistrations = this.state.registrations.filter(reg => (reg._id !== _id));
        //  empty selection and selectedRow so the buttons revert to disabled
        this.setState({
          registrations: newRegistrations,
          selection: [],
          selectedRow: {}
        })
      })
      .catch(err => console.log(err));
  }

  render() {
    //  destructure from 'this' because the props object doesn't like 'this.anything' unless it's in a key:value pair
    const { toggleSelection, isSelected } = this;
    console.log(this.state.registrations);

    if (this.state.registrations.length > 0) {
      this.state.registrations.map(registration => {

        registration.amtDue = "$" + parseFloat(registration.price.$numberDecimal).toFixed(2);
        if (registration.paid) registration.hasPaid = "True";
        else registration.hasPaid = "False";
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

        <h3>Class Registrations for {this.props.forName}</h3>

        {/* if no rows have been selected, button remains disabled;
      otherwise, clicking the button without anything selected results in an error */}

        <div className="table-btn-div">
          <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
          <button disabled={this.state.selection.length === 0} onClick={this.payRegistration}>Log Payment</button>
          <button disabled={this.state.selection.length === 0} onClick={this.cancelRegistration}>Cancel Registration</button>
        </div>
        <CheckboxTable
          // this ref prop is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object 
          ref={r => (this.checkboxTable = r)}
          data={this.state.registrations}
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
              Header: "Registration Data",
              columns: [
                {
                  Header: "Class Name",
                  accessor: "courseName"
                },
                {
                  Header: "Date",
                  accessor: "date"
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