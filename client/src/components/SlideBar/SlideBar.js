import React from "react";
import { Link } from 'react-router-dom';
import GreyBtn from "./../Buttons/GreyBtn";
// import "./SlideBar.css"

// Must pass in a relative or web url with an image in order for parallax to work

class SlideBar extends React.Component {

    componentDidMount = () => {
        document.querySelector(".cross").style.display = 'none';
        document.querySelector(".menu").style.display = 'none';
    }

    hamburgerClick = () => {
      document.querySelector(".cross").style.display = 'inline';
      document.querySelector(".menu").style.display = 'inline';
      document.querySelector(".hamburger").style.display = 'none';
    }

    crossClick = () => {
        document.querySelector(".cross").style.display = 'none';
        document.querySelector(".menu").style.display = 'none';
        document.querySelector(".hamburger").style.display = '';
    }

    render() {


            return (
            <React.Fragment>
                <div class="header-slidebar">
                    <button onClick={this.hamburgerClick} class="hamburger">&#9776;</button>
                    <button onClick={this.crossClick} class="cross">&#735;</button>
                </div>
                <nav>
                    <div class="menu" id="menu">
                        <ul>
                            <a class="page-link" href="index.html">
                                <li>Home</li>
                            </a>
                            <a class="page-link" href="#my-work">
                                <li>Portfolio</li>
                            </a>
                            <a class="page-link" href="#about-me">
                                <li>About Me</li>
                            </a>
                            <a class="page-link" href="contact.html">
                                <li>Contact</li>
                            </a>
                        </ul>
                    </div>
                </nav>
            </React.Fragment>
            );
    }
}


export default SlideBar;