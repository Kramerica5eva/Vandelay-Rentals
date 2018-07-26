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
      if (this.state.fromUsers) {
        this.props.adminGetAllUsers();
      } else {
        this.props.adminGetAllCourses();
      }
    }
  }

  // Standard input change controller
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // MODAL TOGGLE FUNCTIONS
  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
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

  cancelRegistrationModal = row => {
    if (row.hasPaid === "True") {
      this.setModal({
        body: <h4>You must refund the customer's money before you can remove their class registration.</h4>,
        buttons: <button onClick={this.closeModal}>OK</button>
      })
    } else {
      this.setModal({
        body: <h4>Are you sure you want to remove this customer's class registration?</h4>,
        buttons:
          <Fragment>
            <button onClick={this.closeModal}>Nevermind</button>
            <button onClick={() => this.cancelRegistration(row._original)}>Yes, Remove It</button>
          </Fragment>
      })
    }
  }

  //  Cancel function works - Deletes registration and removes the reference from User and Course
  cancelRegistration = row => {
    this.closeModal();
    this.toggleLoadingModal();
    const { _id } = row;

    API.removeCourseRegistration(_id, row)
      .then(res => {
        this.toggleLoadingModal();
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
    const { _id, paid, price } = row._original;

    let payment;
    if (paid === true) payment = 0;
    else payment = price.$numberDecimal;

    API.adminUpdateRegistration(_id, {
      paid: !paid,
      amtPaid: payment
    })
      .then(res => {
        this.toggleLoadingModal();
        //  mutating registrations in state, while not strictly good practice according to React's design, allows for not reloading the table with each change (reloading the table results in the subtable closing - an annoying effect). Setting state runUnmount to true will repopulate the data when the table is closed so that reflects changes when it is reopened.        
        this.state.registrations.forEach(reg => {
          if (reg._id === _id) {
            reg.paid = !paid;
            reg.amtPaid.$numberDecimal = payment;
          }
          this.setState({ runUnmount: true })
        })

      })
      .catch(err => console.log(err));
  }

  noteModal = row => {
    const { _id, note } = row._original;
    this.setModal({
      body:
        <Fragment>
          <textarea name="note" onChange={this.handleInputChange} rows="10" cols="80" defaultValue={note}></textarea>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={() => this.submitNote(_id)}>Submit</button>
          <button onClick={this.closeModal}>Nevermind</button>
        </Fragment>
    })
  }

  submitNote = id => {
    this.closeModal();
    this.toggleLoadingModal();
    API.adminUpdateRegistration(id, { note: this.state.note })
      .then(response => {
        setTimeout(this.toggleLoadingModal, 500);
        this.state.registrations.forEach(pr => {
          if (pr._id === id) pr.note = this.state.note;
          this.setState({ runUnmount: true })
        });
      })
      .catch(err => console.log(err));
  }

  render() {

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
          closeModal={this.closeModal}
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
                          <i onClick={() => this.cancelRegistrationModal(row.row)} className={row.row.hasPaid === "True" ?
                            "table-icon fas fa-trash-alt fa-lg table-icon-disabled"
                            :
                            "table-icon fas fa-trash-alt fa-lg"
                          }></i>
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