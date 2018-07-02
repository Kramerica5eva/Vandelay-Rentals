import React from "react";
import './CategoryCard.css';

export const CategoryCard = props => (
  <div {...props} id="category-card" className="category-card">
    <h3>{props.category}</h3>
    <p>{props.description}</p>
  </div>
);