import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import UserApi from '../../UserApi.js';
import firebase from 'firebase';

/*
 * Database schema:
 *  - left: // Left player one == creator
 *    - userid: User id
 *    - height: Integer position of the top of paddle
 *  - right: // Right player two == creator
 *    - userid: User id (0 if one-player game)
 *    - height: Integer position of the top of paddle
 *  - ball:
 *    - x: Integer ball horizontal position
 *    - y: Integer ball veritical position
 *  - winner: null until game over then user id of winner
 *  - started: Boolean of whether or not game has started
 */

const W = 500, H = 500; // Size of game
const R = 20; // Radius of ball
const paddleWidth = 10, paddleHeight = 100;

export default class Pong extends Component {
  constructor(props) {
    super(props);
    this.user = firebase.auth().currentUser.uid;
    this.isCreator = this.user === props.location.state.creator;
    this.session = firebase.database().ref(`/session/${props.location.state.id}`);
    if(this.isCreator) {
      this.player = this.session.child("left");
    } else {
      this.player = this.session.child("right");
    }
    this.ball = this.session.child("ball");
    this.state = {winner: false, started: false};
    this.started = this.session.child("started");
    this.started.on("value", (snapshot) => {
      if(snapshot.val()) {
        this.onGameStarted();
      }
    });
    this.winner = this.session.child("winner");
    this.winner.on("value", (snapshot) => {
      if(snapshot.val() !== false) {
        this.onGameOver();
      }
    });
    this.session.on("value", (snapshot) => {
      this.setState(snapshot.val());
    });
  }

  onGameStarted() {
    if(this.isCreator) {
      var initState = {
        winner: false,
        started: true,
        ball: {
          x: W/2 - R,
          y: H/2 - R,
          dx: Math.random() * -3 - 2,
          dy: Math.random() * 6 - 3,
        },
        left: {
          userid: this.user,
          height: H/2 - paddleHeight/2,
        },
        right: {
          height: H/2 - paddleHeight/2,
        },
      };
      if(this.props.location.state.users.length === 1) {
        initState.right.userid = 0;
      } else {
        this.props.location.state.users.forEach(uid => {
          if(uid !== this.user) {
            initState.right.userid = uid;
          }
        });
      }
      this.session.set(initState);
      this.setState(initState);
      this.interval = setInterval(() => this.gameLoop(), 10);
    }
  }

  gameLoop() {
    this.updateBall();
    // For one player game keep computer player paddle centered on ball
    if(this.state.right.userid === 0) {
      this.session.update({
        "right/height": this.state.ball.y + R - paddleHeight/2
      });
    }
  }

  updateBall() {
    var {x, y, dx, dy} = this.state.ball;
    if(x <= 2*paddleWidth && y + 2*R >= this.state.left.height &&
      y <= this.state.left.height + paddleHeight) {
      dx = -dx; // Hit left paddle
    } else if(x + 2*R >= W - 2*paddleWidth && y + 2*R >= this.state.right.height &&
      y <= this.state.right.height + paddleHeight) {
      dx = -dx; // Hit right paddle
    } else if(x <= 0) {
      this.winner.set(this.state.right.userid); // Hit left wall
    } else if(x + 2*R >= W) {
      this.winner.set(this.state.left.userid); // Hit right wall
    }
    if(y <= 0 || y + 2*R >= H) {
      dy = -dy; // Hit top/bottom
    }
    this.ball.update({ x: x + dx, y: y + dy, dx: dx, dy: dy });
  }

  onMouseMove(e) {
    this.player.update({height: e.clientY - paddleHeight});
  }

  onGameOver(uid) {
    if(this.interval) {
      clearInterval(this.interval);
      this.interval = false;
    }
    if(this.state.started) {
      this.started.set(false);
    }
  }

  componentWillUnmount() {
    this.session.off();
    this.started.off();
    this.winner.off();
    this.onGameOver();
  }

  render() {
    if(this.state.started === false) {
      return (
        <div style={{textAlign: 'center'}}>
          { this.state.winner !== false &&
            <h1>Game Over: {this.state.winner === 0 ?  'Computer':
                UserApi.getName(this.state.winner)} won</h1>
          }
          <Button
              style={{margin: 10}}
              variant="contained"
              onClick={() => this.started.set(true)}>
            Start Game
          </Button>
          <div style={{
              display:'flex',
              justifyContent: 'center',
          }}>
            <Typography variant="title">
              Users:
            </Typography>
            {this.props.location.state.users.map((uid) =>
              <Avatar
                  key={uid}
                  style={{marginLeft: 10}}
                  src={UserApi.getPhotoUrl(uid)} />
            )}
          </div>
        </div>
      );
    }
    return (
      <div style={{
        margin: '30px auto', position: 'relative', backgroundColor: 'black',
        width: W+'px', height: H+'px', cursor: 'none',
      }} onMouseMove={(e) => this.onMouseMove(e)}>
      <div style={{
        position: 'absolute', backgroundColor: 'white',
        width: paddleWidth+'px', height: paddleHeight+'px',
        top: this.state.left.height+'px', left: paddleWidth+'px',
      }}></div>
      <div style={{
        position: 'absolute', backgroundColor: 'white',
        width: paddleWidth+'px', height: paddleHeight+'px',
        top: this.state.right.height+'px', right: paddleWidth+'px',
      }}></div>
      <div style={{
        position: 'absolute', backgroundColor: 'white',
        width: 2*R+'px', height: 2*R+'px', borderRadius: R+'px',
        top: this.state.ball.y+'px', left: this.state.ball.x+'px',
      }}></div>
      </div>
    );
  }
}
