import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";

export class UsersTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    users: [],
    selection: [],
    selectAll: false
  };

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
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        res.data.map(r => {
          // const rate = "$" + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
          // r.rate = rate;
        });
        console.log(res);
        this.setState({
          users: res.data
        });
        console.log(this.state.users);
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  updateRow = () => {

  }

  // editable react table testing

  renderEditable = (cellInfo) => {
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


  //  Select Table (HOC) testing


  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />

        <ReactTable
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
            // {
            //   Header: 'Bidness Info',
            //   columns: [
            //     {
            //       Header: "Waivers",
            //       accessor: "waivers",
            //       Cell: this.renderEditable
            //     }
            //   ]
            // },
            {
              Header: 'Buttons',
              columns: [
                {
                  Header: "Edit Buttons",
                  id: "edit-buttons",
                  accessor: function () {
                    return <button onClick={() => this.updateRow()}>Stuff</button>;
                  }
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </Fragment>
    );
  }
}

// export RentalTable;
