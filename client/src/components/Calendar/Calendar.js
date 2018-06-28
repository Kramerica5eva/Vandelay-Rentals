import React, { Component } from "react";
import Calendar from 'react-calendar';

class CalendarComp extends Component {

  state = {
    date: new Date(),
  }

  date = () => {
    console.log(this.state.date);
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <div>
      <Calendar
        onChange={this.onChange}
        value={this.state.date}
      />
      {this.date()}
      </div>
    )
  }
}

export default CalendarComp;