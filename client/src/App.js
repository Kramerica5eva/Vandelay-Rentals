import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Test from "./pages/Test";
import Sales from "./pages/Sales";
import Courses from "./pages/Courses";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NoMatch from "./pages/NoMatch";
import Modal from "./components/Modal";
import API from "./utils/API";

class App extends Component {
  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    loggedIn: false,
    username: null,
    firstName: null,
    admin: false
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setModal = (modalInput) => {
    this.setState({
      isOpen: !this.state.isOpen,
      header: modalInput.header,
      body: modalInput.body,
      footer: modalInput.footer
    });
  }

  componentDidMount() {
    this.getUser();
  }

  updateUser = userObject => {
    this.setState(userObject);
  }

  getUser = () => {
    API.getUser().then(res => {
      console.log(res);
      if (res.data._id) {
        this.setState({
          loggedIn: true,
          username: res.data.username,
          admin: res.data.admin,
          firstName: res.data.firstName
        });
      } else {
        this.setState({
          loggedIn: false,
          username: null,
          admin: false,
          firstName: null
        });
      }
    });
  }

  logout = event => {
    event.preventDefault()
    console.log('logging out')
    API.logout().then(() => {
      this.updateUser({
        loggedIn: false,
        username: null,
        admin: false,
        firstName: null
      });
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <Router>
        <div>
          <Modal
            show={this.state.isOpen}
            toggleModal={this.toggleModal}
            header={this.state.header}
            body={this.state.body}
            footer={this.state.footer}
          />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/rentals" component={Rentals} />
            <Route exact path="/sales" component={Sales} />
            <Route exact path="/courses" component={Courses} />
            <Route exact path="/signup"
              render={routeProps =>
                <Signup {...routeProps}
                  updateUser={this.updateUser}
                />}
            />
            <Route exact path="/login"
              render={routeProps =>
                <Login {...routeProps}
                  updateUser={this.updateUser}
                />}
            />
            <Route exact path="/test"
              render={routeProps => (
                <Test {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              )}
            />
            <Route exact path="/admin"
              render={routeProps => (
                <Admin {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    )
  }

}

export default App;
