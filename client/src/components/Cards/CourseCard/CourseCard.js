import React, { Component } from "react";
import "./CourseCard.css"

class CourseCard extends Component {

  render() {
    return (
      <div id="courseCard" className="courseCard">
        <div className="coursecard-display-img-container">
          <img src={this.props.displayImageUrl} alt="" className="rentalcard-display-image"/>
        </div>
        <div className="coursecard-content-container">
          <div key={this.props.id}>
          <h3>{this.props.name}</h3>
          <div className="coursecard-description">
            <h4>{this.props.abstract}</h4>
            <div className={this.props.level === "Advanced" ? "red" : this.props.level === "Intermediate" ? "yellow" : "green"}>
              <h5><span className="black">Level: </span>{this.props.level}</h5>
            </div>
            <p>${this.props.price} per person</p>
            <p>"{this.props.detail}"</p>
            <h4>Topics covered:</h4>
              <ul>
                {this.props.children}
              </ul>
            <div className={this.props.slots < 6 ? "red" : this.props.slots <=10 ? "yellow" : "green"}>
              <p><span className="black">Spaces left: </span>{this.props.slots}</p>
            </div>
          </div>

            <div className="CourseBtn">
            <button onClick={() => this.props.addCourseToCart(this.props.course)}>
              Reserve Course Spot
            </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CourseCard;