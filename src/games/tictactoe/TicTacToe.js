import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import UserApi from '../../UserApi.js';
import firebase from 'firebase';

const State = {
  EMPTY: " ",
  X: "X",
  O: "0",
};

export default class TicTacToe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cellState: (new Array(9)).fill(State.EMPTY),
      currentUser: this.props.location.state.creator,
    };
  }

  componentWillMount() {
    var id = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session/" + id);
    sessionDatabaseRef.on("value", (snapshot) => {
      var sessionSnapshot = snapshot.val();
      if (sessionSnapshot !== null) {
        this.setState({
          cellState: sessionSnapshot.cell_state,
          currentUser: sessionSnapshot.current_user,
        });
      }
    });
  }

  componentWillUnmount() {
    var id = this.props.match.params.id;
    firebase.database().ref("/session/" + id).off();
  }

  isMyTurn() {
    var uid = firebase.auth().currentUser.uid;
    return this.state.currentUser === uid;
  }

  getMyCellState() {
    // The creator is always "X".
    var uid = firebase.auth().currentUser.uid;
    return this.props.location.state.creator === uid ? State.X : State.O;
  }

  getOtherUser() {
    return this.props.location.state.users.find((uid) => {
      return uid !== firebase.auth().currentUser.uid;
    });
  }

  playTurn(i) {
    var cellState = this.state.cellState.slice();
    cellState[i] = this.getMyCellState();
    var databaseState = {
      cell_state: cellState,
      current_user: this.getOtherUser(),
    }
    var sessionId = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session/" + sessionId);
    sessionDatabaseRef.set(databaseState, (error) => {
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
      <RaisedButton
          key={i}
          label={cell}
          onClick={() => this.playTurn(i)}
          disabled={allCellsDisabled || cell !== State.EMPTY} />
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
