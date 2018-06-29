import React, { Component } from "react";
import "./CourseCard.css"

class CourseCard extends Component {

  render() {
    return (
      <div id="courseCard" className="courseCard">
        <li key={this.props.key}>
          <h3>{this.props.name}</h3>
          <h4>{this.props.abstract}</h4>
          <h5>Level: {this.props.level}</h5>
          <p>${this.props.price} per person</p>
          <p>"{this.props.detail}"</p>
          <h4>Topics covered:</h4>
            <ul>
                {this.props.topics}
            </ul>
          <p>Spaces left: {this.props.slots}</p>
        </li>
      </div>
    )
  }
}

export default CourseCard;