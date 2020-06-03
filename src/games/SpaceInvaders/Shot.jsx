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
                top: 0,
                left: 0,
                transform: `translate(${shot.left}px, ${shot.top}px)`
              }}
            />
          );
        })}
      </div>
    );
  }
}
