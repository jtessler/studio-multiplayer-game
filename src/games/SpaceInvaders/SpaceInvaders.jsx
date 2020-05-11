import React from "react";
import GameComponent from "../../GameComponent.js";
import UserApi from "../../UserApi.js";
import GameBoard from "./GameBoard.jsx";
import CONFIG from "./config";

export default class SpaceInvaders extends GameComponent {
  constructor(props) {
    super(props);
    var myUserId = this.getMyUserId();
    this.state = {
      myId: myUserId,
      enemies: {
        enemyOne: {
          direction: 1,
          top: 0,
          left: 0,
          health: 1
        }
      },
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
      shots: {}
    };
    this.getSessionDatabaseRef().set({
      playerNames: UserApi.getName(this.getSessionUserIds()),
      enemies: this.state.enemies,
      status: this.state.status,
      players: this.state.players,
      score: this.state.score,
      shots: this.state.shots
    });
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
    // console.log(data);
  }

  render() {
    const isCreator = () => {
      if (this.getSessionCreatorUserId() === this.getMyUserId()) {
        return "Creator";
      } else {
        return false;
      }
    };

    const enemyFall = num => {
      let enemy = this.state.enemies.enemyOne;
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

      this.getSessionDatabaseRef().update({
        enemies: {
          enemyOne: {
            direction: newDirection,
            top: newTop,
            left: newLeft,
            health: enemy.health
          }
        }
      });
    };

    const playing = () => {
      // console.log(this.state, "playing state");
      this.getSessionDatabaseRef().update({
        status: "playing"
      });
      // this.setState({
      //   enemies: this.state.enemies,
      //   status: "playing",
      //   players: this.state.players,
      //   score: this.state.score,
      //   shots: this.state.shots
      // });
      setInterval(() => {
        if (this.state.status === "playing") {
          // console.log("playing, game is running");
          enemyFall(10);
        }
      }, CONFIG.FRAMES_PER_SECOND);
    };

    const movePlayer = e => {
      // console.log("moving player");
      let newTop = this.state.players.playerOne.top;
      let newLeft = this.state.players.playerOne.left;

      let TwoNewTop = this.state.players.playerTwo.top;
      let TwoNewLeft = this.state.players.playerTwo.left;

      if (isCreator()) {
        if (e.key === "w") {
          newTop -= 10;
        } else if (e.key === "s") {
          newTop += 10;
        } else if (e.key === "d") {
          newLeft += 10;
        } else if (e.key === "a") {
          newLeft -= 10;
        }
        if (e.keyCode === 32) {
          //add a shot component to firebase and render
        }
      } else {
        if (e.key === "w") {
          TwoNewTop -= 10;
        } else if (e.key === "s") {
          TwoNewTop += 10;
        } else if (e.key === "d") {
          TwoNewLeft += 10;
        } else if (e.key === "a") {
          TwoNewLeft -= 10;
        }
      }

      this.getSessionDatabaseRef().update({
        players: {
          playerOne: {
            left: newLeft,
            top: newTop,
            health: this.state.players.playerOne.health
          },
          playerTwo: {
            left: TwoNewLeft,
            top: TwoNewTop,
            health: this.state.players.playerTwo.health
          }
        }
      });

      // this.setState({
      //   enemies: this.state.enemies,
      //   status: this.state.status,
      //   players: {
      //     playerOne: {
      //       left: newLeft,
      //       top: newTop,
      //       health: this.state.players.playerOne.health
      //     },
      //     playerTwo: {
      //       left: TwoNewLeft,
      //       top: TwoNewTop,
      //       health: this.state.players.playerTwo.health
      //     }
      //   },
      //   score: this.state.score,
      //   shots: this.state.shots
      // });
    };

    // console.log(`Render this.state: ${JSON.stringify(this.state)}`);
    var id = this.getSessionId();
    // this.isCreator();
    var users = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());
    if (isCreator()) {
      return (
        <div>
          <h1>You are player one</h1>
          <h1>{`id:${id} creator:${creator} users:`}</h1>
          <ul>{users}</ul>
          <GameBoard
            isCreator={isCreator}
            updatePlayer={e => movePlayer(e)}
            position={this.state.enemies.enemyOne}
            playerOne={this.state.players.playerOne}
            playerTwo={this.state.players.playerTwo}
            status={this.state.status}
            playing={playing}
          />
        </div>
      );
    } else {
      return (
        <div>
          <h1>You are player player two</h1>
          <h1>{`id:${id} creator:${creator} users:`}</h1>
          <ul>{users}</ul>
          <GameBoard
            isCreator={isCreator}
            updatePlayer={e => movePlayer(e)}
            position={this.state.enemies.enemyOne}
            playerOne={this.state.players.playerOne}
            playerTwo={this.state.players.playerTwo}
            status={this.state.status}
            playing={playing}
          />
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
