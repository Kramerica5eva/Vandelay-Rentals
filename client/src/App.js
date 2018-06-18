import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals";
import Sales from "./pages/Sales";
import Classes from "./pages/Classes";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/rentals" component={Rentals} />
        <Route exact path="/sales" component={Sales} />
        <Route exact path="/classes" component={Classes} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default App;
