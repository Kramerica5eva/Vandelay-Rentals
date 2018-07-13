import React from "react";
import "./ParallaxHero.css"

// Must pass in a relative or web url with an image in order for parallax to work

class ParallaxHero extends React.Component {

    render() {
        return (
            <div id="parallax-container" className={this.props.pageClass} style={this.props.image}>
                <h1>
                   {this.props.title}
                </h1>
            </div>
        );
    }
}


export default ParallaxHero;