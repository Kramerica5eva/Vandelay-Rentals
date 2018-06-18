import React from "react";

const Jumbotron = ({ children }) => (
  <div className="jumbotron jumbotron-fluid">
    <div className="container">
      {children}
    </div>
  </div>
);

export default Jumbotron;
