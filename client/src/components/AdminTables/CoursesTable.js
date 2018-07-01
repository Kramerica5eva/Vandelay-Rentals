import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";

export class CoursesTable extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    courses: []
  };

  componentDidMount() {
    this.adminGetAllCourses();
  }

  toggleModal = () => {
    this.setState({
      modal: { isOpen: !this.state.modal.isOpen }
    });
  }

  setModal = (modalInput) => {
    this.setState({
      modal: {
        isOpen: !this.state.modal.isOpen,
        header: modalInput.header,
        body: modalInput.body,
        footer: modalInput.footer
      }
    });
  }

  adminGetAllCourses = () => {
    API.adminGetAllCourses()
      .then(res => {
        res.data.map(r => {
          const costPer = "$" + parseFloat(r.price.$numberDecimal).toFixed(2);
          r.costPer = costPer;
        });
        this.setState({
          courses: res.data,
          title: "All Courses"
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

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  renderEditable = (cellInfo) => {
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
  }


  render() {
    return (
      <Fragment>
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />

        <button onClick={this.updateSelectedRow}>Update Selected Row</button>
        <button onClick={this.props.hideCourses}>Hide Table</button>

        <h2>Courses</h2>
        <ReactTable
          data={this.state.courses}
          columns={[
            {
              Header: "Name",
              id: "name",
              accessor: d => d.category,
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
              Cell: this.renderEditable
            },
            {
              Header: "Price",
              accessor: "pricePer",
              Cell: this.renderEditable
            },
            {
              Header: "Edit Buttons",
              id: "edit-buttons",
              accessor: function () {
                return <button>Stuff</button>;
              }
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </Fragment>
    );
  }
}