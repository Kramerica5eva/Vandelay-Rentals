import React from "react";
import { Label } from "./Label";

export const Input = props => (
  <div>
    <Label htmlFor={props.name}>{props.label}</Label>
    <input {...props} />
  </div>
);

// make sure the <Input> component uses a closing tag rather than being self-closing so you can put the label text in the {props.children} location

//  You will also need props for the 'for' and 'id' properties (labeled above as 'props.control'), as well as the placeholder.