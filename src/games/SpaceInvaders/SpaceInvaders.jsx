import React from "react";
import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import GameBoard from "./GameBoard.jsx";

export default class SpaceInvaders extends GameComponent {
  constructor(props) {
    super(props);
    var myId = this.getMyUserId();
    var defaultValue = {};
    defaultValue[myId] = 0;
    defaultValue["enemies"] = {
      enemyOne: {
        top: 0,
        left: 0,
        health: 1
      }
    };
    defaultValue["status"] = "menu";
    this.state = defaultValue;
  }

  isCreator() {
    if (this.getSessionCreatorUserId() === this.getMyUserId()) {
      return "Creator";
    } else {
      return false;
    }
  }

  enemyFall(num) {
    let enemy = this.state.enemies.enemyOne;
    this.setState({
      enemies: {
        enemyOne: {
          top: enemy.top + num,
          left: enemy.left,
          health: enemy.health
        }
      }
    });
  }

  playing() {
    console.log(this.state);
    let enemy = this.state.enemies.enemyOne;
    this.setState({
      enemies: {
        enemyOne: {
          top: enemy.top,
          left: enemy.left,
          health: enemy.health
        }
      },
      status: "playing"
    });
    setInterval(function() {
      if (this.state.status === "playing") {
        console.log("playing, game is running");
      }
    }, 3000);
  }

  render() {
    console.log(this.state, "state");
    var id = this.getSessionId();
    // this.isCreator();
    var users = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());
    if (this.isCreator()) {
      return (
        <div>
          <h1>You are player one</h1>
          <h1>{`id:${id} creator:${creator} users:`}</h1>
          <ul>{users}</ul>
          <GameBoard status={this.state.status} playing={() => this.playing} />
        </div>
      );
    } else {
      return (
        <div>
          <h1>You are player player two</h1>
          <h1>{`id:${id} creator:${creator} users:`}</h1>
          <ul>{users}</ul>
        </div>
      );
    }
  }
}

// #### Step 1.4: Determine if the current user is the session creator or "game host"

// **An exercise for the reader**

// Use the `this.getMyUserId()` and `this.getSessionCreatorUserId()` functions to
// determine if the current user is the session creator. Try adding this check to
// the `render()` function and conditionally display "I am the host" or "I am a
// guest".
