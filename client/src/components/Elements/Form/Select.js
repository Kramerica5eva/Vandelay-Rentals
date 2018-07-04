import React from "react";
import { Label } from "./Label";
import "./Form.css"

export const Select = props => (
  <div className="group group-select">
    <select>
      {props.children}
    </select>
    <Label htmlFor={props.name}>{props.label}</Label>
  </div>
)