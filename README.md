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

Day-by-day example: Tic Tac Toe
-------------------------------

## Step 1: Creating a new game component and reading session metadata

### Step 1.1: Creating new game data

First, add some data about your game to `src/gameData.js`. See the example
below, which adds `tictactoe` to the `gameData` object. It is a two player
game, so it sets `minUsers` and `maxUsers` to 2. These min/max user numbers
will typically be equal, unless you design a game that can have a variable
number of players, e.g. a chat room.

```
import TicTacToe from './games/tictactoe/TicTacToe.js';

const gameData = {

  chatroom: { ... },

  tictactoe: {
    title: "Tic Tac Toe",
    authors: "Joe Tessler",
    description: "The classic two-player game with Xs and Os",
    minUsers: 2,
    maxUsers: 2,
    component: TicTacToe,
  },

}

export default gameData;
```

### Step 1.2: Extending from the base game component

Next, create a React component to run your game. Using the `tictactoe` example
above, we must create `src/game/tictactoe/TicTacToe.js`. Your filename and
component name will obviously be different.

```
import GameComponent from '../../GameComponent.js';
import React from 'react';

export default class Test extends GameComponent {

  render() {
    var id = this.getSessionId();
    var users = this.getSessionUserIds().map((user_id) => (
      <li key={user_id}>{user_id}</li>
    ));
    var creator = this.getSessionCreatorUserId();
    return (
      <div>
        <p>Session ID: {id}</p>
        <p>Session creator: {creator}</p>
        <p>Session users:</p>
        <ul>
          {users}
        </ul>
      </div>
    );
  }
}
```

Run your code and see what happens! Ask a teammate (who is running the same
code) to join your newly created game and see what happens to the list of
users. It should grow! *This is real time collaboration!*

But what is `GameComponent` and how do we use these `this.getSessionId()`
functions? `GameComponent` is our "parent" component and gives us access to the
following functions:

  1. `this.getSessionId()`: Returns the current session ID as stored in
     Firebase
  1. `this.getSessionUserIds()`: Returns the list of user IDs connected to the
     current session
  1. `this.getSessionCreatorUserId()`: Returns the user ID of the one who
     created this current session
  1. `this.getSessionTitle()`: Returns the session title, e.g., "Rock, Paper,
     Scissors"
  1. `this.getMyUserId()`: Returns the user ID of the current user, i.e. YOU

All of the above functions are accessing the [Firebase Database][firebase-db]
path `/session-metadata/<session-id>`. This is the database shared with all
users playing the current game session. You can explore this data using the
"Debug Tool" in the sidebar menu.

### Step 1.3: Accessing user data via `UserApi`

This webpage shows data like `Session creator: HxTp9DEPvUYbN4eLmge1a7Apjzz2`.
Can we do better? Can I show meaningful data like, `Session creator: Joe
Tessler`? *Yes!* Use `UserApi` as shown below:

```
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {

  render() {
    var id = this.getSessionId();
    var users = this.getSessionUserIds().map((user_id) => (
      <li key={user_id}>{UserApi.getName(user_id)}</li>
    ));
    var creator = UserApi.getName(this.getSessionCreatorUserId());
    return (
      <div>
        <p>Session ID: {id}</p>
        <p>Session creator: {creator}</p>
        <p>Session users:</p>
        <ul>
          {users}
        </ul>
      </div>
    );
  }
}
```

Try running this code. Do you see meaningful user name now?

But how does `UserApi` work? It is a set of functions that look up user data in
the Firebase database at the path `/user/<user-id>`. The API exposes the
following functions:

1. `UserApi.getName(uid)`: Returns the user's display name, e.g. "Joe Tessler"
1. `UserApi.getPhotoUrl(uid)`: Returns the user's avatar photo URL to use in an
   `<img>` tag
1. `UserApi.getLastSignIn(uid)`: Returns the user's last login date as a
   JavaScript `Date` object

## Step 2: Updating game data and listening for changes

TODO

## Step 3: Designing a Firebase data model

TODO

## Step 4: Updating your game component state based on Firebase data changes

TODO

## Step 5: Game style improvements (stretch goal)

TODO

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
