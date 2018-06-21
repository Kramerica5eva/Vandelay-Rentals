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

class App extends Component {
  state = {
    isOpen: false,
    header: "",
    body: {},
    footer: ""

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
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/test"
              render={routeProps => (
                <Test {...routeProps}
                  toggleModal={this.toggleModal}
                  setModal={this.setModal}
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
