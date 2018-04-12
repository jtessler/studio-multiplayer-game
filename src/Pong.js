import React, { Component } from 'react';
import UserApi from './UserApi.js';
import firebase from 'firebase';

/*
 * Database schema:
 *  - players:
 *    - "$userid": Integer position of paddle
 *  - ball:
 *    - x: Integer ball horizontal position
 *    - y: Integer ball veritical position
 *  - winner: null until game over then user id of winner
 */

const W = 500, H = 500; // Size of game
const R = 20; // Radius of ball
const paddleWidth = 10, paddleHeight = 100;

const err = (error) => {
  if(error) {
    console.error("Error communicating with firebase", error);
  }
}

export default class Pong extends Component {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser.uid;
    this.isCreator = this.user === props.location.state.creator;
    this.session = firebase.database().ref(`/session/${props.location.state.id}`);
    this.state = {
      ball: {
        x: W/2 - R,
        y: H/2 - R,
        dx: 0,
        dy: 0,
      },
      players: {
        [this.user]: H/2,
      },
      winner: null,
    };
    this.player = this.session.child("players").child(this.user);
    this.player.set(H/2, err);
    if(this.isCreator) {
      this.ball = this.session.child("ball");
      this.state.ball.dx = Math.random() * -3 - 2;
      this.state.ball.dy = Math.random() * 6 - 3;
      this.ball.set(this.state.ball, err);
      this.interval = setInterval(() => this.updateBall(), 10);
    }
    this.session.on("value", (snapshot) => {
      this.setState(snapshot.val());
    })
  }

  updateBall() {
    var update = {};
    var {x, y, dx, dy} = this.state.ball;
    // TODO check for paddle collision
    if(x + dx < 0 || x + dx + R > W) {
      dx = -dx;
      update.dx = dx;
      // TODO this should trigger game over
    }
    update.x = x + dx;
    if(y + dy < 0 || y + dy + R > H) {
      dy = -dy;
      update.dy = dy;
    }
    update.y = y + dy;
    // TODO add corner checks?
    this.ball.update(update);
  }

  componentWillUnmount() {
    this.session.off();
    if(this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    if(this.state.winner !== null) {
      return (
        <div style={{display: 'flex'}}>
          <h1>Game Over</h1>
          <h2>{UserApi.getName(this.state.winner)} won</h2>
        </div>
      );
    }
    return (
      <div style={{
        margin: '30px auto', position: 'relative',
        width: W+'px', height: H+'px',
        backgroundColor: 'black',
      }}>
      <div style={{
        position: 'absolute',
        width: paddleWidth+'px', height: paddleHeight+'px',
        top: (this.state.players[this.user] - paddleHeight/2)+'px',
        left: paddleWidth+'px',
        backgroundColor: 'white',
      }}></div>
      <div style={{
        position: 'absolute',
        width: 2*R+'px', height: 2*R+'px', borderRadius: R+'px',
        top: this.state.ball.y+'px', left: this.state.ball.x+'px',
        backgroundColor: 'white',
      }}></div>
      </div>
    );
  }
}
