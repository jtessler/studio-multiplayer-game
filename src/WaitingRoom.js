import AddGameButton from './AddGameButton.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import GameCard from './GameCard.js';
import React, { Component } from 'react';
import firebase from 'firebase';

const cardStyle = {
  marginTop: 14,
};

export default class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = { sessions: null };
  }

  componentWillMount() {
    var sessionsDatabaseRef = firebase.database().ref("/session-metadata");
    sessionsDatabaseRef.on("value", (snapshot) => {
      var sessionsSnapshot = snapshot.val();
      if (sessionsSnapshot === null) {
        this.setState({ sessions: [] });
        return;
      }

      var sessions = Object.keys(sessionsSnapshot).map((id) => {
        return {
          id: id,
          type: sessionsSnapshot[id].type,
          users: sessionsSnapshot[id].users,
          creator: sessionsSnapshot[id].creator,
          timestamp: sessionsSnapshot[id].timestamp,
        };
      });
      this.setState({ sessions: sessions });
    });

    document.title = "Studio Games!"
  }

  componentWillUnmount() {
    firebase.database().ref("/session-metadata").off();
  }

  render() {
    if (this.state.sessions === null) {
      return (
        <center style={cardStyle}>
          <CircularProgress size={56} />
        </center>
      )
    }

    var cards = this.state.sessions.map((session) => (
      <GameCard
          key={session.id}
          style={cardStyle}
          session={session} />
    ));

    return (
      <div>
        <AddGameButton style={cardStyle} />
        {cards}
      </div>
    );
  }
}
