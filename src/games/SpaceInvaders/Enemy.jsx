import React from "react";
import Alien from "./Alien.png";

export default class Enemy extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let pos = this.props.pos || [];

    let imgStyle = {
      width: "20px",
      height: "20px"
    };

    return pos.map(position => {
      return (
        <div
          className="enemy"
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "red",
            position: "absolute",
            transform: `translate(${position.left}px, ${position.top}px)`
          }}
        >
          {" "}
          <img style={imgStyle} src={Alien} alt="alien" />
        </div>
      );
    });
  }
}
