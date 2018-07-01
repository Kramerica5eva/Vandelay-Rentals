import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import API from "../../utils/API";
import Modal from "../../components/Modal";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import DevLinks from "../../components/DevLinks";

//ReactTable pkgs//
import ReactTable from "react-table";
import "react-table/react-table.css";
//import namor for random name generator//
import namor from "namor";

class Admin extends Component {
  state = {
    modal: {
      isOpen: false,
      header: "",
      body: "",
      footer: ""
    },
    courses: [],
    rentals: [],
    sales: [],
    users: [],
		title: "",
		data: []
  };

  componentDidMount() {
		// this.adminGetAllRentals();
		this.setState({
			data: this.makeData()
		});
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
        this.setState({
          courses: res.data,
          rentals: [],
          sales: [],
          users: [],
          title: "All Courses"
        });
        console.log(this.state.courses);
      })
      .catch(err => console.log(err));
  };

  adminGetAllRentals = () => {
    API.adminGetAllRentals()
      .then(res => {
        this.setState({
          courses: [],
          rentals: res.data,
          sales: [],
          users: [],
          title: "All Rentals"
        });
        console.log(this.state.rentals);
      })
      .catch(err => console.log(err));
  };

  adminGetAllSaleItems = () => {
    API.adminGetAllSaleItems()
      .then(res => {
        this.setState({
          courses: [],
          rentals: [],
          sales: res.data,
          users: [],
          title: "All Sales"
        });
        console.log(this.state.sales);
      })
      .catch(err => console.log(err));
  };

  adminGetAllUsers = () => {
    API.adminGetAllUsers()
      .then(res => {
        this.setState({
          courses: [],
          rentals: [],
          sales: [],
          users: res.data,
          title: "All Users"
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

  handleFormSubmit = event => {
    event.preventDefault();
    //  blah blah blah
  };

  //shit for my react table testing//

  range = len => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
  };
  newPerson = () => {
    const statusChance = Math.random();
    return {
      firstName: namor.generate({ words: 1, numbers: 0 }),
      lastName: namor.generate({ words: 1, numbers: 0 }),
      age: Math.floor(Math.random() * 30),
      visits: Math.floor(Math.random() * 100),
      progress: Math.floor(Math.random() * 100),
      status:
        statusChance > 0.66
          ? "relationship"
          : statusChance > 0.33
            ? "complicated"
            : "single"
    };
  };

  makeData(len = 5553) {
    return this.range(len).map(d => {
      return {
        ...this.newPerson(),
        children: this.range(10).map(this.newPerson)
      };
    });
  }

	//end of react table testing//
	

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
        <NavBar
          loggedIn={this.props.loggedIn}
          admin={this.props.admin}
          logout={this.props.logout}
          location={this.props.location}
        />
        <Header>
          <h1>Vandelay Admin Page, Nomsayn?</h1>
          <h2>Admin Page</h2>
          <DevLinks
            loggedIn={this.props.loggedIn}
            admin={this.props.admin}
            logout={this.props.logout}
            location={this.props.location}
          />
        </Header>
        <div>
          <div className="admin-btn-array">
            <button onClick={this.adminGetAllUsers}>See All Users</button>
            <button onClick={this.adminGetAllRentals}>See All Rentals</button>
            <button onClick={this.adminGetAllSaleItems}>
              See All Items For Sale
            </button>
            <button onClick={this.adminGetAllCourses}>See All Courses</button>
          </div>
{/* react table testing - start*/}

    {/* const { data } = this.state; */}
      <Fragment>
        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: "Name",
              columns: [
                {
                  Header: "First Name",
                  accessor: "firstName"
                },
                {
                  Header: "Last Name",
                  id: "lastName",
                  accessor: d => d.lastName
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Age",
                  accessor: "age"
                },
                {
                  Header: "Status",
                  accessor: "status"
                }
              ]
            },
            {
              Header: 'Stats',
              columns: [
                {
                  Header: "Visits",
                  accessor: "visits"
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </Fragment>



{/* react table testing - end*/}


          {/* <h2>{this.state.title}</h2>
          <ul>
            {this.state.courses
              ? this.state.courses.map(course => (
                  <li key={course._id}>
                    <h3>{course.name}</h3>
                    <button
                      onClick={() =>
                        this.setModal({
                          header: course.name,
                          body: (
                            <div>
                              <h3>{course.name}</h3>
                              <h4>"{course.abstract}"</h4>
                              <h5>Level: {course.level}</h5>
                              <p>
                                ${parseFloat(
                                  course.price.$numberDecimal
                                ).toFixed(2)}{" "}
                                per person
                              </p>
                              <p>"{course.detail}"</p>
                              <h4>Topics covered:</h4>
                              <ul>
                                {course.topics.map((topic, index) => (
                                  <li key={`${index}-${course._id}`}>
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                              <p>spaces left: {course.slots}</p>
                            </div>
                          ),
                          footer: course.name
                        })
                      }
                    >
                      see details
                    </button>
                  </li>
                ))
              : null}

            {this.state.rentals
              ? this.state.rentals.map(rental => (
                  <li key={rental._id}>
                    <h3>{rental.name}</h3>
                    <button
                      onClick={() =>
                        this.setModal({
                          header: rental.name,
                          body: (
                            <div>
                              <h4>{rental.category}</h4>
                              <h5>Maker: {rental.maker}</h5>
                              <p>
                                Daily rate: ${parseFloat(
                                  rental.dailyRate.$numberDecimal
                                ).toFixed(2)}
                              </p>
                            </div>
                          ),
                          footer: rental.name
                        })
                      }
                    >
                      see details
                    </button>
                  </li>
                ))
              : null}

            {this.state.sales
              ? this.state.sales.map(sale => (
                  <li key={sale._id}>
                    <h3>{sale.name}</h3>
                  </li>
                ))
              : null}

            {this.state.users
              ? this.state.users.map(user => (
                  <li key={user._id}>
                    <h3>{user.username}</h3>
                  </li>
                ))
              : null}
          </ul>					 */}
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default Admin;
