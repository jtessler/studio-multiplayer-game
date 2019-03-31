import React from 'react';
import firebase from 'firebase';

const SESSION_DATA_PATH = "/session";

export default class GameComponent extends React.Component {
  /**
   * Called whenever the session data stored at '/session/<id>/' changes.
   * Passes said data as the argument. Guaranteed non-null.
   */
  onSessionDataChanged(data) {
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

  /** Returns the current session ID as stored in Firebase.  */
  getSessionId() {
    return this.props.match.params.id;
  }

  /** Returns the list of user IDs connected to the current session.  */
  getSessionUserIds() {
    return this.props.location.state.users;
  }

  /** Returns the user ID of the one who created this current session. */
  getSessionCreatorUserId() {
    return this.props.location.state.creator;
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
    document.title = this.props.location.state.title || "Studio Games!";
  }

  componentWillUnmount() {
    this.getSessionDatabaseRef().off();
  }
}
