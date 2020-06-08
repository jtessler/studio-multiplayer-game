import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import "./StrengthTester.css";

export default class StrengthTester extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      rope: 0
    };
    this.getSessionDatabaseRef().set({ rope: 0 });
  }

  onSessionDataChanged(data) {
    console.log("Data changed");
    this.setState({ rope: data.rope });
  }

  handleButtonClick(isHost) {
    console.log("Button clicked");
    if (isHost) {
      this.getSessionDatabaseRef().set({ rope: this.state.rope - 1 });
    } else {
      this.getSessionDatabaseRef().set({ rope: this.state.rope + 1 });
    }
  }
  rightWidth() {
    if (this.state.rope >= 0) {
      return "0%";
    } else {
      return this.state.rope * -7 + "%";
    }
  }

  leftWidth() {
    if (this.state.rope <= 0) {
      return "0%";
    } else {
      return this.state.rope * 7 + "%";
    }
  }

  render() {
    var isHost = this.getSessionCreatorUserId() === this.getMyUserId();
    var usersName = this.getSessionUserIds().map(user_id =>
      UserApi.getName(user_id)
    );
    var hostName = usersName[0];
    var guestName = usersName[1];
    /**.Host wins, smiley on Host screen  isHost*/
    /**.Host wins, sad face on guest screen !isHost */
    /**.Guest wins, smiley on guest screen */
    /**.Guest wins, sad face on host screen */
    if (this.state.rope <= -10 && isHost) {
      return (
        <div>
          <div className="centercontent">
            <p>
              {hostName} wins, {guestName} lost
            </p>
          </div>
          <div className="centercontent">
            <img
              id="happy"
              src="/games/StrengthTester/happy-face.png"
              alt="happy face"
            />
          </div>
        </div>
      );
    } else if (this.state.rope <= -10 && !isHost) {
      return (
        <div>
          <div className="centercontent">
            <p>
              {hostName} wins, {guestName} lost
            </p>
          </div>
          <div className="centercontent">
            <img
              id="sad"
              src="/games/StrengthTester/sadface.png"
              alt="sad face"
            />
          </div>
        </div>
      );
    } else if (this.state.rope >= 10 && isHost) {
      return (
        <div>
          <div className="centercontent">
            <p>
              {guestName} wins, {hostName} lost
            </p>
          </div>
          <div className="centercontent">
            <img
              id="sad"
              src="/games/StrengthTester/sadface.png"
              alt="sad face"
            />
          </div>
        </div>
      );
    } else if (this.state.rope >= 10 && !isHost) {
      return (
        <div>
          <div className="centercontent">
            <p>
              {guestName} wins, {hostName} lost
            </p>
          </div>
          <div className="centercontent">
            <img
              id="happy"
              src="/games/StrengthTester/happy-face.png"
              alt="happy face"
            />
          </div>
        </div>
      );
    } else {
      /* host and guest are still playing */
      return (
        <div id="strengthtester">
          <div className="centercontent">
            <div id="left" style={{ width: this.leftWidth() }} />
            <img id="knot" src="/games/StrengthTester/rope.png" alt="knot" />
            <div id="right" style={{ width: this.rightWidth() }} />
          </div>
          <div className="centercontent">
            <button id="button" onClick={() => this.handleButtonClick(isHost)}>
              Pulling the rope.
            </button>
          </div>
        </div>
      );
    }
  }
}
