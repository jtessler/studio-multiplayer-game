ScriptEd Studio Multiplayer Game
================================

**React/Firebase project designed for [ScriptEd][scripted] students**

Students will implement a React/Firebase app that requires collaboration
between two or more users, be it a game or some other real time, multi-user
program. Teachers provide starter code (this repository) to handle user
authentication, "waiting room", and user matching functionality.

At the end of the project, teachers will merge all groups' projects into a
single React application to be hosted forever, making any game playable at any
time (and available for any future job application).

Groups
------

Students will work in groups of three. Each students should choose one "focus":
_architect_, _designer_, or _implementer_. The _architect_ will draft
high-level concepts like the React component hierarchy and prop data flow. The
_designer_ will make the app look good, e.g. choosing a style library, keeping
the theme consistent, etc. The _implementer_ will make sure everything works,
writing most of the code, confirming whether the _architect_ and the
_designer_'s plans are possible, etc.

Getting Started
---------------

First, [create a new Firebase project][firebase]. Then make the following
changes in the Firebase console:

  1. Develop > Authentication > Sign-in Method > Sign-in providers: Enable
     Google
  1. Develop > Authentication > Sign-in Method > Authorized domains: Add domain
     `c9users.io` (if you're using Cloud9)
  1. Project Overview > Add Firebase to your web app: Keep this window open
     (you'll use it later)

Fork this repository, check out the code, then run the following commands:

  1. `npm install`
  1. `npm start`

You should see an error saying `src/firebaseConfig.js` does not exist (it
doesn't). Using the following template, create this file and replace the values
for `apiKey`, `authDomain`, etc. with your Firebase configuration created in a
previous step.

```
const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXXXXXXX.firebaseapp.com",
  databaseURL: "https://XXXXXXXXXXXXXXXXXXXXX.firebaseio.com",
  projectId: "XXXXXXXXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXXXXXXXXX.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX"
};

export default firebaseConfig;
```

Now the application should be running. Try signing in and starting a game
session using one of the existing games.

Adding a New Game
-----------------

First, add some data about your game to `src/gameData.js`. See the example
below, which adds `mygameid` to the `gameData` object. It is a four player
game, so it sets `minUsers` and `maxUsers` to 4. These min/max user numbers
will typically be equal, unless you design a game that can have a variable
number of players, e.g. a chat room.

```
import MyGameComponent from './MyGameComponent.js';

const gameData = {

  chatroom: { ... },

  tictactoe: { ... },

  mygameid: {
    title: "My Game Title",
    authors: "My team names",
    description: "My game description: it's the best",
    minUsers: 4,
    maxUsers: 4,
    component: MyGameComponent,
  },

}

export default gameData;
```

Then create a component to run your game. Using the `mygameid` example above,
we must create `src/MyGameComponent.js` (shown below). Feel free to copy this
template for your own game. Notice how it uses the following properties to
access important game session data:

  1. `this.props.match.params.id`: The session ID from the URL
  1. `this.props.location.state.id`: Another way to access session ID (same as
     above)
  1. `this.props.location.state.users`: Array of user UIDs currently playing
  1. `this.props.location.state.creator`: The user UID of the game session
     creator

It also references the following [Firebase Realtime Database][firebase-db]
path: `"/session/<session-id>"`. This is the database shared with all users
playing the current game session.

```
import React, { Component } from 'react';
import UserApi from './UserApi.js';
import firebase from 'firebase';

export default class MyGameComponent extends Component {
  componentWillMount() {
    // Listen for changes to your game data.
    var id = this.props.match.params.id;
    var sessionDatabaseRef = firebase.database().ref("/session/" + id);
    sessionDatabaseRef.on("value", (snapshot) => {
      // TODO: Do something with your new game data!
      console.log("Game data updated", snapshot.val());
    });
  }

  componentWillUnmount() {
    // Stop listening for changes.
    var id = this.props.match.params.id;
    firebase.database().ref("/session/" + id).off();
  }

  render() {
    var id = this.props.match.params.id; // Or: this.props.location.state.id
    var users = this.props.location.state.users.map((uid) => (
      <li key={uid}>{UserApi.getName(uid)}</li>
    ));
    var creator = UserApi.getName(this.props.location.state.creator);
    return (
      <div>
        <p>Session ID: {id}</p>
        <p>Session users:</p>
        <ul>
          {users}
        </ul>
        <p>Session creator: {creator}</p>
      </div>
    );
  }
}
```

Resources
---------

  - Material UI: [React components documentation][material-ui]
  - React: [ReactJS documentation][reactjs]
  - Firebase: [Firebase JS documentation][firebase-js]

[firebase-db]:https://firebase.google.com/docs/database/web/read-and-write
[firebase-js]:https://firebase.google.com/docs/reference/js/
[firebase]:https://console.firebase.google.com
[material-ui]:https://www.material-ui.com/#/components/app-bar
[reactjs]:https://reactjs.org/docs/hello-world.html
[scripted]:https://scripted.org
