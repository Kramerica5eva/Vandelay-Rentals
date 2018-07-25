import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import dateFns from "date-fns";

export class SalesTable extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    categories: this.props.categories,
    category: null,
    condition: null,
    sales: [],
    saleType: null,
    status: null,
    note: ""
  };


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
  closeModal = () => {
    this.setState({
      modal: { isOpen: false }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
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

        //  loop through the response and add a new key/value pair with the formatted price
        res.data.map(r => {
          if (r.cost) r.parsedCost = parseFloat(r.cost.$numberDecimal);
          if (r.price) r.parsedPrice = parseFloat(r.price.$numberDecimal);
          if (r.finalSale && r.finalSale !== 'n/a') {
            const sale = parseFloat(r.finalSale.$numberDecimal) || null;
            r.parsedSale = sale;
          }
          return r;
        });
        this.setState({
          sales: res.data
        });
      })
      .catch(err => console.log(err));
  };

  //  Sale Item Delete modal
  saleItemDeleteModal = row => {
    this.setModal({
      body:
        <Fragment>
          <h3>Warning!</h3>
          <h4>Are you sure you want to delete {row.name}?</h4>
          <p>(this is permenent - you cannot undo it)</p>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={this.closeModal}>Nevermind</button>
          <button onClick={() => this.deleteSaleItem(row)}>Delete it</button>
        </Fragment>
    })
  }

  //  Sale Item Delete function
  deleteSaleItem = row => {
    this.closeModal();
    this.toggleLoadingModal();
    const { _id } = row._original;
    API.adminDeleteSaleItem(_id)
      .then(res => {

        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>,
          buttons: <button onClick={this.closeModal}>OK</button>
        });
        //  query the db and reload the table
        this.adminGetAllSaleItems();
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
      buttons: <button onClick={() => this.submitNote(_id)}>Submit</button>
    })
  }

  submitNote = id => {
    this.closeModal();
    this.toggleLoadingModal();
    API.adminUpdateSaleItem(id, { note: this.state.note })
      .then(response => {
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>,
          buttons: <button onClick={this.closeModal}>OK</button>
        });
        //  query the db and reload the table
        this.adminGetAllSaleItems();
      })
      .catch(err => console.log(err));
  }

  //  Update selected Row - sends current field info to db and updates that item
  updateRow = row => {
    this.toggleLoadingModal();
    //  extract variables from the row object
    const { category, condition, dateAcquired, maker, name, parsedCost, parsedPrice, saleType, sku, status, _id } = row._original;

    let unixDate;
    if (typeof dateAcquired === "string") unixDate = dateFns.format(dateAcquired, "X");
    else unixDate = dateFns.format(dateAcquired * 1000, "X");

    // if parsedCost or parsedPrice exist (they should, but to avoid an error, checking first...) and they haven't been changed, they will be typed as numbers because the formatting occurs in the renderEditableRate function (the actual values remain number typed until they are changed) and so the .split method won't exist for them (that's a string method), causing an 'is not a function' error
    let newCost;
    if (parsedCost) {
      if (typeof parsedCost === "string") newCost = parseFloat(parsedCost.split("").filter(x => x !== "$").join(""));
      else newCost = parsedCost
    }

    let newPrice;
    if (parsedPrice) {
      if (typeof parsedPrice === "string") newPrice = parseFloat(parsedPrice.split("").filter(x => x !== "$").join(""));
      else newPrice = parsedPrice;
    }

    let newCategory;
    if (this.state.category) newCategory = this.state.category;
    else newCategory = category;

    let newCondition;
    if (this.state.condition) newCondition = this.state.condition;
    else newCondition = condition;

    let newSaleType;
    if (this.state.saleType) newSaleType = this.state.saleType;
    else newSaleType = saleType;

    let newStatus;
    if (this.state.status) newStatus = this.state.status;
    else newStatus = status;

    const updateObject = {
      category: newCategory,
      condition: newCondition,
      cost: newCost,
      dateAcquired: unixDate,
      maker: maker,
      name: name,
      price: newPrice,
      saleType: newSaleType,
      sku: sku,
      status: newStatus
    };

    API.adminUpdateSaleItem(_id, updateObject)
      .then(response => {
        if (response.status === 200) {
          //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
          setTimeout(this.toggleLoadingModal, 500);
          // success modal after the loading modal is gone.
          setTimeout(this.setModal, 500, {
            body: <h3>Database successfully updated</h3>,
            buttons: <button onClick={this.closeModal}>OK</button>
          });
          //  query the db and reload the table
          this.adminGetAllSaleItems();
        }
      })
      .catch(err => console.log(err));
  };

  // editable react table for the date - allows for date formatting within the cell
  renderEditableDate = cellInfo => {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const sales = [...this.state.sales];
          sales[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ sales: sales });
        }}
        dangerouslySetInnerHTML={{
          //  When you enter a new date that's not in unix time, the below format renders it as "Invalid Date"
          //  As a result, in the split second before the database updates, the field says "Invalid Date"
          //  So, if invalid date, just display what's being typed in. Otherwise, display the formatted version.
          __html: (
            dateFns.format(this.state.sales[cellInfo.index][cellInfo.column.id] * 1000, 'MMM Do YYYY') === "Invalid Date"
              ?
              this.state.sales[cellInfo.index][cellInfo.column.id]
              :
              dateFns.format(this.state.sales[cellInfo.index][cellInfo.column.id] * 1000, 'MMM Do YYYY'))
        }}
      />
    );
  };

  // editable react table function
  renderEditableMoney = (cellInfo) => {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const sales = [...this.state.sales];
          sales[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ sales });
        }}
        dangerouslySetInnerHTML={{
          __html: (
            //  When you enter a new dollar amount that includes anything other than digits (e.g. a dollar sign)
            //  It renders as 'NaN', which shows in the cell for just a second before the change
            //  So, if the cell includes 'NaN', just render what's already in the cell
            //  Otherwise, display the formatted rate.
            `$${parseFloat(this.state.sales[cellInfo.index][cellInfo.column.id]).toFixed(2)}`.includes('NaN')
              ?
              this.state.sales[cellInfo.index][cellInfo.column.id]
              :
              `$${parseFloat(this.state.sales[cellInfo.index][cellInfo.column.id]).toFixed(2)}`
          )
        }}
      />
    );
  }

  // editable react table function
  renderEditable = (cellInfo) => {
    return (
      <div
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
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />

        <div className="main-table-container sales-table">

          <div className="table-title-div">
            <h2>Sale Items Table <button onClick={this.props.toggleSaleItems}>hide table</button></h2>
          </div>

          <ReactTable
            data={this.state.sales}
            filterable
            columns={[
              {
                Header: 'Actions',
                columns: [
                  {
                    Header: 'Actions',
                    id: 'Item',
                    width: 110,
                    Cell: row => {
                      return (
                        <div className="table-icon-div">
                          <div className="fa-sync-div table-icon-inner-div">
                            <i onClick={() => this.updateRow(row.row)} className="table-icon fas fa-sync fa-lg"></i>
                            <span className="fa-sync-tooltip table-tooltip">upload changes</span>
                          </div>
                          <div className="fa-trash-alt-div table-icon-inner-div">
                            <i onClick={() => this.saleItemDeleteModal(row.row)} className="table-icon fas fa-trash-alt fa-lg"></i>
                            <span className="fa-trash-alt-tooltip table-tooltip">delete sale item</span>
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
                Header: "Sale Item Data",
                columns: [
                  {
                    Header: "Name",
                    accessor: "name",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Category",
                    accessor: "category",
                    Cell: row => {
                      return (
                        <Fragment>
                          <form>
                            <div className="table-select">
                              <select
                                name="category"
                                onChange={this.handleInputChange}
                              >
                                <option>{row.row.category}</option>
                                {this.state.categories ? this.state.categories.map(cat => (
                                  cat.category !== row.row.category ? <option key={cat._id}>{cat.category}</option> : null
                                )) : null}
                              </select>
                            </div>
                          </form>
                        </Fragment>
                      )
                    }
                  },
                  {
                    Header: "Brand",
                    accessor: "maker",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "SKU",
                    accessor: "sku",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Cost",
                    accessor: "parsedCost",
                    width: 80,
                    Cell: this.renderEditableMoney
                  },
                  {
                    Header: "Price",
                    accessor: "parsedPrice",
                    width: 80,
                    Cell: this.renderEditableMoney
                  },
                  {
                    Header: "Date Acq.",
                    accessor: "dateAcquired",
                    Cell: this.renderEditableDate
                  },
                  {
                    Header: "Sale Type",
                    accessor: "saleType",
                    width: 80,
                    Cell: row => {
                      return (
                        <Fragment>
                          <form>
                            <div className="table-select">
                              <select
                                name="saleType"
                                onChange={this.handleInputChange}
                              >
                                <option>{row.row.saleType}</option>
                                {row.row.saleType !== "New" ? <option>New</option> : null}
                                {row.row.saleType !== "Used" ? <option>Used</option> : null}
                              </select>
                            </div>
                          </form>
                        </Fragment>
                      )
                    }
                  },
                  {
                    Header: "Condition",
                    accessor: "condition",
                    width: 90,
                    Cell: row => {
                      return (
                        <Fragment>
                          <form>
                            <div className="table-select">
                              <select
                                name="condition"
                                onChange={this.handleInputChange}
                              >
                                <option>{row.row.condition}</option>
                                {row.row.condition !== "New" ? <option>New</option> : null}
                                {row.row.condition !== "Excellent" ? <option>Excellent</option> : null}
                                {row.row.condition !== "Good" ? <option>Good</option> : null}
                                {row.row.condition !== "Fair" ? <option>Fair</option> : null}
                                {row.row.condition !== "Poor" ? <option>Poor</option> : null}
                              </select>
                            </div>
                          </form>
                        </Fragment>
                      )
                    }
                  },
                  {
                    Header: "Status",
                    accessor: "status",
                    width: 90,
                    Cell: row => {
                      return (
                        <Fragment>
                          <form>
                            <div className="table-select">
                              <select
                                name="status"
                                onChange={this.handleInputChange}
                              >
                                <option>{row.row.status}</option>
                                {row.row.condition !== "Available" ? <option>Available</option> : null}
                                {row.row.condition !== "Sold" ? <option>Sold</option> : null}
                              </select>
                            </div>
                          </form>
                        </Fragment>
                      )
                    }
                  },
                  {
                    Header: "Sale Amt",
                    accessor: "parsedSale",
                    width: 80,
                    Cell: this.renderEditableMoney
                  },
                ]
              },
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        </div>
      </Fragment>
    );
  }
}

// export RentalTable;
