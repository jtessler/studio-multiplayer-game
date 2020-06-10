import React from "react";

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let playerStyle = {
      width: "20px",
      height: "20px",
      position: "absolute",
      transform: `translate(${this.props.pos.left}px, ${this.props.pos.top}px)`
    };

    const playerOneStyles = {
      backgroundColor: "blue",
      background: `url(${this.props.id[0]})`,
      backgroundSize: "cover"
    };

    const playerTwoStyles = {
      backgroundColor: "orange",
      background: `url(${this.props.id[1]})`,
      backgroundSize: "cover"
    };

    return (
      <div
        className="player"
        style={{
          ...playerStyle,
          ...(this.props.player === "one" ? playerOneStyles : playerTwoStyles)
        }}
      />
    );
  }
}

// const baseObject = {
//   color: 'blue',
//   size: 12,
// }

// const object2  = Object.assign({}, baseObjec {top: 5});

// const object2a = {
//   ...baseObject,
//   top: 5,
// }

/*
1. move the shots around the board
2. see if shots collide w/ enemy
3. see if shots move off screen
4. update enemey health

5. consider making shots on state separate for each player
*/
