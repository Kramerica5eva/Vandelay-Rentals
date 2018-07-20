import React, { Component, Fragment } from "react";
import { Input } from "../Elements/Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import ReactTable from "react-table";
import { RegistrationsTable } from "./RegistrationsTable";
import "react-table/react-table.css";
import "./AdminTables.css";
import dateFns from "date-fns";

export class TestTable extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    courses: [],
    level: ""
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
  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
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

  //  Toggles a non-dismissable loading modal to prevent clicks while database ops are ongoign
  toggleLoadingModal = () => {
    this.setState({
      loadingModalOpen: !this.state.loadingModalOpen
    });
  }

  //  Get all courses from the database and set state so the table will display
  adminGetAllCourses = () => {
    API.adminGetAllCourses()
      .then(res => {
        res.data.forEach(r => {
          r.pricePer = "$" + parseFloat(r.price.$numberDecimal).toFixed(2);
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
    this.setModal({
      body:
        <Fragment>
          <h4>Are you sure you want to delete {row.name}?</h4>
          <p>(this is permenent - you cannot undo it, and you will lose all data)</p>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={this.toggleModal}>Nevermind</button>
          <button onClick={() => this.deleteCourse(row)}>Delete it</button>
        </Fragment>
    })
  }

  // Course delete function
  deleteCourse = row => {
    console.log(row);
    if (row._original.registrations.length > 0) {
      this.setModal({
        body: <h4>You must remove all class registrations first.</h4>,
        buttons: <button onClick={this.toggleModal}>OK</button>
      });
    } else {
      this.toggleLoadingModal();
      const { _id } = row._original
      API.adminDeleteCourse(_id)
        .then(res => {
          console.log(res)
          this.adminGetAllCourses();
          this.toggleLoadingModal();
          this.toggleModal();
        })
        .catch(err => console.log(err));
    }
  }

  //  Update selected Row - sends current field info to db and updates that item
  updateRow = row => {
    this.toggleLoadingModal()
    const { name, pricePer, abstract, topics, date, slots, _id } = row._original;

    // if pricePer exists (it should, but to avoid an error, checking first...) and hasn't been changed, it will have a dollar sign in it, a format that does not exist in the database and will throw an error if submitted to the database as-is. This removes the '$' before submitting.
    let newPrice;
    if (pricePer)
      newPrice = pricePer.split("").filter(x => x !== "$").join("");

    const updateObject = {
      name: name,
      price: newPrice,
      abstract: abstract,
      topics: topics,
      date: date,
      slots: slots
    };

    API.adminUpdateCourse(_id, updateObject)
      .then(response => {
        if (response.status === 200) {
          //  keep the loading modal up for at least .5 seconds, otherwise it's just a screen flash and looks like a glitch.
          setTimeout(this.toggleLoadingModal, 500);
          // success modal after the loading modal is gone.
          setTimeout(this.setModal, 500, {
            body: <h4>Database successfully updated</h4>
          });
          //  query the db and reload the table
          this.adminGetAllCourses();
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
          toggleModal={this.toggleModal}
          body={this.state.modal.body}
          buttons={this.state.modal.buttons}
        />
        <LoadingModal show={this.state.loadingModalOpen} />
        <div className="main-table-container">

          <div className="table-title-div">
            <h2>Courses Table <button onClick={this.props.toggleCourses}>Hide Table</button></h2>
          </div>

          <ReactTable
            data={this.state.courses}
            filterable
            SubComponent={row => {
              //  thisReservation grabs the reservations from this.state.courses that matches the row index - it grabs the registrations for this course.
              const thisRow = this.state.courses[row.row._index];
              return (
                <Fragment>
                  {thisRow.registrations.length > 0 ? (
                    <RegistrationsTable
                      forName={thisRow.name}
                      filterable
                      fromUsers={false}
                      registrations={thisRow.registrations}
                      adminGetAllCourses={this.adminGetAllCourses}
                    />
                  ) : null}
                </Fragment>
              )
            }}
            columns={[
              {
                Header: 'Actions',
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
                            <i onClick={() => this.courseDeleteModal(row.row)} className="table-icon fas fa-trash-alt fa-lg"></i>
                            <span className="fa-trash-alt-tooltip table-tooltip">delete record</span>
                          </div>
                        </div>
                      )
                    },
                    width: 80
                  }
                ]
              },
              {
                Header: 'Course Info',
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
                    Header: "Abstract",
                    accessor: "abstract",
                    Cell: this.renderEditable
                  },
                  {
                    Header: "Topics",
                    accessor: "topics",
                    Cell: this.renderEditable
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
                  }
                ]
              },
              {
                Header: 'Course Data',
                columns: [
                  {
                    Header: "Price",
                    accessor: "pricePer",
                    width: 80,
                    Cell: this.renderEditable
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
