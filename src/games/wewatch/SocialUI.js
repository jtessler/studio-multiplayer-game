import React from "react";
import "./socialui.css";

export default class SocialUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      video_title: "",
      video_url: ""
    };
  }

  handlePlayNextVideo() {
    console.log("Play next video clicked");
    this.props.onNextVideo();
  }

  handleAdd() {
    console.log("Add Video Clicked", this.state);
    this.props.onVideoAdd(this.state.video_title, this.state.video_url);
    this.setState({
      video_title: "",
      video_url: ""
    });
  }

  isInvalidTitle() {
    let title = this.state.video_title;
    // Check if the string is not empty
    if (title === "") {
      return true;
    } else {
      return false;
    }
  }

  isInvalidUrl() {
    let url = this.state.video_url;
    if (url === "") {
      return true;
    } else {
      return false;
    }
  }

  handleVideoTitleChange(e) {
    let value = e.target.value;
    this.setState({ video_title: value });
  }

  handleVideoUrlChange(e) {
    let value = e.target.value;
    this.setState({ video_url: value });
  }

  render() {
    return (
      <div className="SocialUI">
        <div className="RedBox">
          <div className="EventLog">{this.props.eventLog}</div>
          <div className="AddVideoForm">
            <input
              placeholder="Title"
              onChange={e => this.handleVideoTitleChange(e)}
              value={this.state.video_title}
            />
            <input
              placeholder="URL"
              onChange={e => this.handleVideoUrlChange(e)}
              value={this.state.video_url}
            />
            <button
              disabled={this.isInvalidTitle() || this.isInvalidUrl()}
              className="AddVideo"
              onClick={e => this.handleAdd()}
            >
              Add
            </button>
          </div>
        </div>

        <div className="Buttons">
          <button
            className="NextVideo"
            onClick={e => this.handlePlayNextVideo()}
          >
            Play next video
          </button>
          <div className="NextVideo">{this.props.nextVideoTitle}</div>
        </div>
      </div>
    );
  }
}
