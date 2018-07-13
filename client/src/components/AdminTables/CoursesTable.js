import React, { Component, Fragment } from "react";
import { Input, FormBtn, Label, } from "../Elements/Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import LoadingModal from "../../components/Elements/LoadingModal";
import ReactTable from "react-table";
import { RegistrationsTable } from "./RegistrationsTable";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import dateFns from "date-fns";
const CheckboxTable = checkboxHOC(ReactTable);

export class CoursesTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: "",
      buttons: ""
    },
    courses: [],
    level: "",
    date: "",
    rentals: [],
    selection: [],
    selectedRow: {}
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
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer,
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
        res.data.map(r => {
          r.pricePer = "$" + parseFloat(r.price.$numberDecimal).toFixed(2);
          // r.date = dateFns.format(r.date * 1000, "MMM Do YYYY");
          if (r.registrations.length) {
            r.openSlots = r.slots - r.registrations.length;
          } else {
            r.openSlots = r.slots;
          }
        });
        this.setState({
          courses: res.data,
          selection: []
        });
      })
      .catch(err => console.log(err));
  };

  //  COURSE UPDATE MODALS W/UPDATE FUNCTIONS
  //  Course Date update modal
  //  Changing course date in a modal because:
  //  a) If the date is formatted before going into the table, then the table sort functions end up sorting the date alphabetically, which of course isn't useful.
  //  b) To format the date in the table cell prevents passing in the renderEditable function
  courseDateModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Course Date</h3>
            <Input
              onChange={this.handleInputChange}
              name="date"
              type="text"
              placeholder="e.g. Dec 20th 2018"
            />
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeCourseDate}>Submit</button>
    });
  }

  // Course date update function
  changeCourseDate = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal();
    const { _id } = this.state.selectedRow;
    const unixDate = dateFns.format(this.state.date, "X");
    API.adminUpdateCourse(_id, { date: unixDate })
      .then(res => {
        this.adminGetAllCourses();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  }

  //  Course level update modal
  courseLevelModal = () => {
    this.setModal({
      body:
        <Fragment>
          <form>
            <h3>Change Difficulty</h3>
            <div className="group group-select">
              <select
                name="level"
                onChange={this.handleInputChange}
              >
                <option></option>
                <option>Advanced</option>
                <option>Intermediate</option>
                <option>Beginner</option>
              </select>
            </div>
          </form>
        </Fragment>,
      buttons: <button onClick={this.changeCourseLevel}>Submit</button>
    });
  };

  //  Course level update function
  changeCourseLevel = event => {
    event.preventDefault();
    this.toggleModal();
    this.toggleLoadingModal()
    const { _id } = this.state.selectedRow;
    API.adminUpdateCourse(_id, { level: this.state.level })
      .then(res => {
        this.adminGetAllCourses();
        this.toggleLoadingModal();
      })
      .catch(err => console.log(err));
  };

  //  Course delete modal
  courseDeleteModal = () => {
    this.setModal({
      body:
        <Fragment>
          <h4>Are you sure you want to delete {this.state.selectedRow.name}?</h4>
          <p>(this is permenent - you cannot undo it, and you will lose all data)</p>
        </Fragment>,
      buttons:
        <Fragment>
          <button onClick={this.toggleModal}>Nevermind</button>
          <button onClick={this.deleteCourse}>Delete it</button>
        </Fragment>
    })
  }

  // Course delete function
  deleteCourse = () => {

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

  isSelected = key => {
    return this.state.selection.includes(key);
  };

  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };
  //  END REACT-TABLE: SELECT TABLE HOC FUNCTIONs

  //  Update selected Row - sends current field info to db and updates that item
  updateSelectedRow = () => {
    this.toggleLoadingModal()
    const { name, pricePer, price, abstract, topics, date, slots, _id } = this.state.selectedRow;

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

  // editable react table function
  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
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
            color: selected ? "#000" : "inherit"
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
            <h2>Courses Table <button onClick={this.props.toggleCourses}>Hide Table</button></h2>
          </div>

          <div className="table-btn-div">
            <h4>Courses Table Options</h4>
            <button disabled={this.state.selection.length === 0} onClick={this.updateSelectedRow}>Update Selected</button>
            <button disabled={this.state.selection.length === 0} onClick={this.courseDateModal}>Change Date</button>
            <button disabled={this.state.selection.length === 0} onClick={this.courseLevelModal}>Change Difficulty</button>
            <button disabled={this.state.selection.length === 0} onClick={this.courseDeleteModal}>Delete</button>
            <button disabled={this.state.selection.length === 0} onClick={this.logSelection}>Log Selection</button>
          </div>



          <CheckboxTable
            // this ref prop is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object
            ref={r => (this.checkboxTable = r)}
            data={this.state.courses}
            SubComponent={row => {
              //  thisReservation grabs the reservations from this.state.rentals that matches the row index - it grabs the reservations for this rental item.
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
                Header: "Name",
                accessor: "name",
                Cell: this.renderEditable
              },
              {
                Header: "Date",
                accessor: "date",
                Cell: this.renderEditable,
                Cell: row => {
                  return (
                    dateFns.format(row.row.date * 1000, "MMM Do YYYY")
                  )
                }
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
                accessor: "level"
              },
              {
                Header: "Price",
                accessor: "pricePer",
                Cell: this.renderEditable
              },
              {
                Header: "Slots",
                accessor: "slots",
                Cell: this.renderEditable
              },
              {
                Header: "Availability",
                accessor: "openSlots"
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
