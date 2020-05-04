import React from "react";
import Enemy from "./Enemy";

export default class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let boardStyle = {
      width: "500px",
      height: "500px",
      backgroundColor: "black",
      margin: "auto",
      border: "5px solid"
    };

    if (this.props.status === "menu") {
      return (
        <div className="board" style={boardStyle}>
          <button onClick={this.props.playing()}>Start</button>
        </div>
      );
    } else if (this.props.status === "playing") {
      return (
        <div className="board" style={boardStyle}>
          <Enemy />
        </div>
      );
    }
  }
}
