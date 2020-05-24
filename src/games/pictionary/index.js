import React, { createContext } from "react";
import GameComponent from "../../GameComponent.js";
import Pictionary from "./Pictionary";

export default class App extends GameComponent {

  constructor(props) {
    super(props);

    this.state = {
      animal: "",
      drawingPlayer: this.getSessionCreatorUserId(),
      guess: "",
      myId: this.getMyUserId(),
      phase: "drawing",
      players: this.getSessionUserIds(),
      round: 1,
      score: 0,
    };

    this.updateFirebase = this.updateFirebase.bind(this);
    this.getNextDrawingPlayer = this.getNextDrawingPlayer.bind(this);
  }

  componentDidMount() {
    this.getSessionDatabaseRef().set(this.state, err => {
      if (err) console.error(err);
    });
  }

  getNextDrawingPlayer() {
    let nextDrawingPlayer;

    if (this.state.drawingPlayer === this.players[0]) {
      nextDrawingPlayer = this.players[1];
    } else {
      nextDrawingPlayer = this.players[0];
    }

    return nextDrawingPlayer;
  }

  onSessionDataChanged(data) {
    console.log("data from onSessionDataChanged:", data);
    this.setState({
      ...data,
    });
  }

  onSessionMetadataChanged(metaData) {
    console.log("metaData from onSessionMetadataChanged:", metaData);
  }

  updateFirebase(data) {
    console.log("data from updateFirebase:", data);
    this.getSessionDatabaseRef().set(data, err => {
      if (err) console.error(err);
    });
  }

  render() {
    return (
      <div>
        <Pictionary
          round={this.state.round}
          score={this.state.score}
          phase={this.state.phase}
          animal={this.state.animal}
          drawingPlayer={this.state.drawingPlayer}
          guess={this.state.guess}
          myId={this.state.myId}
          players={this.state.players}
          setDrawingPlayer={this.setDrawingPlayer}
          updateFirebase={this.updateFirebase}
        />
      </div>
    );
  }
}
