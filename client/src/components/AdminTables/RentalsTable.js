import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";

export class RentalsTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    rentals: []
  };

  componentDidMount() {
    this.adminGetAllRentals();
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

  adminGetAllRentals = () => {
    API.adminGetAllRentals()
      .then(res => {
        res.data.map(r => {
          const rate = "$" + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
          r.rate = rate;
        });
        console.log(res);
        this.setState({
          rentals: res.data
        });
        console.log(this.state.rentals);
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleTableButtonClick = obj => {
    console.log(obj.target);
  }

  // editable react table testing

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const rentals = [...this.state.rentals];
          rentals[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ rentals: rentals });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.rentals[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }


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
          data={this.state.rentals}          
          columns={[
            {
              Header: "Category",
              columns: [
                {
                  Header: "Name",
                  accessor: "name",
                  Cell: this.renderEditable
                },
                {
                  Header: "Category",
                  id: "category",
                  accessor: d => d.category,
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Manufacturer",
                  accessor: "maker",
                  Cell: this.renderEditable
                },
                {
                  Header: "Condition",
                  accessor: "condition",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: 'Daily Rate',
              columns: [
                {
                  Header: "Daily Rate",
                  accessor: "rate",
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
                  accessor: () => {
                    return <button onClick={this.handleTableButtonClick.bind(this)}>Stuff</button>;
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
