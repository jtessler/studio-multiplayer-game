import React from "react";

export default class Shot extends React.Component {
  constructor(props) {
    super(props);
    var defaultValue = {};
    this.state = defaultValue;
  }

  render() {
    let shotStyle = {
      width: "10px",
      height: "10px",
      backgroundColor: "white",
      position: "relative",
      top: this.props.pos.top + "px",
      left: this.props.pos.left + "px"
    };

    return <div className="shot" style={shotStyle} />;
  }
}
