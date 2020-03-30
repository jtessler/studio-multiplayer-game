import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import "./TugOfWar.css";

export default class TugOfWar extends GameComponent {
  constructor(props) {
    super(props);
    var myId = this.getMyUserId();
    var defaultValue = {};
    defaultValue[myId] = 0;
    //this.getSessionDatabaseRef().update(defaultValue);
    this.state = defaultValue;
  }

  onSessionDataChanged(data) {
    // data = {
    //   <user-id-1>: 100,
    //   <user-id-2>: 200,
    // }
    //
    this.setState(data);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setDocumentKeyPressHandler();
  }

  setDocumentKeyPressHandler() {
    document.body.onkeyup = e => {
      if (e.keyCode === 32 && !this.gameOver()) {
        var user = this.getMyUserId();
        var newCounter = this.state[user] + 1;
        this.getSessionDatabaseRef()
          .child(user)
          .set(newCounter);
      }
    };
  }

  gameOver() {
    var spacebarDifference = Math.abs(this.getSpaceBarDifference());
    if (spacebarDifference >= 25) {
      return true;
    } else {
      return false;
    }
  }

  componentWillUnmount() {
    document.body.onkeyup = null;
    super.componentWillUnmount();
  }

  getSpaceBarDifference() {
    var counters = this.getSessionUserIds().map(user_id => this.state[user_id]);

    var dif = counters[0] - counters[1];
    return dif;
  }

  getWinnerUserId() {
    var arr = this.getSessionUserIds().map(user_id => UserApi.getName(user_id));

    if (this.getSpaceBarDifference() < 0) {
      return arr[1];
    } else {
      return arr[0];
    }
  }

  onResetButtonClicked() {
    var arr = this.getSessionUserIds();
    var obj = {};
    obj[arr[0]] = 0;
    obj[arr[1]] = 0;
    this.getSessionDatabaseRef().update(obj);
  }

  render() {
    var winner = "TBD";
    var resetButton = <div />;
    if (this.gameOver()) {
      winner = this.getWinnerUserId();

      resetButton = (
        <button onClick={() => this.onResetButtonClicked()}>Reset</button>
      );
    }
    var marginLeft = this.getSpaceBarDifference() * 15;

    return (
      <div>
        <div className="text-Cen">
          <h3>HIT SPACE BAR AND WIN !!!!!</h3>
          <br />
          <h1>Winner: {winner}</h1>
          <br />
          <div>{resetButton}</div>
          <br />
        </div>
        <div className="main">
          <div className="ropeBorder">
            <div className="rope " style={{ marginLeft: marginLeft }}>
              <div className="marker" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
