import React, { Component, Fragment } from "react";
import { Input, FormBtn, Select, Label, Option } from "../Elements/Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import ImageModal from "../../components/Elements/ImageModal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import Moment from 'moment';

import { ReservationsTable } from './ReservationsTable';

const CheckboxTable = checkboxHOC(ReactTable);


// seeReservations and seePastRentals functions (ctrl+f 'seeReservations' & 'seePastRentals') will need to be updated once Ben's calendar/Date functionality is in place

export class RentalsTable extends Component {
  constructor() {
    super();
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
      imageModal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
      currentReservations: null,
      category: "",
      images: [],
      selectedFile: null,
      image: null,
      rentals: [],
      selection: [],
      selectedRow: {}
    };
  }

  componentDidMount() {
    this.adminGetAllRentals();
  }

  // MODAL TOGGLE FUNCTIONS
  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  //  isOpen MUST be set to true for the setModal function, and NOT '!this.state.modal.isOpen' as in the toggleModal function, otherwise select/option tags (dropdowns) won't work properly inside the modal: the dropdown is always a step behind populating from state (the selection won't display what you've chosen until you close and reopen the modal).
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
  // END MODAL TOGGLE FUNCTIONS

  // IMAGEMODAL TOGGLE FUNCTIONS
  toggleImageModal = () => {
    this.setState({
      imageModal: { isOpen: !this.state.imageModal.isOpen }
    });
  }

  setImageModal = (modalInput) => {
    this.setState({
      imageModal: {
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }
  // END MODAL TOGGLE FUNCTIONS

  // Get rentals and set state so the table will display
  adminGetAllRentals = () => {
    API.adminGetAllRentals()
      .then(res => {
        console.log(res.data);

        //  loop through the response array and add a new key/value pair with the formatted rate
        res.data.map(r => {
          const rate = "$" + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
          r.rate = rate;
          console.log(r.dateAcquired);
          const date = Moment.unix(r.dateAcquired).format("MMMM Do YYYY");
          r.dateAcq = date;
        });

        // set state for rentals, but also empty selection - selection is where the selected (highlighted) row _id is kept. This unselects the row - when a row is selected and the data is updated, it calls this function (adminGetAllRentals), and emptying this.state.selected results in unselecting the row, which works as a visual cue that an update operation is complete.
        this.setState({
          rentals: res.data,
          selection: []
        });
      })
      .catch(err => console.log(err));
  };

  // Standard input change controller
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

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

  // Inside the render function, isSelected returns a true or false depending on if a row is selected
  isSelected = key => {
    return this.state.selection.includes(key);
  };

  // editable react table
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
  };

  //  logs the selected row and the selection array to the console
  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };

  //  END - REACT-TABLE: SELECT TABLE HOC FUNCTION

  //  Update selected Row - sends current field info to db and updates that item
  updateSelectedRow = () => {
    //  extract variables from the selectedRow object
    const { category, condition, dailyRate, dateAcquired, maker, name, rate, sku, timesRented, _id } = this.state.selectedRow;

    // if rate exists (it should, but to avoid an error, checking first...) and hasn't been changed, it will have a dollar sign in it, a format that does not exist in the database and will throw an error if submitted to the database as-is. This replaces it with the current (unchanged) rate. If it has changed, it shouldn't have a $ in front of it and can be submitted as is.
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

  handleDropdownChange = event => {
    console.log(event.target.value);
    this.setState({ value: event.target.value });
    this.toggleModal();
    this.categoryModal();
  }

  //  Gets modal with the change category form - category is a limited set of options and can only be changed via dropdown, which doesn't seem to work in normal Select Table mode.
  categoryModal = () => {
    this.setModal({
      header: "Change Category",
      body:
        <Fragment>
          <form>
            {/* using the Select and Option components in a modal seems to make everything stop working... */}
            <div className="group group-select">
              <select
                name="category"
                label="Change Category:"
                // for some reason, setting the select value to this.state.category (as in the React docs) breaks the whole thing. It seems to be grabbing the value from the option html and putting that into state...
                onChange={this.handleInputChange}
              >
                <option></option>
                {this.props.categories.map(cat => (
                  <option key={cat._id} >{cat.category}</option>
                ))}
              </select>
              <Label htmlFor="category">Change Category</Label>
            </div>
            <FormBtn
              onClick={this.changeCategory}
            >
              Submit
            </FormBtn>
          </form>
        </Fragment>
    })
  }

  //  Submits changes made in category modal
  changeCategory = e => {
    e.preventDefault();
    const { _id } = this.state.selectedRow;
    API.adminUpdateRental(_id, { category: this.state.category })
      .then(res => {
        this.adminGetAllRentals();
        this.toggleModal();
      });
  }

  //  IMAGE CRUD OPERATIONS FUNCTIONS
  // Gets the modal with the image upload form
  getUploadModal = () => {
    this.setModal({
      header: "Upload an image",
      body:
        <Fragment>
          <h2>File Uploads</h2>
          {/* form encType must be set this way to take in a file */}
          <form encType="multipart/form-data">
            <Input
              type="file"
              name="file"
              label="Upload an image"
              onChange={this.fileSelectedHandler}
            />
            <FormBtn
              onClick={this.handleUpload}
            >
              Submit
          </FormBtn>
          </form>
        </Fragment>
    });
  }

  // the image chosen in the modal form is pushed into state (similar to handleInputChange function)
  fileSelectedHandler = event => {
    const newFile = event.target.files[0];
    console.log(newFile);
    this.setState({
      selectedFile: newFile
    });
  };

  //  When the submit button on the image upload modal is pressed, the image is uploaded into the db
  handleUpload = event => {
    event.preventDefault();
    //  the row must be selected (checkbox and highlighted) for this to work
    const { _id } = this.state.selectedRow;
    const fd = new FormData();
    fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
    API.uploadImage(_id, fd).then(res => {
      console.log(res);
      this.toggleModal();
      this.getUploadModal();
    });
  }

  // Gets image names from the db so they can be put into 'img' elements to be streamed for display
  getImageNames = () => {
    const { _id } = this.state.selectedRow;
    API.getImageNames(_id).then(res => {
      console.log(res);
      if (res.data.length === 0) {
        this.setModal({
          header: "Rental Images",
          body: <h3>No images to display</h3>
        });
      } else {
        this.getImageModal(res.data);
      }
    });
  }

  // Once image names have been retrieved, they are placed into img tags for display inside a modal
  getImageModal = images => {
    this.setImageModal({
      header: "Rental Images",
      body:
        <Fragment>
          {images.map(image => (
            <div className="rental-img-div">
              <p>Uploaded {Moment(image.uploadDate).format("MMM Do YYYY, h:mm a")}</p>
              <img className="rental-img" src={`file/image/${image.filename}`} alt="rental condition" />
              <button onClick={() => this.deleteImage(image._id)}>Delete</button>
            </div>
          ))}
        </Fragment>
    })
  }

  // Deletes an image, then closes the modal so when getImageNames toggles the modal, it will reopen it
  deleteImage = image => {
    const { _id } = this.state.selectedRow;
    API.deleteImage(image, _id)
      .then(res => {
        this.toggleImageModal();
        this.getImageNames();
      });
  }
  //  END - IMAGE CRUD OPERATIONS FUNCTIONS

  // See Reservations - functionality will be completed once calendar functions (Ben) are ready.
  seeReservations = () => {
    const { _id } = this.state.selectedRow;
    API.adminGetReservationsFromRental(_id)
      .then(res => {
        console.log(res);
        this.setState({ currentReservations: res.data.reservations });
      })
      .catch(err => console.log(err));
  }

  // See Past Rentals - functionality will be completed once calendar functions (Ben) are ready.
  seePastRentals = () => {
    const { _id } = this.state.selectedRow;
    API.adminGetRentalsById(_id)
      .then(res => {
        if (res.data.pastRentals.length > 0) {
          this.setModal({
            header: "Past Rentals",
            body:
              <Fragment>
                <ul>
                  {res.data.pastRentals.map((past, i) => (
                    <li key={i}>
                      <p>From: {past.from}</p>
                      <p>To: {past.to}</p>
                    </li>
                  ))}
                </ul>
              </Fragment>
          })
        } else {
          this.setModal({
            header: "Past Rentals",
            body: <h3>No past rentals to display</h3>
          })
        }
      })
      .catch(err => console.log(err));
  }


  render() {
    //  destructure from 'this' because the props object doesn't like 'this.anything' unless it's in a key:value pair
    const { toggleSelection, isSelected } = this;

    const checkboxProps = {
      isSelected,
      toggleSelection,
      selectType: "checkbox",
      getTrProps: (s, r) => {

        // If there are any empty rows ('r'), r.orignal will throw an error ('r' is undefined), so check for r:
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
        <ImageModal
          show={this.state.imageModal.isOpen}
          toggleImageModal={this.toggleImageModal}
          header={this.state.imageModal.header}
          body={this.state.imageModal.body}
          footer={this.state.imageModal.footer}
        />

        <h2>Rentals Table</h2>

        {/* if no rows have been selected, button remains disabled;
        otherwise, clicking the button without anything selected results in an error */}
        <button
          disabled={this.state.selection.length === 0}
          onClick={this.updateSelectedRow}>
          Update Selected Row
        </button>
        <button onClick={this.props.toggleRentals}>Hide Table</button>
        <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>

        <div className="table-btn-div">
          <button disabled={this.state.selection.length === 0} onClick={this.seeReservations}>See Current Reservations</button>
          <button disabled={this.state.selection.length === 0} onClick={this.seePastRentals}>See Past Rentals</button>
          <button disabled={this.state.selection.length === 0} onClick={this.getImageNames}>Get Images</button>
          <button disabled={this.state.selection.length === 0} onClick={this.getUploadModal}>Upload an Image</button>
        </div>

        <CheckboxTable
          // this ref prop is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object 
          ref={r => (this.checkboxTable = r)}
          data={this.state.rentals}
          filterable
          SubComponent={row => {
            //  thisReservation grabs the reservations from this.state.rentals that matches the row index - it grabs the reservations for this rental item.
            const thisRow = this.state.rentals[row.row._index];
            return (
              <ReservationsTable
                forName={thisRow.name}
                filterable
                reservations={thisRow.reservations}
                rentals={true}
                adminGetAllRentals={this.adminGetAllRentals}
              />
            )
          }}
          columns={[
            {
              Header: "Rental Info",
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
                    return <button className="table-btn-invis" onClick={this.categoryModal}>{row.value}</button>
                  }
                },
                {
                  Header: "Manufacturer",
                  accessor: "maker",
                  Cell: this.renderEditable
                },
                {
                  Header: "SKU",
                  accessor: "sku",
                  Cell: this.renderEditable
                },
              ]
            },
            {
              Header: "Rental Details",
              columns: [
                {
                  Header: "Daily Rate",
                  accessor: "rate",
                  Cell: this.renderEditable
                },
                {
                  Header: "Date Acq.",
                  accessor: "dateAcq",
                  Cell: this.renderEditable
                },
                {
                  Header: "Times Rented",
                  accessor: "timesRented",
                  Cell: this.renderEditable
                },
                {
                  Header: "Condition",
                  accessor: "condition",
                  Cell: this.renderEditable
                }
              ]
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          {...checkboxProps}
        />
      </Fragment>
    );
  }
}