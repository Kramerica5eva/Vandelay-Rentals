import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import ReactTable from "react-table";
import { RegistrationsTable } from "./RegistrationsTable";
import "react-table/react-table.css";
import "./AdminTables.css";
import dateFns from "date-fns";

export class CoursesTable extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    courses: [],
    level: "",
    note: '',
    topics: '',
    summary: '',
    description: ''
  };

  componentDidMount() {
    this.adminGetAllCourses();
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
    this.setState({ modal: { isOpen: false } });
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

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoign
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

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
    API.adminUpdateCourse(id, { note: this.state.note })
      .then(response => {
        setTimeout(this.toggleLoadingModal, 500);
        this.state.courses.forEach(pr => {
          if (pr._id === id) pr.note = this.state.note;
          this.setState({ runUnmount: true })
        });
      })
      .catch(err => console.log(err));
  }

  //  Get all courses from the database and set state so the table will display
  adminGetAllCourses = () => {
    API.adminGetAllCourses()
      .then(res => {
        res.data.forEach(r => {
          r.pricePer = parseFloat(r.price.$numberDecimal);
          // r.date = dateFns.format(r.date * 1000, "MMM Do YYYY");
          if (r.registrations.length) {
            r.openSlots = r.slots - r.registrations.length;
          } else {
            r.openSlots = r.slots;
          }
        });
        this.setState({
          courses: res.data
        });
      })
      .catch(err => console.log(err));
  };

  //  Course delete modal
  courseDeleteModal = row => {
    if (row._original.registrations.length > 0) {
      this.setModal({
        body: <h3>You must remove all class registrations first.</h3>,
        buttons: <button onClick={this.closeModal}>OK</button>
      });
    } else {
      this.setModal({
        body:
          <Fragment>
            <h4>Are you sure you want to delete {row.name}?</h4>
            <p>(this is permenent - you cannot undo it and you will lose all data)</p>
          </Fragment>,
        buttons:
          <Fragment>
            <button onClick={this.closeModal}>Nevermind</button>
            <button onClick={() => this.deleteCourse(row)}>Delete it</button>
          </Fragment>
      })
    }
  }

  // Course delete function
  deleteCourse = row => {
    this.closeModal();
    this.toggleLoadingModal();
    const { _id } = row._original
    API.adminDeleteCourse(_id)
      .then(res => {
        this.adminGetAllCourses();
        this.toggleLoadingModal();
        this.closeModal();
      })
      .catch(err => console.log(err));
  }

  noteModal = row => {
    const { _id, note } = row._original;
    this.setModal({
      body:
        <Fragment>
          <h3>Update Note</h3>
          <textarea name="note" onChange={this.handleInputChange} rows="10" defaultValue={note}></textarea>
        </Fragment>,
      buttons: <button onClick={() => this.submitNote(_id)}>Submit</button>
    })
  }

  submitNote = id => {
    this.closeModal();
    this.toggleLoadingModal();
    API.adminUpdateCourse(id, { note: this.state.note })
      .then(response => {
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>,
          buttons: <button onClick={this.closeModal}>OK</button>
        });
        //  query the db and reload the table
        this.adminGetAllCourses();
      })
      .catch(err => console.log(err));
  }

  topicsModal = row => {
    const { _id, topics } = row._original;
    const topicsString = topics.join(", ");
    this.setModal({
      body:
        <Fragment>
          <h3>Course Topics</h3>
          <textarea name="topics" onChange={this.handleInputChange} rows="4" defaultValue={topicsString}></textarea>
        </Fragment>,
      buttons: <button onClick={() => this.submitTopics(_id)}>Submit</button>
    })
  }

  submitTopics = id => {
    this.closeModal();
    this.toggleLoadingModal();
    const topicsArray = this.state.topics.split(", ");
    API.adminUpdateCourse(id, { topics: topicsArray })
      .then(response => {
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>,
          buttons: <button onClick={this.closeModal}>OK</button>
        });
        //  query the db and reload the table
        this.adminGetAllCourses();
      })
      .catch(err => console.log(err));
  }

  summaryModal = row => {
    const { _id, summary } = row._original;
    this.setModal({
      body:
        <Fragment>
          <h3>Course Summary</h3>
          <textarea name="summary" onChange={this.handleInputChange} rows="2" defaultValue={summary}></textarea>
        </Fragment>,
      buttons: <button onClick={() => this.submitSummary(_id, this.state.summary)}>Submit</button>
    });
  }

  submitSummary = id => {
    this.closeModal();
    this.toggleLoadingModal();
    API.adminUpdateCourse(id, { summary: this.state.summary })
      .then(response => {
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>,
          buttons: <button onClick={this.closeModal}>OK</button>
        });
        //  query the db and reload the table
        this.adminGetAllCourses();
      })
      .catch(err => console.log(err));
  }

  descriptionModal = row => {
    const { _id, description } = row._original;
    this.setModal({
      body:
        <Fragment>
          <h3>Course Description</h3>
          <textarea name="description" onChange={this.handleInputChange} rows="10" defaultValue={description}></textarea>
        </Fragment>,
      buttons: <button onClick={() => this.submitDescription(_id, this.state.description)}>Submit</button>
    });
  }

  submitDescription = id => {
    this.closeModal();
    this.toggleLoadingModal();
    API.adminUpdateCourse(id, { description: this.state.description })
      .then(response => {
        //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
        setTimeout(this.toggleLoadingModal, 500);
        // success modal after the loading modal is gone.
        setTimeout(this.setModal, 500, {
          body: <h3>Database successfully updated</h3>,
          buttons: <button onClick={this.closeModal}>OK</button>
        });
        //  query the db and reload the table
        this.adminGetAllCourses();
      })
      .catch(err => console.log(err));
  }

  //  Update selected Row - sends current field info to db and updates that item
  updateRow = row => {
    const { name, pricePer, level, date, slots, _id } = row._original;

    let unixDate;
    if (typeof date === "string") unixDate = dateFns.format(date, "X");
    else unixDate = dateFns.format(date * 1000, "X");

    if (date.length < 6 || unixDate === "Invalid Date") {
      return this.setModal({
        body:
          <Fragment>
            <h4>Please enter a valid date format</h4>
            <p>(e.g. '01/25/2016' or 'Dec 14 2012')</p>
          </Fragment>,
        buttons: <button onClick={this.closeModal}>OK</button>
      })
    }
    //  wait until here to trigger the loading modal - after the date has been validated - otherwise, the loadingmodal must be closed again inside the "if (dateAcquired.length...)" block, and the timing is such that the loading modal just ends up staying open.
    this.toggleLoadingModal();

    // if pricePer exists (it should, but to avoid an error, checking first...) and it hasn't been changed, it will be a number type because the formatting occurs in the renderEditablePrice function (the actual value remains a number type until it is changed) and so the .split method doesn't exist (that's a string method)
    let newPrice;
    if (pricePer) {
      if (typeof pricePer === "string") newPrice = pricePer.split("").filter(x => x !== "$").join("");
      else newPrice = pricePer;
    }

    let newLevel;
    if (this.state.level) newLevel = this.state.level;
    else newLevel = level;

    const updateObject = {
      name: name,
      date: unixDate,
      level: newLevel,
      price: newPrice,
      slots: slots
    };

    API.adminUpdateCourse(_id, updateObject)
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
          this.adminGetAllCourses();
        }
      })
      .catch(err => console.log(err));
  };

  // editable react table function
  renderEditablePrice = cellInfo => {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const courses = [...this.state.courses];
          courses[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ courses: courses });
        }}
        dangerouslySetInnerHTML={{
          __html: (
            //  When you enter a new price that includes anything other than digits (e.g. a dollar sign)
            //  It renders as 'NaN', which shows in the cell for just a second before the change
            //  So, if the cell includes 'NaN', just render what's already in the cell
            //  Otherwise, display the formatted price.
            `$${parseFloat(this.state.courses[cellInfo.index][cellInfo.column.id]).toFixed(2)}`.includes('NaN')
              ?
              this.state.courses[cellInfo.index][cellInfo.column.id]
              :
              `$${parseFloat(this.state.courses[cellInfo.index][cellInfo.column.id]).toFixed(2)}`
          )
        }}
      />
    );
  };

  // editable react table for the date - allows for date formatting within the cell
  renderEditableDate = cellInfo => {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const courses = [...this.state.courses];
          courses[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ courses: courses });
        }}
        dangerouslySetInnerHTML={{
          //  When you enter a new date that's not in unix time, the below format renders it as "Invalid Date"
          //  As a result, in the split second before the database updates, the field says "Invalid Date"
          //  So, if invalid date, just display what's being typed in. Otherwise, display the formatted version.
          __html: (
            dateFns.format(this.state.courses[cellInfo.index][cellInfo.column.id] * 1000, 'MMM Do YYYY') === "Invalid Date"
              ?
              this.state.courses[cellInfo.index][cellInfo.column.id]
              :
              dateFns.format(this.state.courses[cellInfo.index][cellInfo.column.id] * 1000, 'MMM Do YYYY'))
        }}
      />
    );
  };

  // editable react table function
  renderEditable = cellInfo => {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const courses = [...this.state.courses];
          courses[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ courses: courses });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.courses[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  };

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
        <div className="main-table-container courses-table">

          <div className="table-title-div">
            <h2>Classes Table <button onClick={this.props.toggleCourses}>Hide Table</button></h2>
          </div>

          <ReactTable
            data={this.state.courses}
            filterable
            SubComponent={row => {
              //  thisReservation grabs the reservations from this.state.courses that matches the row index - it grabs the registrations for this course.
              const thisRow = this.state.courses[row.row._index];
              return (
                <div className="sub-table-container">
                  {thisRow.registrations.length > 0 ? (
                    <RegistrationsTable
                      forName={thisRow.name}
                      filterable
                      fromUsers={false}
                      registrations={thisRow.registrations}
                      adminGetAllCourses={this.adminGetAllCourses}
                    />
                  ) : null}
                </div>
              )
            }}
            columns={[
              {
                Header: 'Actions',
                columns: [
                  {
                    Header: 'Item',
                    id: 'item',
                    width: 110,
                    Cell: row => {
                      return (
                        <div className="table-icon-div">
                          <div className="fa-sync-div table-icon-inner-div">
                            <i onClick={() => this.updateRow(row.row)} className="table-icon fas fa-sync fa-lg"></i>
                            <span className="fa-sync-tooltip table-tooltip">upload changes</span>
                          </div>
                          <div className="fa-trash-alt-div table-icon-inner-div">
                            <i onClick={() => this.courseDeleteModal(row.row)} className="table-icon fas fa-trash-alt fa-lg"></i>
                            <span className="fa-trash-alt-tooltip table-tooltip">delete class</span>
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
                Header: 'Class Details',
                columns: [
                  {
                    Header: "More Info",
                    accessor: "",
                    width: 140,
                    Cell: row => {
                      return (
                        <div className="table-icon-div">
                          <div className="fa-list-ul-div table-icon-inner-div">
                            <i onClick={() => this.topicsModal(row.row)} className="table-icon fas fa-list-ul fa-lg"></i>
                            <span className="fa-list-ul-tooltip table-tooltip">see/edit topics</span>
                          </div>
                          <div className="fa-comment-alt-div table-icon-inner-div">
                            <i onClick={() => this.summaryModal(row.row)} className="table-icon far fa-comment-alt fa-lg"></i>
                            <span className="fa-comment-alt-tooltip table-tooltip">see/edit summary</span>
                          </div>
                          <div className="fa-book-open-div table-icon-inner-div">
                            <i onClick={() => this.descriptionModal(row.row)} className="table-icon fas fa-book-open fa-lg"></i>
                            <span className="fa-book-open-tooltip table-tooltip">see/edit description</span>
                          </div>
                        </div>

                      )
                    }
                  }
                ]
              },
              {
                Header: 'Class Info',
                columns: [
                  {
                    Header: "Name",
                    accessor: "name",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Date",
                    accessor: "date",
                    Cell: this.renderEditableDate
                  },
                  {
                    Header: "Difficulty",
                    accessor: "level",
                    Cell: row => {
                      return (
                        <Fragment>
                          <form>
                            <div className="table-select">
                              <select
                                name="level"
                                onChange={this.handleInputChange}
                              >
                                <option>{row.row.level}</option>
                                {row.row.level !== "Advanced" ? <option>Advanced</option> : null}
                                {row.row.level !== "Intermediate" ? <option>Intermediate</option> : null}
                                {row.row.level !== "Beginner" ? <option>Beginner</option> : null}
                              </select>
                            </div>
                          </form>
                        </Fragment>
                      )
                    }
                  },
                  {
                    Header: "Price",
                    accessor: "pricePer",
                    width: 80,
                    Cell: this.renderEditablePrice
                  },
                  {
                    Header: "Slots",
                    accessor: "slots",
                    width: 70,
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Open",
                    accessor: "openSlots",
                    width: 70
                  }
                ]
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        </div>
      </Fragment>
    );
  }
}