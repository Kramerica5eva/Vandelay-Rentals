import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import { ReservationsTable } from './ReservationsTable';
import { RegistrationsTable } from './RegistrationsTable';

const CheckboxTable = checkboxHOC(ReactTable);

// export class UsersTable extends Component {
export class TestTable extends Component {
  constructor() {
    super();
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
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
        footer: modalInput.footer
      }
    });
  }

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        console.log(res);
        this.setState({
          users: res.data
        });
        console.log(this.state.users);
      })
      .catch(err => console.log(err));
  };

  //  Select Table HOC functions

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
    const { city, email, firstName, lastName, phone, standing, state, street, username, zipcode, _id } = this.state.selectedRow;
    const updateObject = {
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
    API.updateUser(_id, updateObject)
      .then(response => {
        console.log(response);
        this.adminGetAllUsers();
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
        />

        {/* <h2>All Users</h2> */}
        <h2>Test Users Table</h2>

        <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected Row</button>
        {/* <button onClick={this.props.toggleUsers}>Hide Table</button> */}
        <button onClick={this.props.toggleTest}>Hide Table</button>
        <button onClick={this.logSelection}>Log Selection</button>

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
                    adminGetAllUsers={this.adminGetAllUsers}
                  />
                ) : null}

                {thisRow.registrations.length > 0 ? (
                  <RegistrationsTable
                    forName={`${thisRow.firstName} ${thisRow.lastName}`}
                    registrations={thisRow.registrations}
                    users={true}
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
                  accessor: "standing",
                  Cell: this.renderEditable
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
      </Fragment>
    );
  }
}