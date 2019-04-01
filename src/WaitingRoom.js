import AddGameButton from './AddGameButton.js';
import FilterSelect from './FilterSelect.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import GameCard from './GameCard.js';
import React, { Component } from 'react';
import firebase from 'firebase';

const cardStyle = {
  marginTop: 14,
};

export const FILTER_TYPE = Object.freeze({
  ALL: 0,
  MY_GAMES: 1,
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
    this.setState({ filterType });
  }

  getFilterFunction() {
    switch (this.state.filterType) {
      case FILTER_TYPE.ALL:
        return (session) => true; // no-op
      case FILTER_TYPE.MY_GAMES:
        return (session) => session.creator === firebase.auth().currentUser.uid;
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
