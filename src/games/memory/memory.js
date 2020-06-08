import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import { zIndex } from "material-ui/styles";
import CardComponent from "./card.js";

export default class Memory extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      input: ""
    };
  }
  randomImages = [
    "https://i.picsum.photos/id/1066/200/300.jpg",
    "https://i.picsum.photos/id/192/200/300.jpg",
    "https://i.picsum.photos/id/556/200/300.jpg",
    "https://i.picsum.photos/id/1068/200/300.jpg",
    "https://i.picsum.photos/id/852/200/300.jpg"
  ];
  gameState = {
    playerOneScore: 0,
    playerTwoScore: 0,
    amountOfImages: 10,
    amountOfPairs: 5,
    imgs: [],
    matchedPairs: [],
    //assign a number to an image so that once it is displayed and then clicked on it will show that it is matched.
    turn: this.getSessionCreatorUserId(),
    players: 2
    // players: 2,
  };
  //if gameState.turn == this.getCurrentUserId()
  //This is used aater when i have determin whose turn it is.

  render() {
    var allIds = this.getSessionUserIds();

    // Store the username of the host (aka player 1)
    var host = this.getSessionCreatorUserId();

    // Store the username of the guest (aka player 2)
    var guest;

    // set the value of guest here

    console.log("ALL IDS IS NEXT");
    console.log(allIds);
    for (var index = 0; index++; index < allIds.length) {
      console.log(allIds[index]);
      if (allIds[index] !== host) {
        console.log("founzIndex");
        guest = allIds[index];
      }
    }

    const array = [1, 2, 3, 4, 5];
    // console.log(array[0]);
    console.log(array[false]);

    console.log("guest id is:" + guest);
    var hostUserName = UserApi.getName(host);
    var guestUserName = UserApi.getName(guest);

    var id = this.getSessionId();
    var users = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{user_id}</li>
    ));

    // create list of card components using map
    var listOfImages = this.randomImages.map((imageUrl, index) => {
      return <CardComponent image={imageUrl} />;
    });

    var host = this.getSessionCreatorUserId();
    // var funVar = "the other variable";
    var message;
    if (id === host) {
      message = "I am a host";
    } else {
      message = "I am a guest";
    }

    const container = {
      display: "flex",
      flexGrow: "1",
      backgroundColor: "#d6c7c7",
      flexFlow: "column",
      /* flex-basis: 100%; */
      height: "-webkit-fill-available"
    };
    const gameInfo = {
      border: "solid",
      display: "flex",
      // flex: "1",
      backgroundColor: "#ddadad",
      flex: "wrap",
      flexFlow: "column",
      width: 600,
      margin: 15
    };
    const scoreboard = {
      border: "solid",
      display: "flex",
      backgroundColor: "#aec8ce",
      justifyContent: "center",
      flexFlow: "column",
      flex: "wrap",
      width: 100,
      margin: 15
    };
    const imgs = {
      display: "flex",
      backgroundColor: "#d6c7c7",
      flexWrap: "Wrap",
      justifyContent: "space-between"
    };
    // $("button").click(function() {
    //   $("imgs").hide();
    // });
    return (
      <div style={container} id="container">
        <div style={gameInfo} id="gameInfo">
          <div>
            <p>Session ID: {id}</p>
          </div>
          <div>
            <p>Session creator: {host}</p>
          </div>
          <div>
            <p>Session users:</p>
            <ul>{users}</ul>
          </div>
          <div>
            <div>{message}</div>
            {/* <span>The value of funVar is {funVar}</span> */}
          </div>
        </div>
        <div style={scoreboard} id="scoreboard">
          <div>
            <span>
              {hostUserName}: {this.gameState.playerOneScore}
            </span>
          </div>
          <div>
            <span>
              {guestUserName}: {this.gameState.playerTwoScore}
            </span>
          </div>
          <button id="button">Hide Images</button>
        </div>
        <div style={imgs} id="imgs" >
          {/* <CardComponent image={this.randomImages[0]} /> */}
          {listOfImages}
       */}
;        </div>
         <div onClick={() => this.flipCard(index)}>
          click example
         </div>
      </div>
      // <div>
      //   // <div>// some stuff // </div>
      //   // <div>// some other stuff // </div>
      //   //{" "}
      // </div>
    );

    //  this.getSessionDatabaseRef().set({
    //  user_id: UserApi.getName(this.getMyUserId())
    //  });
    //  });
  }
   flipCard(index) {
    console.log("flipped card " + index);
  }

}
