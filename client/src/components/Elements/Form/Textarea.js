import React from "react";
import { Label } from "./Label";
import "./Form.css"

export const Textarea = props => (
  <div className="group group-textarea">
    <Label htmlFor={props.name}>{props.label}</Label>
    <textarea className="" rows="3" {...props} />
    <span className="highlight"></span>
    <span className="bar"></span>
  </div>
);