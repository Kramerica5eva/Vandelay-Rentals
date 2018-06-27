import React, { Component } from "react";
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

let today = new Date();
let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

class Calendar extends Component {
  
  render() {
    return(
    <InfiniteCalendar
      width={400}
      height={600}
      selected={today}
      disabledDays={[0,6]}
      minDate={lastWeek}
    />
    )
  }
}

export default Calendar;