import React from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

const SESSION_DATA_PATH = "/session";
const SESSION_METADATA_PATH = "/session-metadata";

export default class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creator: props.location.state.creator || "",
      users: props.location.state.users || [],
      title: props.location.state.title || "Studio Games!",
    };
    document.title = this.state.title;
  }

  /**
   * Called whenever the session data stored at '/session/<id>/' changes.
   * Passes said data as the argument. Guaranteed non-null.
   */
  onSessionDataChanged(data) {
    // No-op by default.
  }

  /**
   * Called whenever the session metadata stored at '/session-metadata/<id>/'
   * changes. Passes said data as the argument. Guaranteed non-null.
   */
  onSessionMetadataChanged(metadata) {
    // No-op by default.
  }

  /**
   * Returns a Firebase real-time database reference to the current session
   * data, i.e. '/session/<id>/'.
   */
  getSessionDatabaseRef() {
    return firebase.database()
        .ref(SESSION_DATA_PATH)
        .child(this.getSessionId());
  }

  /**
   * Returns a Firebase real-time database reference to the current session
   * metadata, i.e. '/session-metadata/<id>/'.
   */
  getSessionMetadataDatabaseRef() {
    return firebase.database()
        .ref(SESSION_METADATA_PATH)
        .child(this.getSessionId());
  }

  /** Returns the current session ID as stored in Firebase.  */
  getSessionId() {
    return this.props.match.params.id;
  }

  /** Returns the list of user IDs connected to the current session.  */
  getSessionUserIds() {
    return this.state.users;
  }

  /** Returns the user ID of the one who created this current session. */
  getSessionCreatorUserId() {
    return this.state.creator;
  }

  /** Returns the session title, e.g., "Rock, Paper, Scissors" */
  getSessionTitle() {
    return this.state.title;
  }

  /** Returns the user ID of the current user, i.e. YOU. */
  getMyUserId() {
    return firebase.auth().currentUser.uid;
  }

  componentWillMount() {
    this.getSessionDatabaseRef().on("value", snapshot => {
      if (snapshot.val() !== null) {
        this.onSessionDataChanged(snapshot.val());
      }
    });

    this.getSessionMetadataDatabaseRef().on("value", snapshot => {
      let data = snapshot.val();
      if (data !== null) {
        let title = this.state.title;
        if (data.type in gameData) {
          title = gameData[data.type].title;
        }
        document.title = title;
        this.setState({
          creator: data.creator,
          users: data.users,
          title: title,
        });
        this.onSessionMetadataChanged(data);
      }
    });
  }

  componentWillUnmount() {
    this.getSessionDatabaseRef().off();
    this.getSessionMetadataDatabaseRef().off();
  }
}
