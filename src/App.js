import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Header from './Header.js'
import Paper from 'material-ui/Paper';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import React, { Component } from 'react';
import WaitingRoom from './WaitingRoom.js';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig.js';
import { Route } from 'react-router-dom';

const buttonStyle = {
  width: 56,
  height: 56,
  marginTop: 56,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null
    };
  }

  componentWillMount() {
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(
        (user) => this.setState({
          loading: false,
          user: user
        }));

    firebase.auth().getRedirectResult().then(
        (result) => {
          if (result.user) {
            this.logSignIn(result.user);
          }
        },
        (error) => { console.error("Failed to sign in", error) });
  }

  logSignIn(user) {
    var userData = {
      name: user.displayName,
      lastSignIn: firebase.database.ServerValue.TIMESTAMP,
    }
    var userDatabaseRef = firebase.database().ref('/user/' + user.uid);

    userDatabaseRef.set(userData).catch(
        (error) => console.error("Error storing user metadata", error));
  }

  signIn() {
    this.setState({ loading: true });
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  render() {
    if (this.state.loading) {
      return (
        <center>
          <Paper style={buttonStyle} circle={true}>
            <CircularProgress size={56} />
          </Paper>
        </center>
      );
    } else if (this.state.user === null) {
      return (
        <center>
          <FloatingActionButton
              style={buttonStyle}
              onClick={() => this.signIn()}>
            <PersonAdd />
          </FloatingActionButton>
        </center>
      );
    } else {
      return (
        <div>
          <Header />
          <Route path="/" component={WaitingRoom} exact />
        </div>
      );
    }
  }
}
