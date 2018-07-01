import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";


//  Select Table (HOC) testing import
import checkboxHOC from "react-table/lib/hoc/selectTable";

//  Select Table (HOC) testing HOC wrap
const CheckboxTable = checkboxHOC(ReactTable);

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

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        // res.data.map(r => {
        //   // const rate = "$" + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
        //   // r.rate = rate;
        // });
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
    const { city, email, firstName, lastName, password, phone, standing, state, street, username, zipcode, _id } = this.state.selectedRow;
    const updateObject = {
      city: city,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
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
    const { toggleSelection, isSelected, logSelection } = this;

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

        <button onClick={this.updateSelectedRow}>Update Selected Row</button>
        <button onClick={this.props.hideTest}>Hide Table</button>

        <h2>Test Table</h2>
        <CheckboxTable
          ref={r => (this.checkboxTable = r)}
          data={this.state.users}
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
                  Header: "Password",
                  accessor: "password",
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
                  id: "lastName",
                  accessor: d => d.lastName,
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
            },
            {
              Header: 'Buttons',
              columns: [
                {
                  Header: "Edit Buttons",
                  id: "edit-buttons",
                  accessor: function () {
                    return <button>Stuff</button>;
                  }
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