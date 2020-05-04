# Space Invaders

## To Do

## Screens

- Tutorial / Intro + Start Button
  - choose color
- Game

### UI Elements

- Rectangle for game board / area
- player (person who shoots)
- score board
- enemy component
- bullet component
- retry button
- need to indidcated which player is which (since multiplayer)
  - user colors

### DOM / Browser API's

- controls: keyboard keys (arrows, space)
- sound
  - when the player shoots
  - when an enemy dies
  - when the player wins
  - SpeechSynthesisUtterance api for the sounds
- do we need canvas ?

### Game Logic

- score
- lives
- enemeies
  - movement - left, right, up and down
- player (2)
  - can shoot enemies
  - needs bullets
  - movement - left, right
    - can maybe go up and down a few rows too
- velocity (difficulty)
  - how fast do enemies move down
  - do they move down faster towards the end
- shots
  - direction does not matter - can only go straight up
  - velocity (function of state)
  - needs to be removed when off screen
- retry button
  - if you die, can resume playing where you left off

### App Logic

- (react) state shape
  - enemies - object of every enemies in its position
    - position (x, y)
    - size (width and height)
    - health (boolean or 0 / 1)
      - enemies have 1 life
    - isVisible (if health > 0)
  - players
    - position (maybe just start with x)
    - player health
    - isAlive
  - shots
    - position (x, y)
    - size (width, height)
    - isVisible (maybe we don't need it, should just delete the bullet)
  - velocity
  - score
  - "game phase" / scene - intro, player alive, player dead
- functions / helpers
  - need to build a function that calculates the next state
    - i.e. we need to move a shot up a square, does it collide with an enemy? If yes, we need to update the enemies health + the players score. if no, we nee to adjust the position of the shot.
  - maybe use setInterval()
    0.25 velocityY
    0.5 velocityX
    10px movementY
    interval .5 seconds
    every .5s seconds, enemeies move down 2.5px and left/right 5 px;
