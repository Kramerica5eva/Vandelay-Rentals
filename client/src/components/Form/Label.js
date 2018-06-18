import React from "react";

export const Label = props => (
  <label htmlFor={props.name}>{props.children}</label>
);