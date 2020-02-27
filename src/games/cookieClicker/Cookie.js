import React from "react";

export default class ClickableCookie extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.score}</p>
        <img
          alt=""
          className="cookie"
          src="/games/cookieClicker/Cooky.png"
          onClick={this.props.clickHandler}
        />
        <audio className="music" id="myAudio" controls autoplay loop>
          <source src="/games/cookieClicker/win.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}
