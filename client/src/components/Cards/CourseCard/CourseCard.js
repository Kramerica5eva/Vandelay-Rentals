import React, { Component } from "react";
import GreyBtn from "../../Elements/Buttons/GreyBtn"
import "./CourseCard.css"

class CourseCard extends Component {

  render() {
    return (
      <div id="courseCard" className="courseCard">
        <li key={this.props.id}>
          <h3>{this.props.name}</h3>
          <h4>{this.props.abstract}</h4>
          <h5>Level: {this.props.level}</h5>
          <p>${this.props.price} per person</p>
          <p>"{this.props.detail}"</p>
          <h4>Topics covered:</h4>
            <ul>
              {this.props.children}
            </ul>
          <p>Spaces left: {this.props.slots}</p>
          <br/>
          <div className="CourseBtn">
          <GreyBtn>
            Reserve Course Spot
          </GreyBtn>
          </div>
        </li>
      </div>
    )
  }
}

export default CourseCard;