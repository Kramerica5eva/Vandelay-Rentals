import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";

export class SalesTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    sales: []
  };

  componentDidMount() {
    this.adminGetAllSaleItems();
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

  adminGetAllSaleItems = () => {
    API.adminGetAllSaleItems()
      .then(res => {

        console.log(res.data);
        res.data.map(r => {
          const cost = "$" + parseFloat(r.cost.$numberDecimal).toFixed(2);
          r.parsedCost = cost;
          const price = "$" + parseFloat(r.price.$numberDecimal).toFixed(2);
          r.parsedPrice = price;
          if (r.finalSale && r.finalSale !== 'n/a') {
            const sale = "$" + parseFloat(r.finalSale.$numberDecimal).toFixed(2) || null;
            r.parsedSale = sale;
          }
        });
        this.setState({
          sales: res.data
        });
        console.log(this.state.sales);
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };

  // editable react table testing

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const sales = [...this.state.sales];
          sales[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ sales });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.sales[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }


  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.modal.header}
          body={this.state.modal.body}
          footer={this.state.modal.footer}
        />

        <h2>Sale Items</h2>

        <button onClick={this.updateSelectedRow}>Update Selected Row</button>
        <button onClick={this.props.hideSaleItems}>Hide Table</button>
        <button onClick={this.logSelection}>Log Selection</button>

        <ReactTable
          data={this.state.sales}
          columns={[
            {
              Header: "Item Data",
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
                },
                {
                  Header: "Brand",
                  accessor: "maker",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: "Money Data",
              columns: [
                {
                  Header: "SKU",
                  accessor: "sku",
                  Cell: this.renderEditable
                },
                {
                  Header: "Cost",
                  accessor: "parsedCost",
                  Cell: this.renderEditable
                },
                {
                  Header: "Price",
                  accessor: "parsedPrice",
                  Cell: this.renderEditable
                }
              ]
            },
            {
              Header: 'Condition Data',
              columns: [
                {
                  Header: "Date Acq.",
                  accessor: "dateAcquired",
                  Cell: this.renderEditable
                },
                {
                  Header: "Sale Type",
                  accessor: "saleType",
                  Cell: this.renderEditable
                },
                {
                  Header: "Condition",
                  accessor: "condition",
                  Cell: this.renderEditable
                },
                {
                  Header: "Status",
                  accessor: "status",
                  Cell: this.renderEditable
                },
                {
                  Header: "Sale Amt",
                  accessor: "parsedSale",
                  Cell: this.renderEditable
                },
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
        />
      </Fragment>
    );
  }
}

// export RentalTable;
