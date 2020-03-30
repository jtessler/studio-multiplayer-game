import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import firebase from 'firebase';

export default class WordGuessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: "",
      answer_uid: "",
      start: false,
      your_answer: "",
      your_uid: "",
    };
  }
  
  componentWillMount() {
    var id = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session/" + id);
    var currentUser = firebase.auth().currentUser.uid;
    this.setState({
        your_uid: currentUser
    })
    firebase.database().ref("/session/" + id + "/players/" + currentUser).set(true, (error) => {
      if (error) {
        console.error("Error storing session metadata", error);
      }
    });
    sessionDatabaseRef.on("value", (snapshot) => {
      var sessionSnapshot = snapshot.val();
      if (sessionSnapshot === null) {
        return;
      }
      console.log("sessionSnapshot");
      console.log(sessionSnapshot);
      if(Object.keys(sessionSnapshot["players"]).length > 1) {
          this.setState({
              start: true
          })
      }
      
      if("answer" in sessionSnapshot) {
          this.setState({
              answer: sessionSnapshot["answer"]["value"],
              answer_uid: sessionSnapshot["answer"]["uid"],
          })
      }
      
    });
  }

  componentWillUnmount() {
    var id = this.props.match.params.id;
    firebase.database().ref("/session/" + id).off();
  }
  
  handleAnswerText(event) {
    this.setState({your_answer: event.target.value});
  }
  
  submitAnswer(event) {
     var id = this.props.match.params.id;
     var sessionDatabaseRef = firebase.database().ref("/session/" + id + "/answer");
     sessionDatabaseRef.set({
         "value": this.state.your_answer,
         "uid": this.state.your_uid
     })
  }
  
  render() {
    if(!this.state.start) {
      return (<div>
        <h1>Waiting for opponent</h1>
        <CircularProgress size={60}/>
      </div>);
    }
    if(this.state.answer_uid === "") {
      return (<div>
        <h1>7 X 9</h1>
        <TextField
            name="Multiplication input"
            onChange={this.handleAnswerText.bind(this)} />
        <Button
            style={{marginLeft: 10}}
            variant="contained"
            onClick={this.submitAnswer.bind(this)}>
          Submit
        </Button>
      </div>);
    }
    var result;
    if (this.state.answer_uid === this.state.your_uid) {
      if (this.state.answer === "63") {
        result = this.state.answer + " is correct. You Won!";
      } else {
        result = this.state.answer + " is incorrect. You Lost!";
      }
    } else {
      if (this.state.answer === "63") {
        result = "Too slow. You Lost!"
      } else {
        result = "Your opponent was wrong. You Won!"
      }
        
    }
    return (<div>
      <h1>Game Over</h1>
      <h1>{result}</h1>
    </div>);
  }
}
