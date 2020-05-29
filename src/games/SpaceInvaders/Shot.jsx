import React from "react";

export default class Shot extends React.Component {
  render() {
    let shots = this.props.shots || [];
    return (
      <div>
        {shots.map(shot => {
          return (
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "white",
                position: "absolute",
                top: shot.top + "px",
                left: shot.left + "px"
              }}
            />
          );
        })}
      </div>
    );
  }
}
