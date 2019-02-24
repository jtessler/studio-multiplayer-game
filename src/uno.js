import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import firebase from 'firebase';

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export default class uno extends Component {
  constructor(props) {
    super(props);
    var allCards = [];
    var suits = ["H", "C", "S", "D"];
    var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    for (var v = 0; v < values.length; v++) {
      for (var s = 0; s < suits.length; s++) {
        allCards.push([values[v], suits[s]]);

      }
    }

    allCards = shuffle(allCards);
    // console.log(allCards[0][0])
    var leftSide = allCards.splice(0, 26);
    var rightSide = allCards.splice(0, 26);
    this.state = {
      readyplayer1: false,
      readyplayer2: false,
      stack1: leftSide,
      stack2: rightSide,
      pile1: [],
      pile2: [],
      winner: null,
    };
    var id = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session/" + id);
    this.readyplayer1 = sessionDatabaseRef.child('readyplayer1');
    this.readyplayer2 = sessionDatabaseRef.child('readyplayer2');
    this.stack1 = sessionDatabaseRef.child('stack1');
    this.stack2 = sessionDatabaseRef.child('stack2');
    this.pile1 = sessionDatabaseRef.child('pile1');
    this.pile2 = sessionDatabaseRef.child('pile2');
    this.winner = sessionDatabaseRef.child('winner');
    this.isCreator = firebase.auth().currentUser.uid === props.location.state.creator;
  }
  componentWillMount() {
    this.setState({ isNextRoundButtonDisabled: true });
    this.readyplayer1.set(this.state.readyplayer1);
    this.readyplayer1.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ readyplayer1: v });
        if (this.state.readyplayer1 === true && this.state.readyplayer2 === true) {
          this.setState({ isNextRoundButtonDisabled: false });
        }
        if(this.state.readyplayer1 === false){
          this.setState({ isButtonDisabled: false});
        }
      }
    });
    this.readyplayer2.set(this.state.readyplayer2);
    
    this.readyplayer2.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ readyplayer2: v });
        if (this.state.readyplayer1 === true && this.state.readyplayer2 === true) {
          this.setState({ isNextRoundButtonDisabled: false });
        }
        if(this.state.readyplayer2 === false){
          this.setState({ isButtonDisabled: false});
        }
      }
    });
    this.stack1.set(this.state.stack1);
    this.stack1.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ stack1: s.val() });
      }
    });
    this.stack2.set(this.state.stack2);
    this.stack2.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ stack2: s.val() });
      }
    });
    this.pile1.set(this.state.pile1);
    this.pile1.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ pile1: s.val() });
      }
    });
    this.pile2.set(this.state.pile2);
    this.pile2.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ pile2: s.val() });
      }
    });
    this.winner.set(this.state.winner);
    this.winner.on('value', s => {
      let v = s.val();
      if (v !== null) {
        this.setState({ winner: s.val() });
      }
    });
  }

  playCard1() {
    this.playerOneReady();
    this.buttonDisabled();
    var card = this.state.stack1.shift();
    this.stack1.set(this.state.stack1);
    this.state.pile1.push(card);
    this.pile1.set(this.state.pile1);
    console.log(this.state.pile1[0][0]);
    this.checkWinner();
}
    playCard2() {
      this.playerTwoReady();
      this.buttonDisabled();
      var card = this.state.stack2.shift();
      this.stack2.set(this.state.stack2);
      this.state.pile2.push(card);
      this.pile2.set(this.state.pile2);
      this.checkWinner();
    }



    disabledNextRoundButton() {
      this.setState({ isNextRoundButtonDisabled: true });
    }

    enabledNextRoundButton() {
        this.setState({ isNextRoundButtonDisabled: false });
    }

    playerOneReady() {
      this.readyplayer1.set(true);
    }

    playerTwoReady() {
      this.readyplayer2.set(true);
    }

    checkWinner() {
      if(this.state.pile1[0] != null && this.state.pile2[0] != null){
        if(this.state.pile1[0][0] > this.state.pile2[0][0]){
          this.winner.set("P1 Wins")
          this.state.stack1.push(this.state.pile1)
        } else if(this.state.pile1[0][0] < this.state.pile2[0][0]){
          this.winner.set("P2 Wins!")
        } 
      } else {
        console.log("no cards")
      }
    }

    buttonDisabled() {
      this.setState({ isButtonDisabled: true });
    }

    nextRound() {
      this.setState({ isButtonDisabled: false });
      this.readyplayer1.set(false);
      this.readyplayer2.set(false);
      this.disabledNextRoundButton();
    }

    render() {

      return (
        <div className="war">
        <div>
          <RaisedButton label="Player 1 Start" fullWidth={true} disabled={this.isCreator || this.state.isButtonDisabled || this.state.isbuttonEnabled} onClick={this.playCard1.bind(this)}/>
          <h1 className="number"> {this.state.pile1} </h1>
        </div>
        <div className="center">
          <RaisedButton label="Next Round" fullWidth={false} disabled={this.state.isNextRoundButtonDisabled} onClick={this.nextRound.bind(this)}/> 
          <p>{this.state.winner}</p>
        </div>
        <div className="playerTwo">
          <h1 className="number"> {this.state.pile2} </h1>
          <RaisedButton label="Player 2 Start" fullWidth={true} disabled={!this.isCreator || this.state.isButtonDisabled }  onClick={this.playCard2.bind(this)}/>
        </div>
    </div>
      );
    }
  }
