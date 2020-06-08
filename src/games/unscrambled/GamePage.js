import React, { Component } from "react";
import { GuessedWords } from "./GuessedWords.js";
import { isDone } from "./Objects.js";

export default class GamePage extends Component {
  readInput() {
    let textArea = document.getElementById("guesses");
    let value = textArea.value;
    this.props.guessWordFn(value);
    textArea.value = "";
  }

  getGuessedWords() {
    return this.props.player.guessedWords ? this.props.player.guessedWords : [];
  }

  render() {
    if (!this.props.player) {
      return <div>Uh oh, something went wrong!</div>;
    } else {
      return (
        <div>
          <div> [ {this.props.scrambledWord} ] </div>

          <textarea rows="1" type="text" id="guesses" />
          <button
            onClick={() => this.readInput()}
            disabled={isDone(this.props.player)}
          >
            Submit
          </button>
          <br />
          <br />
          <div id="tries">Tries Left: {4 - this.getGuessedWords().length}</div>
          <div id="points">Points: {this.props.player.points}</div>
          <GuessedWords
            wordList={this.getGuessedWords()}
            guessedRight={this.props.player.roundWon}
          />
        </div>
      );
    }
  }
}

export { GamePage };
