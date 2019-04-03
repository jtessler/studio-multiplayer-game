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

### Step 2: Updating game data and listening for changes

#### Step 2.1: Writing new game data to the Firebase database

Updating game data is as easy! Just write to the Firebase database using the
reference returned by `this.getSessionDatabaseRef()`, e.g.:

```javascript
this.getSessionDatabaseRef().set({text: "Hello, World!"});
```

This reference give you access to all of the Firebase database functions we
learned about in class. You can learn more about this API in the [Firebase
docs][firebase-db].

#### Step 2.2: Listening for game data changes in the Firebase database

Listening for game data changes is also easy! Extending from `GameComponent`
gives us access to the following callback functions:

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
button. Let's default to `null` (nothing).

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
`/session/<id>/user_id`, which will store the User ID of the last user who
clicked on the button. Just update the `this.state.last_userid` state whenever
this change occurs.

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
`this.getSessionDatabaseRef()`.

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

Finally, add a button click handler to update the Firebase database. If you are
the session creator (checked using `this.getMyUserId() ===
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

Obviously this is **not** complete, but we now have a way to mark a Tic Tac Toe
spot as `X` or `O` depending on the user.

### Step 4: Updating your game component state based on Firebase data changes

TODO

### Step 5: Game style improvements (stretch goal)

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
