import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import "./fight.css";
import P5Wrapper from "react-p5-wrapper";
import sketchFactory from "./sketch.js";
import { character } from "./character.js";

export default class fight extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      p1: {
        characterType: "magician",
        playerLocation: {
          x: 50,
          y: 520
        },
        playerAction: {
          left: false,
          right: false,
          jump: false,
          basic_attack: false,
          ability_1: false,
          ability_2: false,
          ability_3: false,
          facing: "right"
        }
      },
      p2: {
        characterType: "magician",
        playerLocation: {
          x: 960,
          y: 520
        },
        playerAction: {
          left: false,
          right: false,
          jump: false,
          basic_attack: false,
          ability_1: false,
          ability_2: false,
          ability_3: false,
          facing: "left"
        }
      },
      sketch: sketchFactory(
        () => this.updateFirebase(),
        () => this.getState(),
        () => this.getMyUser(),
        () => this.identifyCharacter()
      )
    };

    this.getSessionDatabaseRef().set({
      p1: {
        characterType: "magician",
        playerLocation: {
          x: 50,
          y: 520
        },
        playerAction: {
          basic_attack: false,
          ability_1: false,
          ability_2: false,
          ability_3: false,
          facing: 1
        }
      },
      p2: {
        characterType: "magician",
        playerLocation: {
          x: 960,
          y: 520
        },
        playerAction: {
          basic_attack: false,
          ability_1: false,
          ability_2: false,
          ability_3: false,
          facing: -1
        }
      }
    });
  }

  getState() {
    return this.state;
  }

  identifyCharacter() {
    let char;
    if (this.getMyUser() === "player 1") {
      char = this.state.p1.characterType;
    }
    if (this.getMyUser() === "player 2") {
      char = this.state.p2.characterType;
    }
    return character[char];
  }

  onSessionDataChanged(data) {
    this.setState(data);
  }

  handleButtonClick() {
    this.getSessionDatabaseRef().set({
      user_id: UserApi.getName(this.getMyUserId())
    });
  }

  getMyUser() {
    if (this.getMyUserId() === this.getSessionCreatorUserId()) {
      return "player 1";
    } else {
      return "player 2";
    }
  }

  updateFirebase() {
    if (this.getMyUser() === "player 1") {
      this.getSessionDatabaseRef()
        .child("p1")
        .update({
          playerLocation: playerLocation,
          playerAction: playerAction
        });
    }
    if (this.getMyUser() === "player 2") {
      this.getSessionDatabaseRef()
        .child("p2")
        .update({
          playerLocation: playerLocation,
          playerAction: playerAction
        });
    }
  }

  render() {
    //Identify the Users
    var id = this.getSessionId();
    var users = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>
        <img alt="" key={user_id} src={UserApi.getPhotoUrl(user_id)} height="50px" />
        {UserApi.getName(user_id)}
      </li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());
    var identity;
    if (this.getMyUserId() === this.getSessionCreatorUserId()) {
      identity = "host";
    } else {
      identity = "guest";
    }
    if (true) {
      return (
        <div>
          {/* <canvas ref="game" /> */}
          <P5Wrapper sketch={this.state.sketch} />
        </div>
      );
    } else {
      return (
        <div>
          <div id="logInPage">
            <p>Session ID: {id}</p>
            <p>Session creator: {creator}</p>
            <p>Session users:</p>
            <ul>{users} </ul>
            <p>I am the {identity}!</p>
          </div>
        </div>
      );
    }
  }
}

export var playerAction = {
  basic_attack: false,
  ability_1: false,
  ability_2: false,
  ability_3: false,
  facing: ""
};

export var playerLocation = {
  x: 0,
  y: 0
};
