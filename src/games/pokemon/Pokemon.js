import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
// import AppBar from 'material-ui/AppBar';
import firebase from 'firebase'
import UserApi from '../../UserApi.js';
import Avatar from 'material-ui/Avatar';

export default class Pokemon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerOne: "", //this.state.playerOneName
            playerOneHealth: 0,
            playerOneTrainer: "",
            playerTwo: "",
            playerTwoHealth: 0,
            playerTwoTrainer: "",
        };
    }

    componentWillMount() {
        var id = this.props.match.params.id;
        this.sessionDatabaseRef = firebase.database().ref("/session/" + id);
        var currentUser = firebase.auth().currentUser.uid;

        this.sessionDatabaseRef.on("value", (snapshot) => {
            var sessionSnapshot = snapshot.val();
            if (sessionSnapshot === null) {
                return;
            }

            if (!sessionSnapshot.playerOne) {
                this.sessionDatabaseRef.update({ playerOne: currentUser });
            }
            else if (!sessionSnapshot.playerTwo && currentUser !== sessionSnapshot.playerOne) {
                this.sessionDatabaseRef.update({ playerTwo: currentUser });
            }

            this.setState({
                playerOne: sessionSnapshot.playerOne,
                playerOneHealth: sessionSnapshot.playerOneHealth,
                playerTwo: sessionSnapshot.playerTwo,
                playerTwoHealth: sessionSnapshot.playerTwoHealth,
            });
        });
    }


    randomNumber() {
       return Math.floor(Math.random() * 25) + 5;
    }

    playerOneAttack() {
        // make randam attack to bring score down
        this.sessionDatabaseRef.update({ playerTwoHealth: this.state.playerTwoHealth - this.randomNumber() });
    }

    playerTwoAttack() {
        // make randam attack to bring score down
        this.sessionDatabaseRef.update({ playerOneHealth: this.state.playerOneHealth - this.randomNumber() });
    }


    gameReset() {
        this.sessionDatabaseRef.update({ playerOneHealth: 100 });
        this.sessionDatabaseRef.update({ playerTwoHealth: 100 });
    }

    runScene(){
        console.log("Scene is Running")
    }

    checkWin() {

    }

    render() {

        let display
         if(this.state.playerOneHealth <= 0) {
             display = <h1>{UserApi.getName(this.state.playerTwo)} Wins</h1>
             this.gameReset()
         } else if(this.state.playerTwoHealth <= 0) {
             display = <h1>{UserApi.getName(this.state.playerOne)} Wins</h1>
             this.gameReset()
         }

        return (
            <div className="pokemon">
                <div id="mainTitle">
                    <h1> Pokemon Universe! </h1>
                    <RaisedButton label="Start/Reset" primary={true} onClick={this.gameReset.bind(this)}/>
                    {display}
                </div>
                <div className="playerOne">
                    <h2>Player 1: {UserApi.getName(this.state.playerOne)}</h2>
                    <Avatar src={UserApi.getPhotoUrl(this.state.playerOne)}/>
                    <h3> HP {this.state.playerOneHealth} </h3>
                    <div className="fixed-btns">
                        <RaisedButton className="Attack1" label="Attack" onClick={this.playerOneAttack.bind(this)}/>
                        <RaisedButton className ="Attack2" label="Run" onClick={this.gameReset.bind(this)}/>
                        <RaisedButton className = "Attack3" label="random1" />
                        <RaisedButton className = "Attack4" label="random2" />
                    </div>
                </div>
                <div id="mainBox">
                    <img alt='' className="battleImage" src="https://raw.githubusercontent.com/ijgreenidge/studio-multiplayer-game/master/src/images/Background1.png" />
                </div>
                <div class="playerTwo">
                    <div id="playerInfo2">
                    <h2>Player 2: {UserApi.getName(this.state.playerTwo)}</h2>
                    <h3> HP {this.state.playerTwoHealth} </h3>
                    <Avatar src={UserApi.getPhotoUrl(this.state.playerTwo)}/>
                    </div>
                    <div className="fixed-btns">
                        <RaisedButton className="Attack1" label="Attack" onClick={this.playerTwoAttack.bind(this)}/>
                        <RaisedButton className = "Attack2" label="Run" onClick={this.gameReset.bind(this)}/>
                        <RaisedButton className = "Attack3" label="random1" />
                        <RaisedButton className = "Attack4" label="random2" />
                    </div>
                </div>

            </div>

        );
    }
}
