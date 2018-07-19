import React, { Component, Fragment } from 'react';
import { Input } from '../Elements/Form';
import API from '../../utils/API';
import Modal from '../../components/Elements/Modal';
import LoadingModal from '../../components/Elements/LoadingModal';
import ImageModal from '../../components/Elements/ImageModal';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './AdminTables.css';
// import checkboxHOC from 'react-table/lib/hoc/selectTable';
import dateFns from 'date-fns';
import { ReservationsTable } from './ReservationsTable';
import { PastRentalsTable } from './PastRentalsTable';

// const CheckboxTable = checkboxHOC(ReactTable);

export class TestTable extends Component {
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
    images: [],
    selectedFile: null,
    image: null,
    rentals: [],
    selection: [],
    selectedRow: {},
    selected: null
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

  //  Changes rental condition to retire - offered as an alternative to deleting
  retireRental = row => {
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = row._original;
    API.adminUpdateRental(_id, { condition: 'Retired' })
      .then(() => {
        this.adminGetAllRentals();
        this.toggleLoadingModal();
      });
  };

  rentalDeleteModal = row => {
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
          <button onClick={() => this.retireRental(row)}>Retire it</button>
          <button onClick={() => this.deleteRental(row)}>Delete it</button>
        </Fragment>
    });
  };

  deleteRental = row => {
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = row._original;
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
        // this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  };

  //  IMAGE CRUD OPERATIONS FUNCTIONS
  // Gets the modal with the image upload form
  getImageUploadModal = row => {
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
      buttons: <button onClick={() => this.handleImageUpload(row)}>Submit</button>

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
  handleImageUpload = row => {
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
    const { _id } = row._original;
    const fd = new FormData();
    fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
    API.uploadImage(_id, fd).then(res => {
      console.log(res);
      this.toggleModal();
      this.getImageUploadModal(row);
    });
  };

  // Gets image names from the db so they can be put into 'img' elements to be streamed for display
  getImageNames = row => {
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
    const { _id } = row._original;
    API.getImageNames(_id).then(res => {
      console.log(res);
      if (res.data.length === 0) {
        setTimeout(this.setModal, 500, {
          body: <h4>No images to display</h4>
        });
      } else {
        this.toggleModal();
        this.getImageModal(res.data, row);
      }
    });
  };

  // Once image names have been retrieved, they are placed into img tags for display inside a modal
  getImageModal = (images, row) => {
    console.log(images)
    this.setImageModal({
      body:
        <Fragment>
          {images.map(image => (
            <div key={image._id} className="rental-img-div">
              <p>Uploaded {dateFns.format(image.uploadDate, 'MMM Do YYYY hh:mm a')} </p>
              <img className="rental-img" src={`file/image/${image.filename}`} alt="rental condition" />
              <button onClick={() => this.deleteImage(image._id, row)}>Delete</button>
            </div>
          ))}
        </Fragment>
    });
  };

  // Deletes an image, then closes the modal so when getImageNames toggles the modal, it will reopen it
  deleteImage = (image, row) => {
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
    const { _id } = row._original;
    API.deleteImage(image, _id).then(res => {
      this.toggleImageModal();
      this.getImageNames(row);
    });
  };
  //  END - IMAGE CRUD OPERATIONS FUNCTIONS

  //  Update selected Row - sends current field info to db and updates that item
  updateRow = row => {
    this.toggleLoadingModal();
    //  extract variables from the selectedRow object
    const { condition, dateAcquired, maker, name, rate, sku, timesRented, _id } = row._original;
    console.log(row);
    const unixDate = dateFns.format(dateAcquired, "X");
    let newCategory;
    if (this.state.category) newCategory = this.state.category;
    else newCategory = row._original.category;
    let newCondition;
    if (this.state.condition) newCondition = this.state.condition;
    else newCondition = row._original.condition;

    let newRate;
    if (rate)
      newRate = rate.split('').filter(x => x !== '$').join('');

    const updateObject = {
      category: newCategory,
      condition: newCondition,
      dateAcquired: unixDate,
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

  // editable react table for the date - allows for date formatting within the cell
  renderEditableDate = cellInfo => {
    return (
      <div
        // style={{ backgroundColor: '#aff0ca' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const rentals = [...this.state.rentals];
          rentals[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ rentals: rentals });
        }}
        dangerouslySetInnerHTML={{
          __html: dateFns.format(this.state.rentals[cellInfo.index][cellInfo.column.id] * 1000, 'MMM Do YYYY')
        }}
      />
    );
  };

  // editable react table
  renderEditable = cellInfo => {
    return (
      <div
        // style={{ backgroundColor: '#aff0ca' }}
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
        <div className="main-table-container test-table">
          <div className="table-title-div">
            <h2>Test Rentals Table <button onClick={this.props.toggleRentals}>hide table</button></h2>
          </div>

          <ReactTable
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
                Header: 'Row Actions',
                columns: [
                  {
                    Header: 'Item',
                    id: 'item',
                    Cell: row => {
                      return (
                        <div className="table-icon-div">
                          <div className="fa-sync-div table-icon-inner-div">
                            <i onClick={() => this.updateRow(row.row)} className="table-icon fas fa-sync fa-lg"></i>
                            <span className="fa-sync-tooltip table-tooltip">upload changes</span>
                          </div>
                          <div className="fa-trash-alt-div table-icon-inner-div">
                            <i onClick={() => this.rentalDeleteModal(row.row)} className="table-icon fas fa-trash-alt fa-lg"></i>
                            <span className="fa-trash-alt-tooltip table-tooltip">delete record</span>
                          </div>
                        </div>
                      )
                    },
                    width: 80
                  },
                  {
                    Header: 'Images',
                    id: 'images',
                    Cell: row => {
                      return (
                        <div className="table-icon-div">
                          <div className="fa-upload-div table-icon-inner-div">
                            <i onClick={() => this.getImageUploadModal(row.row)} className="table-icon fas fa-upload fa-lg"></i>
                            <span className="fa-upload-tooltip table-tooltip">upload images</span>
                          </div>
                          <div className="fa-images-div table-icon-inner-div">
                            <i onClick={() => this.getImageNames(row.row)} className="table-icon fas fa-images fa-lg"></i>
                            <span className="fa-images-tooltip table-tooltip">see images</span>
                          </div>
                        </div>
                      )
                    },
                    width: 80
                  },
                ]
              },
              {
                Header: 'Rental Info',
                columns:
                  [
                    {
                      Header: 'Name',
                      accessor: 'name',
                      Cell: this.renderEditable
                    },
                    {
                      Header: 'Type',
                      accessor: 'category',
                      width: 115,
                      Cell: row => {
                        return (
                          <Fragment>
                            <form>
                              {/* using the Select and Option components in a modal seems to make everything stop working... */}
                              <div className="table-select">
                                <select
                                  name="category"
                                  // for whatever reason, setting the select value to this.state.category (as in the React docs) does not work with select/option dropdowns...
                                  onChange={this.handleInputChange}
                                >
                                  <option>{row.row.category}</option>
                                  {this.state.categories ? this.state.categories.map(cat => (
                                    <option key={cat._id}>{cat.category}</option>
                                  )) : null}
                                </select>
                              </div>
                            </form>
                          </Fragment>
                        )
                      }
                    },
                    {
                      Header: 'Mfr.',
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
                    Header: 'Rate',
                    accessor: 'rate',
                    width: 70,
                    Cell: this.renderEditable
                  },
                  {
                    Header: 'Date Acq.',
                    accessor: "dateAcquired",
                    Cell: this.renderEditableDate,
                  },
                  {
                    Header: 'x Rented',
                    accessor: 'timesRented',
                    Cell: this.renderEditable
                  },
                  {
                    Header: 'Condition',
                    accessor: 'condition',
                    width: 85,
                    Cell: row => {
                      return (
                        <Fragment>
                          <form>
                            {/* using the Select and Option components in a modal seems to make everything stop working... */}
                            <div className="table-select">
                              <select
                                name="condition"
                                // for some reason, setting the value={this.state.whatever} in a modal doesn't work. The onChange still updates state, but the input (dropdown) is uncontrolled.
                                onChange={this.handleInputChange}
                              >
                                <option>{row.row.condition}</option>
                                <option>New</option>
                                <option>Good</option>
                                <option>Working</option>
                                <option>Disrepair</option>
                                <option>Retired</option>
                              </select>
                            </div>
                          </form>
                        </Fragment>
                      )
                    }
                  }
                ]
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          // {...checkboxProps}
          />
        </div>
      </Fragment>
    );
  }
}
