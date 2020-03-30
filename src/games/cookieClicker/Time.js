import React from "react";
import "./cookie.css";

export default class Time extends React.Component {
  paddedSeconds(seconds) {
    if (seconds < 10) {
      return "0" + seconds;
    } else {
      return seconds;
    }
  }
  render() {
    return (
      <div>
        {this.props.minutes}:{this.paddedSeconds(this.props.seconds)}
      </div>
    );
  }
}
