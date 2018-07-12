import React, { Component, Fragment } from "react";
import { Input, FormBtn, Label } from "../Elements/Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import { ReservationsTable } from './ReservationsTable';
import { RegistrationsTable } from './RegistrationsTable';

const CheckboxTable = checkboxHOC(ReactTable);

// export class UsersTable extends Component {
export class UsersTable extends Component {
  constructor() {
    super();
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: "",
        buttons: ""
      },
      password: "",
      confirmPassword: "",
      standing: "",
      users: [],
      selection: [],
      selectedRow: {}
    };
  }

  componentDidMount() {
    this.adminGetAllUsers();
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer,
        buttons: modalInput.buttons
      }
    });
  }

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoing
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  // Standard input change controller
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        console.log(res);
        this.setState({
          users: res.data,
          selection: [],
          selectedRow: {}
        });
        console.log(this.state.users);
      })
      .catch(err => console.log(err));
  };

  changePwModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change User Password</h3>
            <Input
              name="password"
              onChange={this.handleInputChange}
              type="text"
              Label="Password:"
            />
            <Input
              name="confirmPassword"
              onChange={this.handleInputChange}
              type="text"
              Label="Confirm Password:"
            />
          </form>
        </Fragment>,
      buttons: <button onClick={this.handlePasswordFormSubmit}>Submit</button>
    })
  }

  handlePasswordFormSubmit = event => {
    event.preventDefault();
    this.toggleLoadingModal();
    console.log("Changing password...")
    const { _id } = this.state.selectedRow;
    API.adminUpdateUser(_id, { password: this.state.password })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          setTimeout(this.toggleLoadingModal, 500);
          setTimeout(this.setModal, 500, {
            body: <h4>Password successfully changed</h4>
          });
        } else {
          setTimeout(this.toggleLoadingModal, 500);
          setTimeout(this.setModal, 500, {
            body:
              <Fragment>
                <h4>Something went wrong</h4>
                <h5>Please try again</h5>
              </Fragment>
          });
        }
      });
  }

  userStandingModal = () => {
    if (Object.keys(this.state.selectedRow).length !== 0) {
      this.setModal({
        body:
          <Fragment>
            <form>
              <h3>Change Customer Standing</h3>
              {/* using the Select and Option components in a modal seems to make everything stop working... */}
              <div className="group group-select">
                <select
                  name="standing"
                  // for some reason, setting the select value to this.state.category (as in the React docs) breaks the whole thing. It seems to be grabbing the value from the option html and putting that into state...
                  onChange={this.handleInputChange}
                >
                  <option></option>
                  <option>Good</option>
                  <option>Uncertain</option>
                  <option>Banned</option>
                </select>
              </div>
            </form>
          </Fragment>,
        buttons: <FormBtn onClick={this.handleStandingFormSubmit}>Submit</FormBtn>
      })
    }
  }

  handleStandingFormSubmit = e => {
    e.preventDefault();
    const { _id } = this.state.selectedRow;
    API.adminUpdateUser(_id, { standing: this.state.standing })
      .then(res => {
        this.adminGetAllUsers();
        this.toggleModal();
      });

  }

  //  REACT-TABLE: SELECT TABLE HOC FUNCTIONS

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

    this.setState({ selection, selectedRow: row });
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  updateSelectedRow = () => {
    console.log(this.state.selectedRow);
    const { city, admin, email, firstName, lastName, phone, standing, state, street, username, zipcode, _id } = this.state.selectedRow;
    const updateObject = {
      admin: admin.toLowerCase(),
      city: city,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      standing: standing,
      state: state,
      street: street,
      username: username,
      zipcode: zipcode
    }
    console.log(updateObject);
    API.adminUpdateUser(_id, updateObject)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
          setTimeout(this.toggleLoadingModal, 500);
          // success modal after the loading modal is gone.
          setTimeout(this.setModal, 500, {
            body: <h4>Database successfully updated</h4>
          });
          this.adminGetAllUsers();
        }
      })
  }

  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };

  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const users = [...this.state.users];
          users[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ users });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.users[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  render() {
    const { toggleSelection, isSelected } = this;

    const checkboxProps = {
      isSelected,
      toggleSelection,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        let selected;
        if (r) {
          selected = this.isSelected(r.original._id);
        }
        return {
          style: {
            backgroundColor: selected ? "#00eef7" : "inherit",
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
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />

        <div className="main-table-container">

          {/* <h2>All Users</h2> */}
          <div className="table-title-div">
            <h2>Users Table <button onClick={this.props.toggleUsers}>hide table</button></h2>
          </div>

          {/* if no rows have been selected, buttons remain disabled;
        otherwise, clicking the button without anything selected results in an error */}
          <div className="table-btn-div">
            <h4>Users Table Options</h4>
            <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected Row</button>
            <button disabled={this.state.selection.length === 0} onClick={this.changePwModal}>Change Password</button>
            <button disabled={this.state.selection.length === 0} onClick={this.userStandingModal}>Change User Standing</button>
            <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
          </div>

          <CheckboxTable
            ref={r => (this.checkboxTable = r)}
            data={this.state.users}
            filterable
            SubComponent={row => {
              console.log(row);
              //  thisReservation grabs the reservations from this.state.rentals that matches the row index - it grabs the reservations for this rental item.
              const thisRow = this.state.users[row.row._index];

              return (
                <Fragment>
                  {thisRow.reservations.length > 0 ? (
                    <ReservationsTable
                      forName={`${thisRow.firstName} ${thisRow.lastName}`}
                      reservations={thisRow.reservations}
                      fromUsers={true}
                      adminGetAllUsers={this.adminGetAllUsers}
                    />
                  ) : null}

                  {thisRow.registrations.length > 0 ? (
                    <RegistrationsTable
                      forName={`${thisRow.firstName} ${thisRow.lastName}`}
                      registrations={thisRow.registrations}
                      fromUsers={true}
                      adminGetAllUsers={this.adminGetAllUsers}
                    />
                  ) : null}
                </Fragment>
              )
            }}
            columns={[
              {
                Header: "User",
                columns: [
                  {
                    Header: "Username",
                    accessor: "username",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Admin?",
                    accessor: "admin",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "First Name",
                    accessor: "firstName",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Last Name",
                    accessor: "lastName",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Standing",
                    accessor: "standing"
                  }
                ]
              },
              {
                Header: "Contact Info",
                columns: [
                  {
                    Header: "Email",
                    accessor: "email",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Street",
                    accessor: "street",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "City",
                    accessor: "city",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "State",
                    accessor: "state",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Zipcode",
                    accessor: "zipcode",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Phone",
                    accessor: "phone",
                    Cell: this.renderEditable
                  }
                ]
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            {...checkboxProps}
          />
        </div>
      </Fragment>
    );
  }
}