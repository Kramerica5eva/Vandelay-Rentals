import React, { Component, Fragment } from 'react';
import { Input } from '../Elements/Form';
import API from '../../utils/API';
import Modal from '../../components/Elements/Modal';
import LoadingModal from '../../components/Elements/LoadingModal';
import ImageModal from '../../components/Elements/ImageModal';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './AdminTables.css';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import dateFns from 'date-fns';
import { ReservationsTable } from './ReservationsTable';
import { PastRentalsTable } from './PastRentalsTable';

const CheckboxTable = checkboxHOC(ReactTable);

export class RentalsTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: '',
      body: '',
      footer: '',
      buttons: ''
    },
    imageModal: {
      isOpen: false,
      header: '',
      body: '',
      footer: ''
    },
    loadingModalOpen: false,
    currentReservations: null,
    categories: this.props.categories,
    category: '',
    condition: '',
    date: "",
    images: [],
    selectedFile: null,
    image: null,
    rentals: [],
    selection: [],
    selectedRow: {}
  };

  componentDidMount = () => {
    this.adminGetAllRentals();
  };

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
  };

  setModal = modalInput => {
    this.setState({
      modal: {
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer,
        buttons: modalInput.buttons
      }
    });
  };
  // END MODAL TOGGLE FUNCTIONS

  // IMAGEMODAL TOGGLE FUNCTIONS
  toggleImageModal = () => {
    this.setState({
      imageModal: { isOpen: !this.state.imageModal.isOpen }
    });
  };

  setImageModal = modalInput => {
    this.setState({
      imageModal: {
        isOpen: true,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  };
  // END IMAGEMODAL TOGGLE FUNCTIONS

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoing
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  };

  // Get rentals and set state so the table will display
  adminGetAllRentals = () => {
    API.adminGetAllRentals()
      .then(res => {
        console.log(res.data);

        //  loop through the response array and add a new key/value pair with the formatted rate
        res.data.forEach(r => {
          r.rate = '$' + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
        });
        // set state for rentals, but also empty selection - selection is where the selected (highlighted) row _id is kept. This unselects the row - when a row is selected and the data is updated, it calls this function (adminGetAllRentals), and emptying this.state.selected results in unselecting the row, which works as a visual cue that an update operation is complete.
        this.setState({
          rentals: res.data,
          selection: [],
          selectedRow: {}
        });
      })
      .catch(err => console.log(err));
  };

  //  Gets modal with the change category form - category is a limited set of options and can only be changed via dropdown, which doesn't seem to work in normal Select Table mode.
  rentalCategoryModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Category</h3>
            {/* using the Select and Option components in a modal seems to make everything stop working... */}
            <div className="group group-select">
              <select
                name="category"
                // for whatever reason, setting the select value to this.state.category (as in the React docs) does not work with select/option dropdowns...
                onChange={this.handleInputChange}
              >
                <option />
                {this.state.categories ? this.state.categories.map(cat => (
                  <option key={cat._id}>{cat.category}</option>
                )) : null}
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeRentalCategory}>Submit</button>

    });
  };

  //  Submits changes made in category modal
  changeRentalCategory = e => {
    this.toggleModal();
    this.toggleLoadingModal();
    e.preventDefault();
    const { _id } = this.state.selectedRow;
    API.adminUpdateRental(_id, { category: this.state.category }).then(res => {
      this.adminGetAllRentals();
      this.toggleLoadingModal();
    });
  };

  //  RENTAL UPDATE MODALS W/UPDATE FUNCTIONS
  //  Rental Date update modal
  //  Changing Rental date in a modal because:
  //  a) If the date is formatted before going into the table, then the table sort functions end up sorting the date alphabetically, which of course isn't useful.
  //  b) To format the date in the table cell prevents passing in the renderEditable function
  rentalDateModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Date</h3>
            <Input
              onChange={this.handleInputChange}
              name="date"
              type="text"
              placeholder="e.g. Dec 20th 2018"
            />
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeRentalDate}>Submit</button>
    });
  }

  // Rental date update function
  changeRentalDate = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    console.log(this.state.date);
    const unixDate = dateFns.format(this.state.date, "X");
    API.adminUpdateRental(_id, { dateAcquired: unixDate })
      .then(res => {
        this.adminGetAllRentals();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  //  Gets modal with the change condition form - condition is a limited set of options and can only be changed via dropdown, which doesn't seem to work in normal Select Table mode.
  rentalConditionModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Condition</h3>
            {/* using the Select and Option components in a modal seems to make everything stop working... */}
            <div className="group group-select">
              <select
                name="condition"
                // for some reason, setting the value={this.state.whatever} in a modal doesn't work. The onChange still updates state, but the input (dropdown) is uncontrolled.
                onChange={this.handleInputChange}
              >
                <option />
                <option>New</option>
                <option>Good</option>
                <option>Working</option>
                <option>Disrepair</option>
                <option>Retired</option>
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeRentalCondition}>Submit</button>

    });
  };

  //  Submits changes made in condition modal
  changeRentalCondition = e => {
    this.toggleModal();
    this.toggleLoadingModal();
    e.preventDefault();
    const { _id } = this.state.selectedRow;
    API.adminUpdateRental(_id, { condition: this.state.condition }).then(
      res => {
        this.adminGetAllRentals();
        this.toggleLoadingModal();
      }
    );
  };

  //  Changes rental condition to retire - offered as an alternative to deleting
  retireRental = () => {
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    API.adminUpdateRental(_id, { condition: 'Retired' }).then(res => {
      this.adminGetAllRentals();
      this.toggleLoadingModal();
    });
  };

  rentalDeleteModal = () => {
    this.setModal({
      body:
        <Fragment>
          <h3>Warning!</h3>
          <h4>Are you sure you want to delete {this.state.selectedRow.name}?</h4>
          <p>(this is permenent - you cannot undo it, and you will lose all data)</p>
          <h4>Would you rather retire the item and keep the data?</h4>
          <p>(make sure you contact customers and change any existing reservations)</p>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={this.toggleModal}>Nevermind</button>
          <button onClick={this.retireRental}>Retire it</button>
          <button onClick={this.deleteRental}>Delete it</button>
        </Fragment>
    });
  };

  deleteRental = event => {
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    API.adminDeleteRentalItem(_id)
      .then(res => {
        console.log(res);
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>
        });
        //  query the db and reload the table
        this.adminGetAllRentals();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  };

  //  IMAGE CRUD OPERATIONS FUNCTIONS
  // Gets the modal with the image upload form
  getImageUploadModal = () => {
    this.setModal({
      body:
        <Fragment>
          <h3>Upload An Image</h3>
          {/* form encType must be set this way to take in a file */}
          <form encType="multipart/form-data">
            <Input
              type="file"
              name="file"
              onChange={this.fileSelectedHandler}
            />
          </form>
        </Fragment>,
      buttons: <button onClick={this.handleImageUpload}>Submit</button>

    });
  };

  // the image chosen in the modal form is pushed into state (similar to handleInputChange function)
  fileSelectedHandler = event => {
    const newFile = event.target.files[0];
    console.log(newFile);
    this.setState({
      selectedFile: newFile
    });
  };

  //  When the submit button on the image upload modal is pressed, the image is uploaded into the db
  handleImageUpload = event => {
    event.preventDefault();
    this.setModal({
      body:
        <Fragment>
          <h3>Loading...</h3>
          <img
            style={{ width: '50px', display: 'block', margin: '50px auto' }}
            src="./../../../loading.gif"
            alt="spinning gears"
          />
        </Fragment>
    });
    //  the row must be selected (checkbox and highlighted) for this to work
    const { _id } = this.state.selectedRow;
    const fd = new FormData();
    fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
    API.uploadImage(_id, fd).then(res => {
      console.log(res);
      this.toggleModal();
      this.getImageUploadModal();
    });
  };

  // Gets image names from the db so they can be put into 'img' elements to be streamed for display
  getImageNames = () => {
    this.setModal({
      body:
        <Fragment>
          <h3>Loading...</h3>
          <img
            style={{ width: '50px', display: 'block', margin: '50px auto' }}
            src="./../../../loading.gif"
            alt="spinning gears"
          />
        </Fragment>
    });
    const { _id } = this.state.selectedRow;
    API.getImageNames(_id).then(res => {
      console.log(res);
      if (res.data.length === 0) {
        setTimeout(this.setModal, 500, {
          body: <h4>No images to display</h4>
        });
      } else {
        this.toggleModal();
        this.getImageModal(res.data);
      }
    });
  };

  // Once image names have been retrieved, they are placed into img tags for display inside a modal
  getImageModal = images => {
    this.setImageModal({
      header: 'Rental Images',
      body: (
        <Fragment>
          {images.map(image => (
            <div className="rental-img-div">
              <p>Uploaded {dateFns.format(image.uploadDate, 'MMM Do YYYY hh:mm a')} </p>
              <img className="rental-img" src={`file/image/${image.filename}`} alt="rental condition" />
              <button onClick={() => this.deleteImage(image._id)}>Delete</button>
            </div>
          ))}
        </Fragment>
      )
    });
  };

  // Deletes an image, then closes the modal so when getImageNames toggles the modal, it will reopen it
  deleteImage = image => {
    this.setModal({
      body:
        <Fragment>
          <h3>Loading...</h3>
          <img
            style={{ width: '50px', display: 'block', margin: '50px auto' }}
            src="./../../../loading.gif"
            alt="spinning gears"
          />
        </Fragment>
    });
    const { _id } = this.state.selectedRow;
    API.deleteImage(image, _id).then(res => {
      this.toggleImageModal();
      this.getImageNames();
    });
  };
  //  END - IMAGE CRUD OPERATIONS FUNCTIONS

  //  Update selected Row - sends current field info to db and updates that item
  updateSelectedRow = () => {
    this.toggleLoadingModal();
    //  extract variables from the selectedRow object
    const { category, condition, dateAcquired, maker, name, rate, sku, timesRented, _id } = this.state.selectedRow;

    let newRate;
    if (rate)
      newRate = rate.split('').filter(x => x !== '$').join('');

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
          //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
          setTimeout(this.toggleLoadingModal, 500);
          // success modal after the loading modal is gone.
          setTimeout(this.setModal, 500, {
            body: <h4>Database successfully updated</h4>
          });
          //  query the db and reload the table
          this.adminGetAllRentals();
        }
      })
      .catch(err => console.log(err));
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

  //  logs the selected row and the selection array to the console
  logSelection = () => {
    console.log('Selection:', this.state.selection);
    console.log('Row: ', this.state.selectedRow);
  };
  //  END REACT-TABLE: SELECT TABLE HOC FUNCTIONs

  // editable react table
  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: '#fafafa' }}
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

  render() {
    //  destructure from 'this' because the props object doesn't like 'this.anything' unless it's in a key:value pair
    const { toggleSelection, isSelected } = this;

    const checkboxProps = {
      isSelected,
      toggleSelection,
      selectType: 'checkbox',
      getTrProps: (s, r) => {
        // If there are any empty rows ('r'), r.orignal will throw an error ('r' is undefined), so check for r:
        let selected;
        if (r) selected = this.isSelected(r.original._id);
        return {
          style: {
            backgroundColor: selected ? 'yellow' : 'inherit',
            color: selected ? '#000' : 'inherit'
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
        <ImageModal
          show={this.state.imageModal.isOpen}
          toggleImageModal={this.toggleImageModal}
          header={this.state.imageModal.header}
          body={this.state.imageModal.body}
          footer={this.state.imageModal.footer}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <div className="main-table-container">
          <div className="table-title-div">
            <h2>
              Rentals Table{' '}
              <button onClick={this.props.toggleRentals}>hide table</button>
            </h2>
          </div>

          {/* if no rows have been selected, buttons remain disabled;
            else clicking the button without anything selected would result in an error */}
          <div className="table-btn-div">
            <h4>Rentals Table Options</h4>
            <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected</button>
            <button disabled={this.state.selection.length === 0} onClick={this.rentalDateModal}>Change Date</button>
            <button disabled={this.state.selection.length === 0} onClick={this.rentalCategoryModal}>Change Category</button>
            <button disabled={this.state.selection.length === 0} onClick={this.rentalConditionModal}>Change Condition</button>
            <button disabled={this.state.selection.length === 0} onClick={this.rentalDeleteModal}>Delete</button>
            <button disabled={this.state.selection.length === 0} onClick={this.getImageNames}>Get Images</button>
            <button disabled={this.state.selection.length === 0} onClick={this.getImageUploadModal}>Upload an Image</button>
            <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
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
                <Fragment>
                  {thisRow.reservations.length > 0 ? (
                    <ReservationsTable
                      forName={thisRow.name}
                      filterable
                      reservations={thisRow.reservations}
                      rentals={true}
                      adminGetAllRentals={this.adminGetAllRentals}
                    />
                  ) : null}

                  {thisRow.pastRentals.length > 0 ? (
                    <PastRentalsTable
                      forName={thisRow.name}
                      filterable
                      pastRentals={thisRow.pastRentals}
                      rentals={true}
                      adminGetAllRentals={this.adminGetAllRentals}
                    />
                  ) : null}
                </Fragment>
              );
            }}
            columns={[
              {
                Header: 'Rental Info',
                columns: [
                  {
                    Header: 'Name',
                    accessor: 'name',
                    Cell: this.renderEditable
                  },
                  {
                    Header: 'Category',
                    accessor: 'category'
                  },
                  {
                    Header: 'Manufacturer',
                    accessor: 'maker',
                    Cell: this.renderEditable
                  },
                  {
                    Header: 'SKU',
                    accessor: 'sku',
                    Cell: this.renderEditable
                  }
                ]
              },
              {
                Header: 'Rental Details',
                columns: [
                  {
                    Header: 'Daily Rate',
                    accessor: 'rate',
                    Cell: this.renderEditable
                  },
                  {
                    Header: 'Date Acq.',
                    accessor: 'dateAcquired',
                    Cell: row => {
                      return dateFns.format(row.row.dateAcquired * 1000, 'MMM Do YYYY')
                    }
                  },
                  {
                    Header: 'Times Rented',
                    accessor: 'timesRented',
                    Cell: this.renderEditable
                  },
                  {
                    Header: 'Condition',
                    accessor: 'condition'
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
