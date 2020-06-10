import GameComponent from '../../GameComponent.js';
import React from 'react';
import { GameScreen } from "./GameScreen";

import './DuckHunt.css';

export default class DuckHunt extends GameComponent {
  constructor(props) {
    super(props);
    console.log(this.getSessionDatabaseRef().database.app)
    const currentUser = this.getMyUserId()
    this.state = {
      currentUser: currentUser,
      currentScreen: 'game', // game
      gameScore: {
        [currentUser]: 0
      },
    };
  }

  onSessionDataChanged(data) {
    // this function runs everytime the datebase changes
    // data is the latest date from database
    console.log(data)
    this.setState({
      currentUser: data.current_user,
      gameScore: data.gameScore ? data.gameScore : this.state.gameScore
      ,
    });
  }

  // isMyTurn() {
  //   return this.state.currentUser === this.getMyUserId();
  // }


  // getOtherUser() {
  //   return this.getSessionUserIds().find((uid) => {
  //     return uid !== this.getMyUserId();
  //   });
  // }
  handleClick = (event) => {
    console.log('WOWOWOW');
    this.setState({
      currentScreen: 'game',
    });
  }

  duckClick = () => {
    console.log("Duck Was Clicked");
    // this.addPoints(1);
    const currentScore = this.state.gameScore[this.getMyUserId()]
    console.log("addPoints 1 to" + currentScore)
    const gameScore = { [this.getMyUserId()]: currentScore + 1 }
    this.setState({gameScore}); 
  }

  addPoints = (points) => {
    const currentScore = this.state.gameScore[this.getMyUserId()]
    console.log("addPoints" + points + " to " + currentScore)
    const gameScore = { [this.getMyUserId()]: currentScore + points }
    this.setState({gameScore}); 
    console.log(this)
    this.getSessionDatabaseRef().set(gameScore, (error) => {
      console.log("updatedDatabase")
      if (error) {
        console.error("Error updating DuckHunt state", error);
      }
    });
  }



  render() {
    console.log(this.state.gameScore)
    const currentScore = this.state.gameScore[this.getMyUserId()]
    return (
      <div className="DuckHunt">
        <GameScreen 
        duckClick={this.duckClick}
        currentScore={currentScore}/>
      </div>
    );
  }
}
