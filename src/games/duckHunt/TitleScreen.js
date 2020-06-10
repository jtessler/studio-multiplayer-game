import React from 'react';

// a React "function component"
const TitleScreen = (props) => {
  return (
    <div className="screen titleScreen">
      <div className="buttons">
        <button
          className="startGameButton"
          onClick={props.handleClick}>START</button>
      </div>
      {props.currentUser}
    </div>
  )
};

export {
  TitleScreen
};
