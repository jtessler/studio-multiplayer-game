import React from "react";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let playerStyle = {
      width: "20px",
      height: "20px",
      backgroundColor: "blue",
      position: "relative",
      top: this.props.pos.top + "px",
      left: this.props.pos.left + "px"
    };

    let playerTwo = {
      width: "20px",
      height: "20px",
      backgroundColor: "orange",
      position: "relative",
      top: this.props.pos.top + "px",
      left: this.props.pos.left + "px"
    };

    if (this.props.player === "one") {
      return <div className="player" style={playerStyle} />;
    } else if (this.props.player === "two") {
      return <div className="player" style={playerTwo} />;
    }
  }
}
