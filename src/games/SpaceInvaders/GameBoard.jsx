import React from "react";
import Enemy from "./Enemy";
import Player from "./Player";
import Shot from "./Shot";

export default class GameBoard extends React.Component {
  render() {
    let boardStyle = {
      width: "500px",
      height: "500px",
      backgroundColor: "black",
      margin: "auto",
      border: "5px solid",
      position: "relative"
    };

    // console.log(`
    //   "player one position: " +
    //   ${JSON.stringify(this.props.playerOne)} +
    //   "\n player two position: " +
    //   ${JSON.stringify(this.props.playerTwo)} `);

    if (this.props.status === "menu") {
      return (
        <div className="board" style={boardStyle}>
          <button onClick={() => this.props.playing()}>Start</button>
        </div>
      );
    } else if (
      this.props.status === "playing" ||
      this.props.status === "paused"
    ) {
      return (
        <div
          className="board"
          style={boardStyle}
          tabIndex={-1}
          onKeyDown={event => this.props.updatePlayer(event)}
        >
          <Enemy pos={this.props.position} />
          <Player
            player={"one"}
            isCreator={this.props.isCreator}
            pos={this.props.playerOne}
          />
          <Player
            player={"two"}
            isCreator={this.props.isCreator}
            pos={this.props.playerTwo}
          />
          <Shot
            playerOne={this.props.playerOne}
            playerTwo={this.props.playerTwo}
          />
        </div>
      );
    }
  }
}
