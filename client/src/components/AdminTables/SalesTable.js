import React, { Component, Fragment } from "react";
import { Input, FormBtn } from "../Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

export class SalesTable extends Component {
  constructor() {
    super();
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
      categories: [],
      rentals: [],
      selection: [],
      selectedRow: {}
    };
  }

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

    //  set state with the selected row key, but also set selectedRow with the entire row object, making it available for db updates
    this.setState({ selection, selectedRow: row });
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  updateSelectedRow = () => {
    const { category, condition, dailyRate, dateAcquired, maker, name, rate, sku, timesRented, _id } = this.state.selectedRow;

    let newRate;
    if (rate)
      if (rate.includes("$")) {
        newRate = dailyRate.$numberDecimal;
      } else {
        newRate = rate;
      }

    const updateObject = {
      category: category,
      condition: condition,
      dateAcquired: dateAcquired,
      maker: maker,
      name: name,
      dailyRate: newRate,
      sku: sku,
      timesRented: timesRented
    };

    API.adminUpdateRental(_id, updateObject)
      .then(response => {
        if (response.status === 200) {

          // Modal for feedback
          this.setModal({
            header: "Success!",
            body: <h3>Database successfully updated</h3>
          });

          //  query the db and reload the table
          this.adminGetAllRentals();
        }
      })
      .catch(err => console.log(err));
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
            backgroundColor: selected ? "yellow" : "inherit",
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

        <h2>Sale Items</h2>

        <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected Row</button>
        <button onClick={this.props.hideSaleItems}>Hide Table</button>
        <button onClick={this.logSelection}>Log Selection</button>

        <CheckboxTable
          // this ref prop is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object 
          ref={r => (this.checkboxTable = r)}
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

// export RentalTable;
