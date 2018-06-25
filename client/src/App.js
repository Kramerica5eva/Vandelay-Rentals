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
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
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
    loggedIn: false,
    username: null,
    firstName: null,
    admin: false
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
        <Switch>
          <Route exact path="/"
            render={routeProps => (
              <React.Fragment>
                <NavBar{...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Home {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Footer/>
              </React.Fragment>
            )}
          />
          <Route exact path="/rentals"
            render={routeProps => (
              <React.Fragment>
                <NavBar{...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Rentals {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Footer/>
              </React.Fragment>
            )} />
          <Route exact path="/sales"
            render={routeProps => (
              <React.Fragment>
              <NavBar{...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Sales {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Footer/>
              </React.Fragment>
            )}
          />
          <Route exact path="/courses"
            render={routeProps => (
              <React.Fragment>
              <NavBar{...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Courses {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Footer/>
              </React.Fragment>
            )}
          />
          <Route exact path="/signup"
            render={routeProps => (
              <React.Fragment>
              <NavBar{...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Signup {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Footer/>
              </React.Fragment>)}
          />
          <Route exact path="/login"
            render={routeProps => (
              <React.Fragment>
              <NavBar{...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Login {...routeProps}
                  updateUser={this.updateUser}
                  loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  admin={this.state.admin}
                  logout={this.logout}
                />
                <Footer/>
              </React.Fragment>
              )}
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
      </Router>
    )
  }

}

export default App;