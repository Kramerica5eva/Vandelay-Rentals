import React, { Component } from "react";
import dateFns, { getTime, isEqual, isAfter, isBefore, startOfDay } from "date-fns";
import Toggle from "react-toggle";
import "react-toggle/style.css";

class Calendar extends Component {

  //calendar functions
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = {
      currentMonth: new startOfDay(Date()),
      from: null,
      to: null,
      enteredTo: null, //keep track of the last day for mouseEnter
      unavailable: this.props.unavailable,
      range: false
    }
  }
  //  && this.isDayBefore(day, from);
  // isSelectingFirstDay(from, to, day) {
  //   const isBeforeFirstDay = from;
  //   const isRangeSelected = from && to;
  //   return !from || isBeforeFirstDay || isRangeSelected;
  // }

  // isDayBefore(d1, d2) {
  //   var day1 = clone(d1).setHours(0, 0, 0, 0);
  //   var day2 = clone(d2).setHours(0, 0, 0, 0);
  //   return day1 < day2;
  // }

  // clone(d) {
  //   return new Date(d.getTime());
  // }

  // componentWillUpdate() {
  //   this.props.unavailable.length > 0 ?
  //     this.setState({ from: null, to: null, enteredTo: null }) : null
  // }

  handleDayClick(day) {
    const { from, to, currentMonth } = this.state;
    // this.props.clearUnavailable();
    if (!this.state.range) {
      isAfter(day, dateFns.endOfMonth(currentMonth))
        ? this.nextMonth()
        : isBefore(day, dateFns.startOfMonth(currentMonth))
          ? this.prevMonth()
          : null
      this.props.updateUnix([day])
      this.setState({ from: day })
    } else {
      from && !to ? this.props.updateUnix([from, day]) : null
      isAfter(day, dateFns.endOfMonth(currentMonth))
        ? this.nextMonth()
        : isBefore(day, dateFns.startOfMonth(currentMonth))
          ? this.prevMonth()
          : null
      // let day = this.toUnix(time);
      if (from && to) {
        this.setState({
          from: day,
          to: null,
          enteredTo: null
        });
        return;
      }
      if (!from) {
        this.setState({
          from: day,
          to: null,
          enteredTo: null
        });
      } else {
        isAfter(day, from)
          ? this.setState({
            to: day,
            enteredTo: day
          })
          : isBefore(day, from)
            ? this.setState({
              from: day,
              to: null,
              enteredTo: null
            })
            : null
      }
    }
  }
  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (from && !to) {
      this.setState({
        enteredTo: day
      });
    }
  }

  toUnix(day) {
    return getTime(day) / 1000
  }

  handleResetClick() {
    this.setState(this.getInitialState());
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="calHeader row flex-middle">
        <div className="column column-start">
          <div className="icon" onClick={this.prevMonth}>
            Previous
        </div>
        </div>
        <div className="column column-center">
          <span>
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
        <div className="column column-end" onClick={this.nextMonth}>
          <div className="icon">Next</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="column column-center" key={i} >
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, from, to, enteredTo } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = startOfDay(day);
        days.push(
          <div
            className={`column cell ${
              this.state.range
                ? isEqual(day, from) || isEqual(day, to) || isEqual(day, enteredTo)
                  ? "selected"
                  : isAfter(day, from) && isBefore(day, enteredTo)
                    ? "range"
                    : ""
                : isEqual(day, from)
                  ? "selected"
                  : ""
              } ${
              this.props.unavailable.includes(getTime(day) / 1000)
                ? "unavailable"
                : ""
              }`}
            key={day}
            onClick={() => this.handleDayClick(dateFns.parse(cloneDay))}
            onMouseEnter={() => this.handleDayMouseEnter(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  // onDateClick = day => {
  //   this.setState({
  //     selectedDate: day
  //   });
  // }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  }

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  }

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        <Toggle
          id='range'
          defaultChecked={this.state.range}
          onChange={() => this.state.range ? this.setState({ from: null, to: null, enteredTo: null, range: false }) : this.setState({ from: null, to: null, enteredTo: null, range: true })}
        />
        <span>Date range selection</span>
        {this.props.unavailableName ? <span>Showing unavailability of <text style={{ fontWeight: "bold" }}>{this.props.unavailableName}</text>.</span> : null}
        {this.renderDays()}
        {this.renderCells()}
      </div>

    );
  }
}

export default Calendar;