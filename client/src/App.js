import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Test from "./pages/Test";
import Sales from "./pages/Sales";
import Courses from "./pages/Courses";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import Modal from "./components/Modal";
import axios from 'axios';

class App extends Component {
  state = {
    isOpen: false,
    header: "",
    body: "",
    footer: "",
    loggedIn: false,
    username: null
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
    axios.get('/user/').then(response => {
      console.log('Get user response: ');
      console.log(response.data.user);
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ');

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        });
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        });
      }
    });
  }

  logout = event => {
    event.preventDefault()
    console.log('logging out')
    axios.post('/user/logout').then(response => {
      console.log(response.data)
      if (response.status === 200) {
      this.updateUser({
        loggedIn: false,
        username: null
      })
      }
    }).catch(error => {
      console.log(error)
    })
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
                  user={this.state.username}
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
