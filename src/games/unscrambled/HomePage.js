import GameComponent from "../../GameComponent.js";
import React from "react";
import { GamePage } from "./GamePage.js";
import UserApi from "../../UserApi.js";
import {
  createNewPlayer,
  createNewPlayerList,
  guessWord,
  restartRound,
  getPlayer,
  allPlayersDone,
  wordList,
  reconcilePlayerList
} from "./Objects.js";

export default class HomePage extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      gamePage: "home",
      word: "applesauce",
      scrambledWord: "ecapesplau",
      scoreLimit: 5,
      timeLimit: 15,
      playerList: createNewPlayerList([this.getMyUserId()])
    };

    this.guessWord_ = this.guessWord_.bind(this);
  }

  guessWord_(word) {
    let playerList = this.state.playerList;
    let playerObj = getPlayer(this.getMyUserId(), playerList);
    let updatedInfo = this.state;
    if (playerObj) {
      guessWord(word, this.state.word, playerObj);
      // Check if everyone is done, if so, generate a new word.
      if (playerList && allPlayersDone(playerList)) {
        let newWord = this.getNewWord();
        let newScrambledWord = this.scrambleWord(newWord);
        let updatedPlayers = restartRound(playerList);
        updatedInfo.word = newWord;
        updatedInfo.scrambledWord = newScrambledWord;
        updatedInfo.playerList = updatedPlayers;
      }
      this.getSessionDatabaseRef().update(updatedInfo);
    }
  }

  letsGoClick() {
    let playerIds = this.getSessionUserIds();
    if (playerIds.length > 0) {
      let players = createNewPlayerList(playerIds);

      let state = this.state;
      let newData = {
        gamePage: "play",
        word: state.word,
        scrambledWord: state.scrambledWord,
        scoreLimit: state.scoreLimit,
        timeLimit: state.timeLimit,
        playerList: players
      };
      this.setState(newData);
    } else if (playerIds.length > 10) {
      alert("too many players!");
    }
  }

  onSessionDataChanged(data) {
    let currentPlayer = this.state.playerList
      ? getPlayer(this.getMyUserId(), this.state.playerList)
      : null;
    let playerList = this.state.playerList;

    // If current player isn't in the playerList, add them.
    if (!currentPlayer) {
      currentPlayer = createNewPlayer(this.getMyUserId());
      playerList.push(currentPlayer);
    }

    // Reconcile the player list if someone new joined after the game started.
    let updatedPlayers = data.playerList
      ? reconcilePlayerList(data.playerList, playerList)
      : playerList;

    // Check what data was updated from firbase
    let newWord = data.word ? data.word : this.state.word;
    let newScrambledWord = data.scrambledWord
      ? data.scrambledWord
      : this.state.scrambledWord;

    this.setState({
      gamePage: data.gamePage,
      word: newWord,
      scrambledWord: newScrambledWord,
      scoreLimit: data.scoreLimit ? data.scoreLimit : this.state.scoreLimit,
      timeLimit: data.timeLimit ? data.timeLimit : this.state.timeLimit,
      playerList: updatedPlayers
    });
  }

  getNewWord() {
    let numWord = wordList.length;
    let i = Math.round(Math.random() * numWord);
    return wordList[i];
  }

  scrambleWord(word) {
    let wordAsArray = word.split("");
    let newWord = [];

    while (wordAsArray.length > 0) {
      let wordLength = wordAsArray.length;
      let i = Math.round(Math.random() * wordLength);
      newWord = newWord.concat(wordAsArray.splice(i, 1));
    }
    return newWord.join("");
  }

  render() {
    let players = this.getSessionUserIds().map(user_id => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));

    let currentPlayer = this.state.playerList
      ? getPlayer(this.getMyUserId(), this.state.playerList)
      : null;

    if (this.state.gamePage === "play" && this.state.playerList) {
      return (
        <GamePage
          word={this.state.word}
          scrambledWord={this.state.scrambledWord}
          player={currentPlayer}
          guessWordFn={word => {
            this.guessWord_(word);
          }}
        />
      );
    } else {
      return (
        <div>
          <h1>Welcome to Unscrambled!!</h1>
          <ul>{players}</ul>
          <button onClick={() => this.letsGoClick()}>Let's Go!</button>
        </div>
      );
    }
  }
}

export { HomePage };
