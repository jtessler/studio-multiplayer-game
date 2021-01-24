import { useEffect, useState } from 'react';
import firebase from 'firebase';
import gameData from './gameData.js';

const SESSION_DATA_PATH = "/session";
const SESSION_METADATA_PATH = "/session-metadata";

/**
 * The game database object to be used by functional components.
 *
 * Exposes all data previously provided by the parent GameComponent class. Most
 * getters share the same name, but the listeners for Firebase changes differ.
 * Rather than overriding callbacks in subclasses, this class offers several
 * use-effects to provided the same functionality:
 *
 *   - useGameData: the entire data object stored in the backend for the game
 *   - useGameUserIds: the list of user IDs in the current game
 *   - useGameCreatorUserId: the user ID of the one who created the game
 *   - useGameTitle: the game type title
 */
export default class GameDatabase {
  constructor(props) {
    this.props = props;

    // Force page title changes based on the game type, i.e. this use effect
    // runs every time for any component that constructs this class.
    const title = this.useGameTitle();
    document.title = title;
  }

  /**
   * Returns a Firebase real-time database reference to the current game
   * data, i.e. '/session/<id>/'.
   */
  getGameDatabaseRef() {
    return firebase.database()
        .ref(SESSION_DATA_PATH)
        .child(this.getGameId());
  }

  /**
   * Returns a Firebase real-time database reference to the current game
   * metadata, i.e. '/session-metadata/<id>/'.
   */
  getGameMetadataDatabaseRef() {
    return firebase.database()
        .ref(SESSION_METADATA_PATH)
        .child(this.getGameId());
  }

  /** Returns the current game ID as stored in Firebase. */
  getGameId(props) {
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
    throw new Error("Unable to get game ID from URL nor browser history");
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

  /** Use effect that provides the entire game data object from Firebase. */
  useGameData() {
    const [data, setData] = useState({});
    const id = this.getGameId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const data = snapshot.val();
        if (data !== null) {
          setData(data);
        }
      };
      const ref = this.getGameDatabaseRef();
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);  // Only re-run this hook if the game ID changes (it won't).
    return data;
  }

  /**
   * Use effect that provides the list of user IDs connected to the current
   * game.
   */
  useGameUserIds() {
    let defaultUserIds = [];
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.users) {
      defaultUserIds = this.props.location.state.users;
    }
    const [userIds, setUserIds] = useState(defaultUserIds);
    const id = this.getGameId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const users = snapshot.val();
        if (users !== null) {
          setUserIds(users);
        }
      };
      const ref = this.getGameMetadataDatabaseRef().child("users");
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);
    return userIds;
  }

  /**
   * Use effect that provides the user ID of the one who created this current
   * game.
   */
  useGameCreatorUserId() {
    let defaultCreatorUserId = "";
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.creator) {
      defaultCreatorUserId = this.props.location.state.creator;
    }
    const [creatorUserId, setCreatorUserId] = useState(defaultCreatorUserId);
    const id = this.getGameId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const creatorUserId = snapshot.val();
        if (creatorUserId !== null) {
          setCreatorUserId(creatorUserId);
        }
      };
      const ref = this.getGameMetadataDatabaseRef().child("creator");
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);
    return creatorUserId;
  }

  /** Use effect that provides the page title for the given game type. */
  useGameTitle() {
    let defaultTitle = "Studio Games!";
    if (this.props &&
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.title) {
      defaultTitle = this.props.location.state.title;
    }
    const [title, setTitle] = useState(defaultTitle);
    const id = this.getGameId();
    useEffect(() => {
      const onValueChange = snapshot => {
        const type = snapshot.val();
        if (type !== null && type in gameData) {
          setTitle(gameData[type].title);
        }
      };
      const ref = this.getGameMetadataDatabaseRef().child("type");
      ref.on("value", onValueChange);
      return () => { ref.off("value", onValueChange); };
    }, [id]);
    return title;
  }

  /**
   * Updates the game data object stored in the remote Firebase database.
   *
   * Behaves like React set-state functions. It only updates the key and value
   * pairs provided in the data parameter. This method does not override the
   * entire object.
   */
  setGameData(data) {
    this.getGameDatabaseRef().update(data).catch(error => {
      console.warn("Error updating game data", this.getGameId(), error);
    });
  }

  /** Updates the metadata object stored in the remote Firebase database. */
  setGameMetadata(metadata) {
    this.getGameMetadataDatabaseRef().update(metadata).catch(error => {
      console.warn(
          "Error updating game metadata", this.getGameId(), error);
    });
  }
}
