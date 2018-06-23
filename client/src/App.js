import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Test from "./pages/Test";
import TestNick from "./pages/TestNick";
import Sales from "./pages/Sales";
import Courses from "./pages/Courses";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AddPropsToRoute from "./components/AddPropsToRoute";
import NoMatch from "./pages/NoMatch";
import Modal from "./components/Modal";
import API from "./utils/API";
import "./App.css";

let isAuthenticated = false;
let isAdmin = false;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: "/login",
            state: { from: props.location }
          }}
          />
        )
    }
  />
)

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAdmin ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: "/",
            state: { from: props.location }
          }}
          />
        )
    }
  />
)

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
    isAuthenticated = userObject.auth;
    isAdmin = userObject.admin;
    this.setState(userObject.state);
  }

  getUser = () => {
    API.getUser().then(res => {
      console.log(res);
      if (res.data._id) {
        isAuthenticated = true;
        if (res.data.admin) {
          isAdmin = true;
        }
        this.setState({
          loggedIn: true,
          username: res.data.username,
          firstName: res.data.firstName,
          admin: res.data.admin
        });
      } else {
        isAuthenticated = false;
        isAdmin = false;
        this.setState({
          loggedIn: false,
          username: null,
          firstName: null,
          admin: false
        });
      }
    });
  }

  logout = event => {
    event.preventDefault()
    console.log('logging out')
    API.logout().then(() => {
      this.updateUser({
        auth: false,
        admin: false,
        state: {
          loggedIn: false,
          username: null,
          admin: false,
          firstName: null
        }
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
            <Route exact path="/"
              render={routeProps => (
                <Home {...routeProps}
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
            <Route exact path="/rentals"
              render={routeProps => (
                <Rentals {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              )} />
            <Route exact path="/sales"
              render={routeProps => (
                <Sales {...routeProps}
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
            <Route exact path="/courses"
              render={routeProps => (
                <Courses {...routeProps}
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
            <Route exact path="/signup"
              render={routeProps =>
                <Signup {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />}
            />
            <Route exact path="/login"
              render={routeProps =>
                <Login {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />}
            />
            <PrivateRoute path="/test" component={AddPropsToRoute(Test, {
              toggleModal: this.toggleModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
            />
            <PrivateRoute path="/testnick" component={AddPropsToRoute(TestNick, {
              toggleModal: this.toggleModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
            />
            <AdminRoute path="/admin" component={AddPropsToRoute(Admin, {
              toggleModal: this.toggleModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    )
  }

}

export default App;
