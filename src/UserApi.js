import firebase from 'firebase';

/** Static utility functions for fetching user metadata. */
export default class UserApi {

  /** Returns true if the given user UID exists in memory. */
  static hasUid(uid) {
    return uid in users;
  }

  /** Returns the user's display name or null if it does not exist. */
  static getName(uid) {
    if (UserApi.hasUid(uid)) {
      return users[uid].name;
    } else {
      console.warn("No user metadata found for UID", uid);
      return null;
    }
  }

  /** Returns the user's photo URL or null if it does not exist. */
  static getPhotoUrl(uid) {
    if (UserApi.hasUid(uid)) {
      return users[uid].photoURL;
    } else {
      console.warn("No user metadata found for UID", uid);
      return null;
    }
  }

  /** Returns the user's last login date or null if it does not exist. */
  static getLastSignIn(uid) {
    if (UserApi.hasUid(uid)) {
      return new Date(users[uid].lastSignIn);
    } else {
      console.warn("No user metadata found for UID", uid);
      return null;
    }
  }
}


var users = {}; // In-memory cache of all user metadata.

function onUserUpdate(snapshot) {
  console.log("In-memory user cache updated", snapshot.val());
  if (snapshot.val() === null) {
    users = {};
  } else {
    users = snapshot.val();
  }
}

export class UserApiConfig {
  static startListeningForChanges() {
    var usersDatabaseRef = firebase.database().ref("/user");
    usersDatabaseRef.on("value", onUserUpdate);
  }

  static stopListeningForChanges() {
    firebase.database().ref("/user").off("value", onUserUpdate);
  }
}
