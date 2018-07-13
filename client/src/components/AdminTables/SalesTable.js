import React, { Component, Fragment } from "react";
import { FormBtn, Label } from "../Elements/Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import dateFns from "date-fns";
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
        footer: "",
        buttons: ""
      },
      category: "",
      saleType: "",
      condition: "",
      status: "",
      categories: [],
      sales: [],
      selection: [],
      selectedRow: {}
    };
  }

  componentWillMount() {
    this.adminGetAllSaleItems();
  }

  // Standard input change controller
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // MODAL TOGGLE FUNCTIONS
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
  // END MODAL TOGGLE FUNCTIONS

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoing
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  //  Get all sale items and set state so the table will display
  adminGetAllSaleItems = () => {
    API.adminGetAllSaleItems()
      .then(res => {

        console.log(res.data);
        //  loop through the response and add a new key/value pair with the formatted price
        res.data.map(r => {
          if (r.cost) r.parsedCost = "$" + parseFloat(r.cost.$numberDecimal).toFixed(2);
          if (r.price) r.parsedPrice = "$" + parseFloat(r.price.$numberDecimal).toFixed(2);
          if (r.dateAcquired) r.acquired = dateFns.format(r.dateAcquired * 1000, "MMM Do YYYY");
          if (r.finalSale && r.finalSale !== 'n/a') {
            const sale = "$" + parseFloat(r.finalSale.$numberDecimal).toFixed(2) || null;
            r.parsedSale = sale;
          }
        });
        this.setState({
          sales: res.data,
          selection: [],
          selectedRow: {}
        });
      })
      .catch(err => console.log(err));
  };

  //  SALE ITEM UPDATE MODALS W/UPDATE FUNCTIONS
  //  Category update modal
  saleItemCategoryModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Category</h3>
            {/* using the Select and Option components in a modal seems to make everything stop working... */}
            <div className="group group-select">
              <select
                name="category"
                // for some reason, setting the select value to this.state.category (as in the React docs) breaks the whole thing. It seems to be grabbing the value from the option html and putting that into state...
                onChange={this.handleInputChange}
              >
                <option></option>
                {this.props.categories.map(cat => (
                  <option key={cat._id} >{cat.category}</option>
                ))}
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeSaleItemCategory}>Submit</button>
    });
  }

  // Category update function
  changeSaleItemCategory = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    API.adminUpdateSaleItem(_id, { category: this.state.category })
      .then(res => {
        this.adminGetAllSaleItems();
        this.toggleLoadingModal();
      });
  }

  //  Sale type update modal
  saleItemSaleTypeModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change New/Used</h3>
            <div className="group group-select">
              <select
                name="saleType"
                // for whatever reason, setting the select value to this.state.category (as in the React docs) does not work with select/option dropdowns...
                onChange={this.handleInputChange}
              >
                <option></option>
                <option>New</option>
                <option>Used</option>
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeSaleItemSaleType}>Submit</button>
    });
  }

  // Sale type update function
  changeSaleItemSaleType = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    API.adminUpdateSaleItem(_id, { saleType: this.state.saleType })
      .then(res => {
        this.adminGetAllSaleItems();
        this.toggleLoadingModal();
      });
  }

  //  Sale Item condition update modal
  saleItemConditionModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Condition</h3>
            {/* using the Select and Option components in a modal seems to make everything stop working... */}
            <div className="group group-select">
              <select
                name="condition"
                // Setting the select value to this.state.condition (as per usual input control) in a modal doesn't work. I'm sure it could be made to work with a different method of managing state, but that's for another time. For now, handleInputChange *is* putting the changes into state, so it works, it's just uncontrolled.
                onChange={this.handleInputChange}
              >
                <option></option>
                <option>New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeSaleItemCondition}>Submit</button>
    })
  }

  // Sale Item condition update function
  changeSaleItemCondition = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal();
    console.log(this.state.condition)
    const { _id } = this.state.selectedRow;
    API.adminUpdateSaleItem(_id, { condition: this.state.condition })
      .then(res => {
        this.adminGetAllSaleItems();
        this.toggleLoadingModal();
      });

  }

  //  Sale Item status update modal
  saleItemStatusModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Status</h3>
            {/* using the Select and Option components in a modal seems to make everything stop working... */}
            <div className="group group-select">
              <select
                name="status"
                // for some reason, setting the select value to this.state.condition (as in the React docs) breaks the whole thing. It seems to be grabbing the value from the option html and putting that into state...
                onChange={this.handleInputChange}
              >
                <option></option>
                <option>Available</option>
                <option>Sold</option>
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeSaleItemStatus}>Submit</button>
    });
  }

  //  Sale Item status update function
  changeSaleItemStatus = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    API.adminUpdateSaleItem(_id, { status: this.state.status })
      .then(res => {
        this.adminGetAllSaleItems();
        this.toggleLoadingModal();
      });
  }

  //  Sale Item Delete modal
  saleItemDeleteModal = () => {
    this.setModal({
      body:
        <Fragment>
          <h3>Warning!</h3>
          <h4>Are you sure you want to delete {this.state.selectedRow.name}?</h4>
          <p>(this is permenent - you cannot undo it)</p>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={this.toggleModal}>Nevermind</button>
          <button onClick={this.deleteSaleItem}>Delete it</button>
        </Fragment>
    })
  }

  //  Sale Item Delete function
  deleteSaleItem = () => {
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    API.adminDeleteSaleItem(_id)
      .then(res => {
        console.log(res);
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h4>Database successfully updated</h4>
        });
        //  query the db and reload the table
        this.adminGetAllSaleItems();
      })
      .catch(err => console.log(err));
  }

  //  REACT-TABLE: SELECT TABLE HOC FUNCTION
  //  This toggles the selected (highlighted) row on or off by pushing/slicing it to/from the this.state.selection array
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

  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };

  isSelected = key => {
    return this.state.selection.includes(key);
  };
  //  END REACT-TABLE: SELECT TABLE HOC FUNCTIONs 

  //  Update selected Row - sends current field info to db and updates that item
  updateSelectedRow = () => {
    this.toggleLoadingModal();
    console.log(this.state.selectedRow);
    const { category, parsedCost, dateAcquired, maker, name, parsedPrice, sku, _id } = this.state.selectedRow;

    let newCost;
    if (parsedCost)
      newCost = parsedCost.split("").filter(x => x !== "$").join("");
    console.log(newCost);

    let newPrice;
    if (parsedPrice)
      newPrice = parsedPrice.split("").filter(x => x !== "$").join("");
    console.log(newPrice);

    const updateObject = {
      category: category,
      cost: newCost,
      dateAcquired: dateAcquired,
      maker: maker,
      name: name,
      price: newPrice,
      sku: sku
    };

    API.adminUpdateSaleItem(_id, updateObject)
      .then(response => {
        if (response.status === 200) {
          //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
          setTimeout(this.toggleLoadingModal, 500);
          // success modal after the loading modal is gone.
          setTimeout(this.setModal, 500, {
            body: <h4>Database successfully updated</h4>
          });
          //  query the db and reload the table
          this.adminGetAllSaleItems();
        }
      })
      .catch(err => console.log(err));
  };

  // editable react table function
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
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />

        <div className="main-table-container">

          <div className="table-title-div">
            <h2>Sale Items Table <button onClick={this.props.toggleSaleItems}>hide table</button></h2>
          </div>

          <div className="table-btn-div">
            <h4>Sale Items Table Options</h4>
            <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected</button>
            <button disabled={this.state.selection.length === 0} onClick={this.saleItemCategoryModal}>Change Category</button>
            <button disabled={this.state.selection.length === 0} onClick={this.saleItemSaleTypeModal}>Change Sale Type</button>
            <button disabled={this.state.selection.length === 0} onClick={this.saleItemConditionModal}>Change Condition</button>
            <button disabled={this.state.selection.length === 0} onClick={this.saleItemStatusModal}>Change Status</button>
            <button disabled={this.state.selection.length === 0} onClick={this.saleItemDeleteModal}>Delete</button>
            <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
          </div>

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
                    accessor: "category"
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
                    accessor: "acquired",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Sale Type",
                    accessor: "saleType"
                  },
                  {
                    Header: "Condition",
                    accessor: "condition"
                  },
                  {
                    Header: "Status",
                    accessor: "status"
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
        </div>
      </Fragment>
    );
  }
}

// export RentalTable;
