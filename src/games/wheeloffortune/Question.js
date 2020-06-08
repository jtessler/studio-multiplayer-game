import React from "react";

export default class Question extends React.Component {
  render() {
    return (
      <div>
        <p> {this.props.question} </p>
      </div>
    );
  }
}
