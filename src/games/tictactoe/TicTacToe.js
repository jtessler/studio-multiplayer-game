import Button from '@material-ui/core/Button';
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

const State = {
  EMPTY: " ",
  X: "X",
  O: "0",
};

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      cellState: (new Array(9)).fill(State.EMPTY),
      currentUser: this.getSessionCreatorUserId(),
    };
  }

  onSessionDataChanged(data) {
    this.setState({
      cellState: data.cell_state,
      currentUser: data.current_user,
    });
  }

  isMyTurn() {
    return this.state.currentUser === this.getMyUserId();
  }

  getMyCellState() {
    if (this.getSessionCreatorUserId() === this.getMyUserId()) {
      return State.X;  // The session creator is always "X".
    } else {
      return State.O;
    }
  }

  getOtherUser() {
    return this.getSessionUserIds().find((uid) => {
      return uid !== this.getMyUserId();
    });
  }

  playTurn(i) {
    var cellState = this.state.cellState.slice();
    cellState[i] = this.getMyCellState();
    var databaseState = {
      cell_state: cellState,
      current_user: this.getOtherUser(),
    }
    this.getSessionDatabaseRef().set(databaseState, (error) => {
      if (error) {
        console.error("Error updating TicTacToe state", error);
      }
    });
  }

  getWinner() {
    var isWinner = (x) => {
      var state = this.state.cellState;
      var isX = cell => (cell === x);
      return state.slice(0, 3).every(isX) || // Row 1
          state.slice(3, 6).every(isX) || // Row 2
          state.slice(6, 9).every(isX) || // Row 3
          [state[0], state[3], state[6]].every(isX) || // Column 1
          [state[1], state[4], state[7]].every(isX) || // Column 2
          [state[2], state[5], state[8]].every(isX) || // Column 3
          [state[0], state[4], state[8]].every(isX) || // Diagonal
          [state[2], state[4], state[6]].every(isX); // Diagonal
    };
    if (isWinner(State.X)) {
      return State.X;
    } else if(isWinner(State.O)) {
      return State.O;
    } else {
      return null;
    }
  }

  render() {
    var currentUserName = UserApi.getName(this.state.currentUser);
    var winnerState = this.getWinner();
    var headerText;
    if (winnerState !== null) {
      headerText = winnerState + " WINS!"
    } else if (this.state.cellState.every(cell => (cell !== State.EMPTY))) {
      headerText = "Draw! Game over.";
    } else if (this.isMyTurn()) {
      headerText = "It's YOUR turn, go!";
    } else {
      headerText = "It's " + currentUserName + "'s turn, wait...";
    }

    var allCellsDisabled = winnerState !== null || !this.isMyTurn();
    var cells = this.state.cellState.map((cell, i) => (
      <Button
          key={i}
          variant="outlined"
          style={{height: 36}}
          onClick={() => this.playTurn(i)}
          disabled={allCellsDisabled || cell !== State.EMPTY}>
        {cell}
      </Button>
    ));
    return (
      <center>
        <h1>{headerText}</h1>
        {cells.slice(0, 3)}
        <br />
        {cells.slice(3, 6)}
        <br />
        {cells.slice(6, 9)}
      </center>
    );
  }
}
