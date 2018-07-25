import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import Modal from '../../components/Elements/Modal';
import LoadingModal from "../../components/Elements/LoadingModal";
import API from "../../utils/API";
import dateFns from "date-fns";
import "react-table/react-table.css";
import "./AdminTables.css";

export class RegistrationsTable extends Component {
  state = {
    modal: {
      isOpen: false,
      body: '',
      buttons: ''
    },
    fromUsers: this.props.fromUsers,
    runUnmount: false,
    registrations: this.props.registrations,
    loadingModalOpen: false,
    note: ''
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

  // MODAL TOGGLE FUNCTIONS
  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  };

  setModal = modalInput => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  };
  // END MODAL TOGGLE FUNCTIONS

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoing
  toggleLoadingModal = () => {
    this.setState({ loadingModalOpen: !this.state.loadingModalOpen });
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
          this.setState({ runUnmount: true })
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
    API.adminUpdateRegistration(id, { note: this.state.note })
      .then(response => {
        console.log(response);
        setTimeout(this.toggleLoadingModal, 500);
        this.state.registrations.forEach(pr => {
          if (pr._id === id) pr.note = this.state.note;
          this.setState({ runUnmount: true })
        });
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
                  width: 110,
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
                  Header: "Class Date",
                  accessor: "date",
                  Cell: row => {
                    return dateFns.format(row.value * 1000, "MMM Do YYYY")
                  }
                },
                {
                  Header: "Paid",
                  accessor: "hasPaid"
                },
                {
                  Header: "Price",
                  accessor: "price.$numberDecimal",
                  Cell: row => {
                    return `$${parseFloat(row.value).toFixed(2)}`
                  }
                },
                {
                  Header: "Amt Paid",
                  accessor: "amtPaid.$numberDecimal",
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