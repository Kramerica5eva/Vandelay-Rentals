import React from "react";
import "./Form.css"

export const Label = props => (
  <label htmlFor={props.name}>{props.children}</label>
);