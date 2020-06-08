import React, { Component } from "react";

export default class GuessedWords extends Component {
  render() {
    let note = "";
    let note2 = "";
    if (this.props.guessedRight) {
      note = <h1 className="correct">You guessed correct!</h1>;
      note2 = <p>(Waiting for other players to finish round)</p>;
    } else if (this.props.wordList.length > 3) {
      note = <h1 className="guess-limit"> You ran out of guesses! </h1>;
      note2 = <p>(Waiting for other players to finish round)</p>;
    }
    return (
      <div>
        {note}
        {note2}
        <br />
        Guesses:
        <ol>
          {this.props.wordList.map((item, index) => (
            <li key={index}> {item} </li>
          ))}
        </ol>
      </div>
    );
  }
}

export { GuessedWords };
