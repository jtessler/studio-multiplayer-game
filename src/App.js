import CircularProgress from '@material-ui/core/CircularProgress';
import DataViewer from './DataViewer.js';
import Fab from '@material-ui/core/Fab';
import Header from './Header.js'
import PersonAdd from '@material-ui/icons/PersonAdd';
import React, { Component } from 'react';
import UnknownGameType from './UnknownGameType.js';
import WaitingRoom from './WaitingRoom.js';
import firebase from 'firebase';
import gameData from './gameData.js';
import { Route, Switch } from 'react-router-dom';
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
    firebase.initializeApp({
      apiKey: "AIzaSyCJPYgNY-rgkZul563iUipYrFKD7BLt_HA",
      authDomain: "studio-multiplayer-game.firebaseapp.com",
      databaseURL: "https://studio-multiplayer-game.firebaseio.com",
      projectId: "studio-multiplayer-game",
      storageBucket: "studio-multiplayer-game.appspot.com",
      messagingSenderId: "953054375831"
    });

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
          <Fab
              style={buttonStyle}
              onClick={() => this.signIn()}>
            <PersonAdd />
          </Fab>
        </center>
      );
    } else if (this.state.authIsLoading || this.state.userApiIsLoading) {
      return (
        <center>
          <CircularProgress
              style={buttonStyle}
              size={56} />
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
          <Switch>
            <Route path="/" component={WaitingRoom} exact />
            <Route path="/dataViewer" component={DataViewer} exact />
            {gameRoutes}
            <Route
                path={"/:type/:id"}
                component={UnknownGameType} exact />
          </Switch>
        </div>
      );
    }
  }
}
