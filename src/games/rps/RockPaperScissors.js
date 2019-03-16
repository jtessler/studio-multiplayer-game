import CircularProgress from 'material-ui/CircularProgress';
import GameComponent from '../../GameComponent.js';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

const gameOverMessages = {
  Rock: {
    Rock: "Tie: Rock v Rock",
    Paper: "You lost: Paper covers Rock",
    Scissors: "You won! Rock beats Scissors",
  },
  Paper: {
    Rock: "You won! Paper covers Rock",
    Paper: "Tie: Paper v Paper",
    Scissors: "You lost: Scissors cuts Paper",
  },
  Scissors: {
    Rock: "You lost: Rock beats Scissors",
    Paper: "You won! Scissors cuts Paper",
    Scissors: "Tie: Scissors v Scissors",
  },
};

export default class RockPaperScissors extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      choice: "",
      opponent: "",
    };
  }

  onSessionDataChanged(data) {
    for(var uid in data) {
      if(uid === this.getMyUserId()) {
        this.setState({choice: data[uid]});
      } else {
        this.setState({opponent: data[uid]});
      }
    }
  }

  select(choice) {
    var userChoice = {};
    userChoice[this.getMyUserId()] = choice;
    this.getSessionDatabaseRef().set(userChoice, (error) => {
      if (error) {
        console.error("Error storing session metadata", error);
      }
    });
    this.setState({choice: choice});
  }

  render() {
    if(this.state.choice === "") {
      return (<div>
        <h1>Make your choice!</h1>
        <div>
          <RaisedButton label="Rock"
            onClick={() => this.select("Rock")} />
          <RaisedButton label="Paper" primary={true}
            onClick={() => this.select("Paper")} />
          <RaisedButton label="Rock" secondary={true}
            onClick={() => this.select("Scissors")} />
        </div>
      </div>);
    } else if(this.state.opponent === "") {
      return (<div>
        <h1>Waiting for opponent</h1>
        <CircularProgress size={60}/>
      </div>);
    }
    return (<div>
      <h1>Game Over</h1>
      <h2>{gameOverMessages[this.state.choice][this.state.opponent]}</h2>
    </div>);
  }
}
