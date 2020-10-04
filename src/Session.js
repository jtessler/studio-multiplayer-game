import { useEffect, useState } from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

const SESSION_DATA_PATH = "/session";
const SESSION_METADATA_PATH = "/session-metadata";

/**
 * The session context object to be used by functional components.
 *
 * Exposes all data previously provided by the parent GameComponent class. Most
 * getters share the same name, but the listeners for Firebase changes differ.
 * Rather than overriding callbacks in subclasses, this class offers several
 * use-effects to provided the same functionality:
 *
 *   - useSessionData: the entire session data object
 *   - useSessionUserIds: the list of user IDs in the current session
 *   - useSessionCreatorUserId: the user ID of the one who created the session
 *   - useSessionTitle: the session type title
 */
export default class Session {
  constructor(props) {
    this.props = props;

    // Force page title changes based on the session type, i.e. this use effect
    // runs every time for any component that constructs this class.
    const title = this.useSessionTitle();
    document.title = title;
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

  /** Returns the current session ID as stored in Firebase. */
  getSessionId(props) {
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

  /** Returns the user ID of the current user, i.e. YOU. */
  getMyUserId() {
    if (firebase.auth() &&
        firebase.auth().currentUser &&
        firebase.auth().currentUser.uid) {
      return firebase.auth().currentUser.uid;
    }
    throw new Error("Unable to get current user ID");
  }

  /** Use effect that provides the entire session data object from Firebase. */
  useSessionData() {
    const [data, setData] = useState({});
    const id = this.getSessionId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const data = snapshot.val();
        if (data !== null) {
          setData(data);
        }
      };
      const ref = this.getSessionDatabaseRef();
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);  // Only re-run this hook if the session ID changes (it won't).
    return data;
  }

  /**
   * Use effect that provides the list of user IDs connected to the current
   * session.
   */
  useSessionUserIds() {
    let defaultUserIds = [];
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.users) {
      defaultUserIds = this.props.location.state.users;
    }
    const [userIds, setUserIds] = useState(defaultUserIds);
    const id = this.getSessionId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const users = snapshot.val();
        if (users !== null) {
          setUserIds(users);
        }
      };
      const ref = this.getSessionMetadataDatabaseRef().child("users");
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);
    return userIds;
  }

  /**
   * Use effect that provides the user ID of the one who created this current
   * session.
   */
  useSessionCreatorUserId() {
    let defaultCreatorUserId = "";
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.creator) {
      defaultCreatorUserId = this.props.location.state.creator;
    }
    const [creatorUserId, setCreatorUserId] = useState(defaultCreatorUserId);
    const id = this.getSessionId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const creatorUserId = snapshot.val();
        if (creatorUserId !== null) {
          setCreatorUserId(creatorUserId);
        }
      };
      const ref = this.getSessionMetadataDatabaseRef().child("creator");
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);
    return creatorUserId;
  }

  /** Use effect that provides the page title for the given session type. */
  useSessionTitle() {
    let defaultTitle = "Studio Games!";
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.title) {
      defaultTitle = this.props.location.state.title;
    }
    const [title, setTitle] = useState(defaultTitle);
    const id = this.getSessionId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const type = snapshot.val();
        if (type !== null && type in gameData) {
          setTitle(gameData[type].title);
        }
      };
      const ref = this.getSessionMetadataDatabaseRef().child("type");
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);
    return title;
  }

  /**
   * Updates the session data object stored in the remote Firebase database.
   *
   * Behaves like React set-state functions. It only updates the key and value
   * pairs provided in the data parameter. This method does not override the
   * entire object.
   */
  setSessionData(data) {
    this.getSessionDatabaseRef().update(data).catch(error => {
      console.warn("Error updating session data", this.getSessionId(), error);
    });
  }

  /** Updates the metadata object stored in the remote Firebase database. */
  setSessionMetadata(metadata) {
    this.getSessionMetadataDatabaseRef().update(metadata).catch(error => {
      console.warn(
          "Error updating session metadata", this.getSessionId(), error);
    });
  }
}
