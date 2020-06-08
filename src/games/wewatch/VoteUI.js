import React from "react";
import "./voteui.css";

// Props:
//   like: count of likes
//   dislike: count of dislikes
export default class VoteUI extends React.Component {
  handleDislike() {
    // Update the firebase database count of dislikes
    console.log("Pressed dislike button");
    this.props.onDislikePressed();
  }

  handleLike() {
    // Update the firebase database count of likes
    console.log("Pressed like button");
    this.props.onLikePressed();
  }

  render() {
    return (
      <div className="VoteUI">
        <button className="Dislike" onClick={e => this.handleDislike()}>
          Dislike ({this.props.dislike})
        </button>
        <button className="Like" onClick={e => this.handleLike()}>
          Like ({this.props.like})
        </button>
      </div>
    );
  }
}
