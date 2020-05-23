import React, { createContext } from "react";
import GameComponent from "../../GameComponent.js";
import Pictionary from "./Pictionary";

export default class App extends GameComponent {

  constructor(props) {
    super(props);

    this.state = {
      animal: "",
      drawingPlayer: null,
      phase: "drawing",
      round: 1,
      score: 0,
    };

    this.updateFirebase = this.updateFirebase.bind(this);
    this.setDrawingPlayer = this.setDrawingPlayer.bind(this);
  }

  componentDidMount() {
    // these two properties are constant and don't need to be maintained in state:
    this.myId = this.getMyUserId();
    this.players = this.getSessionUserIds();
    this.setDrawingPlayer();

    this.getSessionDatabaseRef().update(this.state, err => {
      if (err) console.log(err);
    });

    this.getSessionDatabaseRef().update({ animal: 'cow' }, err => {
      if (err) console.log(err);
    });
  }

  setDrawingPlayer() {
    let newDrawingPlayer;

    if (this.state.drawingPlayer === this.players[0]) {
      newDrawingPlayer = this.players[1];
    } else {
      newDrawingPlayer = this.players[0];
    }

    this.setState({
      drawingPlayer: newDrawingPlayer
    });
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
      if (err) {
        console.error(err);
      }
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
          myId={this.myId}
          players={this.state.players}
          updateFirebase={this.updateFirebase}
        />
      </div>
    );
  }
}
