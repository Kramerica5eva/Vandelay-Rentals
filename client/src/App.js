import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import ClipboardJS from "clipboard";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Test from "./pages/Test";
import TestNick from "./pages/TestNick";
import TestBen from "./pages/TestBen";
import TestBrandon from "./pages/TestBrandon";
import TestCorb from "./pages/TestCorb";
import ShoppingCart from "./pages/ShoppingCart";
import Waiver from "./pages/Waiver";
import Sales from "./pages/Sales";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminKeith from "./pages/AdminKeith";
import AdminBrandon from "./pages/AdminBrandon";
import AddPropsToRoute from "./components/AddPropsToRoute";
import NoMatch from "./pages/NoMatch";
import Modal from "./components/Elements/Modal";
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
          //  send a state object with the redirect to inform the login page of the intended destination
          //  'loginShow' is to make sure the login form shows instead of the signup form
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location, loginShow: true }
            }}
          />
        )
    }
  />
);

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAdmin ? (
        <Component {...props} />
      ) : (
          //  send a state object with the redirect to inform the login page of the intended destination
          //  'loginShow' is to make sure the login form shows instead of the signup form
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location, loginShow: true }
            }}
          />
        )
    }
  />
);

class App extends Component {
  state = {
    modal: {
      isOpen: false,
      body: "",
      buttons: ""
    },
    loggedIn: false,
    username: null,
    firstName: null,
    admin: false,
    dev: false,
    categories: null
  };

  componentDidMount() {
    this.getUser();
    new ClipboardJS('.clipboard-btn');
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
        body: modalInput.body,
        buttons: modalInput.buttons
      }
    });
  }

  updateUser = userObject => {
    isAuthenticated = userObject.auth;
    isAdmin = userObject.admin;
    this.setState(userObject.state);
  };

  getUser = () => {
    API.getUser().then(res => {
      console.log(res);
      if (res.data._id) {
        isAuthenticated = true;
        if (res.data.admin) {
          isAdmin = true;
        }
        API.getAllCategories()
          .then(categories => {
            this.setState({
              loggedIn: true,
              username: res.data.username,
              firstName: res.data.firstName,
              admin: res.data.admin,
              dev: res.data.dev,
              categories: categories.data
            });
          })
      } else {
        API.getAllCategories()
          .then(categories => {
            this.setState({
              loggedIn: false,
              username: null,
              firstName: null,
              admin: false,
              dev: false,
              categories: categories.data
            });
          })
      }
    });
  };

  setCategories = () => {
    API.getAllCategories()
      .then(categories => {
        this.setState({ categories: categories.data });
      })
  }

  badLogout = () => {
    API.logout()
      .then(() => {
        this.updateUser({
          auth: false,
          admin: false,
          state: {
            loggedIn: false,
            username: null,
            admin: false,
            dev: false,
            firstName: null
          }
        });
      })
      .catch(err => console.log(err));
    this.setModal({
      body: <h5>Your account has been locked. Please call Brandon Morin and complain.</h5>,
      buttons: <button>(801) 824-3638</button>
    })
  }

  logout = event => {
    if (event) {
      event.preventDefault();
    }
    console.log("logging out");
    API.logout()
      .then(() => {
        this.updateUser({
          auth: false,
          admin: false,
          state: {
            loggedIn: false,
            username: null,
            admin: false,
            dev: false,
            firstName: null
          }
        });
      })
      .catch(err => console.log(err));
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
        <Router>
          <Switch>
            <Route exact path="/"
              render={routeProps => (
                <Fragment>
                  <Home
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/rentals"
              render={routeProps => (
                <Fragment>
                  <Rentals
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/sales"
              render={routeProps => (
                <Fragment>
                  <Sales
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/courses"
              render={routeProps => (
                <Fragment>
                  <Courses
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/signup"
              render={routeProps => (
                <Fragment>
                  <Login
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                    loginShow={false}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/login"
              render={routeProps => (
                <Fragment>
                  <Login
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                    loginShow={true}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/about"
              render={routeProps => (
                <Fragment>
                  <About
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                    loginShow={true}
                  />
                </Fragment>
              )}
            />
            <PrivateRoute path="/waiver" component={AddPropsToRoute(Waiver, {
              toggleModal: this.toggleModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <PrivateRoute path="/profile" component={AddPropsToRoute(Profile, {
              toggleModal: this.toggleModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout,
              badLogout: this.badLogout
            })}
            />
            <PrivateRoute path="/cart" component={AddPropsToRoute(ShoppingCart, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <AdminRoute path="/admin" component={AddPropsToRoute(Admin, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout,
              categories: this.state.categories,
              setCategories: this.setCategories
            })}
            />
            <PrivateRoute path="/test" component={AddPropsToRoute(Test, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <PrivateRoute path="/testnick" component={AddPropsToRoute(TestNick, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <PrivateRoute path="/testben" component={AddPropsToRoute(TestBen, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <PrivateRoute path="/testbrandon" component={AddPropsToRoute(TestBrandon, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <PrivateRoute path="/testcorb" component={AddPropsToRoute(TestCorb, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <AdminRoute path="/adminbrandon" component={AddPropsToRoute(AdminBrandon, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout
            })}
            />
            <AdminRoute path="/adminkeith" component={AddPropsToRoute(AdminKeith, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              dev: this.state.dev,
              logout: this.logout,
              categories: this.state.categories,
              setCategories: this.setCategories
            })}
            />
            <Route
              //component={NoMatch}
              // exact
              //path="*"
              render={routeProps => (
                <Fragment>
                  <NoMatch
                    {...routeProps}
                    updateUser={this.updateUser}
                    loggedIn={this.state.loggedIn}
                    firstName={this.state.firstName}
                    admin={this.state.admin}
                    dev={this.state.dev}
                    logout={this.logout}
                  />
                </Fragment>
              )}
            />
          </Switch>
        </Router>
      </Fragment>
    );
  }
}

export default App;
