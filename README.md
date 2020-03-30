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

### Step 1: Creating a new game component and reading session metadata

#### Step 1.1: Creating new game data

First, add some data about your game to `src/gameData.js`. See the example
below, which adds `tictactoe` to the `gameData` object. It is a two player
game, so it sets `minUsers` and `maxUsers` to 2. These min/max user numbers
will typically be equal, unless you design a game that can have a variable
number of players, e.g. a chat room.

```javascript
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

#### Step 1.2: Extending from the base game component

Next, create a React component to run your game. Using the `tictactoe` example
above, we must create `src/game/tictactoe/TicTacToe.js`. Your filename and
component name will obviously be different.

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';

export default class TicTacToe extends GameComponent {

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

#### Step 1.3: Accessing user data via `UserApi`

This webpage shows data like `Session creator: HxTp9DEPvUYbN4eLmge1a7Apjzz2`.
Can we do better? Can I show meaningful data like, `Session creator: Joe
Tessler`? *Yes!* Use `UserApi` as shown below:

```javascript
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

Try running this code. Do you see meaningful user names now?

But how does `UserApi` work? It is a set of functions that look up user data in
the Firebase database at the path `/user/<user-id>`. The API exposes the
following functions:

1. `UserApi.getName(uid)`: Returns the user's display name, e.g. "Joe Tessler"
1. `UserApi.getPhotoUrl(uid)`: Returns the user's avatar photo URL to use in an
   `<img>` tag
1. `UserApi.getLastSignIn(uid)`: Returns the user's last login date as a
   JavaScript `Date` object

#### Step 1.4: Determine if the current user is the session creator or "game host"

**An exercise for the reader**

Use the `this.getMyUserId()` and `this.getSessionCreatorUserId()` functions to
determine if the current user is the session creator. Try adding this check to
the `render()` function and conditionally display "I am the host" or "I am a
guest".

### Step 2: Updating game data and listening for changes

#### Step 2.1: Writing new game data to the Firebase database

Updating game data is as easy! Just write to the Firebase database using the
reference returned by `this.getSessionDatabaseRef()`, e.g.:

```javascript
this.getSessionDatabaseRef().set({text: "Hello, World!"});
```

This reference give you access to all of the Firebase database functions we
learned about in class. **Warning: this code snippet is writing to the remote
Firebase database, NOT React state.** You can learn more about this API in the
[Firebase docs][firebase-db].

#### Step 2.2: Listening for game data changes in the Firebase database

Listening for game data changes is also easy! Extending from `GameComponent`
gives us access to the following callback functions. **Warning: these functions
are listening for changes to the Firebase database, NOT React state.**

1. `onSessionDataChanged(data)`: Called whenever the session data stored at
   `/session/<id>/` changes. Passes said data as the argument.
1. `onSessionMetadataChanged(metadata)`: Called whenever the session metadata
   stored at `/session-metadata/<id>/` changes. Passes said metadata as the
   argument.

We can define these functions in our component like the following example:

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.getSessionDatabaseRef().set({text: "Hello, World!"});
  }

  onSessionDataChanged(data) {
    console.log("Data changed!", data);
  }

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

Open your browser console and confirm "Data changed!" is logged. *Yay! Now we
are writing to our Firebase database!*

#### Step 2.3: Building a more interesting demo (button mashing)

**Goal**: Create a webpage that shows a button and some text saying, "Joe
Tessler clicked the button." The text updates whenever a user clicks the button
(and shows their name instead).

First, we must define some default state for the last user who clicked on the
button. Let's default to `null` (nothing). **Warning: this is writing to React
state, NOT the remote Firebase database.**

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = { last_user_id: null, };
  }
}
```

Next, we need to use `onSessionDataChanged` to listen for changes to the path
`/session/<id>/user_id`, which will store the user ID of the last user who
clicked on the button. **Warning: this is listening for changes to the remote
Firebase database, not React state.** We _then_ update the React state
`this.state.last_userid` state whenever this remote Firebase data change
occurs.

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = { last_user_id: null, };
  }

  onSessionDataChanged(data) {
    this.setState({ last_user_id: data.user_id });
  }
}
```

Then we need to add the rendered `<button>` and its click handler,
`handleButtonClick`, which updates the Firebase database using
`this.getSessionDatabaseRef()`. **Warning: this writes to the remote Firebase
database, not React state.**

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = { last_user_id: null, };
  }

  onSessionDataChanged(data) {
    this.setState({ last_user_id: data.user_id });
  }

  handleButtonClick() {
    this.getSessionDatabaseRef().set({ user_id: this.getMyUserId() });
  }

  render() {
    return (
      <button onClick={() => this.handleButtonClick()}>Click me!</button>
    );
  }
}
```

What's missing? Conditional rendering! We must render the "Joe Tessler clicked
the button" message. Simply add this to the `render()` function:

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = { last_user_id: null, };
  }

  onSessionDataChanged(data) {
    this.setState({ last_user_id: data.user_id });
  }

  handleButtonClick() {
    this.getSessionDatabaseRef().set({ user_id: this.getMyUserId() });
  }

  render() {
    var last_user = "No one";
    if (this.state.last_user_id !== null) {
      last_user = UserApi.getName(this.state.last_user_id);
    }
    var last_user_message = last_user + " clicked the button";

    return (
      <div>
        <button onClick={() => this.handleButtonClick()}>Click me!</button>
        <p>{last_user_message}</p>
      </div>
    );
  }
}
```

Try playing this with your teammates and confirm the "clicked the button"
message changes whenever someone new presses the button!

### Step 3: Designing a Firebase data model

**Now things get harder**. How do I store my actual game's data in Firebase?
We'll continue using our Tic Tac Toe example here.

There are two states we care about for Tic Tac Toe:

1. The 3x3 grid of `X` and `O`
1. Which player is selecting the next `X` or `O`

We will represent these two states in Firebase as follows:

```
/session/<session-id>/: {
  cell_state: ["X", "O", "X", ".", "X", "O", ".", ".", "X"],
  current_user: "HxTp9DEPvUYbN4eLmge1a7Apjzz2"
}
```

The `cell_state` is a nine element array of `X`s, `O`s, or `.` (empty). The
`current_user` is the User ID of the player selecting the next move (i.e. it's
their turn).

First, define our default state and update it whenever the database changes.

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      cellState: [".", ".",  ".",  ".",  ".",  ".",  ".",  ".",  "."],
      currentUser: this.getSessionCreatorUserId(),
    };
  }

  onSessionDataChanged(data) {
    this.setState({
      cellState: data.cell_state,
      currentUser: data.current_user,
    });
  }
}
```

Notice how the component state is very similar to the Firebase state. We give
the first turn to the session creator using `this.getSessionCreatorUserId()`.

Next, let's render our Tic Tac Toe grid as a 3x3 set of `<button>` elements:

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      cellState: [".", ".",  ".",  ".",  ".",  ".",  ".",  ".",  "."],
      currentUser: this.getSessionCreatorUserId(),
    };
  }

  onSessionDataChanged(data) {
    this.setState({
      cellState: data.cell_state,
      currentUser: data.current_user,
    });
  }

  render() {
    var buttons = this.state.cellState.map((state, i) => (
      <button>{state}</button>
    ));
    return (
      <div>
        {buttons[0]} {buttons[1]} {buttons[2]}
        <br />
        {buttons[3]} {buttons[4]} {buttons[5]}
        <br />
        {buttons[6]} {buttons[7]} {buttons[8]}
      </div>
    );
  }
}
```

Now we have a Tic Tac Toe data model defined and a simple component to render
the default state. Next we need to make it interactive.

### Step 4: Conditional rendering based on database changes and user input

Using the same Tic Tac Toe example from Step 3, we need to perform the following
actions whenever a user clicks on the board:

1. Determine on which Tic Tac Toe cell the user clicked
1. Determine whether the current user is an `X` or `O`
1. Update the Tic Tac Toe grid values (with a new `X` or `O`)
1. Look up the user ID of the "other" player (to change turns)
1. Write the new grid values and "current player" user ID to Firebase

#### Step 4.1: Create a button click handler

Add a button click handler to update the Firebase database. If you are the
session creator (checked using `this.getMyUserId() ===
this.getSessionCreatorUserId()`), mark an `X`, otherwise an `O`:

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      cellState: [".", ".",  ".",  ".",  ".",  ".",  ".",  ".",  "."],
      currentUser: this.getSessionCreatorUserId(),
    };
  }

  onSessionDataChanged(data) {
    this.setState({
      cellState: data.cell_state,
      currentUser: data.current_user,
    });
  }

  handleButtonClick(i) {
    var cellState = this.state.cellState;
    if (this.getMyUserId() === this.getSessionCreatorUserId()) {
      cellState[i] = "X";
    } else {
      cellState[i] = "O";
    }
    this.getSessionDatabaseRef().set({
      cell_state: cellState,
      current_user: this.getMyUserId(),
    });
  }

  render() {
    var buttons = this.state.cellState.map((state, i) => (
      <button onClick={() => this.handleButtonClick(i)}>{state}</button>
    ));
    return (
      <div>
        {buttons[0]} {buttons[1]} {buttons[2]}
        <br />
        {buttons[3]} {buttons[4]} {buttons[5]}
        <br />
        {buttons[6]} {buttons[7]} {buttons[8]}
      </div>
    );
  }
}
```

Obviously this is **not** complete. Can you list what is wrong with this
code?

1. No turn-by-turn support (can make a move at any time)
1. Able to override any `X` with an `O` or vice versa
1. No announcement saying who won or if there is a draw

#### Step 4.2: Add turn-based gameplay support

We need a way to determine whether it is the "current" user's turn and a way to
find the "other" user's ID. We can write these as two helper functions:

```javascript
isMyTurn() {
  return this.getMyUserId() === this.state.currentUser;
}

getOtherUserId() {
  var user_ids = this.getSessionUserIds();
  for (var i = 0; i < user_ids.length; i++) {
    if (user_ids[i] !== this.getMyUserId()) {
      return user_ids[i];
    }
  }
  console.error("Could not find other player's user ID", user_ids);
  return null;
}
```

Now we only need to make two more modifications:

1. Use `this.getOtherUserId()` when updating the `current_user` in the Firebase
   database
2. Disable any button if it is not the current user's turn or if the button is
   already an `X` or `O`

```javascript
import GameComponent from '../../GameComponent.js';
import React from 'react';
import UserApi from '../../UserApi.js';

export default class TicTacToe extends GameComponent {
  constructor(props) {
    super(props);
    this.state = {
      cellState: [".", ".",  ".",  ".",  ".",  ".",  ".",  ".",  "."],
      currentUser: this.getSessionCreatorUserId(),
    };
  }

  onSessionDataChanged(data) {
    this.setState({
      cellState: data.cell_state,
      currentUser: data.current_user,
    });
  }

  handleButtonClick(i) {
    var cellState = this.state.cellState;
    if (this.getMyUserId() === this.getSessionCreatorUserId()) {
      cellState[i] = "X";
    } else {
      cellState[i] = "O";
    }
    this.getSessionDatabaseRef().set({
      cell_state: cellState,
      current_user: this.getOtherUserId(),
    });
  }

  isMyTurn() {
    return this.getMyUserId() === this.state.currentUser;
  }

  getOtherUserId() {
    var user_ids = this.getSessionUserIds();
    for (var i = 0; i < user_ids.length; i++) {
      if (user_ids[i] !== this.getMyUserId()) {
        return user_ids[i];
      }
    }
    console.error("Could not find other player's user ID", user_ids);
    return null;
  }

  render() {
    var buttons = this.state.cellState.map((state, i) => (
      <button
          disabled={!this.isMyTurn() || state !== "."}
          onClick={() => this.handleButtonClick(i)}>
        {state}
      </button>
    ));
    return (
      <div>
        {buttons[0]} {buttons[1]} {buttons[2]}
        <br />
        {buttons[3]} {buttons[4]} {buttons[5]}
        <br />
        {buttons[6]} {buttons[7]} {buttons[8]}
      </div>
    );
  }
}
```

Try playing the game with a teammate to confirm that you cannot edit the Tic
Tac Toe board when it is not your turn.

#### Step 4.3: Announce when the game is over

**An exercise for the reader**

Using `this.state.currentUser` and `UserApi.getName(user_id)`, render a message
indicating the current turn. For example, "Waiting for Joe Tessler to make a
move."

Add the code that determines if a "winning condition" exists. In other words,
does the Tic Tac Toe board have one of the following three configurations:

1. A horizontal row of three `X`s or `O`s
1. A vertical column of three `X`s or `O`s
1. A diagonal line of three `X`s or `O`s

Run this logic whenever the Firebase data changes, i.e. in the
`onSessionDataChanged(data)` function. Update the rendered message if a winning
condition is found, e.g. "Joe Tessler wins!"

### Step 5: Game style improvements (stretch goal)

**An exercise for the reader**

This game framework was created using the [Material UI React
library][material-ui], which provides React components pre-styled with Google's
Material theme. **Check out the component demos and try using one in your
game!**

Troubleshooting
---------------

### I can't log in!

Are you using a new browser-based IDE that we have not used in class? Ask your
teacher to whitelist the new IDE in Firebase.

### My editor/IDE is really slow

This happens when React tries to reload the application every time the file
changes. Try disabling this feature so React only reloads when you save the
file. In codesandbox.io, go to `File -> Preferences -> CodeSandbox Settings`,
then disable `Preview on edit` in the `Preview` preferences.

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
