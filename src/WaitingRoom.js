import AddGameButton from './AddGameButton.js';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import React, { Component } from 'react';
import firebase from 'firebase';
import { Card, CardActions, CardTitle } from 'material-ui/Card';

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
          minUsers: sessionsSnapshot[id].minUsers,
          maxUsers: sessionsSnapshot[id].maxUsers,
          users: sessionsSnapshot[id].users,
          creator: sessionsSnapshot[id].creator,
          timestamp: sessionsSnapshot[id].timestamp,
        };
      });
      this.setState({ sessions: sessions });
    });
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

    var cards = this.state.sessions.map((session) => {
      var subtitle = session.users.length + "/" + session.maxUsers +
          " users waiting to start";
      var path = "/" + session.type + "/" + session.id;
      return (
        <Card key={session.id}>
          <CardTitle
              style={cardStyle}
              title={session.type}
              subtitle={subtitle} />
          <CardActions>
            <FlatButton label="Join" href={path} />
          </CardActions>
        </Card>
      );
    });

    return (
      <div>
        <AddGameButton style={cardStyle} />
        {cards}
      </div>
    );
  }
}
