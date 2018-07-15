import React from "react";
import "./CourseCard.css"

const CourseCard = props => (
  <div id="courseCard" className="courseCard">
    <div className="coursecard-display-img-container">
      <img src={props.displayImageUrl} alt="" className="rentalcard-display-image" />
    </div>
    <div className="coursecard-content-container">
      <div key={props.id}>
        <h3>{props.name}</h3>
        <div className="coursecard-description">
          <h4>{props.abstract}</h4>
          <div className={props.level === "Advanced" ? "red" : props.level === "Intermediate" ? "yellow" : "green"}>
            <h5><span className="black">Level: </span>{props.level}</h5>
          </div>
          <p>${props.price} per person</p>
          <p>"{props.detail}"</p>
          <h4>Topics covered:</h4>
          <ul>
            {props.children}
          </ul>
          <div className={props.slots < 6 ? "red" : props.slots <= 10 ? "yellow" : "green"}>
            <p><span className="black">Spaces left: </span>{props.slots}</p>
          </div>
        </div>

        <div className="CourseBtn">
          <button onClick={() => props.addCourseToCart(props.course)}>
            Reserve Course Spot
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default CourseCard;