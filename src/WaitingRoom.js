import AddGameButton from './AddGameButton.js';
import FilterButton from './FilterButton.js';
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
    this.state = {
        sessions: null,
        filterType: "all",
    };
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

  onFilterGames(filterType) {
    this.setState({ filterType });
  }

  render() {
    if (this.state.sessions === null) {
      return (
        <center style={cardStyle}>
          <CircularProgress size={56} />
        </center>
      )
    }

    let sessions = [];
    if(this.state.filterType === "all") {
        sessions = this.state.sessions
    } else if (this.state.filterType === "myGames") {
        sessions = this.state.sessions.filter((session) => {
            return session.creator === firebase.auth().currentUser.uid;
        })
    }

    var cards = sessions.map((session) => (
      <GameCard
          key={session.id}
          style={cardStyle}
          session={session} />
    ));

    return (
      <div>
        <AddGameButton style={cardStyle} />
        <FilterButton style={cardStyle} onFilterGames={(f)=>this.onFilterGames(f)} />
        {cards}
      </div>
    );
  }
}
