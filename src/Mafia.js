import React, { Component } from 'react';
import firebase from 'firebase';
import Day from './Day.js';
import Night from './Night.js';
import Announcment from './Announcment.js';

var roles = {
    Mafia: {
        name: "Mafia",
        description: "Kill all the innocents and police force to win."
    },
    Citizen: {
        name: "Citizen",
        description: "Work together with the police to take down the crime group."
    },
    Police: {
        name: "Detective",
        description: "Investigate people to find who is a Mafia"
    },
    Doctors: {
        name: "Doctor",
        description: "Keep the Innocent alive"
    },
    Specate: {
        name: "Specator"
    }
};
export default class Mafia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            phase: 0,
            players: [],
            killedPlayers: []
        };
    }
    handleKill(databaseRef, id){
        
        var newArray = this.state.killedPlayers.concat([id]);
        
        this.setDataVar(databaseRef, "killedPlayers", newArray);
        console.log(id);
    }
    
    findMyPlayer() {
        var myId = firebase.auth().currentUser.uid;

        for (var i = 0; i < this.state.players.length; i++) {
            var temp = this.state.players[i];

            if (temp.id === myId) {
                return temp;
            }
        }

        return null;
    }

    shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    advancePhase(databaseRef) {

        var self = this;

        databaseRef.child("phase").once("value", function(snapshot) {

            var phase = snapshot.val();

            if (phase === 0)
                phase = 1;
            else if(phase === 1)
                phase = 2;
            else if(phase === 2)
                phase = 3;
            else if(phase === 3)
                phase = 4;
            else if(phase === 4)
                phase = 0;

            self.setDataVar(databaseRef, "phase", phase);

        });
    }

    setDataVar(databaseRef, name, value) {
        databaseRef.child(name).set(value, (error) => {
            if (error) {
                console.error("Error storing session metadata", error);
            }
        });
    }
    
    getDataVar(databaseRef, name){
        
        var result;
        
        databaseRef.child(name).once("value", (snapshot) => {
            result = snapshot.val();
        });
        
        return result;
    }



    componentWillMount() {

        var sessionId = this.props.match.params.id;
        var sessionDatabaseRef = firebase.database().ref("/session/" + sessionId);

        console.log(sessionDatabaseRef);

        var hostId = this.props.location.state.creator;
        var myId = firebase.auth().currentUser.uid;

        var userpath = "/session-metadata/" + sessionId + "/users/";
        var usersRef = firebase.database().ref(userpath);
        var players = [];


        if (myId === hostId) {

            usersRef.once("value", (snapshot) => {
                var users = snapshot.val();

                var numUsers = users.length;
                var numMafia = Math.ceil(numUsers / 3);

                this.shuffle(users);

                for (var i = 0; i < numMafia; i++) {
                    players.push({
                        id: users[i],
                        role: roles.Mafia
                    });
                }

                for (i = numMafia; i < numUsers; i++) {
                    players.push({
                        id: users[i],
                        role: roles.Citizen
                    });
                }

                this.setDataVar(sessionDatabaseRef, "players", players);
            });


            this.setDataVar(sessionDatabaseRef, "phase", 0);
            this.setDataVar(sessionDatabaseRef, "time", 5);

            var currentTime = 5;

            this.interval = setInterval(() => {
                currentTime--;

                if (currentTime < 0) {
                    currentTime = 10;
                    this.advancePhase(sessionDatabaseRef);
                }

                this.setDataVar(sessionDatabaseRef, "time", currentTime);
            }, 1000);
        }

        sessionDatabaseRef.child("time").on("value", (snapshot) => {
            this.setState({ time: snapshot.val() });
        });
        sessionDatabaseRef.child("phase").on("value", (snapshot) => {
            this.setState({ phase: snapshot.val() });
        });
        sessionDatabaseRef.child("players").on("value", (snapshot) => {
            this.setState({ players: snapshot.val() });
        });
        sessionDatabaseRef.child("killedPlayers").on("value", (snapshot) => {
            this.setState({ killedPlayers: snapshot.val() });
        });
    }

    render() {

        var content;
        var player = this.findMyPlayer();
        var databaseRef = firebase.database().ref("/session/" + this.props.match.params.id);
        
        if (player == null) {
            return (<div> Game has started </div>);
        }

        if (this.state.phase === 0) {
            content = (<Day players={this.state.players} currentPlayer={player}/>);
        //} else if (this.state.phase === 1){
          //  content = (<Voting players={this.state.players} currentPlayer={player}/>);
        }
        else if (this.state.phase === 1) {
            content = (<Night players={this.state.players} currentPlayer={player} handleKill={(id) => this.handleKill(databaseRef, id)}/>);
        }
        else if(this.state.phase === 2){
            content = (<Announcment killedPlayers={this.getDataVar(databaseRef, "killedPlayers")}/>);
        } 

        return (
            
                <div className="mafia">
                
                <p> {this.state.time} </p>
                
                <p> {player.role.name} </p>
                
                {content}
                
                </div>
        )
    }
}
