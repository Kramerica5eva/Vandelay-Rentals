import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import LoadingModal from "../../components/Elements/LoadingModal";
import API from "../../utils/API";
import "react-table/react-table.css";
import "./AdminTables.css";

export class TestTable extends Component {
  state = {
    fromUsers: this.props.fromUsers,
    runUnmount: false,
    registrations: this.props.registrations,
    loadingModalOpen: false
  };

  componentWillUnmount = () => {
    // the cancelRegistration method deletes the registration from the database, and it also filters the deleted data from this.props.registrations and then sets state. But without querying the database, when the component reloads this.state.registrations would still contain the ones that were deleted. So, if there has been a change (props.registrations.length is > state.registrations.length), the adminGetAllUsers() method is called on the parent component.
    if (this.state.runUnmount) {
      console.log("Registrations Unmount Running!");
      if (this.state.fromUsers) {
        this.props.adminGetAllUsers();
      } else {
        this.props.adminGetAllCourses();
      }
    }
  }

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoing
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  //  Cancel function works - Deletes registration and removes the reference from User and Course
  cancelRegistration = row => {
    this.toggleLoadingModal();
    const { _id } = row._original;
    console.log(row);

    API.removeCourseRegistration(_id, row)
      .then(res => {
        this.toggleLoadingModal();
        console.log(res);
        //  filter the row from the registrations array in state and then setState to the filtered data.
        const newRegistrations = this.state.registrations.filter(reg => (reg._id !== _id));
        //  empty selection and selectedRow so the buttons revert to disabled
        this.setState({
          registrations: newRegistrations,
          runUnmount: true
        })
      })
      .catch(err => console.log(err));
  }

  //  If registration is paid: false, flips it to true, and vice-versa
  toggleRegistrationPaid = row => {
    this.toggleLoadingModal();
    const { _id, paid } = row._original;
    API.adminUpdateRegistration(_id, { paid: !paid })
      .then(res => {
        this.toggleLoadingModal();
        console.log(res)
        this.state.registrations.forEach(reg => {
          if (reg._id === _id) {
            reg.paid = !paid
          }
          this.setState({
            runUnmount: true
          })
        })

      })
      .catch(err => console.log(err));
  }

  render() {
    console.log(this.state.registrations);

    if (this.state.registrations.length > 0) {
      this.state.registrations.forEach(registration => {
        if (registration.paid) {
          registration.hasPaid = "True";
        } else {
          registration.hasPaid = "False";
        }
        registration.amtDue = "$" + parseFloat(registration.price.$numberDecimal).toFixed(2);
      })
    }

    return (

      <Fragment>
        <LoadingModal show={this.state.loadingModalOpen} />

        <h3>Class Registrations for {this.props.forName}</h3>
        
        <ReactTable
          data={this.state.registrations}
          columns={[
            {
              Header: 'Actions',
              columns: [
                {
                  Header: 'Item',
                  id: 'item',
                  width: 80,
                  Cell: row => {
                    return (
                      <div className="table-icon-div">
                        <div className="fa-trash-alt-div table-icon-inner-div">
                          <i onClick={() => this.cancelRegistration(row.row)} className="table-icon fas fa-trash-alt fa-lg"></i>
                          <span className="fa-trash-alt-tooltip table-tooltip">cancel registration</span>
                        </div>
                        <div className="fa-dollar-sign-div table-icon-inner-div">
                          <i onClick={() => this.toggleRegistrationPaid(row.row)} className="table-icon fas fa-dollar-sign fa-lg"></i>
                          <span className="fa-dollar-sign-tooltip table-tooltip">record payment</span>
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
        />

      </Fragment>
    )
  }
}