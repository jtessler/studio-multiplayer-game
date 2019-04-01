Code Nation Studio Multiplayer Game
===================================

**React/Firebase project designed for [Code Nation][code-nation] students**

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

Adding a New Game
-----------------

First, add some data about your game to `src/gameData.js`. See the example
below, which adds `mygameid` to the `gameData` object. It is a four player
game, so it sets `minUsers` and `maxUsers` to 4. These min/max user numbers
will typically be equal, unless you design a game that can have a variable
number of players, e.g. a chat room.

```
import MyGameComponent from './games/mygame/MyGameComponent.js';

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
we must create `src/game/mygame/MyGameComponent.js` (shown below). Feel free to
copy this template for your own game. Notice how it extends from
`GameComponent` and uses the following functions to access important game
session data:

  1. `this.onSessionDataChanged(data)`: Called whenever the session data stored
     at `/session/<id>/` changes (passes said `data` as the argument)
  1. `this.getSessionDatabaseRef()`: Returns a Firebase real-time database
     reference to the current session data, i.e. `/session/<id>/`
  1. `this.getSessionId()`: Returns the current session ID as stored in
     Firebase
  1. `this.getSessionUserIds()`: Returns the list of user IDs connected to the
     current session
  1. `this.getSessionCreatorUserId()`: Returns the user ID of the one who
     created this current session
  1. `this.getMyUserId()`: Returns the user ID of the current user, i.e. YOU

All of the above functions are accessing the [Firebase Realtime
Database][firebase-db] path `/session/<session-id>`. This is the database
shared with all users playing the current game session.

```
import GameComponent from '../../GameComponent.js';
import UserApi from './UserApi.js';
import firebase from 'firebase';

export default class MyGameComponent extends GameComponent {

  onSessionDataChanged(data) {
    // TODO: Do something with your new game data!
    console.log("Game data updated", data);
  }

  render() {
    var id = this.getSessionId();
    var users = this.getSessionUserIds().map((uid) => (
      <li key={uid}>{UserApi.getName(uid)}</li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());
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

[code-nation]:https://codenation.org
[firebase-db]:https://firebase.google.com/docs/database/web/read-and-write
[firebase-js]:https://firebase.google.com/docs/reference/js/
[material-ui]:https://www.material-ui.com/#/components/app-bar
[reactjs]:https://reactjs.org/docs/hello-world.html
