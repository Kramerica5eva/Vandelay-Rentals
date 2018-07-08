import React, { Component, Fragment } from "react";
import { Input, FormBtn, Select, Option } from "../Elements/Form";
import API from "../../utils/API";
import Modal from "../../components/Elements/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./AdminTables.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

export class CoursesTable extends Component {
  constructor() {
    super();
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
      level: [],
      rentals: [],
      selection: [],
      selectedRow: {}
    };
  }

  componentDidMount() {
    this.adminGetAllCourses();
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  };

  setModal = modalInput => {
    this.setState({
      modal: {
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  };

  levelModal = () => {
    this.setModal({
      header: "Change Level",
      body: (
        <Fragment>
          <form>
            <Select
              name="level"
              label="Update level:"
              onChange={this.handleInputChange}
              value={this.state.level}
            >
              <Option />
              <Option>Advanced</Option>
              <Option>Intermediate</Option>
              <Option>Beginner</Option>
            </Select>
            <FormBtn onClick={this.changeLevel}>Submit</FormBtn>
          </form>
        </Fragment>
      )
    });
  };
  changeLevel = e => {
    e.preventDefault();
    console.log(this.state.level);
    const { _id } = this.state.selectedRow;
    API.adminUpdateCourse(_id, { level: this.state.level }).then(res => {
      this.adminGetAllCourses();
      this.toggleModal();
    });
  };

  adminGetAllCourses = () => {
    API.adminGetAllCourses()
      .then(res => {
        res.data.map(r => {
          const pricePer = "$" + parseFloat(r.price.$numberDecimal).toFixed(2);
          r.pricePer = pricePer;
          if (r.participants.length) {
            r.openSlots = r.slots - r.participants.length;
          } else {
            r.openSlots = r.slots;
          }
        });
        this.setState({
          courses: res.data,
          selection: []
        });
        console.log(this.state.courses);
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

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
    const {
      name,
      pricePer,
      price,
      abstract,
      topics,
      date,
      slots,
      _id
    } = this.state.selectedRow;

    let newPrice;
    if (pricePer)
      if (pricePer.includes("$")) {
        newPrice = price.$numberDecimal;
      } else {
        newPrice = pricePer;
      }

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
          // Modal for feedback
          this.setModal({
            header: "Success!",
            body: <h3>Database successfully updated</h3>
          });

          //  query the db and reload the table
          this.adminGetAllCourses();
        }
      })
      .catch(err => console.log(err));
  };

  logSelection = () => {
    console.log("Selection:", this.state.selection);
    console.log("Row: ", this.state.selectedRow);
  };

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
        />
        <div className="main-table-container">

          <h2>Courses</h2>

          <button
            disabled={this.state.selection.length === 0}
            onClick={this.updateSelectedRow}
          >
            Update Selected Row
        </button>
          <button onClick={this.props.toggleCourses}>Hide Table</button>
          <button onClick={this.logSelection}>Log Selection</button>

          <CheckboxTable
            // this ref prop is the 'r' that gets passed in to 'getTrProps' in the checkboxprops object
            ref={r => (this.checkboxTable = r)}
            data={this.state.courses}
            columns={[
              {
                Header: "Name",
                id: "name",
                accessor: d => d.category,
                Cell: this.renderEditable
              },
              {
                Header: "Date",
                id: "date",
                Cell: this.renderEditable
              },
              {
                Header: "Abstract",
                id: "abstract",
                Cell: this.renderEditable
              },
              {
                Header: "Topics",
                accessor: "topics",
                Cell: this.renderEditable
              },
              {
                Header: "Level",
                accessor: "level",
                Cell: row => {
                  return (
                    <button className="table-btn-invis" onClick={this.levelModal}>
                      {row.value}
                    </button>
                  );
                }
              },
              {
                Header: "Price",
                accessor: "pricePer",
                Cell: this.renderEditable
              },
              {
                Header: "Sluts",
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
