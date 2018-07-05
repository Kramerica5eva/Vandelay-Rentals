import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
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
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminKeith from "./pages/AdminKeith";
import AdminBrandon from "./pages/AdminBrandon";
import AddPropsToRoute from "./components/AddPropsToRoute";
import NavBar from "./components/Elements/NavBar";
import Footer from "./components/Elements/Footer";
import NoMatch from "./pages/NoMatch";
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
              pathname: "/login",
              state: { from: props.location, loginShow: true }
            }}
          />
        )
    }
  />
);

class App extends Component {
  state = {
    loggedIn: false,
    username: null,
    firstName: null,
    admin: false,
    categories: null
  };

  componentDidMount() {
    this.getUser();
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
              categories: categories.data
            });
          })
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
  };

  setCategories = () => {
    API.getAllCategories()
      .then(categories => {
        this.setState({ categories: categories.data });
      })
  }

  logout = event => {
    event.preventDefault();
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
            firstName: null
          }
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={routeProps => (
              <Fragment>
                <Home
                  {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              </Fragment>
            )}
          />
          <Route
            exact
            path="/rentals"
            render={routeProps => (
              <Fragment>
                <Rentals
                  {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              </Fragment>
            )}
          />
          <Route
            exact
            path="/sales"
            render={routeProps => (
              <Fragment>
                <Sales
                  {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              </Fragment>
            )}
          />
          <Route
            exact
            path="/courses"
            render={routeProps => (
              <Fragment>
                <Courses
                  {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
              </Fragment>
            )}
          />
          <Route
            exact
            path="/signup"
            render={routeProps => (
              <Fragment>
                <Login
                  {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                  loginShow={false}
                />
              </Fragment>
            )}
          />
          <Route
            exact
            path="/login"
            render={routeProps => (
              <Fragment>
                <Login
                  {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                  loginShow={true}
                />
              </Fragment>
            )}
          />
          <PrivateRoute
            path="/test"
            component={AddPropsToRoute(Test, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <PrivateRoute
            path="/testnick"
            component={AddPropsToRoute(TestNick, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <PrivateRoute
            path="/testben"
            component={AddPropsToRoute(TestBen, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <PrivateRoute
            path="/testbrandon"
            component={AddPropsToRoute(TestBrandon, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <PrivateRoute
            path="/testcorb"
            component={AddPropsToRoute(TestCorb, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <PrivateRoute
            path="/waiver"
            component={AddPropsToRoute(Waiver, {
              toggleModal: this.toggleModal,
              setModal: this.setModal,
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <PrivateRoute
            path="/cart"
            component={AddPropsToRoute(ShoppingCart, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <AdminRoute
            path="/admin"
            component={AddPropsToRoute(Admin, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <AdminRoute
            path="/adminbrandon"
            component={AddPropsToRoute(AdminBrandon, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout
            })}
          />
          <AdminRoute
            path="/adminkeith"
            component={AddPropsToRoute(AdminKeith, {
              updateUser: this.updateUser,
              loggedIn: this.state.loggedIn,
              firstName: this.state.firstName,
              admin: this.state.admin,
              logout: this.logout,
              categories: this.state.categories,
              setCategories: this.setCategories
            })}
          />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

export default App;
