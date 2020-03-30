import GameComponent from "../../GameComponent.js";
import React from "react";
import UserApi from "../../UserApi.js";
import Scorebored from "./Scorebored.js";
import Cookie from "./Cookie.js";
import GameOver from "./GameOver.js";

export default class CookieClicker extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      hostScore: 0,
      guestScore: 0,
      hasGameStarted: false,
      timelefts: 0,
      timeleftm: 0
    };
    this.getSessionDatabaseRef().update(this.state);
  }

  multipleClicks(number, cost) {
    if (this.getSessionCreatorUserId() === this.getMyUserId()) {
      this.getSessionDatabaseRef().update({
        hostScore: this.state.hostScore - cost
      });
      let that = this;
      let interval = setInterval(function() {
        if (that.state.timelefts === 0 && that.state.timeleftm <= 0) {
          clearInterval(interval);
        }
        that.getSessionDatabaseRef().update({
          hostScore: that.state.hostScore + number
        });
      }, 3000);
    } else {
      this.getSessionDatabaseRef().update({
        guestScore: this.state.guestScore - cost
      });
      let that = this;
      let interval = setInterval(function() {
        if (that.state.timelefts === 0 && that.state.timeleftm <= 0) {
          clearInterval(interval);
        }
        that.getSessionDatabaseRef().update({
          guestScore: that.state.guestScore + number
        });
      }, 3000);
    }
  }

  onSessionDataChanged(data) {
    this.setState({
      hostScore: data.hostScore,
      guestScore: data.guestScore,
      hasGameStarted: data.hasGameStarted,
      timeleftm: data.timeleftm,
      timelefts: data.timelefts
    });
  }

  updateScore() {
    if (this.getSessionCreatorUserId() === this.getMyUserId()) {
      this.getSessionDatabaseRef().update({
        hostScore: this.state.hostScore + 1
      });
    } else {
      this.getSessionDatabaseRef().update({
        guestScore: this.state.guestScore + 1
      });
    }
  }

  winningOrLosing() {
    var winner = null;
    if (this.state.hostScore > this.state.guestScore) {
      winner = this.getSessionCreatorUserId();
    } else if (this.state.hostScore < this.state.guestScore) {
      winner = this.getSessionUserIds()[1];
    }
    if (winner === null) {
      return "Tied";
    } else if (winner === this.getMyUserId()) {
      return "Winning";
    } else {
      return "Losing";
    }
  }
  winOrLos() {
    var winner = null;
    if (this.state.hostScore > this.state.guestScore) {
      winner = this.getSessionCreatorUserId();
    } else if (this.state.hostScore < this.state.guestScore) {
      winner = this.getSessionUserIds()[1];
    }
    if (winner === null) {
      return "Tied";
    } else if (winner === this.getMyUserId()) {
      return "You win";
    } else {
      return "you lost";
    }
  }

  startGame(time) {
    this.getSessionDatabaseRef().update({
      timeleftm: time,
      timelefts: 0,
      hasGameStarted: true
    });
    var that = this;
    var interval = setInterval(function() {
      if (that.state.timelefts === 0) {
        if (that.state.timeleftm <= 0) {
          clearInterval(interval);
        } else {
          that.state.timelefts = 59;
          that.state.timeleftm = that.state.timeleftm - 1;
        }
      } else {
        that.state.timelefts = that.state.timelefts - 1;
      }
      that.getSessionDatabaseRef().update({
        timeleftm: that.state.timeleftm,
        timelefts: that.state.timelefts,
        hasGameStarted: true
      });
    }, 1000);
  }

  render() {
    // var id = this.getSessionId();
    //  var users = this.getSessionUserIds().map(user_id => (
    //    < li key={user_id}>{UserApi.getName(user_id)}</li>
    //  ));
    if (
      !this.state.hasGameStarted &&
      this.getSessionCreatorUserId() === this.getMyUserId()
    ) {
      return (
        <div className="buttonholder">
          <button
            className="stime"
            id="fivem"
            onClick={() => this.startGame(1)}
          >
            1 minuts
          </button>
          <button
            className="stime"
            id="fivem"
            onClick={() => this.startGame(5)}
          >
            5 minuts
          </button>
          <button
            className="stime"
            id="tenm"
            onClick={() => this.startGame(10)}
          >
            10 minuts
          </button>
          <button
            className="stime"
            id="fithteenm"
            onClick={() => this.startGame(15)}
          >
            15 minuts
          </button>
        </div>
      );
    } else if (!this.state.hasGameStarted) {
      return (
        <div>
          <p>Waiting for Host to start the game</p>
        </div>
      );
    } else if (
      this.state.hasGameStarted &&
      this.getSessionCreatorUserId() === this.getMyUserId()
    ) {
      if (this.state.timeleftm === 0 && this.state.timelefts === 0) {
        return (
          <div>
            <GameOver
              winOrLoss={this.winOrLos()}
              startTimemin={this.state.timeleftm}
              startTimesec={this.state.timelefts}
            />
          </div>
        );
      } else {
        return (
          <div>
            <Scorebored
              PlayerOne={UserApi.getName(this.getSessionUserIds()[0])}
              PlayerTwo={UserApi.getName(this.getSessionUserIds()[1])}
              p1s={this.state.hostScore}
              p2s={this.state.guestScore}
              winOrLoss={this.winningOrLosing()}
              startTimemin={this.state.timeleftm}
              startTimesec={this.state.timelefts}
              currentScore={this.state.hostScore}
              multipleClicks={(number, cost) =>
                this.multipleClicks(number, cost)
              }
            />
            <Cookie
              clickHandler={() => this.updateScore()}
              score={this.state.hostScore}
            />
          </div>
        );
      }
    } else if (
      this.state.hasGameStarted &&
      this.getSessionCreatorUserId() !== this.getMyUserId()
    ) {
      if (this.state.timeleftm === 0 && this.state.timelefts === 0) {
        return (
          <div>
            <GameOver
              winOrLoss={this.winOrLos()}
              startTimemin={this.state.timeleftm}
              startTimesec={this.state.timelefts}
            />
          </div>
        );
      } else {
        return (
          <div>
            <Scorebored
              PlayerOne={UserApi.getName(this.getSessionUserIds()[1])}
              PlayerTwo={UserApi.getName(this.getSessionUserIds()[0])}
              p1s={this.state.guestScore}
              p2s={this.state.hostScore}

              winOrLoss={this.winningOrLosing()}
              startTimemin={this.state.timeleftm}
              startTimesec={this.state.timelefts}
              currentScore={this.state.guestScore}
              multipleClicks={(number, cost) =>
                this.multipleClicks(number, cost)
              }
            />
            <Cookie
              clickHandler={() => this.updateScore()}
              score={this.state.guestScore}
            />
          </div>
        );
      }
    }
  }
}
