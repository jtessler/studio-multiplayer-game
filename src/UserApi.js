import firebase from 'firebase';

/** Static utility functions for fetching user metadata. */
export default class UserApi {

  /** Returns true if the given user UID exists in memory. */
  static hasUid(uid) {
    return users === null || uid in users;
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


var users = null; // In-memory cache of all user metadata.

export class UserApiConfig {
  static startListeningForChanges() {
    // Some browser-based IDEs cleverly reload the app without destroying the
    // in-memory cache. Clear it before listening to Firebase changes to ensure
    // Promise.resolve() is called.
    users = null;

    var usersDatabaseRef = firebase.database().ref("/user");
    // Returns a Promise that resolves whenever the first load completes.
    return new Promise((resolve) => {
      usersDatabaseRef.on("value", (snapshot) => {
        if (users === null) {
          resolve();
        }

        if (snapshot.val() === null) {
          users = {};
        } else {
          users = snapshot.val();
        }
      })
    });
  }

  static stopListeningForChanges() {
    firebase.database().ref("/user").off();
  }
}
