import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Header from './Header.js'
import Paper from 'material-ui/Paper';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import React, { Component } from 'react';
import WaitingRoom from './WaitingRoom.js';
import firebase from 'firebase';
import firebaseConfig from './firebaseConfig.js';
import gameData from './gameData.js';
import { Route } from 'react-router-dom';
import { UserApiConfig } from './UserApi.js';

const buttonStyle = {
  width: 56,
  height: 56,
  marginTop: 56,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authIsLoading: true,
      userApiIsLoading: true,
      user: null
    };
  }

  componentWillMount() {
    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(
        (user) => this.setState({
          authIsLoading: false,
          user: user
        }));

    UserApiConfig.startListeningForChanges().then(
        () => this.setState({ userApiIsLoading: false }));
  }

  componentWillUnmount() {
    UserApiConfig.stopListeningForChanges();
  }

  signIn() {
    this.setState({ authIsLoading: true });
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  render() {
    if (!this.state.authIsLoading && this.state.user === null) {
      return (
        <center>
          <FloatingActionButton
              style={buttonStyle}
              onClick={() => this.signIn()}>
            <PersonAdd />
          </FloatingActionButton>
        </center>
      );
    } else if (this.state.authIsLoading || this.state.userApiIsLoading) {
      return (
        <center>
          <Paper style={buttonStyle} circle={true}>
            <CircularProgress size={56} />
          </Paper>
        </center>
      );
    } else {
      var gameRoutes = Object.keys(gameData).map((type) => (
        <Route
            key={type}
            path={"/" + type + "/:id"}
            component={gameData[type].component} />
      ));
      return (
        <div>
          <Header />
          <Route path="/" component={WaitingRoom} exact />
          {gameRoutes}
        </div>
      );
    }
  }
}
