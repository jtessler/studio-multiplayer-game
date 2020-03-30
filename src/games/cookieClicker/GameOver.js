import React from "react";
import "./cookie.css";

export default class GameOver extends React.Component {
  render() {
    return (
      <div>
        <div>
          <p className="GOV">Game Over</p>
          <p className="WOR">{this.props.winOrLoss}</p>

        </div>
      </div>
    );
  }
}
