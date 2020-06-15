import AddGameButton from './AddGameButton.js';
import FilterSelect from './FilterSelect.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import GameCard from './GameCard.js';
import React, { Component } from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

const cardStyle = {
  marginTop: 14,
};

export const FILTER_TYPE = Object.freeze({
  ALL_GAMES: 0,
  MY_GAMES: 1,
  GAMES_WITH_SPACE: 2,
  GAMES_I_AM_IN: 3,
});

export default class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
        sessions: null,
        filterType: FILTER_TYPE.MY_GAMES,
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
    firebase.analytics().logEvent('select_content', {
      content_type: 'filter_games',
      item_id: filterType
    });

    this.setState({ filterType });
  }

  getFilterFunction() {
    var my_uid = firebase.auth().currentUser.uid;

    switch (this.state.filterType) {
      case FILTER_TYPE.ALL_GAMES:
        return (session) => true; // no-op
      case FILTER_TYPE.MY_GAMES:
        return (session) => session.creator === my_uid;
      case FILTER_TYPE.GAMES_WITH_SPACE:
        return (session) => {
          return session.type in gameData &&
              session.users.length < gameData[session.type].maxUsers;
        }
      case FILTER_TYPE.GAMES_I_AM_IN:
        return (session) => session.users.indexOf(my_uid) >= 0;
      default: // Log an error.
        console.log("There's been an Error");
    }
  }

  render() {
    if (this.state.sessions === null) {
      return (
        <center style={cardStyle}>
          <CircularProgress size={56} />
        </center>
      )
    }

    var sessions = this.state.sessions.filter(this.getFilterFunction());

    // Sort by timestamp (in reverse).
    sessions.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    var cards = sessions.map((session) => (
      <GameCard
          key={session.id}
          style={cardStyle}
          session={session} />
    ));

    return (
      <div >
        <div style={{display:'flex', justifyContent: 'space-between', margin: '20px'}}>
          <FilterSelect 
                style={cardStyle}
                filterType={this.state.filterType}
                onFilterGames={(f)=>this.onFilterGames(f)} />
          <AddGameButton style={cardStyle} />
        </div>
        {cards}
      </div>
    );
  }
}
