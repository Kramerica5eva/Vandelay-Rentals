import React, { Component, Fragment } from 'react';
import { Input } from '../Elements/Form';
import ReactTable from 'react-table';
import Modal from '../../components/Elements/Modal';
import LoadingModal from '../../components/Elements/LoadingModal';
import ImageModal from '../../components/Elements/ImageModal';
import API from "../../utils/API";
import 'react-table/react-table.css';
import './AdminTables.css';
import dateFns from 'date-fns';

export class PastRentalsTable extends Component {
  state = {
    modal: {
      isOpen: false,
      body: '',
      buttons: ''
    },
    imageModal: {
      isOpen: false,
      body: ''
    },
    loadingModalOpen: false,
    fromUsers: this.props.fromUsers,
    runUnmount: false,
    pastRentals: this.props.pastRentals,
    images: [],
    selectedFile: null,
    image: null,
    note: ''
  };

  componentWillUnmount = () => {
    //  Why call get users on Unmount?
    //  Clicking cancelReservation runs all the necessary database functions to delete the reservation, but in this component it only filters it from the this.state.reservations array, meaning if you close the table and reopen it, the one you just deleted will still show. So by running the get user function when the component unmounts ensures this won't happen while also avoiding an extra database query with every deletion.
    if (this.state.runUnmount) {
      if (this.state.fromUsers) this.props.adminGetAllUsers();
      else this.props.adminGetAllRentals();
    }
  };

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
  };

  setModal = modalInput => {
    this.setState({
      modal: {
        isOpen: true,
        body: modalInput.body,
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
        body: modalInput.body,
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

  noteModal = row => {
    const { _id, note } = row._original;
    this.setModal({
      body:
        <Fragment>
          <textarea name="note" onChange={this.handleInputChange} rows="10" cols="80" defaultValue={note}></textarea>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={() => this.submitNote(_id)}>Submit</button>
          <button onClick={this.closeModal}>Nevermind</button>
        </Fragment>
    })
  }

  submitNote = id => {
    this.closeModal();
    this.toggleLoadingModal();
    API.adminUpdatePastRental(id, { note: this.state.note })
      .then(response => {
        setTimeout(this.toggleLoadingModal, 500);
        this.state.pastRentals.forEach(pr => {
          if (pr._id === id) pr.note = this.state.note;
          this.setState({ runUnmount: true })
        });
      })
      .catch(err => console.log(err));
  }

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
      buttons:
        <Fragment>
          <button onClick={() => this.handleImageUpload(row)}>Submit</button>
          <button onClick={this.closeModal}>I'm done</button>
        </Fragment>

    });
  };

  // the image chosen in the modal form is pushed into state (similar to handleInputChange function)
  fileSelectedHandler = event => {
    const newFile = event.target.files[0];
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

    const { _id } = row._original;
    const fd = new FormData();
    if (this.state.selectedFile) {
      fd.append('file', this.state.selectedFile, this.state.selectedFile.name);
      API.uploadPastRentalImage(_id, fd)
        .then(() => {
          this.setState({
            selectedFile: null
          })
          this.closeModal();
          this.getImageUploadModal(row);
        });
    } else {
      this.setModal({
        body: <h3>You have not selected a file to upload</h3>,
        buttons: <button onClick={() => this.getImageUploadModal(row)}>Try Again</button>
      })
    }
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
    API.getPastRentalImageNames(_id)
      .then(res => {
        if (res.data.length === 0) {
          setTimeout(this.setModal, 500, {
            body: <h3>No images to display</h3>,
            buttons: <button onClick={this.closeModal}>OK</button>
          });
        } else {
          this.closeModal();
          this.getImageModal(res.data, row);
        }
      });
  };

  // Once image names have been retrieved, they are placed into img tags for display inside a modal
  getImageModal = (images, row) => {
    this.setImageModal({
      body:
        <Fragment>
          {images.map(image => (
            <div key={image._id} className="rental-img-div">
              <p>Uploaded {dateFns.format(image.uploadDate, 'MMM Do YYYY hh:mm a')} </p>
              <img className="rental-img" src={`file/image/past/${image.filename}`} alt="rental condition" />
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
    API.deletePastRentalImage(image, _id).then(res => {
      this.toggleImageModal();
      this.getImageNames(row);
    });
  };
  //  END - IMAGE CRUD OPERATIONS FUNCTIONS

  render() {
    console.log(this.state.pastRentals);

    return (
      <Fragment>
        <Modal
          show={this.state.modal.isOpen}
          closeModal={this.closeModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <ImageModal
          show={this.state.imageModal.isOpen}
          toggleImageModal={this.toggleImageModal}
          body={this.state.imageModal.body}
        />
        <LoadingModal show={this.state.loadingModalOpen} />

        <h3>Past Rentals for {this.props.forName}</h3>

        <ReactTable
          data={this.state.pastRentals}
          columns={[
            {
              Header: 'Actions',
              columns: [
                {
                  Header: 'Item',
                  id: 'item',
                  width: 80,
                  Cell: row => {
                    return (
                      <div className="table-icon-div">
                        <div className="fa-sticky-note-div table-icon-inner-div">
                          <i onClick={() => this.noteModal(row.row)} className="table-icon far fa-sticky-note fa-lg"></i>
                          <span className="fa-sticky-note-tooltip table-tooltip">see/edit notes</span>
                        </div>
                      </div>
                    )
                  }
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
              Header: 'Customer',
              columns: [
                {
                  Header: 'First Name',
                  accessor: 'firstName',
                  width: 100
                },
                {
                  Header: 'Last Name',
                  accessor: 'lastName',
                  width: 100
                }
              ]
            },
            {
              Header: 'Reservation Data',
              columns: [
                {
                  Header: 'Item Name',
                  accessor: 'itemName'
                },
                {
                  Header: 'Date From',
                  accessor: "date.from",
                  width: 110,
                  Cell: row => {
                    return dateFns.format(row.value * 1000, "MMM Do YYYY")
                  }
                },
                {
                  Header: 'Date To',
                  accessor: "date.to",
                  width: 110,
                  Cell: row => {
                    return dateFns.format(row.value * 1000, "MMM Do YYYY")
                  }
                },
                {
                  Header: 'Amt Paid',
                  accessor: 'amtPaid.$numberDecimal',
                  Cell: row => {
                    return `$${parseFloat(row.value).toFixed(2)}`
                  }
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight sub-table"
        />
      </Fragment>
    );
  }
}
