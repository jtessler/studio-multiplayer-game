import React from "react";
import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import GameBoard from "./GameBoard.jsx";
import CONFIG from "./config";
import movePlayer from "./movePlayer.js";
import handleShots from "./moveShot.jsx";
import handleEnemies from "./handleEnemies.jsx";
import spawnEnemy from "./spawnEnemies.jsx";
import readOutLoud from "./sounds.jsx";
import PlanetHealth from "./PlanetHealth.jsx";
import handleEnemyShots from "./handleEnemyShots.jsx";

export default class SpaceInvaders extends GameComponent {
  constructor(props) {
    super(props);
    var myUserId = this.getMyUserId();
    this.state = {
      myId: myUserId,
      enemiesDeployed: 5,
      enemies: spawnEnemy(5),
      enemyShots: [],
      status: "menu",
      playerOne: {
        left: 0,
        top: 400,
        health: 3,
        shots: []
      },
      playerTwo: {
        left: 300,
        top: 400,
        health: 3,
        shots: []
      },
      score: 0
    };

    this.getSessionDatabaseRef().set({
      playerNames: UserApi.getName(this.getSessionUserIds()),
      //shourld I call the spawnenemy function here instead or refer to state?
      enemies: this.state.enemies,
      status: this.state.status,
      playerOne: this.state.playerOne,
      playerTwo: this.state.playerTwo,
      score: this.state.score,
      enemiesDeployed: this.state.enemiesDeployed
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
      playerOne: data.playerOne,
      playerTwo: data.playerTwo,
      score: data.score,
      enemiesDeployed: data.enemiesDeployed
    });
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

  playerHealth = () => {
    let player;
    let enemyShots = this.state.enemyShots || [];
    if (this.isCreator()) {
      player = this.state.playerOne;
    } else {
      player = this.state.playerTwo;
    }
    for (let i = 0; i < enemyShots; i++) {
      let enemyShot = enemyShots[i];
      handleEnemyShots(player, enemyShot);
    }
  };

  shotMovement = () => {
    let currentEnemies = this.state.enemies || [];
    if (this.isCreator()) {
      let shots = this.state.playerOne.shots || [];
      let newShots = handleShots(shots, currentEnemies);
      const { enemies, enemiesDeployed } = handleEnemies(
        shots,
        currentEnemies,
        this.state.enemiesDeployed
      );
      this.getSessionDatabaseRef().update({
        playerOne: {
          ...this.state.playerOne,
          shots: newShots
        },
        enemies,
        enemiesDeployed
      });
    } else {
      let shots = this.state.playerTwo.shots || [];
      let newShots = handleShots(shots, currentEnemies);
      const { enemies, enemiesDeployed } = handleEnemies(
        shots,
        currentEnemies,
        this.state.enemiesDeployed
      );
      this.getSessionDatabaseRef().update({
        playerTwo: {
          ...this.state.playerTwo,
          shots: newShots
        },
        enemies,
        enemiesDeployed
      });
    }
  };

  enemyFall = num => {
    // if (this.isCreator()) {
    let currentEnemies = this.state.enemies || [];
    let newEnemies = [];
    for (let i = 0; i < currentEnemies.length; i++) {
      let enemy = currentEnemies[i];
      let newTop = enemy.top;
      let newDirection = enemy.direction;
      let newLeft = enemy.left + num * newDirection;

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

    this.getSessionDatabaseRef().update({
      enemies: newEnemies
    });
    // }
  };

  handlePlayerInput = e => {
    // e.preventDefault();
    // console.log("moving player");
    let playerOne = this.state.playerOne;
    let playerTwo = this.state.playerTwo;

    if (this.isCreator()) {
      playerOne = movePlayer(playerOne, e);
      this.getSessionDatabaseRef().update({
        playerOne
      });
    } else {
      playerTwo = movePlayer(playerTwo, e);
      this.getSessionDatabaseRef().update({
        playerTwo
      });
    }
    if (e.keyCode === 32) {
      this.shoot();
      readOutLoud("pew");
      //add a shot component to firebase and render
    }

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
    if (this.isCreator()) {
      let allShots = this.state.playerOne.shots || [];
      let left = this.state.playerOne.left;
      let top = this.state.playerOne.top;
      let newShot = { left, top };
      allShots.push(newShot);
      this.getSessionDatabaseRef().update({
        playerOne: {
          ...this.state.playerOne,
          shots: allShots
        }
      });
    } else {
      let allShots = this.state.playerTwo.shots || [];
      let left = this.state.playerTwo.left;
      let top = this.state.playerTwo.top;
      let newShot = { left, top };
      allShots.push(newShot);
      this.getSessionDatabaseRef().update({
        playerTwo: {
          ...this.state.playerTwo,
          shots: allShots
        }
      });
    }
  };

  render() {
    // console.log(`Render this.state: ${JSON.stringify(this.state)}`);
    var photos = this.getSessionUserIds().map(user_id => {
      return UserApi.getPhotoUrl(user_id);
    });
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
        <ul>{`Status: ${this.state.status}`}</ul>
        <PlanetHealth
          enemies={this.state.enemies} // [{top: 5, left: 20, health: 1},]
          enemiesDeployed={this.state.enemiesDeployed} // 30
        />
        <GameBoard
          isCreator={this.isCreator}
          updatePlayer={e => this.handlePlayerInput(e)}
          position={this.state.enemies}
          playerOne={this.state.playerOne}
          playerTwo={this.state.playerTwo}
          status={this.state.status}
          playing={this.playing}
          id={photos}
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
