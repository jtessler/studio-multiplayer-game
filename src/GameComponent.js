import React from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

const SESSION_DATA_PATH = "/session";
const SESSION_METADATA_PATH = "/session-metadata";

export default class GameComponent extends React.Component {
  constructor(props) {
    super(props);
    document.title = this.getSessionTitle();
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
    if (this.props &&
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id) {
      return this.props.match.params.id;
    }
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.id) {
      return this.props.location.state.id;
    }
    throw new Error("Unable to get session ID from URL nor browser history");
  }

  /** Returns the list of user IDs connected to the current session.  */
  getSessionUserIds() {
    if (this.state &&
        this.state.metadata &&
        this.state.metadata.users) {
      return this.state.metadata.users;
    }
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.users) {
      return this.props.location.state.users;
    }
    console.warn("Session user list not yet available, using empty list");
    return [];
  }

  /** Returns the user ID of the one who created this current session. */
  getSessionCreatorUserId() {
    if (this.state &&
        this.state.metadata &&
        this.state.metadata.creator) {
      return this.state.metadata.creator;
    }
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.creator) {
      return this.props.location.state.creator;
    }
    console.warn("Session creator ID not yet available, using empty string");
    return "";
  }

  /** Returns the session title, e.g., "Rock, Paper, Scissors" */
  getSessionTitle() {
    if (this.state &&
        this.state.metadata &&
        this.state.metadata.title) {
      return this.state.metadata.title;
    }
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.title) {
      return this.props.location.state.title;
    }
    return "Studio Games!";  // Silently fall back to default value.
  }

  /** Returns the user ID of the current user, i.e. YOU. */
  getMyUserId() {
    if (firebase.auth() &&
        firebase.auth().currentUser &&
        firebase.auth().currentUser.uid) {
      return firebase.auth().currentUser.uid;
    }
    throw new Error("Unable to get current user ID");
  }

  componentDidMount() {
    this.getSessionDatabaseRef().on("value", snapshot => {
      if (snapshot.val() !== null) {
        this.onSessionDataChanged(snapshot.val());
      }
    });

    this.getSessionMetadataDatabaseRef().on("value", snapshot => {
      let data = snapshot.val();
      if (data !== null) {
        let sessionMetadata = {
          creator: data.creator,
          users: data.users,
        }
        if (data.type in gameData) {
          sessionMetadata.title = gameData[data.type].title;
        }
        let newState = this.state || {};
        newState.metadata = sessionMetadata;
        this.setState(newState);
        this.onSessionMetadataChanged(data);
      }
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    document.title = this.getSessionTitle();
  }

  componentWillUnmount() {
    this.getSessionDatabaseRef().off();
    this.getSessionMetadataDatabaseRef().off();
  }
}
