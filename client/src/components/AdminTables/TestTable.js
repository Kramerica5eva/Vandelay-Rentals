import React, { Component, Fragment } from "react";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import ReactTable from "react-table";
import "react-table/react-table.css";


//  Select Table (HOC) testing import
import Chance from "chance";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import testData from "./test_data";

//  Select Table (HOC) testing HOC wrap
const CheckboxTable = checkboxHOC(ReactTable);

const chance = new Chance();

function getData() {
  const data = testData.map(item => {
    // using chancejs to generate guid
    // shortid is probably better but seems to have performance issues
    // on codesandbox.io
    const _id = chance.guid();
    return {
      _id,
      ...item
    };
  });
  return data;
}

function getColumns(data) {
  const columns = [];
  const sample = data[0];
  Object.keys(sample).forEach(key => {
    if (key !== "_id") {
      columns.push({
        accessor: key,
        Header: key
      });
    }
  });
  return columns;
}

export class TestTable extends Component {
  constructor() {
    super();
    const data = getData();
    const columns = getColumns(data);
    this.state = {
      modal: {
        isOpen: false,
        header: "",
        body: "",
        footer: ""
      },
      users: [],
      data,
      columns,
      selection: [],
      selectAll: false
    };
  }

  componentDidMount() {
    this.adminGetAllUsers();
  }

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        res.data.map(r => {
          // const rate = "$" + parseFloat(r.dailyRate.$numberDecimal).toFixed(2);
          // r.rate = rate;
        });
        console.log(res);
        this.setState({
          users: res.data
        });
        console.log(this.state.users);
      })
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // editable react table testing

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const users = [...this.state.users];
          users[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ users });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.users[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }


  //  Select Table (HOC) testing functions

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?
      
      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).
      
      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).
      
      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'. 
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = key => {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    return this.state.selection.includes(key);
  };

  logSelection = () => {
    console.log("selection:", this.state.selection);
  };

  // End Select Table (HOC) testing functions




  render() {
    const { toggleSelection, toggleAll, isSelected, logSelection } = this;
    const { data, columns, selectAll } = this.state;

    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: "checkbox",
      getTrProps: (s, r) => {
        console.log(r);
        // someone asked for an example of a background color change
        // here it is...
        const selected = this.isSelected(r.original._id);
        return {
          style: {
            backgroundColor: selected ? "lightgreen" : "inherit"
            // color: selected ? 'white' : 'inherit',
          }
        };
      }
    };

    return (
      <Fragment>
        <Modal
          show={this.state.isOpen}
          toggleModal={this.toggleModal}
          header={this.state.header}
          body={this.state.body}
          footer={this.state.footer}
        />


        <button onClick={logSelection}>Log Selection</button>
        <CheckboxTable
          ref={r => (this.checkboxTable = r)}
          data={data}
          columns={columns}
          // data={this.state.users}
          // columns={[
          //   {
          //     Header: "User",
          //     columns: [
          //       {
          //         Header: "Username",
          //         accessor: "username",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Password",
          //         accessor: "password",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Admin?",
          //         accessor: "admin",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "First Name",
          //         accessor: "firstName",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Last Name",
          //         id: "lastName",
          //         accessor: d => d.lastName,
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Standing",
          //         accessor: "standing",
          //         Cell: this.renderEditable
          //       }
          //     ]
          //   },
          //   {
          //     Header: "Contact Info",
          //     columns: [
          //       {
          //         Header: "Email",
          //         accessor: "email",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Street",
          //         accessor: "street",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "City",
          //         accessor: "city",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "State",
          //         accessor: "state",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Zipcode",
          //         accessor: "zipcode",
          //         Cell: this.renderEditable
          //       },
          //       {
          //         Header: "Phone",
          //         accessor: "phone",
          //         Cell: this.renderEditable
          //       }
          //     ]
          //   },
          // {
          //   Header: 'Bidness Info',
          //   columns: [
          //     {
          //       Header: "Waivers",
          //       accessor: "waivers",
          //       Cell: this.renderEditable
          //     }
          //   ]
          // },
          // {
          //   Header: 'Buttons',
          //   columns: [
          //     {
          //       Header: "Edit Buttons",
          //       id: "edit-buttons",
          //       accessor: function () {
          //         return <button>Stuff</button>;
          //       }
          //     }
          //   ]
          // }
          // ]}
          defaultPageSize={10}
          className="-striped -highlight"
          {...checkboxProps}
        />
      </Fragment>
    );
  }
}