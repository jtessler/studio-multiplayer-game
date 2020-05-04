import React from "react";

export default class Enemy extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let enemyStyle = {
      width: "20px",
      height: "20px",
      backgroundColor: "red"
    };

    return <div className="enemy" style={enemyStyle} />;
  }
}
