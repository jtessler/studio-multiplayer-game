import React from "react";
import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import GameBoard from "./GameBoard.jsx";
import CONFIG, { PLAYER_HEIGHT, PLAYER_WIDTH } from "./config";
import movePlayer from "./PlayerMovement.jsx";
import handleShots from "./moveShot.jsx";
import spawnEnemy from "./spawnEnemies.jsx";
import shotCollide from "./shotHit.jsx";

export default class SpaceInvaders extends GameComponent {
  constructor(props) {
    super(props);
    var myUserId = this.getMyUserId();
    this.state = {
      myId: myUserId,
      enemies: spawnEnemy(5),
      status: "menu",
      players: {
        playerOne: {
          left: 0,
          top: 400,
          health: 3
        },
        playerTwo: {
          left: 0,
          top: 0,
          health: 3
        }
      },
      score: 0,
      shots: [
        { left: 20, top: 300 },
        { left: 20, top: 350 },
        { left: 20, top: 360 },
        { left: 20, top: 370 },
        { left: 20, top: 400 }
      ]
    };

    this.getSessionDatabaseRef().set({
      playerNames: UserApi.getName(this.getSessionUserIds()),
      //shourld I call the spawnenemy function here instead or refer to state?
      enemies: this.state.enemies,
      status: this.state.status,
      players: this.state.players,
      score: this.state.score,
      shots: this.state.shots
    });

    this.isCreator = () => {
      if (this.getSessionCreatorUserId() === this.getMyUserId()) {
        return "Creator";
      } else {
        return false;
      }
    };

    this.timer = null;
  }

  //this.getSessionDatabaseRef().update({});

  onSessionDataChanged(data) {
    this.setState({
      myId: this.state.myId,
      enemies: data.enemies,
      status: data.status,
      players: data.players,
      score: data.score,
      shots: data.shots
    });
    // console.log(this.state.players);
    // console.log(data);
  }

  playing = () => {
    // console.log(this.state, "playing state");
    this.getSessionDatabaseRef().update({
      status: "playing"
    });
    this.timer = setInterval(() => {
      if (this.state.status === "playing") {
        // console.log("playing, game is running");
        this.enemyFall(10);
        this.shotMovement();
      }
    }, CONFIG.FRAMES_PER_SECOND);
  };

  shotMovement = () => {
    let shots = this.state.shots || [];
    let enemies = this.state.enemies || [];
    let newShots = handleShots(shots, enemies);
    this.getSessionDatabaseRef().update({
      shots: newShots
    });
  };

  enemyFall = num => {
    let newEnemies = [];
    for (let i = 0; i < this.state.enemies.length; i++) {
      let enemy = this.state.enemies[i];
      console.log(enemy.left, "enemy in enemyfall");
      // let left = Math.floor(Math.random() * CONFIG.GAME_BOARD_WIDTH);
      // console.log(`enemy falls: ${JSON.stringify(enemy)}`);
      let newTop = enemy.top;
      let newDirection = enemy.direction;
      let newLeft = enemy.left + num * newDirection; // Num can be + or -, randomly go left and right(?)

      // Check if enemy is within the left/right bounds here.
      if (
        newLeft + CONFIG.ENEMY_WIDTH >= CONFIG.GAME_BOARD_WIDTH ||
        newLeft <= 0
      ) {
        newDirection = newDirection * -1;
        newTop = newTop + num;
        // If their next movement will throw them out of bound
        // Just send them back the other way.
      }

      if (newTop + CONFIG.ENEMY_HEIGHT >= 500) {
        newTop = 0;
      }
      newEnemies.push({
        top: newTop,
        left: newLeft,
        direction: newDirection,
        health: 1
      });
    }

    // also calculate where shots, move, and enemy health

    this.getSessionDatabaseRef().update({
      enemies: newEnemies
    });
  };

  handlePlayerInput = e => {
    // console.log("moving player");
    let playerOne = this.state.players.playerOne;
    let playerTwo = this.state.players.playerTwo;

    if (this.isCreator()) {
      playerOne = movePlayer(playerOne.top, playerOne.left, e);
    } else {
      playerTwo = movePlayer(playerTwo.top, playerTwo.left, e);
    }
    if (e.keyCode === 32) {
      this.shoot();
      //add a shot component to firebase and render
    }

    this.getSessionDatabaseRef().update({
      players: {
        playerOne,
        playerTwo
      }
    });

    if (e.key === "p") {
      if (this.state.status === "playing") {
        clearInterval(this.timer);
        this.getSessionDatabaseRef().update({
          status: "paused"
        });
      } else {
        this.playing();
        this.getSessionDatabaseRef().update({
          status: "playing"
        });
      }
    }
  };

  shoot = () => {
    let allShots = this.state.shots || [];
    if (this.isCreator()) {
      let left = this.state.players.playerOne.left;
      let top = this.state.players.playerOne.top;
      let newShot = { left, top };
      allShots.push(newShot);
      // console.log(allShots);
    } else {
      let left = this.state.players.playerTwo.left;
      let top = this.state.players.playerTwo.top;
      let newShot = { left, top };
      allShots.push(newShot);
      // console.log(allShots);
    }
    this.getSessionDatabaseRef().update({
      shots: allShots
    });
  };

  render() {
    shotCollide({ left: 0, top: 0 }, this.state.enemies);
    // console.log(`Render this.state: ${JSON.stringify(this.state)}`);

    var id = this.getSessionId();
    var users = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());

    return (
      <div>
        <h1>{`You are player ${this.isCreator() ? "one" : "two"}`}</h1>
        <h1>{`id:${id} creator:${creator} users:`}</h1>
        <ul>{users}</ul>
        <GameBoard
          isCreator={this.isCreator}
          updatePlayer={e => this.handlePlayerInput(e)}
          position={this.state.enemies}
          playerOne={this.state.players.playerOne}
          playerTwo={this.state.players.playerTwo}
          shots={this.state.shots}
          status={this.state.status}
          playing={this.playing}
        />
      </div>
    );
  }
}

// #### Step 1.4: Determine if the current user is the session creator or "game host"

// **An exercise for the reader**

// Use the `this.getMyUserId()` and `this.getSessionCreatorUserId()` functions to
// determine if the current user is the session creator. Try adding this check to
// the `render()` function and conditionally display "I am the host" or "I am a
// guest".
